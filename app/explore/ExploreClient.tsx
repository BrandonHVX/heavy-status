"use client";

import { useRouter } from "next/navigation";
import PostCard from "@/components/PostCard";
import MasonryGrid from "@/components/MasonryGrid";
import PullToRefresh from "@/components/PullToRefresh";
import { Compass, ChevronRight } from "lucide-react";
import type { WPPost, WPCategory } from "@/lib/wordpress";

const categoryColors = [
  "from-violet-50 to-violet-100/50",
  "from-blue-50 to-blue-100/50",
  "from-emerald-50 to-emerald-100/50",
  "from-amber-50 to-amber-100/50",
  "from-rose-50 to-rose-100/50",
  "from-cyan-50 to-cyan-100/50",
  "from-orange-50 to-orange-100/50",
  "from-pink-50 to-pink-100/50",
];

export default function ExploreClient({ posts, categories }: { posts: WPPost[]; categories: WPCategory[] }) {
  const router = useRouter();

  return (
    <PullToRefresh>
      <div className="pb-20" data-testid="page-explore">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-blue-500" />
            <h1 className="text-xl font-serif font-bold tracking-tight">Explore</h1>
          </div>
          <p className="text-sm text-gray-400">Discover stories across all topics</p>
        </div>

        <section className="mb-6">
          <h2 className="px-4 font-semibold text-sm text-gray-400 uppercase tracking-wider mb-3">Categories</h2>
          <div className="px-4 grid grid-cols-2 gap-2">
            {categories.map((cat, i) => (
              <button
                key={cat.slug}
                onClick={() => router.push(`/category/${cat.slug}`)}
                className={`flex items-center justify-between p-3 rounded-xl bg-gradient-to-br ${categoryColors[i % categoryColors.length]} border border-gray-200/60 shadow-sm transition-all active:scale-[0.98] hover:shadow-md`}
                data-testid={`category-${cat.slug}`}
              >
                <div>
                  <p className="font-semibold text-sm text-left">{cat.name}</p>
                  <p className="text-[11px] text-gray-400">{cat.count} articles</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="px-4 font-semibold text-sm text-gray-400 uppercase tracking-wider mb-3">All Stories</h2>
          {posts.length > 0 ? (
            <div className="px-4">
              <MasonryGrid columns={2} gap="gap-3">
                {posts.map((post, i) => (
                  <PostCard
                    key={post.slug}
                    post={post}
                    variant={i % 4 === 0 ? "overlay" : i % 4 === 1 ? "standard" : i % 4 === 2 ? "minimal" : "compact"}
                  />
                ))}
              </MasonryGrid>
            </div>
          ) : (
            <div className="px-4 py-16 text-center">
              <Compass className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No stories to explore yet</p>
            </div>
          )}
        </section>
      </div>
    </PullToRefresh>
  );
}
