import type { Metadata } from "next";
import Link from "next/link";
import { safeFetch, urlFor } from "@/sanity/client";
import { noticeBySlugQuery, noticeSlugsQuery } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Notice = Record<string, any>;

export async function generateStaticParams() {
  const slugs = await safeFetch<{ slug: string }[]>(noticeSlugsQuery);
  return (slugs || []).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const notice = await safeFetch<Notice>(noticeBySlugQuery, { slug });
  if (!notice) return {};
  return {
    title: notice.title,
    description: `연세조이치과 공지사항 - ${notice.title}`,
  };
}

const portableTextComponents = {
  types: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: ({ value }: { value: any }) => {
      if (!value?.asset) return null;
      return (
        <img
          src={urlFor(value).width(800).quality(85).url()}
          alt={value.alt || ""}
          loading="lazy"
        />
      );
    },
  },
};

export default async function NoticePage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const notice = await safeFetch<Notice>(noticeBySlugQuery, { slug });

  if (!notice) notFound();

  return (
    <article className="post-page">
      <div className="container">
        <div className="post-header">
          {notice.category && (
            <span className="notice-category">{notice.category}</span>
          )}
          <h1>{notice.title}</h1>
          <div className="post-meta">
            <time dateTime={notice.date}>
              {notice.date
                ? new Date(notice.date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </time>
          </div>
        </div>
        <div className="post-content">
          {notice.body && (
            <PortableText
              value={notice.body}
              components={portableTextComponents}
            />
          )}
        </div>
        <div className="post-nav">
          <Link href="/notice" className="btn btn-primary">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              style={{ width: 16, height: 16 }}
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            공지사항 목록으로
          </Link>
        </div>
      </div>
    </article>
  );
}
