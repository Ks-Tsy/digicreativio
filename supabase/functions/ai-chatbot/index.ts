// AI Chatbot Edge Function for DigiCreativio

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a helpful AI assistant for DigiCreativio, a premium digital creative agency. Your role is to:

1. Answer questions about DigiCreativio's services:
   - Graphic Design: Marketing materials, social media graphics, print design, infographics
   - Logo Design: Custom logos, brand guidelines, vector files, social media kits
   - Branding: Brand strategy, visual identity, color palettes, typography systems
   - Web Design: Responsive design, UI/UX, prototyping, mobile optimization
   - Digital Art: Illustrations, character design, concept art, digital painting
   - Video Editing: Motion graphics, color grading, sound design, post-production

2. Help potential clients understand how DigiCreativio can help their business

3. Provide helpful design tips and creative advice when asked

4. Guide users to contact the team for detailed quotes and project discussions

5. Be friendly, professional, and enthusiastic about creativity and design

Keep responses concise (2-3 paragraphs max) and helpful. If asked about pricing, explain that prices vary based on project scope and encourage them to reach out for a custom quote.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history } = await req.json();

    // Build conversation history
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-10).map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    // Call Lovable AI Gateway (using gemini-2.5-flash for fast, cost-effective responses)
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("AI API error:", error);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in ai-chatbot function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to process request",
        response: "I'm sorry, I'm having trouble right now. Please try again or contact us directly at digicreativio@gmail.com."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
