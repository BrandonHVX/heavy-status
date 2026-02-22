import { ExternalLink } from "lucide-react";

interface AdBannerProps {
  variant?: "cta" | "banner" | "inline";
  title?: string;
  subtitle?: string;
}

export default function AdBanner({ variant = "banner", title, subtitle }: AdBannerProps) {
  if (variant === "cta") {
    return (
      <div className="mx-4 my-6 p-5 rounded-xl bg-gradient-to-br from-blue-50 via-blue-50/50 to-white border border-blue-100 shadow-sm" data-testid="ad-cta">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-sm">{title || "Stay Informed"}</p>
            <p className="text-xs text-gray-400 mt-1">{subtitle || "Get breaking news delivered to your inbox. Subscribe to our newsletter."}</p>
          </div>
          <ExternalLink className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        </div>
        <button className="mt-3 px-4 py-1.5 bg-blue-500 text-white rounded-md text-xs font-medium" data-testid="button-cta-subscribe">
          Subscribe
        </button>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="mx-4 my-4 p-4 rounded-lg bg-gray-50 border border-gray-200/60 text-center shadow-sm" data-testid="ad-inline">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">Advertisement</p>
        <div className="h-16 bg-gray-100 rounded-md flex items-center justify-center">
          <p className="text-xs text-gray-400">Ad Space - 320x100</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 my-6 rounded-xl overflow-hidden bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 p-5 shadow-sm" data-testid="ad-banner">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">Sponsored</p>
      <div className="h-24 bg-white/60 rounded-lg flex items-center justify-center border border-gray-200/40">
        <p className="text-sm text-gray-400">Banner Ad - 300x250</p>
      </div>
    </div>
  );
}
