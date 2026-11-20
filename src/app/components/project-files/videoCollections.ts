export type VideoCollection = {
  title: { ko: string; en: string };
  clips: {
    id: string;
    title: string;
    description: { ko: string; en: string };
  }[];
};

export const videoCollections: Record<string, VideoCollection> = {
  "video-modeling": {
    title: { ko: "모델링", en: "Modeling" },
    clips: [
      {
        id: "1211913186",
        title: "Cafe",
        description: {
          ko: "스타일라이즈드 카페 공간을 모델링하고 Unreal Engine에서 조명과 분위기를 구성한 작업입니다. 영상으로 공간의 구도와 재질, 소품의 디테일을 살펴볼 수 있습니다.",
          en: "A stylized cafe modeled in Blender and lit in Unreal Engine. The video explores its composition, materials, and small details.",
        },
      },
      {
        id: "1211900105",
        title: "Gaming Room",
        description: {
          ko: "Blender와 Unreal Engine으로 제작한 게이밍룸 공간입니다. 가구와 주변 소품, 조명을 함께 배치해 공간의 분위기를 표현했습니다.",
          en: "A gaming room created with Blender and Unreal Engine, combining furniture, props, and lighting to establish its atmosphere.",
        },
      },
      {
        id: "1211900103",
        title: "Stage Design",
        description: {
          ko: "공연 무대의 구조와 연출을 3D 공간으로 시각화한 프로젝트입니다. Blender와 Unreal Engine으로 제작한 무대 배경을 영상으로 담았습니다.",
          en: "A 3D stage environment created with Blender and Unreal Engine, visualizing the structure and presentation of a performance space.",
        },
      },
      {
        id: "1220354350",
        title: "Jinu",
        description: {
          ko: "캐릭터의 인상과 의상을 분석해 모델링과 텍스처링으로 재현한 캐릭터 제작 프로젝트입니다. 영상에서 제작 과정과 완성된 형태를 살펴볼 수 있습니다.",
          en: "A character project focused on recreating facial features and clothing through modeling and texturing. The video shows the process and final form.",
        },
      },
    ],
  },
  "video-unreal": {
    title: { ko: "언리얼", en: "Unreal" },
    clips: [
      {
        id: "1211900004",
        title: "Sky Lantern",
        description: {
          ko: "Blender와 Unreal Engine을 활용해 제작한 풍등 장면입니다. 빛과 배경이 어우러지는 장면의 분위기를 영상으로 담았습니다.",
          en: "A sky lantern scene created with Blender and Unreal Engine, capturing the atmosphere of its lighting and environment.",
        },
      },
      {
        id: "1211900047",
        title: "MetaHuman",
        description: {
          ko: "Unreal Engine의 MetaHuman을 활용한 캐릭터 작업 영상입니다. 엔진 안에서 표현되는 캐릭터의 모습과 움직임을 확인할 수 있습니다.",
          en: "A character video using MetaHuman in Unreal Engine, showing the character’s appearance and movement in the engine.",
        },
      },
    ],
  },
  "video-unity": {
    title: { ko: "유니티", en: "Unity" },
    clips: [
      {
        id: "1221433562",
        title: "UI FX",
        description: {
          ko: "Unity의 UI Particle을 활용한 시각 효과 작업입니다. UI 화면에서 나타나는 파티클의 움직임과 표현을 영상으로 담았습니다.",
          en: "A Unity UI Particle study showing particle motion and visual effects within the interface.",
        },
      },
      {
        id: "1211907156",
        title: "Art",
        description: {
          ko: "Unity로 제작한 미디어아트 작업입니다. 넓은 화면 안에서 전개되는 시각 요소와 파티클의 흐름을 살펴볼 수 있습니다.",
          en: "A media art piece made with Unity, exploring visual elements and particle motion across a wide composition.",
        },
      },
      {
        id: "1211907153",
        title: "Coin",
        description: {
          ko: "Unity Particle System을 활용한 코인 이펙트 작업입니다. 코인이 움직이며 만들어 내는 시각적 반응을 표현했습니다.",
          en: "A coin effect created with Unity Particle System, exploring the visual response produced by moving coins.",
        },
      },
      {
        id: "1211907155",
        title: "Box",
        description: {
          ko: "Unity 파티클을 활용한 보물상자 이펙트 작업입니다. 상자와 함께 나타나는 파티클 연출을 영상으로 담았습니다.",
          en: "A treasure chest effect made with Unity particles, showing the particle presentation around the chest.",
        },
      },
    ],
  },
};
