// =====================
// 전역 변수 선언부
// =====================
let lookAroundTimer = 0,
  lookAroundCount = 0,
  lookAroundDelay = 600;
let startBgImg,
  startButtonImg,
  startButtonOriginalRatio = 1;
let mansionEntrySpoken = false,
  mansionInteriorEntrySpoken = false,
  momsRoomEntrySpoken = false;
let schoolEntranceEntrySpoken = false,
  schoolInteriorEntrySpoken = false,
  class1EntrySpoken = false;
let libraryEntrySpoken = false;
let scene = 0,
  girl,
  currentMap = "none",
  narrationQueue = [],
  activeNarration = null,
  statusText = "";
let alleyIntroShown = false,
  timeCapsuleEvent,
  capsuleChoiceActive = false,
  showLetter = false,
  letterStartTime = 0,
  letterDuration = 4000,
  alleyIntroStep = 0,
  jumpOnce = false,
  jumpVelocity = 0,
  gravity = 0.5,
  isJumping = false;
const MARGIN = 180;
let lastEnteredMap = "",
  mapEntryTime = 0,
  lookAroundStartTime = 0,
  lookingAround = false;
let alleyImg,
  girlFront1,
  girlFront2,
  girlBack1,
  girlBack2,
  girlLeft1,
  girlLeftStop;
let walkTimer = 0,
  walkInterval = 300,
  isWalking = false,
  lookAroundPhase = 0,
  lookAroundDuration = 800,
  lookPauseDuration = 1000;
let drawW, drawH, bgOffsetX, bgOffsetY;
let bgmScared,
  bgmMemories,
  currentBgm = null,
  alleyMusicSwitched = false,
  bgmScaredPlayed = false;
let isHoveringStartButton = false,
  hoverShakeOffset = 0,
  hoverShakeTimer = 0;
let homeEntrySpoken = false;
const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;
let shineImg;
let walkingSound;
let roomOpenSound;
let lastRoomOpenPlayedMap = "";
let slideDoorSound;
let lastSlideDoorPlayedMap = "";
let mansionImg,
  elementaryImg,
  schoolroomImg,
  schoolyardImg,
  classroomImg,
  libraryImg,
  mansionInteriorImg,
  momsRoomImg;
let momsRoomMemoTriggered = false;
let isFading = false,
  fadeAlpha = 0,
  fadeStartTime = 0,
  fadeDuration = 1400; // 페이드 효과 시간 1.4초로 수정
let nextMap = null,
  nextPos = null; // 다음 맵 정보 저장용
let listImg;
let showListModal = false;
let isHoveringList = false;
let listTitleImg;
let memoryFragments = []; // 발견한 기억 조각 리스트 (초기엔 비어있음)
let chapter2Fragments = []; // 챕터 2 기억 조각
let myFont;
let prevWidth = null,
  prevHeight = null;
// 캐릭터 이동 제한 플래그
let blockGirlMove = false;
// 샤인 애니메이션 상태 변수 복구
let shineState = {
  found: false,
  animating: false,
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  t: 0,
  targetX: 0,
  targetY: 0,
  phase: "idle", // 'idle', 'collect', 'fly', 'absorb' 단계
  flyStartX: 0,
  flyStartY: 0,
  flyTargetX: 0,
  flyTargetY: 0,
  flyProgress: 0,
  collectStartTime: null,
  animStartTime: null,
  scale: 1,
  alpha: 255
};
// 기억조각 등록 여부 플래그 추가
let momsRoomMemoAdded = false;
// 전역 변수에 스크롤 관련 변수 추가
let listScrollY = 0;
let isDraggingList = false;
let lastMouseY = 0;
let listContentHeight = 0;
// 전역 변수 추가
let shineEffect = null;

// 샤인 위치, 기억 조각
const shineTriggers = {
  schoolyard: {
    triggered: false,
    added: false,
    title: "어린 아이 답지 않은 다짐.",
    place: "운동장",
    x: 0.8,
    y: 0.8,
  },
  class1: {
    triggered: false,
    added: false,
    title: "잘하는 것이 많은 아이.",
    place: "1학년 1반",
    x: 0.45,
    y: 0.5,
  },
  library: {
    triggered: false,
    added: false,
    title: "나이에 맞지 않는 책을 읽는 아이.",
    place: "도서관",
    x: 0.65,
    y: 0.5,
  },
  mansion: {
    triggered: false,
    added: false,
    title:"한 아이의 소망. 나는 이미 가지고 있는 것. ",
    place: "저택",
    x: 0.86,
    y: 0.7,
  },
  momsRoom: {
    triggered: false,
    added: false,
    title: "어린이 같지 않은 어린애의 방.",
    place: "누군가의 방",
    x: 0.5,
    y: 0.6,
  }, // y값 조정
  inTheMansion2: {
    triggered: false,
    added: false,
    title: "모든 걸 포기해도 괜찮아.",
    place: "저택 내부",
    x: 0.3,
    y: 0.8,
  },
  livingRoom: {
    triggered: false,
    added: false,
    title: "현실과 꿈의 충돌.",
    place: "거실",
    x: 0.4,
    y: 0.9,
  },
  momsRoom2: {
    triggered: false,
    added: false,
    title: "아이를 위해 꿈을 포기한 아이.",
    place: "누군가의 방",
    x: 0.5,
    y: 0.8,
  },
  reality: {
    triggered: false,
    added: false,
    title: "돌아온 나와 그 아이의 집.",
    place: "현실",
    x: 0.7,
    y: 0.6,
  }
};

// 맵 이동 범위를 위한 전역 변수 추가
let mapMinY = 0,
  mapMaxY = 0;

// 각 장소별 shine 내레이션 체인 수정
const shineNarrationChains = {
  schoolyard: [
    { text: "한 명의 아이가 놀았던 흔적이네.\n 어? 모래성 옆에 글씨가 있어.", duration: 3000 },
    { text: '"나는 나중에 내 아이가 꼭 매일 웃게 해줄 거야."', duration: 3000 },
    { text: "글씨체가가 왠지 익숙해.", duration: 2000 },
  ],
  class1: [
    { text: "모든 과목에서 A+...? 이 아이, 엄청난 모범생이었다는 건 알겠다.", duration: 2500 },
    { text: "장래희망은 화가라고 적혀있어.", duration: 2000 },
    { text: "선생님 메모도 있어. \n'미래가 기대되는 재능과 노력을 가진 학생.'", duration: 3000 },
    { text: "이 아이의 기억 조각을 찾는 거, 은근히 재미있네?", duration: 2500 },
  ],
  library: [
    { text: "책장이 묵직해... 이건 '가족 심리학'? \n옆에 도서 이용 내역도 있네. 아까 봤던 그 아이의 글씨야.", duration: 2500 },
    { text: "'동생 돌보기'... '집안의 평화를 위한 책'이라니.", duration: 3000 },
    { text: "이걸... 13살짜리 아이가 읽은 거야? 뭔가 이상해.", duration: 2500 },
  ],
  mansion: [
    { text: "아이의 타임캡슐을 발견했어.", duration: 3000 },
    { text: "기억 조각을 찾아야 하니까... \n미안하지만 열어봐야겠다.", duration: 3200 },
    { text: "나의 소망 리스트?", duration: 2500 },
    { text: "가족들과 함께 외식하는 것,", duration: 2800 },
    { text: "아빠와 함께하는 저녁식사", duration: 2800 },
    { text: "단 한 장의 웃는 가족사진.", duration: 2500 },
    { text: "그 소박한 소원이... 이루어지지 못한 채 여기 남아 있어.", duration: 3000 },
    { text: "이 아이가 간절히 바라는 거, \n다 지금 내가 누리고 있는 것들이네.", duration: 2800 },
  ],
  momsRoom: [
    { text: "바닥에 메모지들이 흩어져 있어.", duration: 2000 },
    { text: '"내가 어른이 되면 동생을 꼭 지켜줄 거야."', duration: 3000 },
    { text: '"우리 가족은 행복해질 수 있을까? \n엄마 아빠가 다투지 않았으면 좋겠다..."', duration: 3000 },
    { text: "초등학생의 글씨 같아. 서툴긴 한데 참 익숙한 글씨체네. 이 아이는 행복하지 않은가봐.", duration: 3900 },
    { text: "우리 엄마는 항상 밥 챙겨주시는데...", duration: 2500 },
    { text: "갑자기 엄마 밥이 먹고 싶어졌어.", duration: 2500 },
  ],
  inTheMansion2: [
    { text: "여기 메모가 있네. 그 글씨야.", duration: 3000 },
    { text: "메모옆에는 초음파 사진이 있어. \n이 집에 살던 그 아이가, 커서 임신을 했나봐.", duration: 2500 },
    { text: "그리고 손글씨로 써진 메모... 역시 이 손글씨, 너무 익숙해.", duration: 2000 },
    { text: '"모든 걸 포기해도 괜찮아.\n너는 나보다 더 큰 사랑을 받기를."', duration: 4000 },
    { text: "이건... 누구의 마음일까?", duration: 3000 }
  ],
  livingRoom: [
    { text: "다양한 것들이 흩어져 있어.", duration: 2500 },
    { text: "대학원 합격 통지서, 미술 공모전 준비물, 유학 브로셔...", duration: 3000 },
    { text: "메모도 있어.", duration: 3000 },
    { text: '"내 꿈과 같은 이 아이를 지켜줄 거야. \n다른 것쯤은 이루지 못해도 괜찮아."', duration: 3000 },
    { text: "누군가의 꿈과 현실이 뒤엉킨 공간...", duration: 3000 }
  ],
  momsRoom2: [
    { text: "벽에 걸려진 그림, 그 아이가 어른이 되어 그린 걸까? \n정말 예쁘다.", duration: 2000 },
    { text: '그런데, 화가가 되고싶다는 꿈은 포기한 걸까? \n미술용품을 정리한 것 같네.', duration: 3000 },
    { text: '"아이가 태어나면, 엄청난 사랑을 줄 거야"', duration: 3000 },
    { text: '"생일에는 매번 편지와 함께 멋진 선물을 줘야지. \n행복의 꽃말을 가진 메리골드도 줄 거야."', duration: 3000 },
    { text: "잠깐, 생일에 편지와 선물? 메리골드까지? \n그건 우리 엄마가 항상 나에게 해주는 건데...", duration: 2500 },
  ],
  reality: [
    { text: "아건 우리 엄마 휴대폰인데, 켜져있네...", duration: 2000 },
    { text: '"엄마는 진짜 인생 망친 사람 같아"', duration: 3000 },
    { text: '"엄마는 내 기분도 모르잖아!"', duration: 3000 },
    { text: "이거 내가 엄마한테 보낸 거네...", duration: 2500 },
    { text: "잠깐...", duration: 2000 },
    { text: "어릴 적 동생을 돌본 소녀...", duration: 2500 },
    { text: "꿈을 포기한 여성...", duration: 2500 },
    { text: "눈물 흘린 엄마...", duration: 2500 },
    { text: "이 모든 것이...", duration: 2000 },
    { 
      text: "같은 한 사람의 이야기였다.", 
      duration: 3000,
      onComplete: function() {
        console.log('마지막 대사 완료로 엔딩 시퀀스 시작');
        showEndingText = true;
        showListModal = false;
        lastStageButton.visible = false;
        lastStageButton.permanentlyHidden = true;
        endingPhase = 1;
        endingStartTime = millis();
      }
    }
  ]
};

// 다음 스테이지 버튼 관련 변수
let nextStageButton = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  visible: false,
  hover: false,
  isRealityButton: false,
  clickCount: 0 // 버튼 클릭 횟수
};

// 전역 변수에 리스트 버튼 흔들림 관련 변수 추가
let listButtonShake = {
  active: false,
  startTime: 0,
  amplitude: 5, // 흔들림 진폭
  frequency: 0.1, // 흔들림 주파수
  offset: 0
};

// 전역 변수에 다음 스테이지 버튼 이미지 추가
let nextStageImg;

