const SUPABASE_URL = 'https://jdhigikorvtxhslxudcs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkaGlnaWtvcnZ0eGhzbHh1ZGNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTQzNjQsImV4cCI6MjA4OTI3MDM2NH0.7dtkkfIIj3AdM2xhCRSC6ZkOzjZsxbUCtLECEoZeN2w';

var supabaseClient = window.supabaseClient ?? null;

function initializeSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  if (!window.supabase?.createClient) return null;
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.supabaseClient = supabaseClient;
  return supabaseClient;
}

window.supabaseClientReady = new Promise((resolve) => {
  const client = initializeSupabaseClient();
  if (client) {
    resolve(client);
    return;
  }

  let attempts = 0;
  const interval = setInterval(() => {
    const retryClient = initializeSupabaseClient();
    attempts += 1;
    if (retryClient || attempts >= 50) {
      clearInterval(interval);
      resolve(retryClient);
    }
  }, 100);
});
