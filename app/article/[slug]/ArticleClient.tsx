"use client";

import { useRouter } from "next/navigation";
import { Share2, Bookmark, ChevronLeft } from "lucide-react";
import { formatDate, readingTime, stripHtml, type WPPost } from "@/lib/wordpress";

export default function ArticleClient({ post }: { post: WPPost }) {
  const router = useRouter();
  const category = post.categories[0];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: stripHtml(post.excerpt).slice(0, 100),
          url: window.location.href,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="pb-20" data-testid="page-article">
      {post.featuredImage && (
        <div className="relative">
          <img
            src={post.featuredImage.sourceUrl}
            alt={post.featuredImage.altText || post.title}
            className="w-full aspect-[16/10] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/20" />
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-black/20 backdrop-blur-sm text-white"
              data-testid="button-article-back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg bg-black/20 backdrop-blur-sm text-white" data-testid="button-bookmark">
                <Bookmark className="w-4 h-4" />
              </button>
              <button onClick={handleShare} className="p-2 rounded-lg bg-black/20 backdrop-blur-sm text-white" data-testid="button-share">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 -mt-8 relative">
        <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
          <span>{formatDate(post.date)}</span>
        </div>

        <h1 className="text-2xl font-serif font-bold leading-tight tracking-tight">{post.title}</h1>

        <div className="flex items-center flex-wrap gap-2 mt-3">
          {category && (
            <span className="px-2 py-0.5 bg-blue-50 text-blue-500 text-[11px] font-semibold rounded-md">{category.name}</span>
          )}
          <span className="text-xs text-gray-400">{readingTime(post.content || post.excerpt)}</span>
        </div>

        {post.author && (
          <div className="flex items-center gap-2 mt-4 pb-4 border-b border-gray-200/50">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
            </div>
          </div>
        )}

        <article
          className="mt-4 prose prose-sm max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-p:text-sm prose-p:leading-relaxed prose-a:text-blue-500 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }}
          data-testid="article-content"
        />

        {post.tags.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200/50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span key={tag.slug} className="px-2 py-0.5 bg-gray-100 text-xs rounded-md text-gray-500">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
