"use client";

import { useRouter } from "next/navigation";
import { Bookmark, Clock } from "lucide-react";
import { formatDate, stripHtml, readingTime, getImageUrl, type WPPost } from "@/lib/wordpress";

interface PostCardProps {
  post: WPPost;
  variant?: "hero" | "standard" | "compact" | "overlay" | "wide" | "minimal";
}

export default function PostCard({ post, variant = "standard" }: PostCardProps) {
  const router = useRouter();
  const imageUrl = getImageUrl(post);
  const category = post.categories[0];

  const handleClick = () => router.push(`/article/${post.slug}`);

  if (variant === "hero") {
    return (
      <button
        onClick={handleClick}
        className="relative w-full aspect-[4/5] rounded-xl overflow-hidden group text-left"
        data-testid={`card-hero-${post.slug}`}
      >
        <img src={imageUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-3 right-3">
          <div className="p-1.5 rounded-full bg-black/30 backdrop-blur-sm">
            <Bookmark className="w-4 h-4 text-white/80" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {category && (
            <span className="inline-block px-2 py-0.5 bg-blue-500/90 text-white text-[10px] font-semibold rounded uppercase tracking-wider mb-2">
              {category.name}
            </span>
          )}
          <h3 className="text-white font-serif font-bold text-lg leading-tight line-clamp-2">{post.title}</h3>
          <div className="flex items-center gap-2 mt-2 text-white/70 text-xs">
            {post.author && <span>{post.author.name}</span>}
            <span className="w-1 h-1 rounded-full bg-white/50" />
            <span>{formatDate(post.date)}</span>
          </div>
        </div>
      </button>
    );
  }

  if (variant === "overlay") {
    return (
      <button
        onClick={handleClick}
        className="relative w-full aspect-[3/4] rounded-xl overflow-hidden group text-left"
        data-testid={`card-overlay-${post.slug}`}
      >
        <img src={imageUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          {category && (
            <span className="inline-block px-1.5 py-0.5 bg-violet-500/80 text-white text-[9px] font-semibold rounded mb-1.5 uppercase tracking-wider">
              {category.name}
            </span>
          )}
          <h3 className="text-white font-serif font-semibold text-sm leading-tight line-clamp-2">{post.title}</h3>
          <p className="text-white/60 text-[11px] mt-1">{formatDate(post.date)}</p>
        </div>
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={handleClick}
        className="w-full text-left flex gap-3 p-3 rounded-xl bg-white shadow-sm border border-gray-200/40 hover:shadow-md transition-all group"
        data-testid={`card-compact-${post.slug}`}
      >
        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
          <img src={imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        </div>
        <div className="flex-1 min-w-0 py-0.5">
          {category && (
            <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider">{category.name}</span>
          )}
          <h3 className="text-sm font-serif font-semibold leading-tight line-clamp-2 mt-0.5">{post.title}</h3>
          <div className="flex items-center gap-1.5 mt-1.5 text-gray-400 text-[11px]">
            <Clock className="w-3 h-3" />
            <span>{formatDate(post.date)}</span>
          </div>
        </div>
      </button>
    );
  }

  if (variant === "wide") {
    return (
      <button
        onClick={handleClick}
        className="relative w-full aspect-[16/9] rounded-xl overflow-hidden group text-left"
        data-testid={`card-wide-${post.slug}`}
      >
        <img src={imageUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {category && (
            <span className="inline-block px-2 py-0.5 bg-white/10 backdrop-blur-sm text-white text-[10px] font-semibold rounded-md mb-2 uppercase tracking-wider">
              {category.name}
            </span>
          )}
          <h3 className="text-white font-serif font-bold text-base leading-tight line-clamp-2">{post.title}</h3>
          <p className="text-white/60 text-xs mt-1.5 line-clamp-1">{stripHtml(post.excerpt).slice(0, 100)}</p>
        </div>
      </button>
    );
  }

  if (variant === "minimal") {
    return (
      <button
        onClick={handleClick}
        className="w-full text-left p-3 rounded-xl border border-gray-200/40 bg-white shadow-sm hover:shadow-md transition-all group"
        data-testid={`card-minimal-${post.slug}`}
      >
        <div className="flex items-center gap-2 mb-2">
          {category && (
            <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider">{category.name}</span>
          )}
          <span className="text-[10px] text-gray-400">{formatDate(post.date)}</span>
        </div>
        <h3 className="text-sm font-serif font-semibold leading-tight line-clamp-2">{post.title}</h3>
        <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{stripHtml(post.excerpt).slice(0, 100)}</p>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="w-full text-left rounded-xl overflow-hidden group bg-white shadow-sm border border-gray-200/40"
      data-testid={`card-standard-${post.slug}`}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img src={imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
      </div>
      <div className="pt-2.5 pb-2.5 px-2.5">
        {category && (
          <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider">{category.name}</span>
        )}
        <h3 className="text-sm font-serif font-semibold leading-tight line-clamp-2 mt-0.5">{post.title}</h3>
        <div className="flex items-center gap-1.5 mt-1.5 text-gray-400 text-[11px]">
          <span>{formatDate(post.date)}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{readingTime(post.excerpt)}</span>
        </div>
      </div>
    </button>
  );
}
