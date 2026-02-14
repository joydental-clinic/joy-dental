import type { Metadata } from "next";
import "@/styles/globals.css";
import { safeFetch } from "@/sanity/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollAnimations from "@/components/ScrollAnimations";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: {
    default: "연세조이치과 - 남양주 다산동 임플란트·교정 전문",
    template: "%s | 연세조이치과",
  },
  description:
    "남양주 다산동 연세조이치과 - 임플란트, 교정, 무통스케일링, 치아미백 전문. 이승범 대표원장(치주과 전문의), 조선미 원장(교정 전문의). 031-553-7528",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "연세조이치과",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settings = await safeFetch<any>(siteSettingsQuery);
  const phone1 = settings?.phone1 || "031-553-7528";
  const phone2 = settings?.phone2 || "031-553-7529";
  const address = settings?.address || "경기 남양주시 도농로32 부영중앙상가 6층";

  return (
    <html lang="ko">
      <body>
        <Header phone1={phone1} />
        {children}
        <Footer address={address} phone1={phone1} phone2={phone2} />
        <ScrollToTop />
        <ScrollAnimations />
      </body>
    </html>
  );
}