// 전역 변수에 챕터 상태 추가
let currentChapter = 1; // 1: 챕터 1, 2: 챕터 2

// 챕터별 맵 정의
const chapterMaps = {
  1: ["school", "class", "playground", "library", "mansion", "momsRoom", "inTheMansion"],
  2: ["mansion2", "inTheMansion2", "livingRoom", "momsRoom2", "reality"]
};

// 전역 변수에 새로운 음악 추가
let memories1Sound;
let memories2Sound;

// =====================
// 클래스 정의
// =================
// 
// 
class GameEvent {
  constructor(name, onTrigger) {
    this.name = name;
    this.triggered = false;
    this.count = 0;
    this.onTrigger = onTrigger;
  }
  tryTrigger(condition) {
    if (!this.triggered && condition) {
      this.triggered = true;
      this.count++;
      this.onTrigger(this.count);
    }
  }
  reset() {
    this.triggered = false;
  }
}

class Narration {
  constructor(text, duration = 2000, shouldFadeOut = true, type = "dialogue", onComplete = null) {
    this.text = text;
    this.duration = duration;
    this.shouldFadeOut = shouldFadeOut;
    this.type = type; // "dialogue" 또는 "memo"
    this.startTime = millis();
    this.active = true;
  }

  update() {
    const elapsed = millis() - this.startTime;
    if (elapsed > this.duration) {
      this.active = false;
    }
  }

  draw(boxOnly = false) {
    if (!this.active) return;

    const elapsed = millis() - this.startTime;
    const fadeInDuration = 400;
    const fadeOutDuration = 400;
    let alpha = 255;

    if (elapsed < fadeInDuration) {
      alpha = map(elapsed, 0, fadeInDuration, 0, 255);
    } else if (this.shouldFadeOut && elapsed > this.duration - fadeOutDuration) {
      alpha = map(elapsed, this.duration - fadeOutDuration, this.duration, 255, 0);
    }

    if (boxOnly) {
      fill(0, alpha * 0.7);
      noStroke();
      rect(0, 0, width, height);
      return;
    }

    const scale = 0.7;
    textSize(32 * scale);
    textAlign(CENTER, CENTER);
    let displayText = this.text;
    let lines = displayText.split("\n");

    // 메모인 경우 따옴표 제거
    if (this.type === "memo") {
      displayText = displayText.replace(/^"|"$/g, '');
      lines = displayText.split("\n");
    }

    let maxLineWidth = 0;
    for (let line of lines) {
      let w = textWidth(line);
      if (w > maxLineWidth) maxLineWidth = w;
    }

    let paddingX = 60 * scale;
    let paddingY = 27 * scale;
    let lineHeight = 48 * scale;

    let boxW = maxLineWidth + paddingX * 2;
    let boxH = lines.length * lineHeight + paddingY * 2;
    let boxX = width / 2 - boxW / 2;
    let boxY = height - 165 - boxH / 2 + 50;

    // 배경 박스 그리기
    fill(0, alpha * 0.7);
    noStroke();
    rect(boxX, boxY, boxW, boxH, 27 * scale);

    // 텍스트 색상 설정
    if (this.type === "memo") {
      fill("#FFEBD1", alpha); // 메모는 FFEBD1 색상
      textStyle(ITALIC); // 이탤릭체 적용
    } else {
      fill(255, alpha); // 대사는 흰색
      textStyle(NORMAL);
    }

    // 텍스트 그리기
    for (let i = 0; i < lines.length; i++) {
      text(
        lines[i],
        width / 2,
        boxY + paddingY + lineHeight / 2 + i * lineHeight
      );
    }

    // 스타일 초기화
    textStyle(NORMAL);
  }
}

class PixelGirl {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.prevPos = this.pos.copy();
    this.baseSpeed = 2;
    this.direction = "front";
    this.frameToggle = false;
    this.jumpScaleValue = null; // 점프 중 scale 고정용
    this.wasWalking = false; // 걷기 상태 변화 감지용
  }
  update() {
    if (activeNarration) return;
    if (isFading) return; // 페이드 중에는 캐릭터가 움직이지 않음
    isWalking = false;
    // y값에 따라 속도 동적 조절 (아래로 갈수록 빨라짐, 위로 갈수록 더 강하게 느려짐)
    let minY = 0,
      maxY = height;
    if (currentMap === "alley") {
      minY = height * (MARGIN / BASE_HEIGHT) - height * (50 / BASE_HEIGHT);
      maxY = height - height * (MARGIN / BASE_HEIGHT);
    } else if (currentMap === "schoolEntrance") {
      minY = height * (MARGIN / BASE_HEIGHT) + height * (120 / BASE_HEIGHT);
      maxY = height - height * (MARGIN / BASE_HEIGHT);
    } else if (currentMap === "schoolInterior") {
      minY = height * (MARGIN / BASE_HEIGHT);
      maxY = height - height * (MARGIN / BASE_HEIGHT);
    } else if (currentMap === "library") {
      minY = 0;
      maxY = height - height * (MARGIN / BASE_HEIGHT);
    } else if (currentMap === "class1") {
      minY = 0;
      maxY = height;
    } else if (currentMap === "schoolyard") {
      minY = 0;
      maxY = height;
    } else if (currentMap === "mansion") {
      minY = height * (MARGIN / BASE_HEIGHT) + height * (200 / BASE_HEIGHT);
      maxY = height - height * (MARGIN / BASE_HEIGHT);
    } else if (currentMap === "mansionInterior") {
      minY = 0;
      maxY = height - height * (MARGIN / BASE_HEIGHT);
    } else if (currentMap === "momsRoom") {
      minY = MARGIN + 200;
      maxY = height - MARGIN - 50;
    } else if (currentMap === "mansion2") {
      minY = height * 0.4;
      maxY = height - MARGIN;
    } else if (currentMap === "inTheMansion2") {
      minY = MARGIN;
      maxY = height - MARGIN - 100;
    } else if (currentMap === "livingRoom") {
      minY = MARGIN;
      maxY = height - MARGIN - 100;
    }
    let t = constrain((this.pos.y - minY) / (maxY - minY), 0, 1);
    // B키 누르면 속도 2배
    let speedMultiplier = keyIsDown(66) || keyIsDown(98) ? 3 : 1;
    // 아래로 갈수록 1.7배 빨라지고, 위로 갈수록 0.8배까지 더 강하게 느려짐
    this.speed = this.baseSpeed * lerp(1, 1.7, t) * speedMultiplier;
    if (keyIsDown(LEFT_ARROW)) {
      this.pos.x -= this.speed;
      this.direction = "left";
      isWalking = true;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.pos.x += this.speed;
      this.direction = "right";
      isWalking = true;
    } else if (keyIsDown(UP_ARROW)) {
      this.pos.y -= this.speed;
      this.direction = "back";
      isWalking = true;
    } else if (keyIsDown(DOWN_ARROW)) {
      this.pos.y += this.speed;
      this.direction = "front";
      isWalking = true;
    }
    if (isJumping) {
      this.pos.y += jumpVelocity;
      jumpVelocity += gravity;
      if (this.pos.y >= height / 2) {
        this.pos.y = height / 2;
        isJumping = false;
        this.jumpScaleValue = null; // 점프 끝나면 해제
      }
    }
    if (isWalking && millis() - walkTimer > walkInterval) {
      this.frameToggle = !this.frameToggle;
      walkTimer = millis();
    }
    // 걷기 효과음 처리
    if (isWalking) {
      if (!walkingSound.isPlaying()) {
        walkingSound.play(0, 1.6, 1.8, 0, 2); // 0초부터 2초, 1.6배속, 볼륨 1.8
      }
    } else {
      if (walkingSound.isPlaying()) {
        walkingSound.stop();
      }
    }
  }
}

