"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Notice {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  category: string;
  pinned: boolean;
}

interface AdminClientProps {
  isAuthenticated: boolean;
  notices: Notice[];
}

export default function AdminClient({
  isAuthenticated,
  notices,
}: AdminClientProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "로그인에 실패했습니다");
        return;
      }

      router.refresh();
    } catch {
      setError("서버 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="admin-login-wrap">
          <div className="admin-login-card">
            <h1>관리자 로그인</h1>
            <p>연세조이치과 관리자 페이지입니다</p>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {error && <div className="admin-error">{error}</div>}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "로그인 중..." : "로그인"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>관리자 대시보드</h1>
          <div className="admin-header-actions">
            <a
              href="https://yonseijoy-dental-clinic.sanity.studio/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Sanity Studio 열기
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ width: 16, height: 16 }}
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
            <button onClick={handleLogout} className="btn admin-logout-btn">
              로그아웃
            </button>
          </div>
        </div>

        <div className="admin-section">
          <h2>공지사항 관리</h2>
          <p className="admin-section-desc">
            공지사항 추가/수정은{" "}
            <a
              href="https://yonseijoy-dental-clinic.sanity.studio/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sanity Studio
            </a>
            에서 할 수 있습니다.
          </p>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>고정</th>
                  <th>카테고리</th>
                  <th>제목</th>
                  <th>날짜</th>
                </tr>
              </thead>
              <tbody>
                {notices.length === 0 && (
                  <tr>
                    <td colSpan={4} className="admin-table-empty">
                      등록된 공지사항이 없습니다
                    </td>
                  </tr>
                )}
                {notices.map((notice) => (
                  <tr key={notice._id}>
                    <td>
                      {notice.pinned ? (
                        <span className="notice-pin">고정</span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {notice.category ? (
                        <span className="notice-category">
                          {notice.category}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{notice.title}</td>
                    <td>
                      {notice.date
                        ? new Date(notice.date)
                            .toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })
                            .replace(/\. /g, ".")
                            .replace(/\.$/, "")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
