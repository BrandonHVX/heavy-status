import { Metadata } from "next";
import { getPosts, getCategories } from "@/lib/wordpress";
import ExploreClient from "./ExploreClient";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Explore",
  description: "Discover stories across all topics and categories.",
};

export default async function ExplorePage() {
  const [posts, categories] = await Promise.all([
    getPosts("explore", 12),
    getCategories(),
  ]);

  return <ExploreClient posts={posts} categories={categories} />;
}
