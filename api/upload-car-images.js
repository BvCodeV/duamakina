import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: { bodyParser: false },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const buffer = Buffer.concat(chunks);

  const fileName = `${Date.now()}.webp`;

  // Compress to WebP
  const optimized = await sharp(buffer)
    .webp({ quality: 80 })
    .resize({ width: 1200, withoutEnlargement: true })
    .toBuffer();

  // Upload to Supabase Storage
  const { error } = await supabase.storage
    .from("car-images")
    .upload(fileName, optimized, { contentType: "image/webp" });

  if (error) return res.status(500).json({ error: error.message });

  // Get public URL
  const { data } = supabase.storage
    .from("car-images")
    .getPublicUrl(fileName);

  return res.status(200).json({ url: data.publicUrl });
}