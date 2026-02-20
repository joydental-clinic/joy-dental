# 연세조이치과 웹사이트

연세조이치과(남양주 다산동) 공식 웹사이트.

## 기술 스택

- **프레임워크**: Astro (Static Site Generation)
- **UI**: React islands (선택적 하이드레이션)
- **CMS**: Sanity
- **스타일**: 순수 CSS (`src/styles/globals.css`)

## 개발

```bash
npm run dev
```

http://localhost:4321 에서 확인.

## 빌드

```bash
npm run build
```

정적 파일이 `dist/`에 생성된다.

## Sanity 스키마 배포

```bash
npx sanity@latest schema deploy
```
