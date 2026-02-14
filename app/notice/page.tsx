import type { Metadata } from "next";
import Link from "next/link";
import { safeFetch } from "@/sanity/client";
import { noticesQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "공지사항",
  description: "연세조이치과 공지사항 - 진료안내, 휴진안내 등 병원 소식을 전합니다",
};

interface Notice {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  category: string;
  pinned: boolean;
  excerpt?: string;
}

export default async function NoticePage() {
  const notices = await safeFetch<Notice[]>(noticesQuery);
  const list = notices || [];

  return (
    <div className="notice-page">
      <div className="container">
        <h1 className="section-title fade-in">공지사항</h1>
        <p className="section-subtitle fade-in">
          연세조이치과의 소식과 안내사항을 확인하세요
        </p>

        <div className="notice-list">
          {list.length === 0 && (
            <p className="notice-empty">등록된 공지사항이 없습니다.</p>
          )}
          {list.map((notice) => (
            <Link
              key={notice._id}
              href={`/notice/${notice.slug?.current || ""}`}
              className="notice-item fade-in"
            >
              <div className="notice-item-left">
                {notice.pinned && <span className="notice-pin">고정</span>}
                {notice.category && (
                  <span className="notice-category">{notice.category}</span>
                )}
                <span className="notice-item-title">{notice.title}</span>
              </div>
              <time className="notice-item-date" dateTime={notice.date}>
                {notice.date
                  ? new Date(notice.date)
                      .toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .replace(/\. /g, ".")
                      .replace(/\.$/, "")
                  : ""}
              </time>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
