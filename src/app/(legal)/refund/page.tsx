export default function RefundPolicy() {
  const lastUpdated = "January 22, 2026";

  return (
    <div className="min-h-screen bg-black text-zinc-300 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">
          Refund & Cancellation
        </h1>
        <p className="text-zinc-500 text-sm mb-12">Last Updated: {lastUpdated}</p>

        <div className="space-y-12">
          {/* Section 1: Digital Goods */}
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-red-600 pl-4">
              1. Digital Goods Policy
            </h2>
            <p>
              BossWrite sells non-tangible, irrevocable digital credits. Since these credits are 
              assigned to your account immediately upon successful payment, 
              <strong> we generally do not issue refunds</strong> once the order is confirmed 
              and the product is sent.
            </p>
          </section>

          {/* Section 2: Technical Issues */}
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-red-600 pl-4">
              2. Technical Failures
            </h2>
            <p>
              We understand that technology can sometimes fail. You are eligible for a credit 
              reversal or refund if:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>You were charged but the credits were not added to your dashboard.</li>
              <li>A technical bug on our end prevented the AI from generating your manifesto after a credit was deducted.</li>
              <li>You have a duplicate charge for the same transaction due to a gateway error.</li>
            </ul>
          </section>

          {/* Section 3: Timeline */}
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-red-600 pl-4">
              3. Refund Timeline
            </h2>
            <p>
              If a refund is approved, it will be processed through the original payment method 
              within <strong>5-7 working days</strong>. 
              <br /><br />
              <span className="text-sm italic">Note: UPI refunds are usually faster (3-5 days), while Credit Card refunds may take up to 10 days depending on your bank.</span>
            </p>
          </section>

          {/* Section 4: Cancellation */}
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-red-600 pl-4">
              4. Cancellation
            </h2>
            <p>
              You can stop using BossWrite at any time. There are no recurring subscription 
              fees unless explicitly mentioned. Deleting your account will result in the 
              permanent loss of any remaining credit balance, for which no refund will be provided.
            </p>
          </section>

          {/* Section 5: Contact */}
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-red-600 pl-4">
              5. How to Request a Refund
            </h2>
            <p>
              To request a refund for a technical issue, please email 
              <span className="text-red-600 font-bold ml-1">support@bosswrite.ai</span> with:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2 font-mono text-sm">
              <li>Order ID (e.g., order_123456)</li>
              <li>Transaction Screenshot</li>
              <li>Description of the technical error</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}