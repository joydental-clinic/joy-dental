import { safeFetch } from "@/sanity/client";
import {
  siteSettingsQuery,
  heroSlidesQuery,
  doctorsQuery,
  hoursQuery,
  recentPostsQuery,
} from "@/sanity/lib/queries";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Doctors from "@/components/Doctors";
import Treatments from "@/components/Treatments";
import Hours from "@/components/Hours";
import MapSection from "@/components/MapSection";
import BlogPreview from "@/components/BlogPreview";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function HomePage() {
  const [settings, slides, doctors, hours, posts] = await Promise.all([
    safeFetch<any>(siteSettingsQuery),
    safeFetch<any[]>(heroSlidesQuery),
    safeFetch<any[]>(doctorsQuery),
    safeFetch<any>(hoursQuery),
    safeFetch<any[]>(recentPostsQuery),
  ]);

  const phone1 = settings?.phone1 || "031-553-7528";
  const phone2 = settings?.phone2 || "031-553-7529";
  const email = settings?.email || "yonseicholee@naver.com";
  const address = settings?.address || "경기 남양주시 도농로32 부영중앙상가 6층";

  return (
    <>
      <Hero slides={slides || []} phone1={phone1} />
      <About />
      <Doctors doctors={doctors || []} />
      <Treatments />
      <Hours
        schedule={hours?.schedule || []}
        phone1={phone1}
        phone2={phone2}
        email={email}
      />
      <MapSection address={address} />
      <BlogPreview posts={posts || []} />
    </>
  );
}
