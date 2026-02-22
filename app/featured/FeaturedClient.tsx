"use client";

import PostCard from "@/components/PostCard";
import MasonryGrid from "@/components/MasonryGrid";
import PullToRefresh from "@/components/PullToRefresh";
import { Star } from "lucide-react";
import type { WPPost } from "@/lib/wordpress";

export default function FeaturedClient({ posts }: { posts: WPPost[] }) {
  return (
    <PullToRefresh>
      <div className="pb-20" data-testid="page-featured">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h1 className="text-xl font-serif font-bold tracking-tight">Featured</h1>
          </div>
          <p className="text-sm text-gray-400">Hand-picked stories that matter most</p>
        </div>

        {posts.length > 0 ? (
          <div className="px-4">
            <PostCard post={posts[0]} variant="hero" />
            <div className="mt-4">
              <MasonryGrid columns={2} gap="gap-3">
                {posts.slice(1).map((post, i) => (
                  <PostCard
                    key={post.slug}
                    post={post}
                    variant={i % 3 === 0 ? "overlay" : i % 3 === 1 ? "standard" : "minimal"}
                  />
                ))}
              </MasonryGrid>
            </div>
          </div>
        ) : (
          <div className="px-4 py-16 text-center">
            <Star className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No featured stories yet</p>
          </div>
        )}
      </div>
    </PullToRefresh>
  );
}
