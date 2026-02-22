import { Metadata } from "next";
import { getPostsByCategory } from "@/lib/wordpress";
import CategoryClient from "./CategoryClient";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  return {
    title: categoryName,
    description: `All stories in ${categoryName} from Heavy Status.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getPostsByCategory(slug);
  const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  return <CategoryClient posts={posts} categoryName={categoryName} />;
}