// =====================
// p5.js 필수 함수
// =====================
function preload() {
  startBgImg = loadImage("img/start_background.png");
  startButtonImg = loadImage("img/game_start.png", (img) => {
    startButtonOriginalRatio = img.width / img.height;
  });
  alleyImg = loadImage("img/alley_background.png");
  mansionImg = loadImage("img/mansion_background.png");
  elementaryImg = loadImage("img/elementary_background.png");
  schoolroomImg = loadImage("img/schoolroom_background.png");
  schoolyardImg = loadImage("img/schoolyard_background.png");
  classroomImg = loadImage("img/classroom_background.png");
  libraryImg = loadImage("img/library_background.png");
  mansionInteriorImg = loadImage("img/in_the_mansion.png");
  momsRoomImg = loadImage(
    "img/mom's_room.png",
    () => {
      console.log(
        "엄마의 방 이미지 로드 완료:",
        momsRoomImg.width,
        "x",
        momsRoomImg.height
      );
    },
    () => {
      console.error("엄마의 방 이미지 로드 실패");
    }
  );
  girlFront1 = loadImage("img/girl-frontside.png");
  girlFront2 = loadImage("img/girl-frontside2.png");
  girlBack1 = loadImage("img/girl-backside.png");
  girlBack2 = loadImage("img/girl-backside2.png");
  girlLeft1 = loadImage("img/girl-leftside.png");
  girlLeftStop = loadImage("img/girl-leftside-stop.png");
  shineImg = loadImage("img/shine.png");
  soundFormats("mp3");
  bgmScared = loadSound("music/scared1.mp3");
  memories1Sound = loadSound("music/memories1.mp3");
  memories2Sound = loadSound("music/memories2.mp3");
  walkingSound = loadSound("music/walking.mp3");
  roomOpenSound = loadSound("music/room_open.mp3");
  slideDoorSound = loadSound("music/slide_door.mp3");
  listImg = loadImage("img/list.png");
  listTitleImg = loadImage("img/list_title.png");
  myFont = loadFont("font/myfont.ttf");
  mansion2Img = loadImage("img/mansion2.png");
  nextStageImg = loadImage("img/next_stage.png");
  inTheMansion2Img = loadImage("img/in_the_mansion2.png");
  livingRoomImg = loadImage("img/living_room.png");
  momsRoom2Img = loadImage("img/mom's_room2.png");
  myHouseImg = loadImage("img/my_house.png");
  knockSound = loadSound("music/knock.mp3");
  knockSound.setVolume(1.5); // 노크 소리 볼륨 1.5배로 설정
  lastStageImg = loadImage("img/last_stage_button.png");
  goToHomeImg = loadImage('img/go_to_home.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  girl = new PixelGirl(width / 2, height / 2);
  girl.prevPos = girl.pos.copy();
  textFont(myFont);
  prevWidth = width;
  prevHeight = height;
  window.mouseWheel = mouseWheel;
}

function draw() {
  background(0);

  // 골목 처음 진입 시 한 번만 scared1 재생
  if (
    scene === 6 &&
    currentMap === "alley" &&
    !currentBgm &&
    !bgmScaredPlayed
  ) {
    currentBgm = bgmScared;
    currentBgm.setLoop(true);
    currentBgm.setVolume(0.3);
    currentBgm.play();
    bgmScaredPlayed = true;
  }

  if (scene === 6) {
    drawGameScene();
    // 기억조각 4개(챕터1) 또는 3개(챕터2) 모았을 때 리스트 버튼 흔들림 항상 보장
    if ((currentChapter === 1 && memoryFragments.length >= 4) || (currentChapter === 2 && chapter2Fragments.length >= 3)) {
      if (!listButtonShake.active) {
        startListButtonShake();
      }
    }
    drawListButton();
    if (showListModal) drawListModal();
    
    // 샤인 애니메이션 그리기 추가
    if (shineState.phase !== "idle" || shineState.animating) {
      const trigger = shineTriggers[currentMap];
      if (trigger && trigger.triggered) {
        push();
        translate(shineState.x + shineState.w/2, shineState.y + shineState.h/2);
        if (shineState.phase === "fly") {
          rotate(radians(map(shineState.flyProgress, 0, 1, 0, 360)));
        }
        tint(255, shineState.alpha);
        imageMode(CENTER);
        image(
          shineImg,
          0, 0,
          shineState.w * shineState.scale,
          shineState.h * shineState.scale
        );
        pop();
      }
    }
    // 챕터2에서는 다음스테이지 버튼이 무조건 사라지도록 보장
    if (currentChapter === 2) {
      if (nextStageButton.visible) {
        nextStageButton.visible = false;
        // 챕터 2에서 기억 조각을 3개 모았을 때 마지막 스테이지 버튼 표시
        if (chapter2Fragments.length >= 3) {
          lastStageButton.visible = true;
        }
      }
    }
  } else if (scene === 0) {
    drawTitleScreen();
  } else if (scene >= 1 && scene <= 5) {
    handlePrologue();
  }

  // 내레이션은 항상 가장 위에 그려지도록 마지막에 처리
  if (activeNarration) {
    activeNarration.update();

    if (!activeNarration.active && narrationQueue.length > 0) {
      activeNarration.draw(true);
    } else {
      activeNarration.draw();
    }

    if (!activeNarration.active) {
      const shine = shineTriggers?.[currentMap];
      if (shine && shine.triggered && !shine.added && narrationQueue.length === 0) {
        // 챕터별 기억조각 배열 사용
        const fragments = currentChapter === 1 ? memoryFragments : chapter2Fragments;
        const exists = fragments.some(fragment => fragment.place === shine.place);

        if (!exists) {
          // 기억조각 추가
          fragments.push({
            title: shine.title,
            place: shine.place,
          });
          shine.added = true;
          shineState.found = true;

          console.log("기억조각 등록됨:", shine.title, "현재 기억조각 수:", fragments.length);

          // 리스트 스크롤 위치 업데이트
          listScrollY = Math.max(0, listContentHeight - height * 0.45);

          // 챕터별 기억조각 개수에 따라 리스트 버튼 흔들림 시작
          if ((currentChapter === 1 && memoryFragments.length >= 4) || 
              (currentChapter === 2 && chapter2Fragments.length >= 3)) {
            listButtonShake.active = true;
            listButtonShake.startTime = millis();
          }

          // 현실 맵이 아닐 때만 다음 스테이지 버튼 표시
          if (currentMap !== "reality") {
            if ((currentChapter === 1 && memoryFragments.length >= 4) || 
                (currentChapter === 2 && chapter2Fragments.length >= 3)) {
              if (nextStageButtonTimer) clearTimeout(nextStageButtonTimer);
              nextStageButtonTimer = setTimeout(() => {
                nextStageButton.visible = true;
                nextStageButton.isRealityButton = currentChapter === 2;
              }, 5000);
            }
          }
        }
      }
      activeNarration = null;
    }
  } else if (narrationQueue.length > 0) {
    activeNarration = narrationQueue.shift();
    activeNarration.shouldFadeOut = true;
    activeNarration.startTime = millis();
  }
}


function windowResized() {
  // 리사이즈 전 위치 비율 저장
  let xRatio = girl.pos.x / prevWidth;
  let yRatio = girl.pos.y / prevHeight;
  resizeCanvas(windowWidth, windowHeight);
  if (!girl || !girl.pos) return;
  // 리사이즈 후에도 같은 비율로 위치 보정
  girl.pos.x = xRatio * width;
  girl.pos.y = yRatio * height;
  prevWidth = width;
  prevHeight = height;
}

// =====================
// 게임 주요 화면 및 UI 함수
// =====================
function drawGameScene() {
  handleFadeTransition();
  drawBackgroundImage();
  calculateMapBoundaries();
  handleShineInteraction();
  if (currentMap === "alley") handleAlleyIntro();
  updateMapLogic();
  drawMap();
  drawStatusText();
  updateAndDrawGirl();
  drawLetterUI();
  drawNextStageButton();
  drawLastStageButton();
  drawFadeOverlay();


  // 엔딩 텍스트 표시
  if (showEndingText) {
    handleEndingSequence();
  }
}
function handleFadeTransition() {
  const elapsed = millis() - fadeStartTime;
  if (!isFading) return;
  if (elapsed < fadeDuration) {
    fadeAlpha = map(elapsed, 0, fadeDuration, 0, 255);
  } else if (elapsed < fadeDuration * 2) {
    if (nextMap && nextPos) {
      shineState = {
        found: false,
        animating: false,
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        t: 0,
        targetX: 0,
        targetY: 0,
        phase: "idle",
        flyStartX: 0,
        flyStartY: 0,
        flyTargetX: 0,
        flyTargetY: 0,
        flyProgress: 0,
        collectStartTime: null,
        animStartTime: null,
        scale: 1,
        alpha: 255
      };
      currentMap = nextMap;
      girl.pos = nextPos;
      nextMap = null;
      nextPos = null;
    }
    fadeAlpha = map(elapsed, fadeDuration, fadeDuration * 2, 255, 0);
  } else {
    isFading = false;
    fadeAlpha = 0;
  }
}

function drawBackgroundImage() {
  let bg;
  switch (currentMap) {
    case "alley":
      bg = alleyImg;
      break;
    case "schoolEntrance":
      bg = elementaryImg;
      break;
    case "schoolInterior":
      bg = schoolroomImg;
      break;
    case "library":
      bg = libraryImg;
      break;
    case "class1":
      bg = classroomImg;
      break;
    case "schoolyard":
      bg = schoolyardImg;
      break;
    case "mansion":
      bg = mansionImg;
      break;
    case "mansionInterior":
      bg = mansionInteriorImg;
      break;
    case "momsRoom":
      bg = momsRoomImg;
      break;
    case "mansion2":
      bg = mansion2Img;
      break;
    case "inTheMansion2":
      image(inTheMansion2Img, 0, 0, width, height);
      return;
    case "livingRoom":
      image(livingRoomImg, 0, 0, width, height);
      return;
    case "momsRoom2":
      image(momsRoom2Img, 0, 0, width, height);
      return;
    case "reality":
      bg = myHouseImg;
      break;
    default:
      bg = alleyImg;
  }
  let imgAspect = bg.width / bg.height;
  let canvasAspect = width / height;
  if (canvasAspect > imgAspect) {
    drawW = width;
    drawH = width / imgAspect;
  } else {
    drawH = height;
    drawW = height * imgAspect;
  }
  bgOffsetX = (width - drawW) / 2;
  bgOffsetY = height - drawH;
  image(bg, bgOffsetX, bgOffsetY, drawW, drawH);
}

function calculateMapBoundaries() {
  mapMinY = 0;
  mapMaxY = height;
  if (currentMap === "alley") {
    mapMinY = MARGIN - 50;
    mapMaxY = height - MARGIN;
  } else if (currentMap === "schoolEntrance") {
    mapMinY = MARGIN + 120;
    mapMaxY = height - MARGIN;
  } else if (currentMap === "schoolInterior") {
    mapMinY = MARGIN;
    mapMaxY = height - MARGIN;
  } else if (currentMap === "library") {
    mapMinY = 0;
    mapMaxY = height - MARGIN;
  } else if (currentMap === "class1") {
    mapMinY = 0;
    mapMaxY = height;
  } else if (currentMap === "schoolyard") {
    mapMinY = 0;
    mapMaxY = height;
  } else if (currentMap === "mansion") {
    mapMinY = MARGIN + 200;
    mapMaxY = height - MARGIN - 20;
  } else if (currentMap === "mansionInterior") {
    mapMinY = 0;
    mapMaxY = height - MARGIN;
  } else if (currentMap === "momsRoom") {
    mapMinY = MARGIN + 200;
    mapMaxY = height - MARGIN - 50;
  } else if (currentMap === "mansion2") {
    mapMinY = height * 0.4;
    mapMaxY = height - MARGIN;
  } else if (currentMap === "inTheMansion2") {
    mapMinY = MARGIN;
    mapMaxY = height - MARGIN - 100;
  } else if (currentMap === "livingRoom") {
    mapMinY = MARGIN;
    mapMaxY = height - MARGIN - 100;
  } else if (currentMap === "reality") {
    mapMinY = MARGIN;
    mapMaxY = height - MARGIN;
  }
}

function drawFadeOverlay() {
  if (isFading) {
    push();
    fill(0, fadeAlpha);
    rect(0, 0, width, height);
    pop();
  }
}

function drawMap() {
  // TODO: 문이나 오브젝트 등 맵 요소 그리기
}

function drawStatusText() {
  // TODO: 현재 위치, 상단 상태 정보 출력
}

function updateAndDrawGirl() {
  if (currentMap === "momsRoom" && !momsRoomMemoTriggered) {
    blockGirlMove = true;
  } else {
    blockGirlMove = false;
  }
  girl.update();
  let t = constrain((girl.pos.y - mapMinY) / (mapMaxY - mapMinY), 0, 1);
  let baseScale = 0.35;
  let minPerspective = 0.8;
  let maxPerspective = 1.5;
  
  // 맨션 맵에서만 크기 변화를 줄임
  if (currentMap === "mansion" || currentMap === "mansionInterior" || 
      currentMap === "mansion2" || currentMap === "inTheMansion2") {
    minPerspective = 0.8;
    maxPerspective = 1.2;
  }
  
  let perspective = lerp(minPerspective, maxPerspective, t);
  let scaleValue = baseScale * perspective;
  if (currentMap === "momsRoom") scaleValue *= 1.3;
  if (isJumping && girl.jumpScaleValue == null)
    girl.jumpScaleValue = scaleValue;
  if (isJumping && girl.jumpScaleValue != null)
    scaleValue = girl.jumpScaleValue;
  const imgW = 64,
    offsetY = -64;
  push();
  translate(girl.pos.x, girl.pos.y);
  if (girl.direction === "right") {
    scale(-scaleValue, scaleValue);
    image(girl.frameToggle ? girlLeft1 : girlLeftStop, -imgW, offsetY);
  } else if (girl.direction === "left") {
    scale(scaleValue, scaleValue);
    image(girl.frameToggle ? girlLeft1 : girlLeftStop, 0, offsetY);
  } else if (girl.direction === "back") {
    scale(scaleValue, scaleValue);
    image(girl.frameToggle ? girlBack2 : girlBack1, -imgW / 2, offsetY);
  } else {
    scale(scaleValue, scaleValue);
    image(girl.frameToggle ? girlFront2 : girlFront1, -imgW / 2, offsetY);
  }
  pop();
}

function drawLetterUI() {
  if (showLetter) {
    drawLetter();
    if (millis() - letterStartTime > letterDuration) showLetter = false;
  }
}

function drawNextStageButton() {
  if (!nextStageButton.visible) return;

  const btnW = width * 0.15;
  const btnH = btnW * (nextStageImg.height / nextStageImg.width);
  nextStageButton.x = width - btnW - 40;
  nextStageButton.y = height - btnH - 40;
  nextStageButton.w = btnW;
  nextStageButton.h = btnH;

  nextStageButton.hover =
    mouseX > nextStageButton.x &&
    mouseX < nextStageButton.x + nextStageButton.w &&
    mouseY > nextStageButton.y &&
    mouseY < nextStageButton.y + nextStageButton.h;

  push();
  if (nextStageButton.hover) {
    tint(255, 220);
  }
  image(
    nextStageImg,
    nextStageButton.x,
    nextStageButton.y,
    nextStageButton.w,
    nextStageButton.h
  );
  pop();
}

function drawLastStageButton() {
  // 현실 맵이거나 버튼이 영구적으로 숨겨졌거나 visible이 false일 때는 그리지 않음
  if (currentMap === "reality" || lastStageButton.permanentlyHidden || !lastStageButton.visible) return;
  
  const btnW = width * 0.15;
  const btnH = btnW * (lastStageImg.height / lastStageImg.width);
  lastStageButton.x = width - btnW - 40;
  lastStageButton.y = height - btnH - 40;
  lastStageButton.w = btnW;
  lastStageButton.h = btnH;
  lastStageButton.hover =
    mouseX > lastStageButton.x &&
    mouseX < lastStageButton.x + lastStageButton.w &&
    mouseY > lastStageButton.y &&
    mouseY < lastStageButton.y + lastStageButton.h;
  push();
  if (lastStageButton.hover) {
    tint(255, 220);
  }
  image(
    lastStageImg,
    lastStageButton.x,
    lastStageButton.y,
    lastStageButton.w,
    lastStageButton.h
  );
  pop();
}

function handleShineInteraction() {
  if (!shineTriggers[currentMap]) return;
  const trigger = shineTriggers[currentMap];

  // 디버깅을 위한 상태 로깅
  if (frameCount % 60 === 0) { // 1초마다 로그 출력
    console.log('Shine State:', {
      phase: shineState.phase,
      animating: shineState.animating,
      found: shineState.found,
      trigger: {
        triggered: trigger.triggered,
        added: trigger.added,
        narrationComplete: trigger.narrationComplete
      },
      currentMap: currentMap
    });
  }

  // 이미 트리거된 샤인은 처리하지 않음
  if (trigger.triggered && trigger.added) return;

  // 샤인 충돌 체크 및 나레이션 트리거
  const baseW = width * 0.09;
  const scale = baseW / shineImg.width;
  const shineW = shineImg.width * scale;
  const shineH = shineImg.height * scale;
  const shineX = width * trigger.x - shineW / 2;
  const shineY = height * trigger.y - shineH / 2;
  const imgW = 64, offsetY = -64;
  const centerX = girl.pos.x;
  const centerY = girl.pos.y + offsetY * scale + (imgW * scale) / 2;
  const charW = imgW * scale * 30;
  const charH = imgW * scale * 80;
  const charX = centerX - charW / 2 + 50;
  const charY = centerY - charH / 2 + 50;

  const overlap = !(
    charX + charW < shineX ||
    charX > shineX + shineW ||
    charY + charH < shineY ||
    charY > shineY + shineH
  );

  // 샤인과 충돌했을 때 처리
  if (overlap && !trigger.triggered && !shineState.found) {
    if (!activeNarration && narrationQueue.length === 0) {
      console.log('Shine triggered - starting collect phase for map:', currentMap);
      queueNarrationChain(shineNarrationChains[currentMap]);
      trigger.triggered = true;
      trigger.narrationComplete = false;
      shineState.phase = "collect";
      shineState.x = shineX;
      shineState.y = shineY;
      shineState.w = shineW;
      shineState.h = shineH;
      shineState.collectStartTime = millis();
      shineState.animating = true;
      shineState.found = false;
    }
  }

  // 내레이션이 끝났을 때 narrationComplete 상태 업데이트
  if (trigger.triggered && !trigger.narrationComplete && !activeNarration && narrationQueue.length === 0) {
    console.log('샤인 내레이션 완료 - 맵:', currentMap, {
      triggered: trigger.triggered,
      added: trigger.added,
      narrationComplete: trigger.narrationComplete
    });
    trigger.narrationComplete = true;
    
    // 기억조각 추가 로직
    if (!trigger.added) {
      const fragments = currentChapter === 1 ? memoryFragments : chapter2Fragments;
      const exists = fragments.some(fragment => fragment.place === trigger.place);
      
      if (!exists) {
        console.log('Adding memory fragment for map:', currentMap, 'title:', trigger.title);
        fragments.push({
          title: trigger.title,
          place: trigger.place,
        });
        trigger.added = true;
        shineState.found = true;
        
        // 리스트 스크롤 위치 업데이트
        listScrollY = Math.max(0, listContentHeight - height * 0.45);
        
        // 챕터별 기억조각 개수에 따라 리스트 버튼 흔들림 시작
        if ((currentChapter === 1 && memoryFragments.length >= 4) || 
            (currentChapter === 2 && chapter2Fragments.length >= 3)) {
          listButtonShake.active = true;
          listButtonShake.startTime = millis();
        }
      }
    }
  }

  // 샤인 애니메이션 처리
  if (shineState.animating) {
    if (shineState.phase === "collect" && shineState.collectStartTime) {
      const elapsed = millis() - shineState.collectStartTime;
      if (elapsed > 1000) {
        console.log('Collect phase complete - starting fly phase for map:', currentMap);
        shineState.phase = "fly";
        shineState.flyStartX = shineX;
        shineState.flyStartY = shineY;
        shineState.flyTargetX = width - 100;
        shineState.flyTargetY = 80;
        shineState.flyProgress = 0;
        shineState.collectStartTime = null;
      }
    } else if (shineState.phase === "fly") {
      shineState.flyProgress += 0.015;
      const p = constrain(shineState.flyProgress, 0, 1);
      const easedP = easeInOutQuad(p);
      const midX = (shineState.flyStartX + shineState.flyTargetX) / 2;
      const midY = shineState.flyStartY - 100;
      const t = easedP;
      const oneMinusT = 1 - t;
      shineState.x = oneMinusT * oneMinusT * shineState.flyStartX + 2 * oneMinusT * t * midX + t * t * shineState.flyTargetX;
      shineState.y = oneMinusT * oneMinusT * shineState.flyStartY + 2 * oneMinusT * t * midY + t * t * shineState.flyTargetY;
      shineState.scale = lerp(1, 0.5, p);
      shineState.alpha = lerp(255, 0, p);
      if (p >= 1) {
        console.log('Fly phase complete - starting absorb phase for map:', currentMap);
        shineState.phase = "absorb";
        shineState.animStartTime = millis();
        shineState.found = true; // fly 단계가 완료된 후에만 found를 true로 설정
      }
    } else if (shineState.phase === "absorb") {
      const elapsed = millis() - shineState.animStartTime;
      const duration = 600;
      const p = constrain(elapsed / duration, 0, 1);
      shineState.scale = 0.5 + p * 1.5;
      shineState.alpha = 255 * (1 - p);
      if (p >= 1) {
        console.log('Absorb phase complete - returning to idle for map:', currentMap);
        shineState.phase = "idle";
        shineState.animating = false;
      }
    }
  } else if (shineState.phase === "idle" && !shineState.found && !shineState.animating) {
    // 애니메이션이 모두 끝난 뒤에만 trigger.added가 true면 return
    if (trigger.added) return;
    const t = millis() / 1000;
    const alpha = 180 + 75 * sin(t * 2.2);
    const bounce = 18 * sin(t * 2.0);
    push();
    tint(255, alpha);
    image(shineImg, shineX, shineY + bounce, shineW, shineH);
    pop();
  }
}

function drawTitleScreen() {
  background(0);
  const img = startBgImg;
  const imgAspect = img.width / img.height;
  const canvasAspect = width / height;
  let drawW, drawH;
  if (canvasAspect > imgAspect) {
    drawH = height;
    drawW = height * imgAspect;
  } else {
    drawW = width;
    drawH = width / imgAspect;
  }
  const offsetX = (width - drawW) / 2;
  const offsetY = (height - drawH) / 2;
  image(img, offsetX, offsetY, drawW, drawH);
  const btnW = width * 0.25;
  const btnH = btnW / startButtonOriginalRatio;
  const btnX = width / 2 - btnW / 2;
  const btnY = height * 0.75;
  isHoveringStartButton =
    mouseX > btnX &&
    mouseX < btnX + btnW &&
    mouseY > btnY &&
    mouseY < btnY + btnH;
  if (isHoveringStartButton) {
    push();
    translate(hoverShakeOffset, 0);
    tint(200);
    image(startButtonImg, btnX, btnY, btnW, btnH);
    pop();
  } else {
    tint(255);
    image(startButtonImg, btnX, btnY, btnW, btnH);
  }
}

function drawMap() {
  fill(100);
  textSize(16);
  textAlign(LEFT, TOP);
  text("MAP: " + currentMap, 20, height - 40);
}

function drawListButton() {
  // 현실 맵에서는 리스트 버튼을 그리지 않음
  if (currentMap === "reality") return;

  const btnW = width * 0.08;
  const btnH = btnW * (listImg.height / listImg.width);
  const btnX = width - btnW - 32;
  const btnY = 32;

  isHoveringList =
    mouseX > btnX &&
    mouseX < btnX + btnW &&
    mouseY > btnY &&
    mouseY < btnY + btnH;

  push();
  if (listButtonShake.active) {
    const elapsed = millis() - listButtonShake.startTime;
    if (elapsed < 2000) { // 2초 동안 흔들림
      listButtonShake.offset = sin(elapsed * listButtonShake.frequency * 2) * listButtonShake.amplitude;
      translate(listButtonShake.offset, 0);
    } else {
      listButtonShake.active = false;
    }
  }
  image(listImg, btnX, btnY, btnW, btnH);
  if (isHoveringList) {
    fill(0, 120);
    rect(btnX, btnY, btnW, btnH, 12);
  }
  pop();
}

function drawListModal() {
  // 모달 배경
  fill(0, 200);
  rect(0, 0, width, height);

  // 닫기 버튼 (오른쪽 위)
  const closeW = 60;
  const closeH = 36;
  const closeX = width - closeW - 40;
  const closeY = 40;

  // 닫기 버튼 그리기
  push();
  fill(255);
  rect(closeX, closeY, closeW, closeH, 10);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("닫기", closeX + closeW / 2, closeY + closeH / 2);
  pop();

  // 리스트 타이틀 이미지 (정중앙)
  const titleW = width * 0.25;
  const titleH = titleW * (listTitleImg.height / listTitleImg.width);
  const titleX = width / 2 - titleW / 2;
  const titleY = height / 2 - (titleH + 40 + height * 0.45) / 2;
  image(listTitleImg, titleX, titleY, titleW, titleH);

  // 리스트 스크롤 영역 (정중앙)
  const listAreaW = width * 0.5;
  const listAreaH = height * 0.45;
  const listAreaX = width / 2 - listAreaW / 2;
  const listAreaY = titleY + titleH + 40;

  // 배경
  push();
  fill("#FFEBD1");
  stroke("#341C14");
  strokeWeight(3);
  rect(listAreaX, listAreaY, listAreaW, listAreaH, 24);
  noStroke();
  pop();

  // 리스트 내용
  const fragments = currentChapter === 1 ? memoryFragments : chapter2Fragments;
  if (fragments.length === 0) {
    push();
    fill("#341C14");
    textAlign(CENTER, CENTER);
    textSize(24);
    text(
      "아직 찾은 기억 조각이 없어요.\n기억 조각을 찾아보세요",
      listAreaX + listAreaW / 2,
      listAreaY + listAreaH / 2
    );
    pop();
    return;
  }

  // 스크롤 영역 마스킹
  push();
  // 마스킹 영역 설정
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(listAreaX, listAreaY, listAreaW, listAreaH);
  drawingContext.clip();

  // 컴포넌트(카드) 렌더링
  const compMargin = 24;
  const compH = 70;
  let y = listAreaY + compMargin - listScrollY; // 스크롤 위치 반영
  listContentHeight = calcListContentHeight(); // 항상 최신 값 반영

  // 기억조각을 역순으로 그리기 (최신 항목이 아래에)
  for (let i = fragments.length - 1; i >= 0; i--) {
    let compX = listAreaX + compMargin;
    let compW = listAreaW - compMargin * 2;

    // 카드 배경
    push();
    fill("#FFBD65");
    stroke("#FFEBD1");
    strokeWeight(3);
    rect(compX, y, compW, compH, 16);
    noStroke();

    // 텍스트 (위: 주된 내용, 아래: 장소)
    fill("#341C14");
    textAlign(LEFT, CENTER);
    textSize(20);
    text(fragments[i].title, compX + 20, y + compH / 2 - 12);
    textSize(16);
    text(fragments[i].place, compX + 20, y + compH / 2 + 14);
    pop();

    y += compH + compMargin;
  }

  // 마스킹 해제
  drawingContext.restore();
  pop();

  // 스크롤바 그리기 (마스킹 영역 밖에서)
  if (listContentHeight > listAreaH) {
    push();
    const scrollbarW = 8;
    const scrollbarX = listAreaX + listAreaW - scrollbarW - 4;
    const scrollbarH = (listAreaH / listContentHeight) * listAreaH;
    const scrollbarY =
      listAreaY + (listScrollY / listContentHeight) * listAreaH;

    fill(0, 100);
    noStroke();
    rect(scrollbarX, listAreaY, scrollbarW, listAreaH, 4);
    fill(0, 200);
    rect(scrollbarX, scrollbarY, scrollbarW, scrollbarH, 4);
    pop();
  }
}

function drawStatusText() {
  if (!statusText) return;
  textSize(24);
  textAlign(LEFT, TOP);
  let paddingX = 32;
  let paddingY = 18;
  let lines = statusText.split("\n");
  let maxLineWidth = 0;
  for (let line of lines) {
    let w = textWidth(line);
    if (w > maxLineWidth) maxLineWidth = w;
  }
  let boxW = maxLineWidth + paddingX * 2;
  let boxH = lines.length * 32 + paddingY * 2;
  let boxX = 32;
  let boxY = 32;
  // 배경
  fill("#FFEBD1");
  stroke("#341C14");
  strokeWeight(3);
  rect(boxX, boxY, boxW, boxH, 18);
  noStroke();
  // 글자
  fill("#341C14");
  textAlign(LEFT, TOP);
  let y = boxY + paddingY + 3; // 3픽셀 아래로 내림
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], boxX + paddingX, y);
    y += 32;
  }
}

