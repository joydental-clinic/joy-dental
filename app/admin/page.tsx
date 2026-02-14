import type { Metadata } from "next";
import { cookies } from "next/headers";
import { safeFetch } from "@/sanity/client";
import { noticesQuery } from "@/sanity/lib/queries";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "관리자",
  robots: "noindex, nofollow",
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const isAuthenticated = session?.value === "authenticated";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let notices: any[] = [];
  if (isAuthenticated) {
    const result = await safeFetch<typeof notices>(noticesQuery);
    notices = result || [];
  }

  return (
    <AdminClient isAuthenticated={isAuthenticated} notices={notices} />
  );
}
