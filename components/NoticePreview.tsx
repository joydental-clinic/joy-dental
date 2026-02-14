import Link from "next/link";

interface Notice {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  category: string;
  pinned: boolean;
}

interface NoticePreviewProps {
  notices: Notice[];
}

export default function NoticePreview({ notices }: NoticePreviewProps) {
  if (notices.length === 0) return null;

  return (
    <section className="section" id="notice">
      <div className="container">
        <h2 className="section-title fade-in">공지사항</h2>
        <p className="section-subtitle fade-in">
          연세조이치과의 소식과 안내사항
        </p>
        <div className="notice-preview-list">
          {notices.map((notice) => (
            <Link
              key={notice._id}
              href={`/notice/${notice.slug?.current || ""}`}
              className="notice-preview-item fade-in"
            >
              <div className="notice-preview-left">
                {notice.pinned && <span className="notice-pin">고정</span>}
                {notice.category && (
                  <span className="notice-category">{notice.category}</span>
                )}
                <span className="notice-preview-title">{notice.title}</span>
              </div>
              <time className="notice-preview-date" dateTime={notice.date}>
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
        <div className="blog-more fade-in">
          <Link href="/notice" className="btn btn-primary">
            공지사항 더보기
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              style={{ width: 16, height: 16 }}
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
