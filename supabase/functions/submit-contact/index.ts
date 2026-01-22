import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting store (in-memory, resets on cold start)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // Max submissions per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// Timing check constants
const MIN_FORM_TIME_MS = 3000; // Minimum 3 seconds to fill form
const MAX_FORM_TIME_MS = 30 * 60 * 1000; // Maximum 30 minutes

// Validation schema
const validateContact = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Name validation
  if (!data.name || typeof data.name !== "string") {
    errors.push("Name is required");
  } else if (data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  } else if (data.name.length > 100) {
    errors.push("Name must be less than 100 characters");
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || typeof data.email !== "string") {
    errors.push("Email is required");
  } else if (!emailRegex.test(data.email)) {
    errors.push("Invalid email format");
  } else if (data.email.length > 255) {
    errors.push("Email must be less than 255 characters");
  }

  // Phone validation (optional)
  if (data.phone && typeof data.phone === "string" && data.phone.length > 50) {
    errors.push("Phone must be less than 50 characters");
  }

  // Subject validation (optional)
  if (data.subject && typeof data.subject === "string" && data.subject.length > 200) {
    errors.push("Subject must be less than 200 characters");
  }

  // Message validation
  if (!data.message || typeof data.message !== "string") {
    errors.push("Message is required");
  } else if (data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters");
  } else if (data.message.length > 5000) {
    errors.push("Message must be less than 5000 characters");
  }

  return { valid: errors.length === 0, errors };
};

// Get client IP from request headers
const getClientIP = (req: Request): string => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "unknown";
};

// Check rate limit
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

// Log spam attempt to database
const logSpamAttempt = async (
  supabase: any,
  ip: string,
  reason: string,
  details: Record<string, any>
) => {
  try {
    await supabase.from("spam_logs").insert([
      {
        ip_address: ip,
        reason,
        details,
      },
    ]);
  } catch (error) {
    console.error("Failed to log spam attempt:", error);
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Initialize Supabase client with service role for bypassing RLS
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const clientIP = getClientIP(req);
    const body = await req.json();

    // === HONEYPOT CHECK ===
    // If the hidden field is filled, it's a bot
    if (body._hp_field && body._hp_field.length > 0) {
      console.log(`Honeypot triggered for IP: ${clientIP}`);
      await logSpamAttempt(supabase, clientIP, "honeypot", {
        field_value: body._hp_field.slice(0, 100),
      });
      // Return success to not reveal detection
      return new Response(
        JSON.stringify({ success: true, message: "Message sent successfully" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // === TIMING CHECK ===
    const formLoadedAt = body._form_loaded_at;
    if (formLoadedAt) {
      const submissionTime = Date.now() - formLoadedAt;
      
      // Too fast - likely a bot
      if (submissionTime < MIN_FORM_TIME_MS) {
        console.log(`Timing check failed (too fast) for IP: ${clientIP}, time: ${submissionTime}ms`);
        await logSpamAttempt(supabase, clientIP, "timing_too_fast", {
          submission_time_ms: submissionTime,
          threshold_ms: MIN_FORM_TIME_MS,
        });
        return new Response(
          JSON.stringify({ 
            error: "Please take a moment to fill out the form carefully.",
            slowDown: true 
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Too slow - might be replay attack or stale form
      if (submissionTime > MAX_FORM_TIME_MS) {
        console.log(`Timing check failed (too slow) for IP: ${clientIP}, time: ${submissionTime}ms`);
        await logSpamAttempt(supabase, clientIP, "timing_too_slow", {
          submission_time_ms: submissionTime,
          threshold_ms: MAX_FORM_TIME_MS,
        });
        return new Response(
          JSON.stringify({ 
            error: "Your session has expired. Please refresh the page and try again.",
            expired: true 
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // === RATE LIMITING ===
    const rateLimit = checkRateLimit(clientIP);

    if (!rateLimit.allowed) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      await logSpamAttempt(supabase, clientIP, "rate_limit", {
        limit: RATE_LIMIT,
        window_ms: RATE_LIMIT_WINDOW,
      });
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": "0"
          } 
        }
      );
    }

    // Parse and validate input
    const validation = validateContact(body);

    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: "Validation failed", details: validation.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: body.name.trim().slice(0, 100),
      email: body.email.trim().toLowerCase().slice(0, 255),
      message: [
        body.subject ? `Subject: ${body.subject.trim().slice(0, 200)}` : null,
        body.phone ? `Phone: ${body.phone.trim().slice(0, 50)}` : null,
        "",
        body.message.trim().slice(0, 5000)
      ].filter(Boolean).join("\n"),
    };

    // Insert into database
    const { error } = await supabase
      .from("contact_submissions")
      .insert([sanitizedData]);

    if (error) {
      console.error("Database insert error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to submit message. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Contact form submitted successfully from IP: ${clientIP}`);

    return new Response(
      JSON.stringify({ success: true, message: "Message sent successfully" }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(rateLimit.remaining)
        } 
      }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
