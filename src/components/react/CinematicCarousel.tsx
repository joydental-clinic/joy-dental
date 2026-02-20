import { useEffect, useState } from "react";

const slides = [
  { url: "/images/clinic-1.jpg" },
  { url: "/images/clinic-2.jpg" },
];

export default function CinematicCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section about" id="about">
      <div className="about-intro">
        <div className="about-intro-text fade-in">
          <span className="about-label">ABOUT US</span>
          <h2>마음까지 살피는<br />정직한 진료</h2>
          <div className="about-divider"></div>
          <p>연세조이치과는 치주과 전문의와 교정과 전문의가 직접 진료하는 전문 치과입니다. 과잉 진료 없이, 환자의 입장에서 꼭 필요한 치료만 정직하게 안내합니다.</p>
          <p className="about-intro-sub">최신 장비와 풍부한 임상 경험을 바탕으로, 한 분 한 분 최선의 결과를 약속드립니다.</p>
        </div>
      </div>

      <div className="about-cinematic fade-in">
        <div className="cinematic-slider">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`cinematic-slide${i === current ? " active" : ""}`}
              style={{ backgroundImage: `url(${slide.url})` }}
            />
          ))}
        </div>
        <div className="cinematic-overlay" />
        <div className="cinematic-content">
          <div className="cinematic-line" />
          <h2>전문 의료진의 섬세한 진료</h2>
          <p>정밀한 진단부터 안전한 시술까지, 환자 한 분 한 분에게 최선을 다합니다</p>
        </div>
      </div>

      <div className="container">
        <div className="about-features fade-in">
          <div className="about-feature">
            <span className="about-feature-num">01</span>
            <h3>전문의 직접 진료</h3>
            <p>각 분야 전문의가 상담부터 시술까지 책임집니다</p>
          </div>
          <div className="about-feature">
            <span className="about-feature-num">02</span>
            <h3>무통 · 편안한 치료</h3>
            <p>최신 장비와 세심한 케어로 치과 공포를 줄여드립니다</p>
          </div>
          <div className="about-feature">
            <span className="about-feature-num">03</span>
            <h3>합리적인 가격</h3>
            <p>과잉진료 없이 꼭 필요한 치료만 정직하게 안내합니다</p>
          </div>
        </div>
      </div>
    </section>
  );
}
