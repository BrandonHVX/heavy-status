"use client";

import { useState } from "react";
import PullToRefresh from "@/components/PullToRefresh";
import { Radio, Play, Clock } from "lucide-react";
import { formatDate, stripHtml, getImageUrl, type WPPost } from "@/lib/wordpress";

export default function LiveClient({ posts }: { posts: WPPost[] }) {
  const [selectedPost, setSelectedPost] = useState<WPPost | null>(null);
  const activePost = selectedPost || (posts && posts[0]) || null;

  return (
    <PullToRefresh>
      <div className="pb-20" data-testid="page-live">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="relative">
              <Radio className="w-5 h-5 text-red-500" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
            <h1 className="text-xl font-serif font-bold tracking-tight">Live</h1>
          </div>
          <p className="text-sm text-gray-400">Watch live coverage and recent video content</p>
        </div>

        {activePost && (
          <div className="px-4 mb-4">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
              <img
                src={getImageUrl(activePost)}
                alt={activePost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center" data-testid="button-play">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-600 text-white text-[10px] font-bold uppercase">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Live
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <h2 className="text-white font-serif font-semibold text-sm leading-tight line-clamp-2">{activePost.title}</h2>
                <p className="text-white/60 text-xs mt-1">{formatDate(activePost.date)}</p>
              </div>
            </div>
            <div className="mt-3 px-1">
              <h3 className="font-semibold text-sm">{activePost.title}</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{stripHtml(activePost.excerpt)}</p>
            </div>
          </div>
        )}

        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm text-gray-400 uppercase tracking-wider">Up Next</h2>
            <span className="text-xs text-gray-400">{posts?.length || 0} videos</span>
          </div>
          <div className="space-y-2">
            {posts?.map((post, i) => {
              const isActive = activePost?.slug === post.slug;
              return (
                <button
                  key={post.slug}
                  onClick={() => setSelectedPost(post)}
                  className={`w-full flex gap-3 p-2 rounded-xl text-left transition-all ${
                    isActive ? 'bg-blue-50 border border-blue-200 shadow-sm' : 'hover:bg-gray-50 border border-transparent'
                  }`}
                  data-testid={`video-item-${i}`}
                >
                  <div className="relative w-28 aspect-video rounded-lg overflow-hidden shrink-0">
                    <img src={getImageUrl(post)} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                    {isActive && (
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-red-600 text-white text-[8px] font-bold rounded uppercase">
                        Now Playing
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <h3 className="text-sm font-medium leading-tight line-clamp-2">{post.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5 text-gray-400 text-[11px]">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    {post.categories[0] && (
                      <span className="inline-block text-[10px] text-blue-500 font-medium mt-1">{post.categories[0].name}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </PullToRefresh>
  );
}