// =====================
// 게임 진행 및 이벤트 함수
// =====================
function mousePressed() {
  // 내레이션 진행: activeNarration이 있으면 즉시 다음으로
  if (activeNarration) {
    activeNarration.active = false;
    return;
  }

  // 샤인 이벤트의 나레이션 스킵
  const shine = shineTriggers?.[currentMap];
  if (shine && shine.triggered && !shine.added && narrationQueue.length > 0) {
    narrationQueue = [];
    activeNarration = null;
    return;
  }

  if (scene === 0) {
    const btnW = width * 0.25;
    const btnH = btnW / startButtonOriginalRatio;
    const btnX = width / 2 - btnW / 2;
    const btnY = height * 0.75;
    if (
      mouseX > btnX &&
      mouseX < btnX + btnW &&
      mouseY > btnY &&
      mouseY < btnY + btnH
    ) {
      scene = 1;
    }
    return;
  }

  if (scene >= 1 && scene <= 4) {
    scene++;
    return;
  }

  if (scene === 5) {
    scene = 6;
    currentMap = "alley";
    girl.pos = createVector(width / 2, height / 2);
    alleyIntroShown = false;
    return;
  }

  if (scene === 6) {
    // 리스트 모달이 열려있을 때 닫기 버튼 클릭 처리
    if (showListModal) {
      const closeW = 60;
      const closeH = 36;
      const closeX = width - closeW - 40;
      const closeY = 40;
      
      if (mouseX > closeX && mouseX < closeX + closeW &&
          mouseY > closeY && mouseY < closeY + closeH) {
        showListModal = false;
        return;
      }
    }

    // 다음 스테이지 버튼 클릭 처리
    if (nextStageButton.visible &&
        mouseX > nextStageButton.x &&
        mouseX < nextStageButton.x + nextStageButton.w &&
        mouseY > nextStageButton.y &&
        mouseY < nextStageButton.y + nextStageButton.h) {
      if (nextStageButtonTimer) {
        clearTimeout(nextStageButtonTimer);
        nextStageButtonTimer = null;
      }
      nextStageButton.clickCount = (nextStageButton.clickCount || 0) + 1;
      if (nextStageButton.clickCount === 1) {
        // 챕터1에서 처음 누르면 챕터2로 이동
        startMapTransition("mansion2", createVector(width / 2, height - MARGIN - 200));
        nextStageButton.visible = false;
        nextStageButton.isRealityButton = true; // 두 번째부터는 현실로 가도록
      }
      return;
    }

    // 리스트 버튼 클릭 처리
    const btnW = width * 0.08;
    const btnH = btnW * (listImg.height / listImg.width);
    const btnX = width - btnW - 32;
    const btnY = 32;

    if (mouseX > btnX && mouseX < btnX + btnW && 
        mouseY > btnY && mouseY < btnY + btnH) {
      
      const fragments = currentChapter === 1 ? memoryFragments : chapter2Fragments;
      
      // 기억 조각 개수와 관계없이 모달 표시
      showListModal = true;
      listButtonShake.active = false; // 흔들림 중지
      
      // 챕터 2에서 3개의 기억 조각이 모였을 때는 마지막 스테이지 버튼 표시
      if (currentChapter === 2 && fragments.length >= 3) {
        lastStageButton.visible = true;
      }
      return;
    }
  }

  if (showListModal) {
    // 리스트 모달이 열려있을 때 스크롤 시작
    const listAreaW = width * 0.5;
    const listAreaH = height * 0.45;
    const listAreaX = width / 2 - listAreaW / 2;
    const listAreaY = height / 2 - (height * 0.45 + 40) / 2 + 40;

    if (mouseX > listAreaX && mouseX < listAreaX + listAreaW &&
        mouseY > listAreaY && mouseY < listAreaY + listAreaH) {
      isDraggingList = true;
      lastMouseY = mouseY;
    }
  }

  // 마지막 스테이지 버튼 클릭 처리
  if (
    lastStageButton.visible &&
    !lastStageButton.permanentlyHidden &&
    mouseX > lastStageButton.x &&
    mouseX < lastStageButton.x + lastStageButton.w &&
    mouseY > lastStageButton.y &&
    mouseY < lastStageButton.y + lastStageButton.h
  ) {
    lastStageButton.visible = false;
    lastStageButton.permanentlyHidden = true; // 버튼을 영구적으로 숨김
    showListModal = false;
    listButtonShake.active = false;  // 리스트 버튼 흔들림 멈춤
    startMapTransition("reality", createVector(width/2, height/2));
    return;
  }

  if (endingPhase === 4 && goToHomeButton.visible) {
    if (mouseX > goToHomeButton.x && 
        mouseX < goToHomeButton.x + goToHomeButton.w &&
        mouseY > goToHomeButton.y && 
        mouseY < goToHomeButton.y + goToHomeButton.h) {
      // 페이지 새로고침
      location.reload();
    }
  }
}

