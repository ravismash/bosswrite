"use client";

import React from "react";

interface AudienceSelectorProps {
  selected: string;
  onChange: (value: string) => void;
}

const audiences = [
  { id: "solopreneur", label: "Solopreneur", icon: "👤" },
  { id: "founder", label: "Tech Founder", icon: "🚀" },
  { id: "investor", label: "VC / Investor", icon: "💰" },
  { id: "corporate", label: "Corporate Exec", icon: "🏢" },
];

export default function AudienceSelector({ selected, onChange }: AudienceSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
        Target Audience Lens
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {audiences.map((item) => {
          // Determine active state strictly
          const isActive = selected === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                console.log("Setting Audience to:", item.id);
                onChange(item.id);
              }}
              // Force Tailwind to see these exact strings
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                isActive 
                  ? "border-red-600 bg-red-900/20 text-white shadow-[0_0_15px_rgba(220,38,38,0.2)]" 
                  : "border-zinc-800 bg-black text-zinc-500 hover:border-zinc-700"
              }`}
            >
              <span className={`text-xl transition-opacity ${isActive ? "opacity-100" : "opacity-50"}`}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? "text-white" : "text-zinc-500"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}