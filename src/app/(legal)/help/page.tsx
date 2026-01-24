export default function HelpPage() {
  const guides = [
    {
      title: "The 200-Word Rule",
      description: "LinkedIn mobile cuts off text at ~140 characters. By keeping your 'Manifesto' around 200-250 words, you force the 'See More' click, which tells the algorithm your content is high-value.",
      icon: "📈"
    },
    {
      title: "The Hook is Everything",
      description: "The first 2 lines are all that matters. Use the AI output, but always rewrite the first sentence to be a 'contrarian' or 'result-oriented' statement.",
      icon: "🪝"
    },
    {
      title: "Formatting for Skimmers",
      description: "Our AI uses white space effectively. Don't clump text. Use 1-2 sentence paragraphs to keep readers moving down the page.",
      icon: "📱"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-300 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter mb-4">
          Pro Guide
        </h1>
        <p className="text-zinc-500 mb-12 uppercase tracking-widest text-sm">Mastering the LinkedIn Manifesto</p>

        <div className="grid gap-6">
          {guides.map((guide, i) => (
            <div key={i} className="group p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800 hover:border-red-600/50 transition-all">
              <div className="text-4xl mb-4">{guide.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">{guide.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{guide.description}</p>
            </div>
          ))}
        </div>

        {/* --- UPDATED SUPPORT SECTION --- */}
        <div className="mt-12 p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 text-center">
          <h4 className="text-white font-bold mb-2">Still stuck?</h4>
          <p className="text-sm text-zinc-400 mb-6">Our support team usually responds within 2 hours.</p>
          
          <a 
            href="mailto:support@bosswrite.ai?subject=Support Request: BossWrite" 
            className="inline-block bg-white text-black px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all duration-300 shadow-lg shadow-white/5"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}