export default function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <h2 className="section-title fade-in">연세조이치과를 소개합니다</h2>
        <p className="section-subtitle fade-in">
          이젠 자신있게 웃으세요! 전문 의료진이 정성을 다해 치료합니다.
        </p>
        <div className="about-grid">
          <div className="about-card fade-in">
            <div className="about-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>전문의 직접 진료</h3>
            <p>치주과 전문의와 교정과 전문의가 직접 상담하고 치료합니다. 각 분야 전문의의 정확한 진단을 받으세요.</p>
          </div>
          <div className="about-card fade-in">
            <div className="about-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <h3>무통 · 편안한 치료</h3>
            <p>최신 에어플로우 장비를 활용한 무통 스케일링과 편안한 진료 환경으로 치과 공포를 줄여드립니다.</p>
          </div>
          <div className="about-card fade-in">
            <div className="about-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3>합리적인 가격</h3>
            <p>불필요한 과잉진료 없이 꼭 필요한 치료만 정직하게 안내합니다. 합리적인 가격으로 최상의 결과를 만듭니다.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
