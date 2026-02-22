"use client";

import PostCard from "@/components/PostCard";
import MasonryGrid from "@/components/MasonryGrid";
import AdBanner from "@/components/AdBanner";
import PullToRefresh from "@/components/PullToRefresh";
import { TrendingUp, Flame, Sparkles } from "lucide-react";
import type { WPPost } from "@/lib/wordpress";

function SectionHeader({ icon: Icon, title, accent }: { icon: React.ElementType; title: string; accent?: string }) {
  return (
    <div className="flex items-center gap-2 px-4 mb-3">
      <div className={`p-1.5 rounded-lg ${accent || 'bg-blue-50'}`}>
        <Icon className={`w-4 h-4 ${accent ? 'text-white' : 'text-blue-500'}`} />
      </div>
      <h2 className="font-serif font-bold text-base tracking-tight">{title}</h2>
    </div>
  );
}

interface HeadlinesClientProps {
  latestPosts: WPPost[];
  featuredPosts: WPPost[];
  highlightPosts: WPPost[];
}

export default function HeadlinesClient({ latestPosts, featuredPosts, highlightPosts }: HeadlinesClientProps) {
  return (
    <PullToRefresh>
      <div className="pb-20" data-testid="page-headlines">
        <section className="mt-4">
          <SectionHeader icon={TrendingUp} title="Latest News" />
          <div className="px-4">
            {latestPosts.length > 0 && (
              <>
                <PostCard post={latestPosts[0]} variant="hero" />
                <div className="mt-3">
                  <MasonryGrid columns={2} gap="gap-3">
                    {latestPosts.slice(1, 5).map((post) => (
                      <PostCard key={post.slug} post={post} variant="standard" />
                    ))}
                  </MasonryGrid>
                </div>
                {latestPosts[5] && (
                  <div className="mt-3">
                    <PostCard post={latestPosts[5]} variant="wide" />
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <AdBanner variant="cta" title="Get Breaking News First" subtitle="Enable push notifications and never miss important stories." />

        <section className="mt-2">
          <SectionHeader icon={Flame} title="Featured Stories" accent="bg-orange-500" />
          <div className="px-4">
            <MasonryGrid columns={2} gap="gap-3">
              {featuredPosts.slice(0, 6).map((post, i) => (
                <PostCard
                  key={post.slug}
                  post={post}
                  variant={i === 0 ? "overlay" : i < 3 ? "standard" : "minimal"}
                />
              ))}
            </MasonryGrid>
          </div>
        </section>

        <AdBanner variant="banner" />

        <section className="mt-6">
          <SectionHeader icon={Sparkles} title="Highlights" accent="bg-violet-500" />
          <div className="px-4">
            {highlightPosts.length > 0 && (
              <>
                <PostCard post={highlightPosts[0]} variant="wide" />
                <div className="mt-3">
                  <MasonryGrid columns={2} gap="gap-3">
                    {highlightPosts.slice(1, 5).map((post) => (
                      <PostCard key={post.slug} post={post} variant="overlay" />
                    ))}
                  </MasonryGrid>
                </div>
                {highlightPosts[5] && (
                  <div className="mt-3">
                    <PostCard post={highlightPosts[5]} variant="compact" />
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <AdBanner variant="inline" />
      </div>
    </PullToRefresh>
  );
}
