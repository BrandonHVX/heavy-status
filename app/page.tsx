import { getPosts } from "@/lib/wordpress";
import HeadlinesClient from "./HeadlinesClient";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function HeadlinesPage() {
  const [latestPosts, featuredPosts, highlightPosts] = await Promise.all([
    getPosts("latest", 6),
    getPosts("featured", 6),
    getPosts("highlights", 6),
  ]);

  return (
    <HeadlinesClient
      latestPosts={latestPosts}
      featuredPosts={featuredPosts}
      highlightPosts={highlightPosts}
    />
  );
}
