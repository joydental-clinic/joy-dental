import { useEffect, useState, useCallback } from "react";

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

export default function AnnouncementBar({ notices }: { notices: Notice[] }) {
  const [dismissed, setDismissed] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!notices.length) return;
    const allIds = notices.map((n) => n._id).join(",");
    const key = `announcement-dismissed-${allIds}`;
    if (sessionStorage.getItem(key)) return;
    setDismissed(false);
    document.body.classList.add("has-announcement-bar");
    return () => {
      document.body.classList.remove("has-announcement-bar");
    };
  }, [notices]);

  useEffect(() => {
    if (dismissed || notices.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notices.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [dismissed, notices.length]);

  const handleDismiss = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const allIds = notices.map((n) => n._id).join(",");
      sessionStorage.setItem(`announcement-dismissed-${allIds}`, "1");
      setDismissed(true);
      document.body.classList.remove("has-announcement-bar");
    },
    [notices]
  );

  if (!notices.length || dismissed) return null;

  return (
    <div className="announcement-bar">
      {notices.map((notice, i) => {
        const label = notice.category
          ? categoryLabels[notice.category] || notice.category
          : null;
        return (
          <a
            key={notice._id}
            href={`/notice/${notice.slug.current}`}
            className={`announcement-bar-slide${i === currentIndex ? " active" : ""}`}
          >
            {label && (
              <span className="announcement-bar-category">{label}</span>
            )}
            <span className="announcement-bar-title">{notice.title}</span>
          </a>
        );
      })}
      <button
        className="announcement-bar-close"
        onClick={handleDismiss}
        aria-label="공지 닫기"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
