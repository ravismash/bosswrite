"use client";

import { useState } from "react";
import { 
  ThumbsUp, 
  MessageSquare, 
  Repeat, 
  Send, 
  MoreHorizontal, 
  Globe, 
  Copy,
  Check
} from "lucide-react";

interface LinkedInPreviewProps {
  content: string;
  role?: string;
  authorName?: string; // Optional: Pass real name if available
}

export default function LinkedInPreview({ 
  content, 
  role = "Founder", 
  authorName = "You" 
}: LinkedInPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Logic to truncate text for the "See more" preview
  const TRUNCATE_LENGTH = 280;
  const shouldTruncate = content.length > TRUNCATE_LENGTH && !isExpanded;
  const displayContent = shouldTruncate 
    ? content.slice(0, TRUNCATE_LENGTH) + "..." 
    : content;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[550px] bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden font-sans">
      
      {/* --- HEADER --- */}
      <div className="p-4 pb-2 flex items-start gap-3">
        {/* Avatar Placeholder */}
        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white font-bold text-lg shrink-0">
          {authorName[0]}
        </div>
        
        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900 truncate">
              {authorName}
              <span className="text-zinc-500 font-normal ml-1">• You</span>
            </h3>
            <button className="text-zinc-500 hover:bg-zinc-100 p-1 rounded-full">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-zinc-500 truncate">{role} @ Stealth • 100M+ Views</p>
          <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
            <span>Now</span>
            <span>•</span>
            <Globe className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="px-4 py-2">
        <div className="text-sm text-zinc-900 whitespace-pre-wrap leading-relaxed">
          {displayContent}
          {shouldTruncate && (
            <button 
              onClick={() => setIsExpanded(true)}
              className="text-zinc-500 font-medium hover:text-blue-600 hover:underline ml-1 cursor-pointer"
            >
              ...see more
            </button>
          )}
        </div>
      </div>

      {/* --- MEDIA PLACEHOLDER (Optional visual flair) --- */}
      {/* You can remove this div if you only generate text, but it adds realism */}
      {/* <div className="mt-2 h-64 bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs uppercase font-bold tracking-widest border-y border-zinc-100">
        Image / Video Placeholder
      </div> */}

      {/* --- STATS BAR --- */}
      <div className="px-4 py-2 mt-2 flex items-center justify-between border-t border-zinc-100">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
               <ThumbsUp className="w-2 h-2 text-white fill-white" />
            </div>
            <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
               <span className="text-[6px] text-white">❤️</span>
            </div>
            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
               <span className="text-[6px] text-white">👏</span>
            </div>
          </div>
          <span className="text-xs text-zinc-500 hover:text-blue-600 hover:underline cursor-pointer">
            1,245
          </span>
        </div>
        <div className="text-xs text-zinc-500 hover:text-blue-600 hover:underline cursor-pointer">
          84 comments • 12 reposts
        </div>
      </div>

      {/* --- ACTION BUTTONS --- */}
      <div className="px-2 py-1 flex items-center justify-between border-t border-zinc-100">
        <ActionButton icon={<ThumbsUp className="w-5 h-5" />} label="Like" />
        <ActionButton icon={<MessageSquare className="w-5 h-5" />} label="Comment" />
        <ActionButton icon={<Repeat className="w-5 h-5" />} label="Repost" />
        <ActionButton icon={<Send className="w-5 h-5" />} label="Send" />
      </div>

      {/* --- REAL COPY BUTTON (Overlay) --- */}
      <div className="px-4 py-4 bg-zinc-50 border-t border-zinc-200 flex justify-end">
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            copied 
              ? "bg-green-600 text-white shadow-lg shadow-green-200" 
              : "bg-zinc-900 text-white hover:bg-black shadow-lg shadow-zinc-200"
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied to Clipboard" : "Copy Text"}
        </button>
      </div>

    </div>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-2 px-2 py-3 rounded hover:bg-zinc-100 flex-1 justify-center transition-colors group">
      <span className="text-zinc-500 group-hover:text-zinc-600 group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span className="text-sm font-semibold text-zinc-500 group-hover:text-zinc-600">
        {label}
      </span>
    </button>
  );
}