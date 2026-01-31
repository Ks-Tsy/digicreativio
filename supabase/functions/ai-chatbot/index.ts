import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Get the allowed origin from environment or default to production domain
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") || "https://digicreativio.lovable.app";

const getCorsHeaders = (origin: string | null) => {
  // Only allow specific origin in production
  const allowedOrigin = origin && (
    origin === ALLOWED_ORIGIN || 
    origin.includes("localhost") || 
    origin.includes("lovable.app") ||
    origin.includes("lovableproject.com")
  ) ? origin : ALLOWED_ORIGIN;
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Access-Control-Allow-Credentials": "true",
  };
};

// Rate limiting stores - separate for authenticated and anonymous users
const anonymousRateLimitStore = new Map<string, { count: number; resetAt: number }>();
const authenticatedRateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Stricter limits for anonymous users, more generous for authenticated
const ANONYMOUS_RATE_LIMIT = 15; // Max requests per hour for anonymous
const AUTHENTICATED_RATE_LIMIT = 60; // Max requests per hour for authenticated users
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

const getClientIP = (req: Request): string => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
};

const checkRateLimit = (
  identifier: string, 
  isAuthenticated: boolean
): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const store = isAuthenticated ? authenticatedRateLimitStore : anonymousRateLimitStore;
  const limit = isAuthenticated ? AUTHENTICATED_RATE_LIMIT : ANONYMOUS_RATE_LIMIT;
  const entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
};

// Validate JWT and get user ID (optional auth - returns null if not authenticated)
const validateOptionalAuth = async (req: Request): Promise<{ userId: string | null; email: string | null }> => {
  const authHeader = req.headers.get("Authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    return { userId: null, email: null };
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase credentials not configured for auth validation");
      return { userId: null, email: null };
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace("Bearer ", "");
    const { data, error } = await supabase.auth.getClaims(token);
    
    if (error || !data?.claims) {
      console.log("Invalid or expired JWT token");
      return { userId: null, email: null };
    }

    return { 
      userId: data.claims.sub as string, 
      email: data.claims.email as string || null 
    };
  } catch (error) {
    console.error("Error validating auth:", error);
    return { userId: null, email: null };
  }
};

