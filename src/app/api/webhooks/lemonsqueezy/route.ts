import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    const hmac = crypto.createHmac("sha256", secret!);
    const digest = Buffer.from(hmac.update(text).digest("hex"), "utf8");
    const signature = Buffer.from(req.headers.get("x-signature") || "", "utf8");

    if (!crypto.timingSafeEqual(digest, signature)) {
      return new Response("Invalid signature", { status: 401 });
    }

    const payload = JSON.parse(text);
    const { meta, data } = payload;
    const eventName = meta.event_name;
    
    // 1. Get identifiers
    let userId = meta.custom_data?.user_id;
    const userEmail = data.attributes.user_email;
    const variantId = parseInt(data.attributes.variant_id || data.attributes.first_order_item?.variant_id);

    console.log("\n------------------------------------------------------");
    console.log(`🔔 EVENT: ${eventName}`);
    console.log(`📧 Email: ${userEmail}`);
    console.log(`🆔 Variant: ${variantId}`);
    console.log(`👤 User ID (Direct): ${userId || "❌ Missing"}`);

    if (eventName === "order_created" || eventName === "subscription_created") {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // 2. 🕵️‍♂️ THE FIX: If User ID is missing, find user by EMAIL
      if (!userId && userEmail) {
        console.log("🔍 User ID missing... Searching profile by Email...");
        
        // This assumes you have an 'email' column in your 'profiles' table.
        // If not, we might need to query auth.users, but usually profiles has it.
        const { data: userProfile } = await supabaseAdmin
          .from("profiles")
          .select("id, email")
          .eq("email", userEmail)
          .single();

        if (userProfile) {
          userId = userProfile.id;
          console.log(`✅ FOUND USER via Email: ${userId}`);
        } else {
          console.log("❌ Could not find user by email either.");
        }
      }

      // 3. Credits Logic
      if (userId) {
        let creditsToAdd = 0;

        if (variantId === 1277381) creditsToAdd = 50;        // Monthly
        else if (variantId === 1295941) creditsToAdd = 1000; // Yearly
       //Live payement
        /*if (variantId === 1295723) creditsToAdd = 50;        // Monthly
        else if (variantId === 1295725) creditsToAdd = 1000;
        */

        if (creditsToAdd > 0) {
           console.log(`🚀 Adding ${creditsToAdd} credits to user ${userId}...`);
           
           const { data: profile } = await supabaseAdmin
             .from("profiles")
             .select("credits")
             .eq("id", userId)
             .single();

           await supabaseAdmin
             .from("profiles")
             .update({ credits: (profile?.credits || 0) + creditsToAdd })
             .eq("id", userId);
             
           console.log("✅ SUCCESS: Credits Updated.");
        } else {
           console.log(`⚠️ Ignored: Variant ID ${variantId} is not configured.`);
        }
      }
    }
    console.log("------------------------------------------------------\n");

    return new Response("Webhook processed", { status: 200 });

  } catch (err: any) {
    console.error("💥 Error:", err.message);
    return new Response(`Server Error: ${err.message}`, { status: 500 });
  }
}