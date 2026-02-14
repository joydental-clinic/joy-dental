import Image from "next/image";

interface MapSectionProps {
  address: string;
}

export default function MapSection({ address }: MapSectionProps) {
  return (
    <section className="section map-section" id="map">
      <div className="container">
        <h2 className="section-title fade-in">오시는 길</h2>
        <p className="section-subtitle fade-in">도농역에서 가까운 곳에 위치해 있습니다</p>
        <div className="map-wrap fade-in">
          <a
            href="https://map.kakao.com/link/map/연세조이치과,37.6118,127.1567"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/map.png"
              alt="연세조이치과 위치 지도"
              width={900}
              height={500}
              className="map-embed"
            />
          </a>
          <div className="map-info">
            <div className="map-address">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{address}</span>
            </div>
            <div className="map-links">
              <a
                href="https://map.kakao.com/link/to/연세조이치과,37.6118,127.1567"
                target="_blank"
                rel="noopener noreferrer"
                className="map-link"
              >
                카카오맵 길찾기
              </a>
              <a
                href="https://map.naver.com/v5/search/연세조이치과"
                target="_blank"
                rel="noopener noreferrer"
                className="map-link"
              >
                네이버지도
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
