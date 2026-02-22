import { Metadata } from "next";
import { getPosts } from "@/lib/wordpress";
import LiveClient from "./LiveClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Live Coverage",
  description: "Watch live coverage and recent video content from Heavy Status.",
};

export default async function LivePage() {
  const posts = await getPosts("live", 10);
  return <LiveClient posts={posts} />;
}
