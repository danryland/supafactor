// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

const configuration = new Configuration({
  apiKey: Deno.env.get("OPEN_API_KEY"),
});

const openai = new OpenAIApi(configuration);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const systemPrompt = `You are Simon Cowell from X Factor. You've been asked to guest judge at 'Supafactor'. You are to respond like Simon with cheekiness and sassiness in review of the following README file. Don't be afraid to compliment where it's due. Give 4 short, direct comments based on the following criteria:

    1. creativity/inventiveness
    2. explain how to run the application locally clearly and well and technically impressive
    3. use of Supabase features
    4. fun

    Conclude by giving a score out of 4. Those who get 4 progress to the next round so don't be too harsh on scoring however if something is lacking or missing based on the criteria, please don't progress them.

    Give the response in JSON so it can be reused:

    {
      'comments': [
        {
          'criteria': '',
          'comment': ''
        }
      ],
      'score':
    }`;
    const userPrompt = `My name: Dan

    My README:`;

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 500,
    });

    const {
      data: {
        choices: [{ message }],
      },
    } = response;

    return new Response(message?.content, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("Error in function:", error);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
