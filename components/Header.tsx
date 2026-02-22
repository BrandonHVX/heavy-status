"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, Bell, ChevronLeft } from "lucide-react";
import type { WPPost, WPCategory, WPTag } from "@/lib/wordpress";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&hellip;/g, '...').replace(/&amp;/g, '&').trim();
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ posts: WPPost[]; categories: WPCategory[]; tags: WPTag[] } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          setSearchResults(await res.json());
        }
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-sm" data-testid="header">
      <div className="flex items-center justify-between gap-2 px-4 h-14">
        {!isHome && !searchOpen && (
          <button
            onClick={() => router.back()}
            className="shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {searchOpen ? (
          <div className="flex items-center gap-2 flex-1">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, categories, tags..."
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-gray-100 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/40"
                data-testid="input-search"
              />
              {searchQuery.length >= 2 && searchResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto z-50" data-testid="search-results">
                  {searchResults.categories.length > 0 && (
                    <div className="p-2">
                      <p className="text-xs font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">Categories</p>
                      {searchResults.categories.map((cat) => (
                        <button
                          key={cat.slug}
                          onClick={() => { router.push(`/category/${cat.slug}`); setSearchOpen(false); setSearchQuery(""); }}
                          className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-50 transition-colors"
                          data-testid={`search-category-${cat.slug}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.tags.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">Tags</p>
                      <div className="flex flex-wrap gap-1 px-2">
                        {searchResults.tags.map((tag) => (
                          <span key={tag.slug} className="text-xs bg-gray-100 px-2 py-0.5 rounded-md">{tag.name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {searchResults.posts.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">Articles</p>
                      {searchResults.posts.map((post) => (
                        <button
                          key={post.slug}
                          onClick={() => { router.push(`/article/${post.slug}`); setSearchOpen(false); setSearchQuery(""); }}
                          className="w-full text-left px-2 py-2 rounded hover:bg-gray-50 transition-colors flex gap-3 items-center"
                          data-testid={`search-post-${post.slug}`}
                        >
                          {post.featuredImage && (
                            <img src={post.featuredImage.sourceUrl} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{post.title}</p>
                            <p className="text-xs text-gray-400 truncate">{stripHtml(post.excerpt).slice(0, 60)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.posts.length === 0 && searchResults.categories.length === 0 && searchResults.tags.length === 0 && (
                    <div className="p-6 text-center text-sm text-gray-400">No results found</div>
                  )}
                </div>
              )}
            </div>
            <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" data-testid="button-close-search">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <button onClick={() => router.push("/")} className="flex items-center gap-1.5" data-testid="link-home">
              <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xs">HS</span>
              </div>
              <span className="font-serif font-bold text-base tracking-tight text-gray-900">Heavy Status</span>
            </button>
            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" data-testid="button-search">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" data-testid="button-notifications">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
