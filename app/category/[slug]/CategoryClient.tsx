"use client";

import PostCard from "@/components/PostCard";
import MasonryGrid from "@/components/MasonryGrid";
import PullToRefresh from "@/components/PullToRefresh";
import { Tag } from "lucide-react";
import type { WPPost } from "@/lib/wordpress";

export default function CategoryClient({ posts, categoryName }: { posts: WPPost[]; categoryName: string }) {
  return (
    <PullToRefresh>
      <div className="pb-20" data-testid="page-category">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-5 h-5 text-blue-500" />
            <h1 className="text-xl font-serif font-bold tracking-tight">{categoryName}</h1>
          </div>
          <p className="text-sm text-gray-400">All stories in {categoryName}</p>
        </div>

        {posts.length > 0 ? (
          <div className="px-4">
            <PostCard post={posts[0]} variant="wide" />
            <div className="mt-3">
              <MasonryGrid columns={2} gap="gap-3">
                {posts.slice(1).map((post, i) => (
                  <PostCard
                    key={post.slug}
                    post={post}
                    variant={i % 3 === 0 ? "overlay" : "standard"}
                  />
                ))}
              </MasonryGrid>
            </div>
          </div>
        ) : (
          <div className="px-4 py-16 text-center">
            <Tag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No stories in this category yet</p>
          </div>
        )}
      </div>
    </PullToRefresh>
  );
}
