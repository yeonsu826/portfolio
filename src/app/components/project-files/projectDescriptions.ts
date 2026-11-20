// Editorial summaries combine the introduction and production notes in one place.
export const projectDescriptions: Record<
  string,
  { ko: string[]; en: string[] }
> = {
  devPetChewGroup: {
    ko: [
      "Chap-Chew는 전면 카메라로 얼굴과 입의 움직임을 인식하고, 씹는 동작을 왁뿌볼의 변화로 연결한 인터랙티브 게임입니다. 처음에는 고양이 캐릭터가 얼굴 움직임을 따라 하는 방식으로 시작했지만, 직접 움직여 공을 누르고 갈라지게 하는 놀이에 집중하도록 발전시켰습니다. 고양이는 화면 속 동반자로 남고, 왁뿌볼이 움직임에 대한 시각적 피드백을 전달합니다.",
      "플레이어는 한입당 씹기 목표를 정하고, 자신의 얼굴 위치와 한입·씹기 동작의 기준을 측정합니다. 씹을 때마다 공의 표면이 변형되고 균열이 드러나며, 새로운 한입을 시작하면 공이 초기화됩니다. 놀이가 끝나면 한입별 씹기 횟수와 목표선, 그래프로 움직임의 흐름을 돌아볼 수 있습니다.",
      "기획부터 화면 디자인과 개발까지 직접 진행한 제작 중인 프로젝트입니다. Unity, AR Foundation, C#으로 개인별 동작 기준 측정과 얼굴 추적, 씹기 이벤트, 기록과 리포트를 연결했습니다. 왁뿌볼은 미리 나눈 표면 조각과 변형을 활용해 갈라짐을 표현했습니다.",
    ],
    en: [
      "Chap-Chew is an interactive game that uses the front camera to turn facial and chewing movements into changes in a wax ball. It began with a cat character mirroring the player’s face, then evolved into a playful experience centered on pressing and cracking the ball. The cat remains a companion while the ball provides visual feedback.",
      "Players set a chewing goal per bite and calibrate their face position, bite gesture, and chewing movement. Each chew deforms the surface and reveals cracks; a new bite resets the ball. After playing, bite-by-bite counts, goal lines, and graphs show the rhythm of the session.",
      "An independent work in progress spanning planning, interface design, and development. Unity, AR Foundation, and C# connect calibration, face tracking, chewing events, and reports. Pre-segmented surface pieces and deformation create the cracking effect.",
    ],
  },
  devManittoGroup: {
    ko: [
      "Manitto는 친구나 동료에게 평소 전하지 못했던 마음을 익명으로 보내는 웹 서비스입니다. 자주 만나는 사이에서도 고마움이나 호감을 표현하기 어렵다는 점에서 출발해, 학교·동아리·직장 등 함께하는 그룹 안에서 부담 없이 서로의 좋은 점을 발견하고 전할 수 있도록 기획했습니다.",
      "그룹을 만들고 초대 링크로 참가자를 모은 뒤, 관리자가 라운드를 시작하면 하트와 칭찬, 비밀 메시지를 주고받습니다. 한 상대에게 하트 100개를 보낼 때마다 메시지 한 글자를 작성할 수 있어, 가벼운 관심이 짧은 편지로 이어집니다. 라운드가 끝나면 우편함에서 받은 메시지와 하트·칭찬 결과를 확인하며, 보낸 사람의 이름은 공개되지 않습니다.",
      "그룹 생성부터 초대, 참여, 마음 표현, 결과 확인까지의 흐름을 모바일에서도 편하게 이용하도록 구성했습니다. Next.js, React, TypeScript, Tailwind CSS, Supabase를 사용해 기획과 디자인, 개발을 직접 이어간 1인 개발 프로젝트입니다.",
    ],
    en: [
      "Manitto is a web service for anonymously sharing appreciation with friends and colleagues. It began with the difficulty of expressing gratitude or affection, even among people who meet regularly, and creates a low-pressure way to notice and celebrate others in a school, club, or workplace group.",
      "Participants join through an invitation link and exchange hearts, compliments, and secret messages during a round. Every 100 hearts sent to one person unlocks one character of a message, turning a small gesture into a short letter. When the round ends, recipients open their mailbox and view messages and heart and compliment results without learning the sender’s identity.",
      "The mobile-friendly flow connects group creation, invitations, participation, expression, and results. Planning, design, and development were handled independently using Next.js, React, TypeScript, Tailwind CSS, and Supabase.",
    ],
  },
  devPraynoteGroup: {
    ko: [
      "은혜의 바다는 매일의 기도와 말씀을 기록하고, 그 기록을 실제 묵상으로 이어가는 신앙생활 앱입니다. 글을 적는 데서 그치지 않고 잠시 화면을 내려놓아 돌아보는 시간을 만들고자 기획했습니다. 개인의 기록은 ‘나의 바다’, 공동체와 함께하는 기도는 ‘등대’라는 이미지로 연결했습니다.",
      "기도·말씀·적용을 작성하거나 성경 구절을 검색한 뒤, 휴대폰을 뒤집어 내려놓으면 묵상 타이머가 진행됩니다. 기록한 날과 묵상을 완료한 날을 달력과 물결로 구분해 꾸준함을 돌아볼 수 있습니다. 등대에서는 공동체의 기도제목을 나누고, 커뮤니티에서는 공개 또는 익명으로 기도제목을 올려 함께 중보기도할 수 있습니다.",
      "개인 묵상은 비공개로 두고 나눌 기도제목은 직접 작성하도록 구분했습니다. 기획과 화면 디자인, 앱 개발을 직접 진행했으며 React Native, Expo, Supabase로 기록·묵상·돌아보기·공동 기도의 흐름을 구현했습니다. 이메일 인증과 접근 권한 확인, 개인 묵상 본문 암호화, 계정 삭제와 신고·차단 기능도 함께 마련했습니다.",
    ],
    en: [
      "Sea of Grace is a faith journal that connects daily prayers and scripture notes with time spent in reflection. It was designed to move beyond saving text and encourage putting the screen down to reflect. Personal records become “My Sea,” while shared prayer is represented by “Lighthouse” groups.",
      "After writing prayers, scripture, and reflections—or searching for Bible passages—users place their phone face down to run the devotional timer. A calendar and waves distinguish recorded days from completed devotional sessions. Lighthouse groups share prayer requests, while the community supports public or anonymous requests and praying for one another.",
      "Personal devotional entries remain private, and users separately write the requests they want to share. Planning, interface design, and development were handled independently using React Native, Expo, and Supabase. Email verification, access checks, encryption for personal devotional text, account deletion, reporting, and blocking support the experience.",
    ],
  },
};
