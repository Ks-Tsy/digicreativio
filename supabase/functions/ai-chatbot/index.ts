import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Get the allowed origin from environment or default to production domain
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") || "https://digicreativio.lovable.app";

const getCorsHeaders = (origin: string | null) => {
  // Only allow specific origin in production
  const allowedOrigin = origin && (
    origin === ALLOWED_ORIGIN || 
    origin.includes("localhost") || 
    origin.includes("lovable.app")
  ) ? origin : ALLOWED_ORIGIN;
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
};

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // Max requests per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

const getClientIP = (req: Request): string => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
};

const checkRateLimit = (ip: string): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count };
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
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIP = getClientIP(req);
    const rateLimit = checkRateLimit(clientIP);

    if (!rateLimit.allowed) {
      console.log(`Rate limit exceeded for chatbot from IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          error: "Too many requests",
          response: "I'm receiving too many requests right now. Please try again in a few minutes."
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { message, history } = await req.json();

    // Validate input
    if (!message || typeof message !== "string" || message.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Invalid message", response: "Please provide a valid message." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build conversation history
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(Array.isArray(history) ? history.slice(-10) : []).map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: String(msg.content).slice(0, 2000),
      })),
      { role: "user", content: message.slice(0, 2000) },
    ];

    // Call Lovable AI Gateway
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
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
