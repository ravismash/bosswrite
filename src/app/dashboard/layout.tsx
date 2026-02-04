"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Fingerprint, 
  LayoutDashboard, 
  CreditCard, 
  Settings, 
  LogOut,
  Menu
} from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans text-zinc-900">
      
      {/* ================================================= */}
      {/* 1. SIDEBAR (Desktop: Visible | Mobile: Hidden)    */}
      {/* ================================================= */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-zinc-200 fixed inset-y-0 z-50">
        
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-zinc-100">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white group-hover:bg-red-600 transition-colors shadow-lg shadow-zinc-900/20">
              <Fingerprint className="w-5 h-5" />
            </div>
            <span className="font-black italic text-lg tracking-tighter text-zinc-900">
              BOSSRWRITE
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-2">
          <NavItem 
            href="/dashboard" 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="Generator" 
            isActive={pathname === "/dashboard"} 
          />
          <NavItem 
            href="/dashboard/billing" 
            icon={<CreditCard className="w-5 h-5" />} 
            label="Billing & Credits" 
            isActive={pathname === "/dashboard/billing"} 
          />
          <div className="pt-4 mt-4 border-t border-zinc-100">
             <NavItem 
              href="/dashboard/settings" 
              icon={<Settings className="w-5 h-5" />} 
              label="Settings" 
              isActive={pathname === "/dashboard/settings"} 
            />
          </div>
        </nav>

        {/* Footer / User Info */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
          {/* ✅ UPDATED: Form Action for Server-Side Logout */}
          <form action="/auth/signout" method="post">
            <button 
              type="submit"
              className="flex items-center gap-3 px-4 py-3 w-full text-sm font-bold text-zinc-500 hover:text-red-600 transition-colors rounded-xl hover:bg-white hover:shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* ================================================= */}
      {/* 2. MOBILE HEADER (Desktop: Hidden)                */}
      {/* ================================================= */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-zinc-200 h-16 flex items-center justify-between px-4 z-50">
         <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
              <Fingerprint className="w-5 h-5" />
            </div>
            <span className="font-black italic text-lg tracking-tighter">BOSSRWRITE</span>
         </Link>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-zinc-600">
           <Menu className="w-6 h-6" />
         </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-zinc-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-white w-3/4 h-full pt-20 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <NavItem href="/dashboard" icon={<LayoutDashboard />} label="Generator" isActive={pathname === "/dashboard"} />
            <NavItem href="/dashboard/billing" icon={<CreditCard />} label="Billing" isActive={pathname === "/dashboard/billing"} />
            
            {/* ✅ UPDATED: Form Action for Mobile Logout */}
            <form action="/auth/signout" method="post">
               <button type="submit" className="flex items-center gap-3 px-4 py-3 w-full text-sm font-bold text-red-600">
                 <LogOut className="w-5 h-5" /> Sign Out
               </button>
            </form>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* 3. MAIN CONTENT AREA                              */}
      {/* ================================================= */}
      <div className="flex-1 md:ml-64 pt-16 md:pt-0">
        {/* Content injected here */}
        {children}
      </div>

    </div>
  );
}

// --- HELPER COMPONENT FOR LINKS ---
function NavItem({ 
  href, 
  icon, 
  label, 
  isActive 
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean 
}) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200 group ${
        isActive 
          ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20" 
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
      }`}
    >
      <span className={`transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}