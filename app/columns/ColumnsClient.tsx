"use client";

import { useState } from "react";
import Link from "next/link";
import { urlFor } from "@/sanity/client";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  category: string;
  author?: string;
  excerpt?: string;
  thumbnail?: { asset: { _ref: string } };
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

export default function ColumnsClient({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState("all");

  const filters = [
    { value: "all", label: "전체" },
    { value: "ortho", label: "교정" },
    { value: "implant", label: "임플란트" },
    { value: "general", label: "일반" },
  ];

  const filtered = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  return (
    <div className="columns-page">
      <div className="container">
        <h1 className="section-title fade-in">블로그 칼럼</h1>
        <p className="section-subtitle fade-in">
          전문의가 직접 쓰는 치과 상식과 치료 사례
        </p>

        <div className="filter-tabs fade-in">
          {filters.map((f) => (
            <button
              key={f.value}
              className={`filter-tab${filter === f.value ? " active" : ""}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="blog-grid">
          {filtered.map((post) => {
            const thumbUrl = post.thumbnail
              ? urlFor(post.thumbnail).width(400).height(240).fit("crop").url()
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
      </div>
    </div>
  );
}
