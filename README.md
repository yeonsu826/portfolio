# 🌌 정연수 (Yeon-su Jeong) | 3D Environment Modeler & Technical Artist

> "현실과 디지털이 자연스럽게 맞닿는 세계를 설계하는 아티스트입니다."

소프트웨어(Unity) 개발자로 커리어를 시작하여, 코드 너머의 시각적인 3D 공간을 직접 창조하기 위해 3D 배경 모델러로 전향했습니다. 프로그래밍적인 접근법을 바탕으로 **엔진 최적화(Draw Call, Polygon Count)와 PBR 워크플로우를 완벽하게 이해**하며, 심미성과 퍼포먼스를 모두 잡는 테크니컬 아트(TA) 역량을 지향합니다.

## 🛠 Tech Stack

| Category | Skills |
| :--- | :--- |
| **Game Engines** | Unity (C#), Unreal Engine 5 (Blueprints, Sequencer) |
| **3D Art & Graphics** | Blender (Modeling, Rigging), Substance Painter (PBR Texturing) |
| **Web & Interactive** | React, React Three Fiber (R3F), Three.js |
| **AI & Pipeline** | GenAI (ElevenLabs, Google STT), ARFoundation, Vuforia |

## 🚀 About This Repository: 3D Interactive Portfolio

이 리포지토리는 저의 3D 작업물과 프로젝트 경험을 담은 **React 기반 3D 인터랙티브 디오라마 웹사이트**입니다. 단순한 모델링 전시를 넘어, 웹 환경에서의 최적화와 렌더링 퍼포먼스 방어를 위한 다양한 TA 기술이 적용되어 있습니다.

* **Interactive Diorama:** '게이밍 룸' 컨셉의 3D 공간 안에서 오브젝트 클릭 시 카메라 줌인 및 프로젝트 상세 UI 오버레이 연출
* **Post-Processing:** `@react-three/postprocessing`을 활용한 낮과 밤(Day & Night) 무드 전환 및 Bloom, Depth of Field 이펙트 구현
* **Optimization Strategies:**
  * **Baking:** 실시간 라이팅 연산 부하를 줄이기 위해 Blender에서 빛과 그림자를 텍스처로 베이킹
  * **Channel Packing:** 이미지 용량 최적화를 위해 Roughness, Metallic, AO 맵을 RGB 채널에 병합
  * **Draw Call Minimization:** 다수의 소품 메쉬와 텍스처를 병합(Batching)하여 렌더링 병목 현상 방어

## 💼 Key Projects

* **생성형 AI 기반 실감형 교육 콘텐츠 (금산/괴산)**
  * Google STT 및 ElevenLabs API 연동 다국어 영상 제작 파이프라인 설계
  * 하드웨어 가속(NVIDIA Broadcast)과 Unity 크로마키 쉐이더 결합
* **태안 AI 교육 체험센터 인터랙티브 공간 구축**
  * 대형 빔 프로젝션 기반 몰입형 인터랙티브 월 설계
  * Vuforia 및 ARFoundation 활용 다중 디바이스 인터랙션 구현

## 📫 Contact
* **Email:** yeonsu826@gmail.com
* **LinkedIn:** www.linkedin.com/in/yeonsu0826
* **Portfolio Link:** https://yeonsu826.github.io/portfolio/