function keyPressed() {
  // 내레이션 스킵은 blockGirlMove와 관계없이 동작하도록 수정
  if (activeNarration && (keyCode === ENTER || key === " ")) {
    // 샤인 애니메이션 중이 아닐 때만 내레이션 스킵
    const shine = shineTriggers?.[currentMap];
    if (!shine || !shine.triggered || shine.added || shineState.phase === "idle") {
      activeNarration.active = false;
    }
    return;
  }

  // 샤인 이벤트의 나레이션 스킵도 blockGirlMove와 관계없이 동작
  const shine = shineTriggers?.[currentMap];
  if (shine && shine.triggered && !shine.added && narrationQueue.length > 0 && (keyCode === ENTER || key === " ")) {
    // 샤인 애니메이션이 fly나 absorb 단계일 때는 나레이션만 스킵
    if (shineState.phase === "fly" || shineState.phase === "absorb") {
      // 기억조각 저장 로직을 먼저 실행
      if (!shine.added) {
        const fragments = currentChapter === 1 ? memoryFragments : chapter2Fragments;
        const exists = fragments.some(fragment => fragment.place === shine.place);
        
        if (!exists) {
          console.log('내레이션 스킵으로 기억조각 추가:', shine.title);
          fragments.push({
            title: shine.title,
            place: shine.place,
          });
          shine.added = true;
          shineState.found = true;
          
          // 리스트 스크롤 위치 업데이트
          listScrollY = Math.max(0, listContentHeight - height * 0.45);
          
          // 챕터별 기억조각 개수에 따라 리스트 버튼 흔들림 시작
          if ((currentChapter === 1 && memoryFragments.length >= 4) || 
              (currentChapter === 2 && chapter2Fragments.length >= 3)) {
            listButtonShake.active = true;
            listButtonShake.startTime = millis();
          }
        }
      }

      // 내레이션 상태 업데이트
      narrationQueue = [];
      activeNarration = null;
      shine.narrationComplete = true;
      console.log('내레이션 스킵으로 인한 상태 업데이트:', {
        triggered: shine.triggered,
        added: shine.added,
        narrationComplete: shine.narrationComplete
      });

      // 현실 맵에서 내레이션 스킵 시 엔딩 시퀀스 시작
      if (currentMap === "reality" && realityEntrySpoken && !showEndingText) {
        console.log('현실 맵 내레이션 스킵으로 엔딩 시퀀스 시작');
        showEndingText = true;
        endingPhase = 1;
        endingStartTime = millis();
      }
    }
    return;
  }

  // 프롤로그(1~5)에서 엔터/스페이스로 바로 다음 장면으로
  if (scene >= 1 && scene <= 5 && (keyCode === ENTER || key === " ")) {
    scene++;
    // scene이 6이 되면 alley 진입 초기화(mousePressed와 동일하게)
    if (scene === 6) {
      currentMap = "alley";
      girl.pos = createVector(width / 2, height / 2);
      alleyIntroShown = false;
      // alleyIntroStep도 0으로 초기화(내레이션 정상 동작 보장)
      alleyIntroStep = 0;
    }
    return;
  }

  // 캐릭터 이동은 blockGirlMove가 true일 때 막힘
  if (blockGirlMove) return;
}

function keyReleased() {
  if (blockGirlMove) return;
  // 방향키에서 손을 뗄 때 걷기 소리 즉시 멈춤
  if (
    keyCode === LEFT_ARROW ||
    keyCode === RIGHT_ARROW ||
    keyCode === UP_ARROW ||
    keyCode === DOWN_ARROW
  ) {
    if (walkingSound && walkingSound.isPlaying()) {
      walkingSound.stop();
    }
  }
}

function handlePrologue() {
  let texts = [
    "엄마와 다투고, 막말을 했다. \n나는 혼자 거실에 앉아 있었다.",
    "감정이 북받쳐\n엄마가 준 목걸이를 힘껏 던졌다.",
    "다시 주우려 손을 댄 순간—",
    "지이이잉!!\n땅이 흔들리기 시작했다!",
    "정신을 차려보니,\n나는 낯선 골목에 와 있었다.",
  ];
  push();
  if (scene === 4) {
    let shakeX = random(-10, 10);
    let shakeY = random(-10, 10);
    translate(shakeX, shakeY);
  }
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(texts[scene - 1], width / 2, height / 2);
  pop();
}

