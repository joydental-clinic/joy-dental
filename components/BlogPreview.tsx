import Link from "next/link";
import { urlFor } from "@/sanity/client";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  category: string;
  excerpt?: string;
  thumbnail?: { asset: { _ref: string } };
  firstImage?: { asset: { _ref: string } };
}

interface BlogPreviewProps {
  posts: Post[];
}

function getCategoryLabel(category: string) {
  if (category === "ortho") return "교정";
  if (category === "implant") return "임플란트";
  return "일반";
}

function getCategoryEmoji(category: string) {
  if (category === "ortho") return "\uD83D\uDE01";
  if (category === "implant") return "\uD83E\uDDB7";
  return "\u2728";
}

function getCategoryGradient(category: string) {
  if (category === "ortho") return "linear-gradient(135deg, #FCE7F3, #FBCFE8)";
  if (category === "implant") return "linear-gradient(135deg, #DBEAFE, #BFDBFE)";
  return "linear-gradient(135deg, #D1FAE5, #A7F3D0)";
}

export default function BlogPreview({ posts }: BlogPreviewProps) {
  return (
    <section className="section" id="blog">
      <div className="container">
        <h2 className="section-title fade-in">블로그 칼럼</h2>
        <p className="section-subtitle fade-in">전문의가 직접 쓰는 치과 상식과 치료 사례</p>
        <div className="blog-grid">
          {posts.map((post) => {
            const thumbSource = post.thumbnail || post.firstImage;
            const thumbUrl = thumbSource
              ? urlFor(thumbSource).width(400).height(240).fit("crop").url()
              : null;

            return (
              <Link
                key={post._id}
                href={`/columns/${post.slug.current}`}
                className="blog-card fade-in"
              >
                <div className="blog-thumb">
                  {thumbUrl ? (
                    <img src={thumbUrl} alt={post.title} className="blog-thumb-img" />
                  ) : (
                    <div
                      className="blog-thumb-bg"
                      style={{ background: getCategoryGradient(post.category) }}
                    >
                      {getCategoryEmoji(post.category)}
                    </div>
                  )}
                </div>
                <div className="blog-body">
                  <span className={`blog-tag ${post.category}`}>
                    {getCategoryLabel(post.category)}
                  </span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt ? post.excerpt.slice(0, 80) : ""}</p>
                  <div className="blog-date">
                    {new Date(post.date).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }).replace(/\. /g, ".").replace(/\.$/, "")}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="blog-more fade-in">
          <Link href="/columns" className="btn btn-primary">
            칼럼 더보기
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
