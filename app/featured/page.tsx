import { Metadata } from "next";
import { getPosts } from "@/lib/wordpress";
import FeaturedClient from "./FeaturedClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Featured Stories",
  description: "Hand-picked stories that matter most from Heavy Status.",
};

export default async function FeaturedPage() {
  const posts = await getPosts("featured", 12);
  return <FeaturedClient posts={posts} />;
}
