// src/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white py-10 mt-auto">
      <div className="mx-auto max-w-7xl px-6 flex flex-col items-center gap-8">
        
        {/* Navigation with extra-wide spacing */}
        <nav className="flex flex-wrap justify-center gap-x-12 gap-y-4">
          <Link href="/help" className="text-sm text-gray-500 hover:text-black hover:underline transition-all">
            Help Center
          </Link>
          <Link href="/terms" className="text-sm text-gray-500 hover:text-black hover:underline transition-all">
            Terms of Service
          </Link>
          <Link href="/refund" className="text-sm text-gray-500 hover:text-black hover:underline transition-all">
            Refund & Cancellation
          </Link>
          <Link href="/privacy" className="text-sm text-gray-500 hover:text-black hover:underline transition-all">
            Privacy Policy
          </Link>
        </nav>

        {/* Minimalist branding line */}
        <div className="flex items-center gap-4">
          <div className="h-px w-8 bg-gray-200" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            © 2026 DNA CLONER
          </p>
          <div className="h-px w-8 bg-gray-200" />
        </div>
        
      </div>
    </footer>
  );
}