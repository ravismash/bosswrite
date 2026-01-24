export default function PrivacyPolicy() {
  const lastUpdated = "January 22, 2026";

  return (
    <div className="min-h-screen bg-black text-zinc-300 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">
          Privacy Policy
        </h1>
        <p className="text-zinc-500 text-sm mb-12">Effective Date: {lastUpdated}</p>

        <div className="space-y-12">
          {/* Section 1: Introduction */}
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-red-600 pl-4">
              1. Information We Collect
            </h2>
            <p className="mb-4">We collect information to provide a better experience for our users. This includes:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Account Data:</strong> Email address and name provided via Google Auth or Supabase.</li>
              <li><strong>Payment Data:</strong> Transaction IDs and billing details (processed securely via Cashfree/Stripe; we do not store card numbers).</li>
              <li><strong>Usage Data:</strong> YouTube URLs submitted and the resulting generated Manifestos.</li>
            </ul>
          </section>

          {/* Section 2: Audio & Transcription Handling */}
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-red-600 pl-4">
              2. Data Processing (YouTube & Audio)
            </h2>
            <p className="mb-4 text-white font-medium italic">How we handle transcription:</p>
            <p>
              When you provide a YouTube URL, our system downloads the audio temporarily to a secure server. 
              <strong> We do not store these audio files permanently.</strong> 
              Temporary files are automatically deleted after the "Manifesto" is generated. 
              The resulting transcript is processed by AI to create your post.
            </p>
          </section>

          {/* Section 3: Use of Data */}
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-red-600 pl-4">
              3. Purpose of Processing
            </h2>
            <p>Under the India DPDP Act, we process your data based on your explicit consent for the following purposes:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>To generate content based on your requests.</li>
              <li>To manage your "Credit" balance.</li>
              <li>To send essential service updates or technical alerts.</li>
            </ul>
          </section>

          {/* Section 4: Data Retention */}
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-red-600 pl-4">
              4. Data Retention & Your Rights
            </h2>
            <p>
              We retain your account info as long as your account is active. You have the right to:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Request a copy of the data we hold about you.</li>
              <li>Request the correction or total erasure of your data.</li>
              <li>Withdraw consent at any time (which may limit your access to the Service).</li>
            </ul>
          </section>

          {/* Section 5: Security */}
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-red-600 pl-4">
              5. Security Measures
            </h2>
            <p>
              We implement industry-standard encryption (SSL/TLS) for all data in transit. 
              Our database is protected by Row Level Security (RLS) via Supabase to ensure 
              no other user can access your private generated content.
            </p>
          </section>

          {/* Section 6: Contact */}
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-red-600 pl-4">
              6. Grievance Officer
            </h2>
            <p>
              In compliance with Indian Law, if you have any privacy concerns, you may contact our Grievance Officer at: 
              <br />
              <span className="text-red-600 font-bold">privacy@bosswrite.ai</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}