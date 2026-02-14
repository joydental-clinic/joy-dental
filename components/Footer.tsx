"use client";

import Link from "next/link";

interface FooterProps {
  address: string;
  phone1: string;
  phone2: string;
}

export default function Footer({ address, phone1, phone2 }: FooterProps) {
  const phone2Last = phone2.split("-").pop();

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    const el = document.getElementById(hash);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>연세조이치과의원</h3>
            <p>
              {address}
              <br />
              대표: 이승범 외 1인
              <br />
              사업자등록번호: 132-91-67553
              <br />
              TEL: {phone1} / {phone2Last}
            </p>
          </div>
          <div className="footer-links">
            <h4>진료 분야</h4>
            <Link href="/#treatments" onClick={(e) => handleHashClick(e, "treatments")}>임플란트</Link>
            <Link href="/#treatments" onClick={(e) => handleHashClick(e, "treatments")}>치아교정</Link>
            <Link href="/#treatments" onClick={(e) => handleHashClick(e, "treatments")}>무통 스케일링</Link>
            <Link href="/#treatments" onClick={(e) => handleHashClick(e, "treatments")}>치아미백</Link>
            <Link href="/#treatments" onClick={(e) => handleHashClick(e, "treatments")}>일반 치과</Link>
          </div>
          <div className="footer-links">
            <h4>바로가기</h4>
            <Link href="/#about" onClick={(e) => handleHashClick(e, "about")}>병원소개</Link>
            <Link href="/#doctors" onClick={(e) => handleHashClick(e, "doctors")}>의료진 소개</Link>
            <Link href="/#hours" onClick={(e) => handleHashClick(e, "hours")}>진료시간</Link>
            <Link href="/#map" onClick={(e) => handleHashClick(e, "map")}>오시는 길</Link>
            <Link href="/columns">칼럼</Link>
            <a href="https://blog.naver.com/yonseicholee" target="_blank" rel="noopener noreferrer">
              네이버 블로그
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} 연세조이치과의원. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