function handleAlleyIntro() {
  if (alleyIntroStep === 0) {
    narrationQueue.push(
      new Narration(
        "으어... 여기가 어디지?\n맞다, 아까 엄마가 준 목걸이를 집어던졌지. ",
        2000
      )
    );
    alleyIntroStep++;
  } else if (
    alleyIntroStep === 1 &&
    !activeNarration &&
    narrationQueue.length === 0
  ) {
    narrationQueue.push(
      new Narration(
        "왜 그 이후가 기억이 안나지?\n우선 휴대폰을 봐야겠다.",
        2500
      )
    );
    alleyIntroStep++;
  } else if (
    alleyIntroStep === 2 &&
    !activeNarration &&
    narrationQueue.length === 0
  ) {
    isJumping = true;
    jumpVelocity = -10;
    jumpOnce = true;
    alleyIntroStep++;
  } else if (
    alleyIntroStep === 3 &&
    !activeNarration &&
    narrationQueue.length === 0 &&
    !isJumping
  ) {
    narrationQueue.push(
      new Narration(
        "휴대폰이 안돼... 날짜만 뜨네?\n1982년 3월 26일? 나 설마 과거로 온거야?",
        3000
      )
    );
    alleyIntroStep++;
  } else if (
    alleyIntroStep === 4 &&
    !activeNarration &&
    narrationQueue.length === 0
  ) {
    narrationQueue.push(
      new Narration(
        "침착하자. 방법만 찾는다면 집으로 돌아갈 수 있을 거야.",
        3000
      )
    );
    alleyIntroStep++;
  } else if (
    alleyIntroStep === 5 &&
    !activeNarration &&
    narrationQueue.length === 0
  ) {
    narrationQueue.push(
      new Narration("엄마가 준 목걸이를 주웠을 때 여기로 왔잖아.", 3000)
    );
    alleyIntroStep++;
  } else if (
    alleyIntroStep === 6 &&
    !activeNarration &&
    narrationQueue.length === 0
  ) {
    narrationQueue.push(
      new Narration(
        "잠깐, 목걸이 뒷면에 뭐가 써져 있어. \n'아이의 기억 조각을 모으면 과거에서 현실로 돌아갈 수 있을 거야.'",
        3800
      )
    );
    alleyIntroStep++;
  } else if (
    alleyIntroStep === 7 &&
    !activeNarration &&
    narrationQueue.length === 0
  ) {
    narrationQueue.push(
      new Narration("누군가의 기억을 찾아야 집에 돌아갈 수 있다는 뜻...?", 3000)
    );
    alleyIntroStep++;
  } else if (
    alleyIntroStep === 8 &&
    !activeNarration &&
    narrationQueue.length === 0
  ) {
    narrationQueue.push(
      new Narration(
        "우선 이곳을 돌아다니며 기억 조각을 찾아보자.",
        3000
      )
    );
    alleyIntroStep++;
  } else if (
    alleyIntroStep === 9 &&
    !activeNarration &&
    narrationQueue.length === 0
  ) {
    lookingAround = true;
    lookAroundTimer = millis();
    lookAroundCount = 0;
    alleyIntroStep++;
    if (currentBgm && currentBgm.isPlaying()) {
      currentBgm.stop();
      currentBgm = null;
    }
  } else if (alleyIntroStep === 10) {
    if (!lookingAround) {
      lookingAround = true;
      lookAroundStartTime = millis();
      lookAroundPhase = 0;
    }
    const elapsed = millis() - lookAroundStartTime;
    if (lookAroundPhase === 0) {
      girl.direction = "back";
      girl.frameToggle = false;
      if (elapsed > lookAroundDuration) {
        lookAroundPhase = 1;
        lookAroundStartTime = millis();
      }
    } else if (lookAroundPhase === 1) {
      if (elapsed > lookPauseDuration) {
        lookAroundPhase = 2;
        lookAroundStartTime = millis();
      }
    } else if (lookAroundPhase === 2) {
      girl.direction = "front";
      girl.frameToggle = false;
      if (elapsed > lookAroundDuration) {
        lookingAround = false;
        alleyIntroStep++;
        narrationQueue.push(
          new Narration(
            "그런데 이 거리... 엄청 익숙하네?\n 예쁜 것 같기도 하고...",
            3000
          )
        );
      }
    }
  } else if (
    alleyIntroStep === 11 &&
    !activeNarration &&
    narrationQueue.length === 0
  ) {
    narrationQueue.push(new Narration("조금 돌아다녀볼까?", 3000));
    if (!alleyMusicSwitched) {
      currentBgm = memories1Sound;
      currentBgm.setLoop(true);
      currentBgm.setVolume(0.5);
      currentBgm.play();
      alleyMusicSwitched = true;
    }
    alleyIntroStep++;
  }

  if (
    alleyIntroStep >= 9 &&
    !activeNarration &&
    narrationQueue.length === 0 &&
    !alleyMusicSwitched
  ) {
    if (currentBgm && currentBgm.isPlaying()) currentBgm.stop();
    currentBgm = memories1Sound;
    currentBgm.setLoop(true);
    currentBgm.setVolume(0.5);
    currentBgm.play();
    alleyMusicSwitched = true;
  }
}

// =====================
// 맵 이동 및 충돌 함수
// =====================
function isInsideAlleyTrap(x, y) {
  if (currentMap !== "alley") return true;
  const bgW = 158.6875,
    bgH = 85.75,
    trapW = 115.15625,
    trapH = 40.8125;
  const topLeft = { x: (bgW - trapW) / 2, y: (bgH - trapH) / 2 };
  const topRight = { x: topLeft.x + trapW, y: topLeft.y };
  const bottomLeft = { x: 0, y: bgH };
  const bottomRight = { x: bgW, y: bgH };
  const scaleX = drawW / bgW,
    scaleY = drawH / bgH,
    offsetX = bgOffsetX,
    offsetY = bgOffsetY;
  function scalePoint(p) {
    return { x: p.x * scaleX + offsetX, y: p.y * scaleY + offsetY };
  }
  const A = scalePoint(topLeft),
    B = scalePoint(topRight),
    C = scalePoint(bottomRight),
    D = scalePoint(bottomLeft);
  return isPointInTrapezoid({ x, y }, A, B, C, D);
}
function isPointInTrapezoid(P, A, B, C, D) {
  function cross(p1, p2, p3) {
    return (p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y);
  }
  return (
    cross(A, B, P) * cross(C, D, P) >= 0 && cross(B, C, P) * cross(D, A, P) >= 0
  );
}