const SYSTEM_PROMPT = `You are DigiCreativio's advanced AI assistant - a highly knowledgeable, professional, and friendly virtual expert for this premium digital creative agency. You have complete knowledge of everything about DigiCreativio and can help visitors with any questions.

## About DigiCreativio

DigiCreativio is a premium digital creative agency founded with a simple belief: that great design has the power to transform businesses and connect with people on a deeper level. We are a passionate team of designers, artists, and strategists dedicated to crafting digital experiences that make a lasting impact.

### Our Mission
To empower businesses and creators with exceptional digital design solutions that drive success and inspire audiences.

### Our Vision  
To be the leading creative agency recognized for innovation, quality, and transformative digital experiences.

### Our Core Values
- **Excellence**: We pursue excellence in every project, delivering work that exceeds expectations
- **Collaboration**: We work closely with clients to achieve their goals and realize their vision
- **Innovation**: We stay at the forefront of design trends and technologies
- **Client Focus**: Every client's vision is treated as our own

### Company Stats
- 150+ Projects Delivered
- 50+ Happy Clients
- 5+ Years of Experience
- 100% Client Satisfaction Rate

## Our Services (Complete Details)

### 1. Graphic Design
Transform ideas into stunning visual content that captures attention and communicates messages with impact.
**What's Included:**
- Marketing Materials (brochures, flyers, banners)
- Social Media Graphics (posts, stories, covers)
- Print Design (business cards, letterheads, packaging)
- Infographics (data visualization, reports)
- Presentations (pitch decks, corporate presentations)

### 2. Logo Design ⭐ Popular
Create unique and memorable brand identities with professionally designed logos.
**What's Included:**
- Custom Logo Concepts (multiple design directions)
- Multiple Revisions (until you're satisfied)
- Vector Files (AI, EPS, SVG for scalability)
- Brand Guidelines (usage rules, color codes)
- Social Media Kit (optimized versions for all platforms)

### 3. Branding
Build cohesive brand identities that resonate with target audiences.
**What's Included:**
- Brand Strategy (positioning, messaging, tone of voice)
- Visual Identity (complete visual system)
- Brand Guidelines (comprehensive style guide)
- Color Palette (primary, secondary, accent colors)
- Typography System (font pairings, hierarchy)

### 4. Web Design ⭐ Popular
Beautiful, responsive websites that deliver exceptional user experiences.
**What's Included:**
- Responsive Design (works on all devices)
- UI/UX Design (user-centered interface design)
- Prototyping (interactive mockups)
- User Testing (usability validation)
- Mobile Optimization (mobile-first approach)

### 5. Digital Art
Custom digital artwork and illustrations that bring creative visions to life.
**What's Included:**
- Digital Illustrations (custom artwork)
- Character Design (mascots, personas)
- Concept Art (visual development)
- Digital Painting (realistic or stylized)
- Custom Artwork (one-of-a-kind pieces)

### 6. Video Editing
Professional video editing to create engaging content that tells stories.
**What's Included:**
- Video Production (end-to-end video creation)
- Motion Graphics (animated elements, titles)
- Color Grading (cinematic color correction)
- Sound Design (audio enhancement, mixing)
- Post-Production (effects, transitions, finishing)

## Contact Information
- **Email**: digicreativio@gmail.com
- **Phone**: +1 (234) 567-890
- **Address**: 123 Creative Street, Design City, DC 12345
- **Business Hours**: Monday - Friday: 9AM - 6PM

## How You Should Respond

1. **Be Knowledgeable**: You know EVERYTHING about DigiCreativio. Answer confidently about services, processes, values, and capabilities.

2. **Be Helpful**: Guide users to the right service based on their needs. Ask clarifying questions when needed.

3. **Use Markdown Formatting**: Format your responses nicely with:
   - **Bold** for emphasis
   - Bullet points for lists
   - Headers when organizing information
   - Code blocks if showing examples

4. **Pricing Questions**: Explain that pricing varies based on project scope, complexity, and requirements. Encourage them to reach out for a custom quote via the contact form or email.

5. **Project Inquiries**: Gather relevant information about their project (type, timeline, budget range) and guide them to contact the team.

6. **Design Advice**: Share professional design tips, best practices, and creative insights when asked.

7. **Keep It Conversational**: Be friendly, enthusiastic, and professional. Show genuine interest in helping.

8. **Call to Action**: When appropriate, encourage users to:
   - Visit the Contact page to start a project
   - Check out the Portfolio page to see our work
   - Explore the Services page for more details
   - Email digicreativio@gmail.com directly

## Sample Topics You Can Help With

- Explaining any of our services in detail
- Recommending the right service for a specific need
- Sharing the design process and what to expect
- Discussing timelines and project workflow
- Providing design tips and creative advice
- Answering questions about branding, logos, websites
- Helping users understand what information to prepare for a project
- Explaining file formats, deliverables, and revisions
- Discussing design trends and best practices

Remember: You are the virtual face of DigiCreativio. Be professional yet approachable, knowledgeable yet humble, and always focus on how we can help the visitor achieve their creative goals.`;

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate optional authentication
    const { userId, email } = await validateOptionalAuth(req);
    const isAuthenticated = !!userId;
    
    // Use userId for authenticated users, IP for anonymous
    const clientIP = getClientIP(req);
    const rateLimitIdentifier = isAuthenticated ? userId : clientIP;
    
    // Check rate limit with appropriate limits based on auth status
    const rateLimit = checkRateLimit(rateLimitIdentifier, isAuthenticated);

    if (!rateLimit.allowed) {
      const limitType = isAuthenticated ? "authenticated" : "anonymous";
      console.log(`Rate limit exceeded for ${limitType} chatbot request: ${rateLimitIdentifier}`);
      
      const suggestion = isAuthenticated 
        ? "Please try again in a few minutes."
        : "Please try again in a few minutes, or sign in for higher rate limits.";
      
      return new Response(
        JSON.stringify({ 
          error: "Too many requests",
          response: `I'm receiving too many requests right now. ${suggestion}`
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Authenticated": String(isAuthenticated)
          } 
        }
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

    // Log request with user context (no sensitive data)
    console.log(`Chatbot request: authenticated=${isAuthenticated}, IP=${clientIP}, messageLength=${message.length}`);

    // Build conversation history
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(Array.isArray(history) ? history.slice(-15) : []).map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: String(msg.content).slice(0, 2000),
      })),
      { role: "user", content: message.slice(0, 2000) },
    ];

    // Call Lovable AI Gateway with more capable model
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
        model: "google/gemini-3-flash-preview",
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "Rate limited",
            response: "I'm receiving too many requests right now. Please try again in a moment."
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "Service unavailable",
            response: "I'm temporarily unavailable. Please try again later or contact us directly at digicreativio@gmail.com."
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const error = await response.text();
      console.error("AI API error:", error);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Authenticated": String(isAuthenticated)
        } 
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
