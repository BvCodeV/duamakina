import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const buffer = await getRawBody(req);

    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: "No image data received" });
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

    // Compress to WebP
    const optimized = await sharp(buffer)
      .webp({ quality: 80 })
      .resize({ width: 1200, withoutEnlargement: true })
      .toBuffer();

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("car-images")
      .upload(fileName, optimized, {
        contentType: "image/webp",
        upsert: false,
      });

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    // Get public URL
    const { data } = supabase.storage
      .from("car-images")
      .getPublicUrl(fileName);

    return res.status(200).json({ url: data.publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: err.message });
  }
}