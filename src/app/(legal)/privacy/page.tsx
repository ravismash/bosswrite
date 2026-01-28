export default function PrivacyPolicy() {
  const lastUpdated = "January 22, 2026";

  return (
    <div className="min-h-screen bg-white text-zinc-600 py-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black text-zinc-900 italic uppercase tracking-tighter mb-4">
          Privacy Policy
        </h1>
        <p className="text-zinc-500 text-sm mb-16 font-medium border-b border-zinc-200 pb-8">
          Effective Date: {lastUpdated}
        </p>

        <div className="space-y-16">
          {/* Section 1: Introduction */}
          <section>
            <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest mb-6 border-l-4 border-red-600 pl-4">
              1. Information We Collect
            </h2>
            <p className="mb-4 text-lg leading-relaxed">
              We collect information to provide a better experience for our users. This includes:
            </p>
            <ul className="list-disc ml-6 space-y-3 marker:text-red-600">
              <li>
                <strong className="text-zinc-900">Account Data:</strong> Email address and name provided via Google Auth or Supabase.
              </li>
              <li>
                <strong className="text-zinc-900">Payment Data:</strong> Transaction IDs and billing details (processed securely via Cashfree/Stripe; we do not store card numbers).
              </li>
              <li>
                <strong className="text-zinc-900">Usage Data:</strong> YouTube URLs submitted and the resulting generated Manifestos.
              </li>
            </ul>
          </section>

          {/* Section 2: Audio & Transcription Handling */}
          <section>
            <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest mb-6 border-l-4 border-red-600 pl-4">
              2. Data Processing (YouTube & Audio)
            </h2>
            <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
                <p className="mb-3 text-zinc-900 font-bold italic">How we handle transcription:</p>
                <p className="leading-relaxed">
                When you provide a YouTube URL, our system downloads the audio temporarily to a secure server. 
                <strong className="text-zinc-900"> We do not store these audio files permanently.</strong> 
                Temporary files are automatically deleted after the "Manifesto" is generated. 
                The resulting transcript is processed by AI to create your post.
                </p>
            </div>
          </section>

          {/* Section 3: Purpose of Processing */}
          <section>
            <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest mb-6 border-l-4 border-red-600 pl-4">
              3. Purpose of Processing
            </h2>
            <p className="text-lg leading-relaxed">
              Under the India DPDP Act, we process your data based on your explicit consent for the following purposes:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-3 marker:text-red-600">
              <li>To generate content based on your requests.</li>
              <li>To manage your "Credit" balance.</li>
              <li>To send essential service updates or technical alerts.</li>
            </ul>
          </section>

          {/* Section 4: Data Retention */}
          <section>
            <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest mb-6 border-l-4 border-red-600 pl-4">
              4. Data Retention & Your Rights
            </h2>
            <p className="text-lg leading-relaxed">
              We retain your account info as long as your account is active. You have the right to:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-3 marker:text-red-600">
              <li>Request a copy of the data we hold about you.</li>
              <li>Request the correction or total erasure of your data.</li>
              <li>Withdraw consent at any time (which may limit your access to the Service).</li>
            </ul>
          </section>

          {/* Section 5: Security */}
          <section>
            <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest mb-6 border-l-4 border-red-600 pl-4">
              5. Security Measures
            </h2>
            <p className="text-lg leading-relaxed">
              We implement industry-standard encryption (SSL/TLS) for all data in transit. 
              Our database is protected by Row Level Security (RLS) via Supabase to ensure 
              no other user can access your private generated content.
            </p>
          </section>

          {/* Section 6: Contact */}
          <section>
            <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest mb-6 border-l-4 border-red-600 pl-4">
              6. Grievance Officer
            </h2>
            <div className="bg-red-50 border border-red-100 p-6 rounded-xl">
                <p className="leading-relaxed text-zinc-800">
                In compliance with Indian Law, if you have any privacy concerns, you may contact our Grievance Officer at: 
                <br />
                <a href="mailto:privacy@bosswrite.ai" className="text-red-600 font-bold hover:underline mt-2 inline-block">
                    privacy@bosswrite.ai
                </a>
                </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}