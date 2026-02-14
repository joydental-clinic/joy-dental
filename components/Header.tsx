"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface HeaderProps {
  phone1: string;
}

export default function Header({ phone1 }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobileNav = () => {
    setMenuOpen(false);
    document.body.style.overflow = "";
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      document.body.style.overflow = !prev ? "hidden" : "";
      return !prev;
    });
  };

  const navItems = [
    { href: "/#about", label: "병원소개" },
    { href: "/#doctors", label: "의료진" },
    { href: "/#treatments", label: "진료분야" },
    { href: "/#hours", label: "진료안내" },
    { href: "/#map", label: "오시는 길" },
    { href: "/columns", label: "칼럼" },
  ];

  return (
    <>
      <header className={`header${scrolled ? " scrolled" : ""}`} id="header">
        <nav className="nav container">
          <Link href="/" className="nav-logo" onClick={() => window.scrollTo(0, 0)}>
            <svg viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" />
              <path d="M16 8v8l5.5 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M10 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            </svg>
            연세조이치과
          </Link>
          <div className="nav-links">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
          <a href={`tel:${phone1}`} className="nav-cta">
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16, display: "inline", verticalAlign: "middle", marginRight: 2 }}>
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            전화예약
          </a>
          <button
            className={`hamburger${menuOpen ? " active" : ""}`}
            onClick={toggleMenu}
            aria-label="메뉴 열기"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>

      <div className={`mobile-nav${menuOpen ? " open" : ""}`}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} onClick={closeMobileNav}>
            {item.label}
          </Link>
        ))}
        <a href={`tel:${phone1}`} className="btn btn-primary" onClick={closeMobileNav}>
          <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          전화예약
        </a>
      </div>
    </>
  );
}
