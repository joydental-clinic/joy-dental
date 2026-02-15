"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Notice {
  _id: string;
  title: string;
  slug: { current: string };
  category?: string;
}

const categoryLabels: Record<string, string> = {
  event: "이벤트",
  clinic: "진료안내",
  general: "공지",
};

export default function AnnouncementBar({ notice }: { notice: Notice | null }) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!notice) return;
    const key = `announcement-dismissed-${notice._id}`;
    if (sessionStorage.getItem(key)) return;
    setDismissed(false);
    document.body.classList.add("has-announcement-bar");
    return () => {
      document.body.classList.remove("has-announcement-bar");
    };
  }, [notice]);

  if (!notice || dismissed) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sessionStorage.setItem(`announcement-dismissed-${notice._id}`, "1");
    setDismissed(true);
    document.body.classList.remove("has-announcement-bar");
  };

  const label = notice.category ? categoryLabels[notice.category] || notice.category : null;

  return (
    <div className="announcement-bar">
      <Link href={`/notice/${notice.slug.current}`} className="announcement-bar-link">
        {label && <span className="announcement-bar-category">{label}</span>}
        <span className="announcement-bar-title">{notice.title}</span>
      </Link>
      <button
        className="announcement-bar-close"
        onClick={handleDismiss}
        aria-label="공지 닫기"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
