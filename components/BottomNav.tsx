"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Star, Compass, Radio } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Headlines" },
  { path: "/featured", icon: Star, label: "Featured" },
  { path: "/explore", icon: Compass, label: "Explore" },
  { path: "/live", icon: Radio, label: "Live" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200/60 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] safe-area-bottom" data-testid="bottom-nav">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = pathname === path;
          return (
            <button
              key={path}
              onClick={() => router.push(path)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
                isActive ? "text-blue-500" : "text-gray-400"
              }`}
              data-testid={`nav-${label.toLowerCase()}`}
            >
              <div className={`p-1.5 rounded-lg transition-all ${isActive ? "bg-blue-50" : ""}`}>
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
