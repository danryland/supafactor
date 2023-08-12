// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_API_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req) => {
  const url = new URL(req.url);
  const userName = url.searchParams.get("userName");
  const repo = url.searchParams.get("repo");

  if (!userName || !repo) {
    return new Response(
      JSON.stringify({ error: "Invalid or missing parameters" }),
      { headers: { "Content-Type": "application/json" }, status: 400 }
    );
  }

  // Query Supabase for matching submission
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/submissions?user_name=eq.${userName}&repo=eq.${repo}`,
    {
      headers: {
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  let imageUrl;
  if (data && data.length > 0 && data[0].score > 3) {
    imageUrl =
      "https://nipsfqhfvpgclfjnctna.supabase.co/storage/v1/object/public/badges/badge-supafactor-pass.svg";
  } else {
    imageUrl =
      "https://nipsfqhfvpgclfjnctna.supabase.co/storage/v1/object/public/badges/badge-supafactor-fail.svg";
  }

  const svgResponse = await fetch(imageUrl);
  const svgContent = await svgResponse.text();

  return new Response(svgContent, {
    headers: { "Content-Type": "image/svg+xml" },
  });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
