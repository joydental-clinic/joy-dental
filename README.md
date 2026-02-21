# 연세조이치과 웹사이트

연세조이치과(남양주 다산동) 공식 웹사이트.

## 기술 스택

- **프레임워크**: Astro (SSR — Cloudflare Workers)
- **UI**: React islands (선택적 하이드레이션)
- **CMS**: Sanity
- **스타일**: 순수 CSS (`src/styles/globals.css`)
- **배포**: Cloudflare Workers + Static Assets

## 개발

```bash
npm run dev
```

http://localhost:4321 에서 확인.

## 빌드

```bash
npm run build
```

`dist/`에 Worker 번들(`_worker.js/`)과 정적 파일이 생성된다.

## 배포

GitHub `main` 브랜치에 push하면 Cloudflare Workers Builds가 자동으로 빌드·배포한다.

## Sanity 스키마 배포

```bash
npx sanity@latest schema deploy
```

## 캐시 전략

| 페이지 | Cache-Control | 반영 시점 |
|--------|--------------|----------|
| `/` | `public, s-maxage=60` | 최대 1분 |
| `/columns` | `public, s-maxage=60` | 최대 1분 |
| `/columns/[slug]` | `public, s-maxage=60` | 최대 1분 |
| `/notice` | 없음 | 즉시 |
| `/notice/[slug]` | 없음 | 즉시 |
| `/sitemap.xml` | prerender (정적) | 빌드 시 |
| `/robots.txt` | prerender (정적) | 빌드 시 |
