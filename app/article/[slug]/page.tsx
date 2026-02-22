import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, stripHtml } from "@/lib/wordpress";
import ArticleClient from "./ArticleClient";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article Not Found" };

  return {
    title: post.title,
    description: stripHtml(post.excerpt).slice(0, 160),
    openGraph: {
      title: `${post.title} - Heavy Status`,
      description: stripHtml(post.excerpt).slice(0, 160),
      type: "article",
      images: post.featuredImage ? [post.featuredImage.sourceUrl] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: stripHtml(post.excerpt).slice(0, 160),
      images: post.featuredImage ? [post.featuredImage.sourceUrl] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  return <ArticleClient post={post} />;
}