function updateMapLogic() {
  if (currentMap !== lastEnteredMap) {
    lastEnteredMap = currentMap;
    mapEntryTime = millis();
  }

  const marginX = width * (MARGIN / BASE_WIDTH);
  const marginY = height * (MARGIN / BASE_HEIGHT);
  let minY = 0, maxY = height;

  const mapYBoundaries = {
    alley: { min: MARGIN - 50, max: height - MARGIN },
    schoolEntrance: { min: MARGIN + 120, max: height - MARGIN },
    schoolInterior: { min: MARGIN, max: height - MARGIN },
    library: { min: 0, max: height - MARGIN },
    class1: { min: 0, max: height },
    schoolyard: { min: 0, max: height },
    mansion: { min: MARGIN + 230, max: height - MARGIN - 20 },
    mansionInterior: { min: 0, max: height - MARGIN },
    momsRoom: { min: 0, max: height }
  };

  if (mapYBoundaries[currentMap]) {
    minY = mapYBoundaries[currentMap].min;
    maxY = mapYBoundaries[currentMap].max;
  }

  // 기억조각 추가 로직 제거 (handleShineInteraction에서만 처리)
  const shine = shineTriggers?.[currentMap];
  if (shine && shine.triggered && !shine.added && narrationQueue.length === 0) {
    // 챕터2에서 3개 모았을 때 리스트 버튼 흔들림 시작만 처리
    if (chapterMaps[2].includes(currentMap) && chapter2Fragments.length >= 3) {
      startListButtonShake();
    }
  }

  // 지도별 로직 처리
  switch (currentMap) {
    case "alley":
      handleAlleyIntro();
      statusText = "과거의 낯선 골목. 위쪽: 국민학교, 오른쪽: 누군가의 집";
      if (girl.pos.y > height - marginY) {
        girl.pos.y = height - marginY;
        if (!activeNarration && narrationQueue.length === 0)
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
      } else if (girl.pos.y < marginY + height * (80 / BASE_HEIGHT) + 30) {
        startMapTransition("schoolEntrance", createVector(width / 2, height - marginY - 200));
      } else if (girl.pos.x > width - marginX - width * (100 / BASE_WIDTH)) {
        startMapTransition("mansion", createVector(marginX + 350, girl.pos.y));
      }
      // 왼쪽 30% 미만 제한
      if (girl.pos.x < width * 0.3) {
        girl.pos.x = width * 0.3;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      // 아래쪽 30%를 제외한 오른쪽 30% 제한 → 위쪽 70%에서만 오른쪽 30% 제한
      if (girl.pos.y <= height * 0.45 && girl.pos.x > width * 0.7) {
        girl.pos.x = width * 0.7;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      break;

    case "schoolEntrance":
      statusText = "국민학교 입구. 위쪽: 학교 내부, 아래쪽: 골목, 왼쪽: 운동장";
      if (!schoolEntranceEntrySpoken) {
        schoolEntranceEntrySpoken = true;
        queueNarrationChain([
          { text: "와 여기 진짜 고풍스러운 학교다.", duration: 2000 },
          { text: "국민학교라고 적혀있어. 응..? 국민학교?", duration: 3000 },
          { text: "초등학교가 아니라 국민학교라고? 여기 진짜 과거구나!", duration: 3000 },
          { text: "왼쪽으로 가면 운동장인가? 위로 가면 학교 내부?", duration: 3000 }
        ]);
      }
      if (girl.pos.x < marginX) {
        startMapTransition("schoolyard", createVector(width - marginX, girl.pos.y));
      } else if (girl.pos.x > width - marginX) {
        girl.pos.x = width - marginX;
        if (!activeNarration && narrationQueue.length === 0)
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
      } else if (girl.pos.y > height - marginY) {
        startMapTransition("alley", createVector(width / 2, marginY + 170));
      } else if (girl.pos.y < marginY + height * (250 / BASE_HEIGHT) && girl.pos.x > width * 0.35 && girl.pos.x < width * 0.65) {
        startMapTransition("schoolInterior", createVector(width / 2, height - marginY - 200));
      } else if (girl.pos.y < height / 2 - height * (220 / BASE_HEIGHT) + 200 && (girl.pos.x < width * 0.35 || girl.pos.x > width * 0.65)) {
        girl.pos.y = height / 2 - height * (220 / BASE_HEIGHT) + 200;
        girl.pos = girl.prevPos.copy();
        if (!activeNarration && narrationQueue.length === 0)
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
      } else {
        girl.prevPos = girl.pos.copy();
      }
      break;

    case "schoolInterior":
      statusText = "국민학교 내부. 위쪽: 도서관, 아래쪽: 국민학교 입구, 오른쪽: 1학년 1반";
      if (!schoolInteriorEntrySpoken) {
        schoolInteriorEntrySpoken = true;
        queueNarrationChain([
          { text: "안에도 참 고풍스럽네...", duration: 2000 },
          { text: "우리 부모님이 다녔을 법해.", duration: 2000 },
          { text: "하긴, 1980년대니까.", duration: 2500 },
          { text: "둘러보며 정보를 좀 더 찾아봐야겠다. 오른쪽이 교실, 위쪽은 도서관인 거 같아.", duration: 2500 }
        ]);
      }
      if (girl.pos.y < marginY) {
        startMapTransition("library", createVector(width / 2, height - marginY));
      } else if (girl.pos.y > height - marginY) {
        startMapTransition("schoolEntrance", createVector(width / 2, marginY + height * (330 / BASE_HEIGHT)));
      } else if (girl.pos.x > width - marginX) {
        startMapTransition("class1", createVector(marginX+30, girl.pos.y));
      }
      break;

    case "class1":
      statusText = "1학년 1반 교실. 왼쪽: 국민학교 내부";
      if (!class1EntrySpoken) {
        class1EntrySpoken = true;
        queueNarrationChain([
          { text: "와 여기 정말 귀엽다.", duration: 2000 },
          { text: "한국 지도도 있고 칠판이 초록색이잖아!", duration: 2500 },
          { text: "안에 좀 더 둘러볼까?", duration: 2000 }
        ]);
      }
      if (girl.pos.x < marginX) {
        startMapTransition("schoolInterior", createVector(width - marginX-80, girl.pos.y));
      }
      // 위쪽 30% 이상으로 이동 시 제한
      if (girl.pos.y < height * 0.3) {
        girl.pos.y = height * 0.3;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      break;

    case "library":
      statusText = "도서관. 아래쪽: 국민학교 내부";
      if (!libraryEntrySpoken) {
        libraryEntrySpoken = true;
        queueNarrationChain([
          { text: "여기 도서관 냄새 되게 좋다.\n만화책방 냄새 나.", duration: 3000 },
          { text: "어? 저기 빛나는게 보이네?\n저건 뭐지?", duration: 3000 }
        ]);
      }
      if (girl.pos.y > height - marginY) {
        startMapTransition("schoolInterior", createVector(width / 2, marginY + height * (100 / BASE_HEIGHT)));
      }
      // 위쪽 40% 이상으로 이동 시 제한
      if (girl.pos.y < height * 0.4) {
        girl.pos.y = height * 0.4;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      // 왼쪽 30% 미만 접근 제한
      if (girl.pos.x < width * 0.3) {
        girl.pos.x = width * 0.3;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      // 오른쪽 70% 초과 접근 제한
      if (girl.pos.x > width * 0.7) {
        girl.pos.x = width * 0.7;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      break;

    case "schoolyard":
      statusText = "운동장. 오른쪽: 국민학교 입구";
      if (girl.pos.x > width - marginX) {
        startMapTransition("schoolEntrance", createVector(marginX, girl.pos.y));
      }
      const inCapsuleZone =
        girl.pos.x > width / 2 - width * (50 / BASE_WIDTH) &&
        girl.pos.x < width / 2 + width * (50 / BASE_WIDTH) &&
        girl.pos.y > height / 2 - height * (50 / BASE_HEIGHT) &&
        girl.pos.y < height / 2 + height * (50 / BASE_HEIGHT);
if (timeCapsuleEvent && !timeCapsuleEvent.triggered && inCapsuleZone) {
  timeCapsuleEvent.tryTrigger(true);
}

      break;

    case "mansion":
      statusText = "저택 입구. 위쪽: 저택 내부, 왼쪽: 낯선 골목";
      if (!mansionEntrySpoken) {
        mansionEntrySpoken = true;
        queueNarrationChain([
          { text: "아무도 안계세요?", duration: 2000 },
          { text: "흠... 아무도 없나보네. 그나저나 참 정감가는 정원이다.", duration: 3000 }
        ]);
      }
      if (girl.pos.x < marginX + 350) {
        startMapTransition("alley", createVector(width - marginX - width * (200 / BASE_WIDTH), girl.pos.y));
      } else if (girl.pos.y < height / 2 - 200) {
        startMapTransition("mansionInterior", createVector(width / 2, height - marginY - height * (50 / BASE_HEIGHT)));
      } else if (girl.pos.y > maxY) {
        girl.pos.y = maxY;
        if (!activeNarration && narrationQueue.length === 0)
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
      }
      break;

    case "mansionInterior":
      statusText = "저택 내부. 아래쪽: 저택 입구, 왼쪽: 누군가의 방";
      if (!mansionInteriorEntrySpoken) {
        mansionInteriorEntrySpoken = true;
        queueNarrationChain([
          { text: "이 집 열려있잖아? 지금 예의를 차릴 때가 아니야. 잠깐만 둘러보자.", duration: 3000 },
          { text: "왜 이렇게 더럽지... 설마 폐가?! 아닌데... 흔적이 있긴 한데...", duration: 3500 },
          { text: "왼쪽에 문이 보이네... 내가 찾는 그 아이의 방 같은데?", duration: 3000 },
        ]);
      }
      // 오른쪽 70% 초과 이동 제한
      if (girl.pos.x > width * 0.7) {
        girl.pos.x = width * 0.7;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      // 활동 범위를 아래쪽 40%로 제한
      const restrictedY = height * 0.4; // 화면 높이의 40% 지점
      if (girl.pos.y < restrictedY) {
        girl.pos.y = restrictedY;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      if (girl.pos.y > height - marginY) {
        startMapTransition("mansion", createVector(width / 2, marginY + height * (300 / BASE_HEIGHT)));
      } else if (girl.pos.x < marginX) {
        startMapTransition("momsRoom", createVector(width - marginX, girl.pos.y));
      }
      break;

    case "momsRoom":
      statusText = "아이의 방. 오른쪽: 저택 내부";
      if (!momsRoomEntrySpoken) {
        narrationQueue.push(new Narration("여긴 그 아이의 방이야.\n방이 엄청 더럽네?", 3000));
        momsRoomEntrySpoken = true;
      }
      // 오른쪽 바깥(저택 내부로 이동)
      if (girl.pos.x > width - marginX) {
        startMapTransition("mansionInterior", createVector(marginX, girl.pos.y-30));
      }
      // 왼쪽 바깥
      if (girl.pos.x < 0) {
        girl.pos.x = 0;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      // 위쪽 60% 이상으로 이동 시 제한
      if (girl.pos.y < height * 0.4) {
        girl.pos.y = height * 0.4;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      // 아래 바깥
      if (girl.pos.y > maxY) {
        girl.pos.y = maxY;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      break;

    case "mansion2":
      statusText = "저택 외부. 위쪽: 저택 내부";
      
      if (!mansion2EntrySpoken) {
        mansion2EntrySpoken = true;
        queueNarrationChain([
          { text: "기억 조각을 모으면 집에 보내준다며.. \n왜 또 이 집으로 돌아온 거야?", duration: 3000 },
          { text: "기억 조각을 더 많이 모아야 하나?", duration: 4000 },
          { text: "근데, 이 집 왜 변했지? 계절도 바뀐 것 같아.", duration: 2000 },
          { text: "설마 그새 또 다른 시대로 이동한 거 아니야?", duration: 4000 },
          { text: "휴대폰을 확인해보자!", duration: 2000 },
          { text: "헉, 지금이 1998년이라고? 내가 태어나기 1년 전이잖아?", duration: 4000 }
        ]);
      }
      
      // 좌우 이동 제한
      if (girl.pos.x < MARGIN) girl.pos.x = MARGIN;
      if (girl.pos.x > width - MARGIN) girl.pos.x = width - MARGIN;
      
      // 상단 이동 시 메시지 표시
      if (girl.pos.y < height * 0.4) {
        startMapTransition("inTheMansion2", createVector(width / 2, height - MARGIN - 100));
        return;
      }
      
      // 하단 이동 제한
      if (girl.pos.y > height - MARGIN) {
        girl.pos.y = height - MARGIN;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      break;

    case "inTheMansion2":
      statusText = "저택 내부. 왼쪽: 어른이 된 아이의 방, 오른쪽: 거실";
      // 좌우 이동 제한
      if (girl.pos.x < MARGIN) {
        startMapTransition("momsRoom2", createVector(width - MARGIN - 100, height - MARGIN - 100));
        return;
      }
      if (girl.pos.x > width - MARGIN) {
        startMapTransition("livingRoom", createVector(MARGIN + 100, height - MARGIN - 100));
        return;
      }
      // 상하 이동 제한 (하단 60%만 이동 가능)
      if (girl.pos.y < height * 0.4) {
        girl.pos.y = height * 0.4;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      if (girl.pos.y > height - MARGIN) girl.pos.y = height - MARGIN;
      break;

    case "livingRoom":
      statusText = "거실. 왼쪽: 저택 내부";
      // 좌우 이동 제한
      if (girl.pos.x < MARGIN) {
        startMapTransition("inTheMansion2", createVector(width - MARGIN - 100, height - MARGIN - 100));
        return;
      }
      if (girl.pos.x > width - MARGIN) girl.pos.x = width - MARGIN;
      // 상하 이동 제한 (하단 60%만 이동 가능)
      if (girl.pos.y < height * 0.4) {
        girl.pos.y = height * 0.4;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      if (girl.pos.y > height - MARGIN) girl.pos.y = height - MARGIN;
      break;

    case "momsRoom2":
      statusText = "어른이 된 아이의 방. 오른쪽: 저택 내부";
      // 오른쪽 바깥(저택 내부로 이동)
      if (girl.pos.x > width - MARGIN) {
        startMapTransition("inTheMansion2", createVector(MARGIN + 100, height - MARGIN - 100));
        return;
      }
      // 왼쪽 바깥
      if (girl.pos.x < MARGIN) {
        girl.pos.x = MARGIN;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      // 위쪽 60% 이상으로 이동 시 제한
      if (girl.pos.y < height * 0.4) {
        girl.pos.y = height * 0.4;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      // 아래 바깥
      if (girl.pos.y > height - MARGIN) {
        girl.pos.y = height - MARGIN;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      break;

    case "reality":
      // 현실 맵에서는 좌우 이동 제한을 마진으로만 설정
      if (girl.pos.x < MARGIN) {
        girl.pos.x = MARGIN;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      if (girl.pos.x > width - MARGIN) {
        girl.pos.x = width - MARGIN;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      // 상하 이동 제한도 마진으로만 설정
      if (girl.pos.y < MARGIN) {
        girl.pos.y = MARGIN;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      if (girl.pos.y > height - MARGIN) {
        girl.pos.y = height - MARGIN;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
        }
      }
      statusText = "현실. 엄마의 흔적이 남아있는 집";
      if (!realityEntrySpoken) {
        queueNarrationChain([
          { text: "뭐야! 정말 기억 조각을 모았더니 우리 집으로 돌아왔어.", duration: 3000 },
          { text: "저기 엄마가 휴대폰을 두고 갔네...", duration: 2500 },
          { text: "엄마 어디 갔지? 보고싶다...", duration: 3000 }
        ]);
        realityEntrySpoken = true;
      }

      // 마지막 샤인 나레이션이 모두 끝났고, 현실 맵의 샤인이 트리거되었을 때만 엔딩 시퀀스 시작
      const shine = shineTriggers[currentMap];
      if (realityEntrySpoken && 
          !activeNarration && 
          narrationQueue.length === 0 && 
          !showEndingText && 
          shine && 
          shine.triggered && 
          shine.added ) {
        console.log('엔딩 시퀀스 시작 조건 충족:', {
          realityEntrySpoken,
          activeNarration: !!activeNarration,
          narrationQueueLength: narrationQueue.length,
          showEndingText,
          shineTriggered: shine.triggered,
          shineAdded: shine.added,
          shineNarrationComplete: shine.narrationComplete
        });
        showEndingText = true;
        showListModal = false;
        lastStageButton.visible = false;
        lastStageButton.permanentlyHidden = true; // 엔딩 시작 시 버튼을 영구적으로 숨김
        endingPhase = 1;
        endingStartTime = millis();
      } else if (shine && !showEndingText) {
        console.log('엔딩 시퀀스 시작 조건 미충족:', {
          realityEntrySpoken,
          activeNarration: !!activeNarration,
          narrationQueueLength: narrationQueue.length,
          showEndingText,
          shineTriggered: shine.triggered,
          shineAdded: shine.added,
          shineNarrationComplete: shine.narrationComplete
        });
      }

      // 바운더리 이동 제한 및 나레이션
      if (girl.pos.x < MARGIN) {
        girl.pos.x = MARGIN;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("지금은 거실에서 나갈 수 없어."));
        }
      }
      if (girl.pos.x > width - MARGIN) {
        girl.pos.x = width - MARGIN;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("지금은 거실에서 나갈 수 없어."));
        }
      }
      if (girl.pos.y < MARGIN) {
        girl.pos.y = MARGIN;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("지금은 거실에서 나갈 수 없어."));
        }
      }
      if (girl.pos.y > height - MARGIN) {
        girl.pos.y = height - MARGIN;
        if (!activeNarration && narrationQueue.length === 0) {
          narrationQueue.push(new Narration("지금은 거실에서 나갈 수 없어."));
        }
      }
      break;
  }

  // 맵 간 효과음 처리
  const sfxMapTransitions = [
    ["schoolEntrance", "schoolInterior"],
    ["schoolInterior", "library"],
    ["mansion", "mansionInterior"],
    ["momsRoom", "mansionInterior"],  // 콤마 추가
    ["mansion2", "inTheMansion2"],
    ["inTheMansion2", "livingRoom"],
    ["inTheMansion2", "momsRoom2"]
  ];

  for (const [from, to] of sfxMapTransitions) {
    if (currentMap === from && lastEnteredMap === to)
      playRoomOpenOnce(from);
    if (currentMap === to && lastEnteredMap === from)
      playRoomOpenOnce(to);
  }

  // 교실 출입은 미닫이문 소리로 처리
  if (
    (currentMap === "class1" && lastEnteredMap === "schoolInterior") ||
    (currentMap === "schoolInterior" && lastEnteredMap === "class1")
  ) {
    playSlideDoorOnce("class1");
  }

  // 맵에 따라 챕터 상태 업데이트
  if (chapterMaps[1].includes(currentMap)) {
    if (currentChapter !== 1) {
      currentChapter = 1;
      // 챕터 1 음악으로 전환
      if (memories2Sound.isPlaying()) {
        memories2Sound.stop();
      }
      if (!memories1Sound.isPlaying()) {
        memories1Sound.setLoop(true);
        memories1Sound.setVolume(0.5);
        memories1Sound.play();
      }
    }
  } else if (chapterMaps[2].includes(currentMap)) {
    if (currentChapter !== 2) {
      currentChapter = 2;
      // 챕터 2 음악으로 전환
      if (memories1Sound.isPlaying()) {
        memories1Sound.stop();
      }
      if (!memories2Sound.isPlaying()) {
        memories2Sound.setLoop(true);
        memories2Sound.setVolume(0.5);
        memories2Sound.play(0, 1, 1, 5);
      }
    }
  }
}

function queueNarrationChain(textArray) {
  for (let i = 0; i < textArray.length; i++) {
    narrationQueue.push(
      new Narration(
        textArray[i].text,
        textArray[i].duration,
        true,
        textArray[i].type || "dialogue" // type이 지정되지 않은 경우 기본값은 "dialogue"
      )
    );
  }
}

function playRoomOpenOnce(mapName) {
  if (lastRoomOpenPlayedMap !== mapName) {
    console.log("문 소리 재생:", mapName);
    roomOpenSound.play();
    lastRoomOpenPlayedMap = mapName;
  }
}

function playSlideDoorOnce(mapName) {
  if (lastSlideDoorPlayedMap !== mapName) {
    console.log("미닫이문 소리 재생:", mapName);
    slideDoorSound.play();
    lastSlideDoorPlayedMap = mapName;
  }
}

// 맵 이동을 위한 함수 추가
function startMapTransition(newMap, newPos) {
  if (!isFading) {
    isFading = true;
    fadeStartTime = millis();
    fadeAlpha = 0;
    nextMap = newMap;
    nextPos = newPos;

    // 맵 전환 시 문 소리 재생
    if (currentMap && newMap) {
      // 일반 문 소리가 필요한 맵 전환
      const roomDoorTransitions = [
        ["schoolEntrance", "schoolInterior"],
        ["schoolInterior", "library"],
        ["mansion", "mansionInterior"],
        ["momsRoom", "mansionInterior"],
        ["mansion2", "inTheMansion2"],
        ["inTheMansion2", "livingRoom"],
        ["inTheMansion2", "momsRoom2"]
      ];
      
      // 미닫이문 소리가 필요한 맵 전환
      const slideDoorTransitions = [
        ["class1", "schoolInterior"],
        ["schoolInterior", "class1"]
      ];

      // 일반 문 소리 체크
      for (const [from, to] of roomDoorTransitions) {
        if ((currentMap === from && newMap === to) || (currentMap === to && newMap === from)) {
          playRoomOpenOnce(currentMap);
          break;
        }
      }

      // 미닫이문 소리 체크
      for (const [from, to] of slideDoorTransitions) {
        if ((currentMap === from && newMap === to) || (currentMap === to && newMap === from)) {
          playSlideDoorOnce(currentMap);
          break;
        }
      }
    }

    // 챕터2 진입 또는 현실 맵 진입 시 버튼 숨김
    if (newMap === "mansion2" || newMap === "reality") {
      nextStageButton.visible = false;
      lastStageButton.visible = false;
      // 현실 맵으로 이동할 때 리스트 버튼 흔들림 멈춤
      if (newMap === "reality") {
        listButtonShake.active = false;
      }
    }

    // shine 상태 초기화 (found 상태는 유지)
    if (shineTriggers[newMap]) {
      let wasFound = shineState.found;
      let wasTriggered = shineTriggers[newMap].triggered;
      let wasAdded = shineTriggers[newMap].added;

      shineState = {
        found: wasFound,
        animating: false,
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        t: 0,
        targetX: 0,
        targetY: 0,
        phase: "idle",
        flyStartX: 0,
        flyStartY: 0,
        flyTargetX: 0,
        flyTargetY: 0,
        flyProgress: 0,
        collectStartTime: null,
        animStartTime: null,
        scale: 1,
        alpha: 255
      };

      // 맵 전환 시 triggered와 added 상태 유지
      shineTriggers[newMap].triggered = wasTriggered;
      shineTriggers[newMap].added = wasAdded;
    }
  }
}

// easeInOutQuad 함수 추가 (부드러운 애니메이션을 위한 이징 함수)
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// 리스트 버튼 깜빡임 효과를 위한 변수 추가
let listButtonFlash = false;
let listButtonFlashStart = 0;

function drawShine() {
  const trigger = shineTriggers[currentMap];
  if (!trigger || !trigger.triggered || shineState.found) return;

  const baseW = width * 0.09;
  const scale = baseW / shineImg.width;
  const shineW = shineImg.width * scale;
  const shineH = shineImg.height * scale;
  const shineX = width * trigger.x - shineW / 2;
  const shineY = height * trigger.y - shineH / 2;

  if (shineState.phase === "collect") {
    shineState.x = shineX;
    shineState.y = shineY;
    shineState.w = shineW;
    shineState.h = shineH;

    if (!shineState.collectStartTime) {
      shineState.collectStartTime = millis();
    }

    const elapsed = millis() - shineState.collectStartTime;
  }

  if (elapsed > 1000) {
    shineState.flyStartX = shineX;
    shineState.flyStartY = shineY;
    shineState.flyTargetX = width - 80;
    shineState.flyTargetY = 80;
    shineState.phase = "fly";
    shineState.flyProgress = 0;
    shineState.collectStartTime = null;

    const t = millis() / 1000;
    const alpha = 200 + 55 * sin(t * 2.0);
    push();
    tint(255, alpha);
    image(shineImg, shineX, shineY, shineW, shineH);
    pop();
  }

  if (shineState.phase === "fly") {
    shineState.flyProgress += 0.02;
    const p = constrain(shineState.flyProgress, 0, 1);
    const x = lerp(shineState.flyStartX, shineState.flyTargetX, p);
    const y = lerp(shineState.flyStartY, shineState.flyTargetY, p);
    const alpha = 255 * (1 - p);

    push();
    tint(255, alpha);
    image(shineImg, x, y, shineState.w, shineState.h);
    pop();

    if (p >= 1) {
      shineState.phase = "absorb";
      shineState.animating = true;
      shineState.animStartTime = millis();
    }
  } else if (shineState.phase === "idle") {
    const t = millis() / 1000;
    const alpha = 180 + 75 * sin(t * 2.2);
    const bounce = 18 * sin(t * 2.0);
    push();
    tint(255, alpha);
    image(shineImg, shineX, shineY + bounce, shineW, shineH);
    pop();
  } else if (shineState.phase === "absorb") {
    const elapsed = millis() - shineState.animStartTime;
    const duration = 600;
    const p = constrain(elapsed / duration, 0, 1);
    const scale = 1 + p * 1.5;
    const alpha = 255 * (1 - p);
    const x = shineState.flyTargetX;
    const y = shineState.flyTargetY;

    push();
    translate(x, y);
    scale(scale);
    tint(255, alpha);
    imageMode(CENTER);
    image(shineImg, 0, 0, shineState.w, shineState.h);
    pop();

    if (p >= 1) {
      shineState.animating = false;
      shineState.phase = "idle";
    }
  }
}

function resetShineState() {
  shineState.found = false;
  shineState.animating = false;
  shineState.phase = "idle";
  shineState.collectStartTime = null;
  shineState.flyProgress = 0;
}

// 전역 변수 추가
let momsRoom2EntrySpoken = false;
let realityEntrySpoken = false;

// 전역 변수 추가
let showEndingText = false;
let endingTextStartTime = 0;
let endingTextDuration = 5000; // 5초 동안 표시

// 현실 세계에서 엔딩 텍스트 표시 시작
function startEndingText() {
  showEndingText = true;
  endingPhase = 1;
  endingStartTime = millis();
}

let mansion2EntrySpoken = false;  // 전역 변수로 추가

function mouseReleased() {
  isDraggingList = false;
}

function mouseDragged() {
  if (isDraggingList && showListModal) {
    const deltaY = mouseY - lastMouseY;
    listScrollY = constrain(listScrollY - deltaY, 0, Math.max(0, listContentHeight - height * 0.45));
    lastMouseY = mouseY;
  }
}

// 전역 변수에 다음 스테이지 버튼 타이머 추가
let nextStageButtonTimer = null;

// 전역 변수에 현실 배경 관련 변수 추가
let realityShineTriggered = false;
let realityNarrationShown = false;

// 리스트 전체 높이 계산 함수 추가
function calcListContentHeight() {
  const fragments = currentChapter === 1 ? memoryFragments : chapter2Fragments;
  if (fragments.length === 0) return 0;
  const compMargin = 24;
  const compH = 70;
  return (compH + compMargin) * fragments.length + compMargin;
}

// 리스트 버튼 흔들림 효과를 시작하는 함수 정의
function startListButtonShake() {
  listButtonShake.active = true;
  listButtonShake.startTime = millis();
}

// 전역 변수에 마지막 스테이지 버튼 추가
let lastStageButton = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  visible: false,
  hover: false,
  permanentlyHidden: false // 버튼이 영구적으로 숨겨졌는지 여부
};

// p5.js 마우스 휠 스크롤 이벤트 함수 추가
function mouseWheel(event) {
  if (showListModal) {
    listScrollY = constrain(
      listScrollY + event.delta,
      0,
      Math.max(0, listContentHeight - height * 0.45)
    );
    return false;
  }
}

// ShineEffect 클래스 정의 (샤인 획득 애니메이션 효과)
class ShineEffect {
  constructor(x, y, w, h, onComplete) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.onComplete = onComplete;
    this.startTime = millis();
    this.duration = 1200;
    this.active = true;
  }
  update() {
    const elapsed = millis() - this.startTime;
    if (elapsed > this.duration) {
      this.active = false;
      if (this.onComplete) this.onComplete();
    }
  }
  draw() {
    const elapsed = millis() - this.startTime;
    const p = constrain(elapsed / this.duration, 0, 1);
    const alpha = lerp(255, 0, p);
    push();
    fill(255, 255, 0, alpha);
    noStroke();
    ellipse(this.x, this.y, this.w * (1 + 0.2 * p), this.h * (1 + 0.2 * p));
    pop();
  }
}

// 전역 변수 선언부에 추가
let endingPhase = 0; // 0: 시작 전, 1: 엔딩 텍스트, 2: 노크 소리, 3: 엄마 대사, 4: 홈 버튼
let knockSound;
let goToHomeImg;
let goToHomeButton = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  visible: false
};

// 엔딩 시퀀스 처리 함수 추가
function handleEndingSequence() {
  const elapsed = millis() - endingStartTime;
  
  switch (endingPhase) {
    case 1: // 엔딩 텍스트
      if (elapsed > 5000) { // 5초 후 노크 소리
        endingPhase = 2;
        knockSound.play();
        endingStartTime = millis();
      }
      break;
      
    case 2: // 노크 소리 후 엄마 대사
      if (elapsed > 2000) { // 2초 후 엄마 대사
        endingPhase = 3;
        endingStartTime = millis();
      }
      break;
      
    case 3: // 엄마 대사
      if (elapsed > 5000) { // 5초 후 홈 버튼
        endingPhase = 4;
        endingStartTime = millis();
        // 홈 버튼 위치 설정
        const btnW = width * 0.2;
        const btnH = btnW * (goToHomeImg.height / goToHomeImg.width);
        goToHomeButton = {
          x: width / 2 - btnW / 2,
          y: height / 2 - btnH / 2,
          w: btnW,
          h: btnH,
          visible: true
        };
      }
      break;
  }
  
  // 배경 검정색으로
  background(0);
  
  // 각 페이즈별 텍스트 표시
  if (endingPhase === 1) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("내가 갔다온 곳, 우리 엄마의 과거였어.", width/2, height/2);
  } else if (endingPhase === 3) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text('"딸, 엄마가 미안해.\n엄마 용서해줄 수 있을까?"', width/2, height/2);
  } else if (endingPhase === 4) {
    // 홈 버튼 표시
    if (goToHomeButton.visible) {
      image(goToHomeImg, goToHomeButton.x, goToHomeButton.y, goToHomeButton.w, goToHomeButton.h);
    }
  }
}
