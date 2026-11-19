# 정연수 포트폴리오

디자인, 개발, 3D 공간과 인터랙티브 콘텐츠 작업을 모은 React 포트폴리오입니다.
현재 첫 화면은 프로젝트를 색상별 파일로 탐색하는 인터페이스이며, 기존 포트폴리오도 별도 주소에서 유지합니다.

## 로컬 실행

Node.js와 npm이 필요합니다.

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5175
```

브라우저에서 <http://127.0.0.1:5175/portfolio/>를 엽니다.

```sh
npm run build    # 배포용 파일 생성
npm run preview  # 생성된 파일 미리보기
```

`npm run deploy`는 GitHub Pages에 실제로 게시하므로 배포할 때만 실행합니다.

## 폴더 구조

- `src/main.tsx`: 페이지 주소와 공통 스타일 연결
- `src/app/components/project-files/`: 현재 파일형 포트폴리오 화면, 커버 전환, 이미지 탐색
- `src/app/components/Readme.tsx`: 현재 화면과 기존 화면에서 공유하는 프로젝트 설명 렌더러
- `src/app/components/`: 기존 포트폴리오, 프로젝트 소개, 이야기, 이력서 화면 및 공통 요소
- `src/app/data/`: 프로젝트·영상·기술 데이터와 프로젝트별 설명 문서
- `src/app/context/`, `src/app/i18n/`: 언어 설정과 번역
- `src/Dev/`: 기존 개발 작업 아카이브 화면
- `src/styles/`: 공통 스타일
- `src/assets/`, `public/`: 사용 중인 이미지·영상·3D 모델 등 자료
- `docs/`: 작업 참고 문서
- `_archive/`: 로컬에서 복구할 수 있도록 보관한 미사용 파일. Git 및 배포 대상에서 제외

## 페이지 주소

모든 주소는 `/portfolio/` 뒤에 붙입니다.

- `#/`: 현재 파일형 포트폴리오
- `#/classic`: 이전 포트폴리오 시작 화면
- `#/main`: 이전 프로젝트 목록
- `#/dev-archive`: 개발 작업 아카이브
- `#/gracesea`, `#/chapchew`: 개별 프로젝트 소개
- `#/story`: 작업 이야기
- `#/resume/unity`: Unity 이력서

## 수정할 위치

프로젝트 내용은 `src/app/data/portfolio.ts`와 `src/app/i18n/translations.ts`에서 관리합니다.
파일형 화면의 그룹 구성·탭 이름·색상은 `src/app/components/project-files/projectFileData.ts`에 있습니다.
전환 애니메이션은 같은 폴더의 `FilePortfolio.tsx`, 이미지 탐색은 `FileProjectExperience.tsx`에서 관리합니다.

Unity 이력서 참고 문서는 [docs/UNITY_RESUME.md](docs/UNITY_RESUME.md)를 확인하세요.

## 연락처

- 이메일: yeonsu826@gmail.com
- 포트폴리오: <https://yeonsu826.github.io/portfolio/>
