"use client";

import { useState, useEffect } from "react";
import { urlFor } from "@/sanity/client";

interface HeroSlide {
  _id: string;
  image: { asset: { _ref: string } };
  alt: string;
  order: number;
}

interface HeroProps {
  slides: HeroSlide[];
  phone1: string;
}

export default function Hero({ slides, phone1 }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const placeholderColors = [
    "linear-gradient(135deg, #1e3a6e, #2B7DE9)",
    "linear-gradient(135deg, #2B7DE9, #00B4D8)",
    "linear-gradient(135deg, #00B4D8, #1e3a6e)",
    "linear-gradient(135deg, #1A5CB8, #00B4D8)",
  ];

  return (
    <section className="hero" id="hero">
      <div className="hero-slider">
        {slides.map((slide, i) => {
          const imageUrl = slide.image
            ? urlFor(slide.image).width(1920).quality(80).url()
            : null;
          return (
            <div
              key={slide._id || i}
              className={`hero-slide${i === currentSlide ? " active" : ""}${!imageUrl ? " placeholder" : ""}`}
              style={
                imageUrl
                  ? { backgroundImage: `url(${imageUrl})` }
                  : { background: placeholderColors[i % placeholderColors.length] }
              }
              data-index={!imageUrl ? i + 1 : undefined}
            />
          );
        })}
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-badge fade-in">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          남양주 다산 · 도농역
        </div>
        <h1 className="fade-in">
          연세조이치과
          <span>YONSEI JOY DENTAL CLINIC</span>
        </h1>
        <p className="fade-in">
          합리적인 가격과 최상의 의료진이 함께하는
          <br />
          남양주 다산의 믿을 수 있는 치과
        </p>
        <div className="hero-buttons fade-in">
          <a href={`tel:${phone1}`} className="btn btn-white">
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            전화 예약하기
          </a>
          <a href="#map" className="btn btn-outline">
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            오시는 길
          </a>
        </div>
      </div>
    </section>
  );
}
