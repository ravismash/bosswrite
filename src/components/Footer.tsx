// src/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-900 bg-black py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          
          {/* Copyright Section */}
          <div className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            © 2026 <span className="text-zinc-400 italic">BossWrite AI</span>
          </div>
          
          {/* Navigation Links with Dividers */}
          <nav className="flex flex-wrap justify-center items-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <Link href="/terms" className="hover:text-red-600 transition-all px-3">Terms</Link>
            
            <span className="text-zinc-800 pointer-events-none">|</span>
            
            <Link href="/privacy" className="hover:text-red-600 transition-all px-3">Privacy</Link>
            
            <span className="text-zinc-800 pointer-events-none">|</span>
            
            <Link href="/refund" className="hover:text-red-600 transition-all px-3">Refunds</Link>
            
            <span className="text-zinc-800 pointer-events-none">|</span>
            
            <Link href="/help" className="hover:text-red-600 transition-all px-3">Help</Link>
            
            <span className="text-zinc-800 pointer-events-none">|</span>
            
            <Link href="/contact" className="hover:text-red-600 transition-all px-3">Contact</Link>
          </nav>

        </div>
      </div>
    </footer>
  );
}