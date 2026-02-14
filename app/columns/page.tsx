import type { Metadata } from "next";
import { safeFetch } from "@/sanity/client";
import { postsQuery } from "@/sanity/lib/queries";
import ColumnsClient from "./ColumnsClient";

export const metadata: Metadata = {
  title: "칼럼",
  description: "연세조이치과 전문의가 직접 쓰는 치과 칼럼 - 교정, 임플란트, 일반 치과 상식과 치료 사례",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ColumnsPage() {
  const posts = await safeFetch<any[]>(postsQuery);
  return <ColumnsClient posts={posts || []} />;
}
