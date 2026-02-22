import { NextResponse } from "next/server";
import { searchContent } from "@/lib/wordpress";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ query: string }> }
) {
  try {
    const { query } = await params;
    const results = await searchContent(decodeURIComponent(query));
    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
