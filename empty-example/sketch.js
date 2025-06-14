// =====================
// 전역 변수 선언부
// =====================
let lookAroundTimer = 0, lookAroundCount = 0, lookAroundDelay = 600;
let startBgImg, startButtonImg, startButtonOriginalRatio = 1;
let mansionEntrySpoken = false, mansionInteriorEntrySpoken = false, momsRoomEntrySpoken = false;
let schoolEntranceEntrySpoken = false, schoolInteriorEntrySpoken = false, class1EntrySpoken = false;
let libraryEntrySpoken = false;
let scene = 0, girl, currentMap = "none", narrationQueue = [], activeNarration = null, statusText = "";
let alleyIntroShown = false, timeCapsuleEvent, capsuleChoiceActive = false, showLetter = false, letterStartTime = 0, letterDuration = 4000, alleyIntroStep = 0, jumpOnce = false, jumpVelocity = 0, gravity = 0.5, isJumping = false;
const MARGIN = 180;
let lastEnteredMap = "", mapEntryTime = 0, lookAroundStartTime = 0, lookingAround = false;
let alleyImg, girlFront1, girlFront2, girlBack1, girlBack2, girlLeft1, girlLeftStop;
let walkTimer = 0, walkInterval = 300, isWalking = false, lookAroundPhase = 0, lookAroundDuration = 800, lookPauseDuration = 1000;
let drawW, drawH, bgOffsetX, bgOffsetY;
let bgmScared, bgmMemories, currentBgm = null, alleyMusicSwitched = false, bgmScaredPlayed = false;
let isHoveringStartButton = false, hoverShakeOffset = 0, hoverShakeTimer = 0;
let homeEntrySpoken = false;
const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;
let shineImg;
let walkingSound;
let roomOpenSound;
let lastRoomOpenPlayedMap = "";
let slideDoorSound;
let lastSlideDoorPlayedMap = "";
let mansionImg, elementaryImg, schoolroomImg, schoolyardImg, classroomImg, libraryImg, mansionInteriorImg, momsRoomImg;
let momsRoomMemoTriggered = false;
let isFading = false, fadeAlpha = 0, fadeStartTime = 0, fadeDuration = 1400;  // 페이드 효과 시간 1.4초로 수정
let nextMap = null, nextPos = null;  // 다음 맵 정보 저장용
let listImg;
let showListModal = false;
let isHoveringList = false;
let listTitleImg;
let memoryFragments = []; // 발견한 기억 조각 리스트 (초기엔 비어있음)
let myFont;
let prevWidth = null, prevHeight = null;
// 캐릭터 이동 제한 플래그
let blockGirlMove = false;
// 샤인 애니메이션 상태 변수 복구
let shineState = {
  found: false,
  animating: false,
  x: 0, y: 0, w: 0, h: 0, t: 0,
  targetX: 0, targetY: 0,
  phase: 'idle', // 'idle', 'collect', 'fly', 'absorb' 단계 추가
  flyStartX: 0, flyStartY: 0, // 비행 시작 위치
  flyTargetX: 0, flyTargetY: 0, // 비행 목표 위치 (리스트 버튼)
  flyProgress: 0 // 비행 진행도
};
// 기억조각 등록 여부 플래그 추가
let momsRoomMemoAdded = false;
// 전역 변수에 스크롤 관련 변수 추가
let listScrollY = 0;
let isDraggingList = false;
let lastMouseY = 0;
let listContentHeight = 0;

// 엄마의 방 메모 내레이션 텍스트 배열
const momsRoomMemoChain = [
  { text: "첫 번째 메모 내용: 13살 어린이날 기념으로 동생과 둘이서 놀이공원에 갔는데,\n보호자가 없어서 1시간만에 집으로 돌아올 수밖에 없었다", duration: 3500 },
  { text: "두 번째 메모 내용: 우리 가족은 행복해질 수 있을까?", duration: 3500},
  { text: "세 번째 메모 내용: 엄마 아빠가 다투지 않았으면 좋겠다...", duration: 3500},
  { text: "네 번째 메모 내용: 밤이 되기 전에 들어와서 함께 저녁을 먹어주면 좋겠어.", duration: 3500},
  { text: "이 집에 사는 아이는\n무슨 이런 쪽지들을 많이 방에 던져놨지??", duration: 3500},
  { text: "어린이날에 동생이랑 둘이서 보내는 애가 있나? 난 어린이날에 뭐했지? ", duration: 3500},
  { text: "아...가족들과 다같이 패밀리 레스토랑에 갔었지", duration: 3500},
  { text: "나도 집에 돌아가서 우리 엄마 ", duration: 3500}
];

// 전역 변수에 shineTriggers 수정
let shineTriggers = {
  schoolyard: { triggered: false, added: false, title: "어린 시절의 운동장", place: "운동장", x: 0.8, y: 0.8 },
  class1: { triggered: false, added: false, title: "첫 번째 교실", place: "1학년 1반", x: 0.75, y: 0.15 },
  library: { triggered: false, added: false, title: "추억의 도서관", place: "도서관", x: 0.5, y: 0.5 },
  mansion: { triggered: false, added: false, title: "낯선 저택", place: "저택", x: 0.8, y: 0.7 },
  momsRoom: { triggered: false, added: false, title: "어린이 같지 않은 어린애의 방", place: "엄마의 방", x: 0.5, y: 0.6 } // y값 조정
};

// 맵 이동 범위를 위한 전역 변수 추가
let mapMinY = 0, mapMaxY = 0;

// 각 장소별 shine 내레이션 체인 수정
const shineNarrationChains = {
  schoolyard: [
    { text: "이 운동장... 어릴 때 뛰어놀던 기억이 나.", duration: 3000 },
    { text: "친구들과 숨바꼭질하고, 땅따먹기하고...", duration: 3000 },
    { text: "그때는 정말 행복했었지.", duration: 2000 }
  ],
  class1: [
    { text: "아, 이 교실...", duration: 2000 },
    { text: "첫 발표를 했던 곳이야.", duration: 2000 },
    { text: "떨리는 목소리로 읽었던 국어책...", duration: 3000 }
  ],
  library: [
    { text: "여기서 처음 만화책을 봤었지.", duration: 2000 },
    { text: "도서관 선생님이 몰래 봐주셨던 기억이...", duration: 3000 },
    { text: "그때는 정말 행복했어.", duration: 2000 }
  ],
  mansion: [
    { text: "이 저택... 왠지 모르게 낯설면서도 익숙해.", duration: 3000 },
    { text: "마치 꿈에서 본 것 같은 느낌이 들어.", duration: 3000 }
  ],
  momsRoom: [
    { text: "여기 누군가의 방이야...", duration: 2000 },
    { text: "방 안에 메모지가 떨어져 있네?", duration: 2000 },
    { text: "첫 번째 메모 내용: 13살 어린이날 기념으로 동생과 둘이서 놀이공원에 갔는데,\n보호자가 없어서 1시간만에 집으로 돌아올 수밖에 없었다", duration: 3500 },
    { text: "두 번째 메모 내용: 우리 가족은 행복해질 수 있을까?", duration: 3500 },
    { text: "세 번째 메모 내용: 엄마 아빠가 다투지 않았으면 좋겠다...", duration: 3500 },
    { text: "네 번째 메모 내용: 밤이 되기 전에 들어와서 함께 저녁을 먹어주면 좋겠어.", duration: 3500 },
    { text: "이 집에 사는 아이는\n무슨 이런 쪽지들을 많이 방에 던져놨지??", duration: 3500 },
    { text: "어린이날에 동생이랑 둘이서 보내는 애가 있나? 난 어린이날에 뭐했지?", duration: 3500 },
    { text: "아...가족들과 다같이 패밀리 레스토랑에 갔었지", duration: 3500 },
    { text: "나도 집에 돌아가서 우리 엄마...", duration: 3500 }
  ]
};

// 다음 스테이지 버튼 관련 변수
let nextStageButton = {
  x: 0, y: 0, w: 0, h: 0,
  visible: false,
  hover: false
};

// =====================
// 클래스 정의
// =====================
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
  constructor(text, duration = 2000, shouldFadeOut = true) {
    this.text = text;
    this.duration = duration;
    this.startTime = millis();
    this.active = true;
    this.shouldFadeOut = shouldFadeOut;
  }
  update() {
    const elapsed = millis() - this.startTime;
    if (this.shouldFadeOut && elapsed > this.duration) this.active = false;
    if (!this.shouldFadeOut && elapsed > this.duration) this.active = false;
  }
  draw(boxOnly = false) {
    // 영화관 자막 스타일: 텍스트만 감싸는 반투명 박스
    textSize(36);
    textAlign(CENTER, CENTER);
    let displayText = this.text;
    // 여러 줄 처리
    let lines = displayText.split('\n');
    let maxLineWidth = 0;
    for (let line of lines) {
      let w = textWidth(line);
      if (w > maxLineWidth) maxLineWidth = w;
    }
    let paddingX = 60;
    let paddingY = 27;
    let boxW = maxLineWidth + paddingX * 2;
    let boxH = lines.length * 48 + paddingY * 2;
    let boxX = width / 2 - boxW / 2;
    let boxY = height - 165 - boxH / 2;
    fill(0, 180);
    noStroke();
    rect(boxX, boxY, boxW, boxH, 27);
    if (!boxOnly) {
      fill(255);
      for (let i = 0; i < lines.length; i++) {
        text(lines[i], width / 2, boxY + paddingY + 21 + i * 48);
      }
    }
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
    // y값에 따라 속도 동적 조절 (아래로 갈수록 빨라짐)
    let minY = 0, maxY = height;
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
    }
    let t = constrain((this.pos.y - minY) / (maxY - minY), 0, 1);
    // B키 누르면 속도 2배
    let speedMultiplier = (keyIsDown(66) || keyIsDown(98)) ? 2 : 1;
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
  momsRoomImg = loadImage("img/mom's_room.png", () => {
    console.log("엄마의 방 이미지 로드 완료:", momsRoomImg.width, "x", momsRoomImg.height);
  }, () => {
    console.error("엄마의 방 이미지 로드 실패");
  });
  girlFront1 = loadImage("img/girl-frontside.png");
  girlFront2 = loadImage("img/girl-frontside2.png");
  girlBack1 = loadImage("img/girl-backside.png");
  girlBack2 = loadImage("img/girl-backside2.png");
  girlLeft1 = loadImage("img/girl-leftside.png");
  girlLeftStop = loadImage("img/girl-leftside-stop.png");
  shineImg = loadImage("img/shine.png");
  soundFormats("mp3");
  bgmScared = loadSound("music/scared1.mp3");
  bgmMemories = loadSound("music/memories1.mp3");
  walkingSound = loadSound("music/walking.mp3");
  roomOpenSound = loadSound("music/room_open.mp3");
  slideDoorSound = loadSound("music/slide_door.mp3");
  listImg = loadImage("img/list.png");
  listTitleImg = loadImage("img/list_title.png");
  myFont = loadFont('font/myfont.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  girl = new PixelGirl(width / 2, height / 2);
  girl.prevPos = girl.pos.copy();
  timeCapsuleEvent = new GameEvent("타임캡슐", (count) => {
    narrationQueue.push(new Narration("저기 뭔가 묻혀있는 자국이 보인다...\n한번 파볼까?"));
    capsuleChoiceActive = true;
  });
  textFont(myFont);
  prevWidth = width;
  prevHeight = height;
}

function draw() {
  background(0);
  // 골목 처음 진입 시 한 번만 scared1 재생
  if (scene === 6 && currentMap === "alley" && !currentBgm && !bgmScaredPlayed) {
    currentBgm = bgmScared;
    currentBgm.setLoop(true);
    currentBgm.setVolume(0.3);
    currentBgm.play();
    bgmScaredPlayed = true;
  }
  if (scene === 6) {
    drawGameScene();
    drawListButton();
    if (showListModal) drawListModal();
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
      // shine 내레이션이 끝나고 기억조각이 아직 추가되지 않았다면 추가
      if (shineTriggers[currentMap] && 
          shineTriggers[currentMap].triggered && 
          !shineTriggers[currentMap].added && 
          narrationQueue.length === 0) {
        // 이미 같은 장소의 기억조각이 있는지 확인
        let exists = memoryFragments.some(fragment => fragment.place === shineTriggers[currentMap].place);
        if (!exists) {
          // 기억조각을 배열 끝에 추가
          memoryFragments.push({
            title: shineTriggers[currentMap].title,
            place: shineTriggers[currentMap].place
          });
          shineTriggers[currentMap].added = true;
          console.log("기억조각 등록됨:", shineTriggers[currentMap].title, "현재 기억조각 수:", memoryFragments.length);
          
          // 스크롤을 최하단으로 이동
          listScrollY = Math.max(0, listContentHeight - height * 0.45);
          
          if (memoryFragments.length >= 4) {
            nextStageButton.visible = true;
          }
        }
      }
      activeNarration = null;
    }
  } else if (narrationQueue.length > 0) {
    activeNarration = narrationQueue.shift();
    activeNarration.shouldFadeOut = true;
    activeNarration.startTime = millis(); // 체인 내 모든 내레이션이 정상적으로 duration만큼 보이도록
  }
}

function windowResized() {
  // 리사이즈 전 위치 비율 저장
  let xRatio = girl.pos.x / prevWidth;
  let yRatio = girl.pos.y / prevHeight;
  resizeCanvas(windowWidth, windowHeight);
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
  // 페이드 효과 처리
  if (isFading) {
    const elapsed = millis() - fadeStartTime;
    if (elapsed < fadeDuration) {
      // 페이드 아웃 (0 -> 255)
      fadeAlpha = map(elapsed, 0, fadeDuration, 0, 255);
    } else if (elapsed < fadeDuration * 2) {
      // 맵 전환
      if (nextMap && nextPos) {
        currentMap = nextMap;
        girl.pos = nextPos;
        nextMap = null;
        nextPos = null;
      }
      // 페이드 인 (255 -> 0)
      fadeAlpha = map(elapsed, fadeDuration, fadeDuration * 2, 255, 0);
    } else {
      // 페이드 완료
      isFading = false;
      fadeAlpha = 0;
    }
  }

  // 1. 배경 이미지 처리
  let bg;
  switch (currentMap) {
    case "alley": bg = alleyImg; break;
    case "schoolEntrance": bg = elementaryImg; break;
    case "schoolInterior": bg = schoolroomImg; break;
    case "library": bg = libraryImg; break;
    case "class1": bg = classroomImg; break;
    case "schoolyard": bg = schoolyardImg; break;
    case "mansion": bg = mansionImg; break;
    case "mansionInterior": bg = mansionInteriorImg; break;
    case "momsRoom": bg = momsRoomImg; break;
    default: bg = alleyImg;
  }

  // 배경 이미지 그리기
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

  // 2. 맵별 이동 범위 계산 (shine 처리 전에 미리 계산)
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
    mapMaxY = height - MARGIN;
  } else if (currentMap === "mansionInterior") {
    mapMinY = 0;
    mapMaxY = height - MARGIN;
  } else if (currentMap === "momsRoom") {
    mapMinY = MARGIN + 200;
    mapMaxY = height - MARGIN-50;
  }

  // 3. shine 처리
  if (["schoolyard", "class1", "library", "mansion", "momsRoom"].includes(currentMap)) {
    let baseW = width * 0.09;
    let scale = baseW / shineImg.width;
    let shineW = shineImg.width * scale;
    let shineH = shineImg.height * scale;
    
    // shine 위치 계산
    let shineX = width * shineTriggers[currentMap].x - shineW / 2;
    let shineY = height * shineTriggers[currentMap].y - shineH / 2;
    
    // shine 충돌 체크를 위한 변수들 정의 (이 부분을 위로 이동)
    const imgW = 64, offsetY = -64;
    let t = constrain((girl.pos.y - mapMinY) / (mapMaxY - mapMinY), 0, 1);
    let baseScale = 0.35;
    let minPerspective = 0.5;
    let maxPerspective = 2.4;
    let perspective = lerp(minPerspective, maxPerspective, t);
    let scaleValue = baseScale * perspective;
    if (currentMap === "momsRoom") scaleValue *= 1.3;
    
    // 디버그: 샤인 위치 정보 출력 (엄마 방일 때만)
    if (currentMap === "momsRoom") {
      console.log("엄마 방 샤인 정보:", {
        x: shineX,
        y: shineY,
        width: shineW,
        height: shineH,
        mapMinY: mapMinY,
        mapMaxY: mapMaxY,
        scale: scaleValue
      });
    }
    
    // 캐릭터 중심 좌표 계산
    let centerX = girl.pos.x;
    let centerY = girl.pos.y + offsetY * scaleValue + (imgW * scaleValue) / 2;
    if (currentMap === "momsRoom") {
      centerX += 100;
      centerY += 300;
    }
    
    // 박스 크기 5배 확대
    let charW = imgW * scaleValue * 5;
    let charH = imgW * scaleValue * 5;
    let charX = centerX - charW / 2;
    let charY = centerY - charH / 2;
    
    // AABB 충돌 체크
    let overlap = !(charX + charW < shineX || charX > shineX + shineW || 
                   charY + charH < shineY || charY > shineY + shineH);

    // 디버그: 화면에 사각형 그리기 (모든 맵에서)
    push();
    noFill();
    stroke('red');
    strokeWeight(2);
    rect(charX, charY, charW, charH);
    stroke('blue');
    rect(shineX, shineY, shineW, shineH);
    pop();

    // shine 상호작용 처리
    if (overlap && !shineTriggers[currentMap].triggered && !shineState.found) {
      if (!activeNarration && narrationQueue.length === 0) {
        queueNarrationChain(shineNarrationChains[currentMap]);
        shineTriggers[currentMap].triggered = true;
        shineState.phase = 'collect';
        shineState.targetX = shineX;
        shineState.targetY = shineY;
        shineState.t = 0;
      }
    }

    // shine 애니메이션 처리
    if (shineState.phase === 'idle' && !shineState.found && !shineState.animating) {
      // 평소 샤인 그리기 (애니메이션 시작 전, 사라지기 전만)
      let t = millis() / 1000;
      let alpha = 180 + 75 * sin(t * 2.2); // 180~255
      let bounce = 18 * sin(t * 2.0); // 위아래 18px
      let drawY = shineY;
      if (currentMap !== "library") {
        drawY += bounce;
      }
      push();
      tint(255, alpha);
      image(shineImg, shineX, drawY, shineW, shineH);
      pop();
    } else if (shineState.phase === 'collect') {
      // 수집 애니메이션
      shineState.t += 0.04;
      shineState.x = lerp(shineX, shineState.targetX, shineState.t);
      shineState.y = lerp(shineY, shineState.targetY, shineState.t);
      shineState.w = lerp(shineW, 32, shineState.t);
      shineState.h = lerp(shineH, 32, shineState.t);
      push();
      tint(255, 255);
      image(shineImg, shineState.x, shineState.y, shineState.w, shineState.h);
      pop();
      if (shineState.t >= 1) {
        shineState.phase = 'fly';
        shineState.flyStartX = shineState.x;
        shineState.flyStartY = shineState.y;
        // 리스트 버튼 위치 계산
        const btnW = width * 0.08;
        const btnH = btnW * (listImg.height / listImg.width);
        shineState.flyTargetX = width - btnW - 32 + btnW/2;
        shineState.flyTargetY = 32 + btnH/2;
        shineState.flyProgress = 0;
      }
    } else if (shineState.phase === 'fly') {
      // 리스트 버튼으로 날아가는 애니메이션
      shineState.flyProgress += 0.02;
      let easeProgress = easeInOutQuad(shineState.flyProgress);
      shineState.x = lerp(shineState.flyStartX, shineState.flyTargetX, easeProgress);
      shineState.y = lerp(shineState.flyStartY, shineState.flyTargetY, easeProgress);
      // 날아가는 동안 크기 점점 작아짐
      let scale = 1 - easeProgress * 0.5;
      shineState.w = 32 * scale;
      shineState.h = 32 * scale;
      push();
      tint(255, 255 * (1 - easeProgress));
      image(shineImg, shineState.x - shineState.w/2, shineState.y - shineState.h/2, shineState.w, shineState.h);
      pop();
      if (shineState.flyProgress >= 1) {
        shineState.phase = 'absorb';
        shineState.found = true;
        // 리스트 버튼 깜빡임 효과 시작
        listButtonFlash = true;
        listButtonFlashStart = millis();
        
        // 기억조각 추가 (수정된 부분)
        if (shineTriggers[currentMap] && !shineTriggers[currentMap].added) {
          let exists = memoryFragments.some(fragment => fragment.place === shineTriggers[currentMap].place);
          if (!exists) {
            memoryFragments.push({
              title: shineTriggers[currentMap].title,
              place: shineTriggers[currentMap].place
            });
            shineTriggers[currentMap].added = true;
            console.log("기억조각 등록됨:", shineTriggers[currentMap].title, "현재 기억조각 수:", memoryFragments.length);
            
            // 스크롤을 최하단으로 이동
            listScrollY = Math.max(0, listContentHeight - height * 0.45);
            
            if (memoryFragments.length >= 4) {
              nextStageButton.visible = true;
            }
          }
        }
      }
    }
  }

  // 4. 나머지 게임 요소 그리기
  // 3. 골목 진입 시 인트로 대사
  if (currentMap === "alley") handleAlleyIntro();
  
  // 4. 맵 이동 로직 및 상태 텍스트
  updateMapLogic();
  drawMap();
  drawStatusText();
  
  // 5. 캐릭터 이동 및 애니메이션 처리
  // 엄마의 방에서 메모 나레이션이 끝난 뒤에만 이동 제한
  if (currentMap === "momsRoom" && !momsRoomMemoTriggered) {
    blockGirlMove = true;
  } else {
    blockGirlMove = false;
  }
  girl.update();
  // === 모든 맵에서 y 이동 범위에 맞춰 원근감 scale 계산 ===
  let t = constrain((girl.pos.y - mapMinY) / (mapMaxY - mapMinY), 0, 1);
  let baseScale = 0.35;
  let minPerspective = 0.5;
  let maxPerspective = 2.4;
  let perspective = lerp(minPerspective, maxPerspective, t);
  let scaleValue = baseScale * perspective;
  if (currentMap === "momsRoom") scaleValue *= 1.3;
  // 점프 시작 시 scaleValue를 고정
  if (isJumping && girl.jumpScaleValue == null) {
    girl.jumpScaleValue = scaleValue;
  }
  if (isJumping && girl.jumpScaleValue != null) {
    scaleValue = girl.jumpScaleValue;
  }
  console.log("Map:", currentMap, "y:", Math.round(girl.pos.y), "minY:", mapMinY, "maxY:", mapMaxY, "t:", t.toFixed(2), "scale:", scaleValue.toFixed(3));
  const imgW = 64, offsetY = -64;
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
  // 편지 UI 출력
  if (showLetter) {
    drawLetter();
    if (millis() - letterStartTime > letterDuration) showLetter = false;
  }
  // 선택 버튼 UI 출력
  if (capsuleChoiceActive) drawChoiceButtons();

  // 다음 스테이지 버튼 그리기
  drawNextStageButton();
  
  // 페이드 오버레이 그리기
  if (isFading) {
    push();
    fill(0, fadeAlpha);
    rect(0, 0, width, height);
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
  isHoveringStartButton = mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH;
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

function drawChoiceButtons() {
  fill(255);
  rect(width / 2 - 110, height - 100, 100, 40);
  rect(width / 2 + 10, height - 100, 100, 40);
  fill(0);
  textSize(18);
  text("O", width / 2 - 60, height - 80);
  text("X", width / 2 + 60, height - 80);
}

function drawLetter() {
  fill(0, 200);
  rect(0, height - 250, width, 200);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  text('"어른이 된 은주에게...\n은주야, 잘 지내고 있니?\n요즘도 책 좋아하니?”', width / 2, height - 150);
}

function drawListButton() {
  const btnW = width * 0.08;
  const btnH = btnW * (listImg.height / listImg.width);
  const btnX = width - btnW - 32;
  const btnY = 32;
  
  // 마우스가 버튼 위에 있는지 체크
  isHoveringList = mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH;
  
  push();
  // 깜빡임 효과
  if (listButtonFlash) {
    let flashElapsed = millis() - listButtonFlashStart;
    if (flashElapsed < 1000) { // 1초 동안 깜빡임
      let flashAlpha = 255 * (1 - flashElapsed / 1000);
      tint(255, 255, 255, flashAlpha);
    } else {
      listButtonFlash = false;
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
  fill('#FFEBD1');
  stroke('#341C14');
  strokeWeight(3);
  rect(listAreaX, listAreaY, listAreaW, listAreaH, 24);
  noStroke();
  pop();

  // 리스트 내용
  if (memoryFragments.length === 0) {
    push();
    fill('#341C14');
    textAlign(CENTER, CENTER);
    textSize(24);
    text("아직 찾은 기억 조각이 없어요.\n기억 조각을 찾아보세요", listAreaX + listAreaW / 2, listAreaY + listAreaH / 2);
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
  listContentHeight = 0; // 전체 컨텐츠 높이 계산용

  // 기억조각을 역순으로 그리기 (최신 항목이 아래에)
  for (let i = memoryFragments.length - 1; i >= 0; i--) {
    let compX = listAreaX + compMargin;
    let compW = listAreaW - compMargin * 2;
    
    // 카드 배경
    push();
    fill('#FFBD65');
    stroke('#FFEBD1');
    strokeWeight(3);
    rect(compX, y, compW, compH, 16);
    noStroke();
    
    // 텍스트 (위: 주된 내용, 아래: 장소)
    fill('#341C14');
    textAlign(LEFT, CENTER);
    textSize(20);
    text(memoryFragments[i].title, compX + 20, y + compH / 2 - 12);
    textSize(16);
    text(memoryFragments[i].place, compX + 20, y + compH / 2 + 14);
    pop();
    
    y += compH + compMargin;
    listContentHeight += compH + compMargin;
  }
  listContentHeight += compMargin; // 마지막 여백 추가

  // 마스킹 해제
  drawingContext.restore();
  pop();

  // 스크롤바 그리기 (마스킹 영역 밖에서)
  if (listContentHeight > listAreaH) {
    push();
    const scrollbarW = 8;
    const scrollbarX = listAreaX + listAreaW - scrollbarW - 4;
    const scrollbarH = (listAreaH / listContentHeight) * listAreaH;
    const scrollbarY = listAreaY + (listScrollY / listContentHeight) * listAreaH;
    
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
  let lines = statusText.split('\n');
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
  fill('#FFEBD1');
  stroke('#341C14');
  strokeWeight(3);
  rect(boxX, boxY, boxW, boxH, 18);
  noStroke();
  // 글자
  fill('#341C14');
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

  if (scene === 0) {
    const btnW = width * 0.25;
    const btnH = btnW / startButtonOriginalRatio;
    const btnX = width / 2 - btnW / 2;
    const btnY = height * 0.75;
    if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
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
    // 리스트 버튼 클릭
    const btnW = width * 0.08;
    const btnH = btnW * (listImg.height / listImg.width);
    const btnX = width - btnW - 32;
    const btnY = 32;
    
    if (!showListModal && mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
      showListModal = true;
      return;
    }

    // 모달 닫기 버튼 클릭
    if (showListModal) {
      const closeW = 60;
      const closeH = 36;
      const closeX = width - closeW - 40;
      const closeY = 40;
      
      if (mouseX >= closeX && mouseX <= closeX + closeW && 
          mouseY >= closeY && mouseY <= closeY + closeH) {
        showListModal = false;
        listScrollY = 0;
        return;
      }
    }
  }
}

function keyPressed() {
  if (blockGirlMove) return;
  // 내레이션 진행: activeNarration이 있으면 즉시 다음으로
  if (activeNarration && (keyCode === ENTER || key === " ")) {
    activeNarration.active = false;
    return;
  }
}

function keyReleased() {
  if (blockGirlMove) return;
  // 방향키에서 손을 뗄 때 걷기 소리 즉시 멈춤
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW || keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
    if (walkingSound && walkingSound.isPlaying()) {
      walkingSound.stop();
    }
  }
}

function handlePrologue() {
  let texts = [
    "엄마와 다투고,\n혼자 공원에 앉아 있었다.",
    "감정이 북받쳐\n목걸이를 잔디밭에 던졌다.",
    "다시 주우려 손을 댄 순간—",
    "지이이잉!!\n땅이 흔들리기 시작했다!",
    "정신을 차려보니,\n낯선 골목에 와 있었다...",
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
    narrationQueue.push(new Narration("으어... 여기가 어디지?\n맞다, 아까 엄마가 준 목걸이를 집어던졌지.. ", 2000));
    alleyIntroStep++;
  } else if (alleyIntroStep === 1 && !activeNarration && narrationQueue.length === 0) {
    narrationQueue.push(new Narration("왜 그 이후가 기억이 안나지?\n우선 휴대폰을 봐야겠다...", 2500));
    alleyIntroStep++;
  } else if (alleyIntroStep === 2 && !activeNarration && narrationQueue.length === 0) {
    isJumping = true;
    jumpVelocity = -10;
    jumpOnce = true;
    alleyIntroStep++;
  } else if (alleyIntroStep === 3 && !activeNarration && narrationQueue.length === 0 && !isJumping) {
    narrationQueue.push(new Narration("휴대폰이 작동하지 않잖아... 여기 대체 뭐야?", 2000));
    alleyIntroStep++;
  } else if (alleyIntroStep === 4 && !activeNarration && narrationQueue.length === 0) {
    narrationQueue.push(new Narration("날짜부터 위치까지 Nan? 아무것도 제대로 안뜨네.", 2000));
    lookAroundStartTime = millis();
    lookingAround = true;
    alleyIntroStep++;
  } else if (alleyIntroStep === 5 && !activeNarration && narrationQueue.length === 0) {
    narrationQueue.push(new Narration("침착하자. 방법만 찾는다면 집으로 돌아갈 수 있을 거야.", 2000));
    alleyIntroStep++;
  } else if (alleyIntroStep === 6 && !activeNarration && narrationQueue.length === 0) {
    narrationQueue.push(new Narration("아직 겁내기엔 이르지.\n차분히 주변부터 살펴보자.", 2000));
    alleyIntroStep++;
  } else if (alleyIntroStep === 7 && !activeNarration && narrationQueue.length === 0) {
    lookingAround = true;
    lookAroundTimer = millis();
    lookAroundCount = 0;
    alleyIntroStep++;
    if (currentBgm && currentBgm.isPlaying()) {
      currentBgm.stop();
      currentBgm = null;
    }
  } else if (alleyIntroStep === 8) {
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
        narrationQueue.push(new Narration("그런데 이 거리 엄청 익숙하네? 예쁜 것 같기도 하고..", 2300));
      }
    }
  } else if (alleyIntroStep === 9 && !activeNarration && narrationQueue.length === 0) {
    narrationQueue.push(new Narration("조금 돌아다녀볼까?", 2000));
    if (!alleyMusicSwitched) {
      currentBgm = bgmMemories;
      currentBgm.setLoop(true);
      currentBgm.setVolume(0.5);
      currentBgm.play();
      alleyMusicSwitched = true;
    }
    alleyIntroStep++;
  }
  if (alleyIntroStep >= 7 && !activeNarration && narrationQueue.length === 0 && !alleyMusicSwitched) {
    if (currentBgm && currentBgm.isPlaying()) currentBgm.stop();
    currentBgm = bgmMemories;
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
  const bgW = 158.6875, bgH = 85.75, trapW = 115.15625, trapH = 40.8125;
  const topLeft = { x: (bgW - trapW) / 2, y: (bgH - trapH) / 2 };
  const topRight = { x: topLeft.x + trapW, y: topLeft.y };
  const bottomLeft = { x: 0, y: bgH };
  const bottomRight = { x: bgW, y: bgH };
  const scaleX = drawW / bgW, scaleY = drawH / bgH, offsetX = bgOffsetX, offsetY = bgOffsetY;
  function scalePoint(p) { return { x: p.x * scaleX + offsetX, y: p.y * scaleY + offsetY }; }
  const A = scalePoint(topLeft), B = scalePoint(topRight), C = scalePoint(bottomRight), D = scalePoint(bottomLeft);
  return isPointInTrapezoid({ x, y }, A, B, C, D);
}
function isPointInTrapezoid(P, A, B, C, D) {
  function cross(p1, p2, p3) { return (p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y); }
  return cross(A, B, P) * cross(C, D, P) >= 0 && cross(B, C, P) * cross(D, A, P) >= 0;
}

function updateMapLogic() {
  if (currentMap !== lastEnteredMap) {
    lastEnteredMap = currentMap;
    mapEntryTime = millis();
  }
  // 비율 기반 경계값 계산
  const marginX = width * (MARGIN / BASE_WIDTH);
  const marginY = height * (MARGIN / BASE_HEIGHT);
  // minY, maxY 기본값 선언 (모든 맵에서 안전하게 사용)
  let minY = 0, maxY = height;
  if (currentMap === "alley") {
    minY = MARGIN - 50;
    maxY = height - MARGIN;
  } else if (currentMap === "schoolEntrance") {
    minY = MARGIN + 120;
    maxY = height - MARGIN;
  } else if (currentMap === "schoolInterior") {
    minY = MARGIN;
    maxY = height - MARGIN;
  } else if (currentMap === "library") {
    minY = 0;
    maxY = height - MARGIN;
  } else if (currentMap === "class1") {
    minY = 0;
    maxY = height;
  } else if (currentMap === "schoolyard") {
    minY = 0;
    maxY = height;
  } else if (currentMap === "mansion") {
    minY = MARGIN + 230;
    maxY = height - MARGIN-20;
  } else if (currentMap === "mansionInterior") {
    minY = 0;
    maxY = height - MARGIN;
  } else if (currentMap === "momsRoom") {
    minY = 0;
    maxY = height;
  }
  // 골목 로직
  if (currentMap === "alley") {
    handleAlleyIntro();
    statusText = "여긴 낯선 골목이야. ↑ 초등학교 입구 / → 저택 입구";
    // 아래로 벗어나려 할 때
    if (girl.pos.y > height - marginY) {
      girl.pos.y = height - marginY;
      if (!activeNarration && narrationQueue.length === 0) narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
    }
    if (girl.pos.y < marginY + height * (80 / BASE_HEIGHT)+30) {
      startMapTransition("schoolEntrance", createVector(width/2, height - marginY));
      return;
    }
    if (girl.pos.x > width - marginX - width * (100 / BASE_WIDTH)) {
      startMapTransition("mansion", createVector(marginX+500, girl.pos.y+100));
      return;
    }
  }
  // 초등학교 입구
  if (currentMap === "schoolEntrance") {
    statusText = "초등학교 입구. ↑ 학교 내부 / ↓ 골목 / ← 운동장";
    if (!schoolEntranceEntrySpoken) {
      schoolEntranceEntrySpoken = true;
      queueNarrationChain([
        { text: "와 여기 진짜 고풍스러운 학교다 ㅋㅋㅋ", duration: 2000 },
        { text: "국민학교라고 적혀있네? 엥...? 국민학교?", duration: 3000 },
        { text: "초등학교가 아니라 국민학교라고?!", duration: 3000 },
        { text: "왼쪽으로 가면 운동장인가? 위로 가면 입구?", duration: 3000 },
      ]);
    }
    let blocked = false;
    const topLimit = height / 2 - height * (220 / BASE_HEIGHT)+200;
    if (girl.pos.x < marginX) {
      startMapTransition("schoolyard", createVector(width - marginX, girl.pos.y));
      return;
    }
    if (girl.pos.x > width - marginX) {
      girl.pos.x = width - marginX;
      if (!activeNarration && narrationQueue.length === 0) narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
    }
    if (girl.pos.y > height - marginY) {
      startMapTransition("alley", createVector(width/2, marginY+170));
      return;
    }
    if (girl.pos.y < marginY + height * (250 / BASE_HEIGHT) && girl.pos.x > width * 0.35 && girl.pos.x < width * 0.65) {
      startMapTransition("schoolInterior", createVector(width/2, height - marginY));
      return;
    }
    if (girl.pos.y < topLimit && (girl.pos.x < width * 0.35 || girl.pos.x > width * 0.65)) {
      girl.pos.y = topLimit;
      blocked = true;
    }
    if (blocked) {
      girl.pos = girl.prevPos.copy();
      if (!activeNarration && narrationQueue.length === 0) narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
    } else {
      girl.prevPos = girl.pos.copy();
    }
  }
  if (currentMap === "schoolInterior") {
    statusText = "초등학교 내부. ↑ 도서관 / ↓ 초등학교 입구 / → 1학년 1반";
    if (!schoolInteriorEntrySpoken) {
      schoolInteriorEntrySpoken = true;
      queueNarrationChain([
        { text: "안에도 참 고풍스럽네...", duration: 2000 },
        { text: "우리 부모님이 다녔을 법해.", duration: 2000 },
        { text: "나 기억을 잃은 사이에 시골에 왔나...?", duration: 2500 },
        { text: "둘러보며 정보를 좀 더 찾아봐야겠다. 오른쪽이 교실, 위쪽은 도서관인 거 같아.", duration: 2500 },
      ]);
    }
    if (girl.pos.y < marginY) {
      startMapTransition("library", createVector(width/2, height - marginY));
      return;
    }
    if (girl.pos.y > height - marginY) {
      startMapTransition("schoolEntrance", createVector(width/2, marginY + height * (330 / BASE_HEIGHT)));
      return;
    }
    if (girl.pos.x > width - marginX) {
      startMapTransition("class1", createVector(marginX, girl.pos.y));
      return;
    }
  }
  if (currentMap === "class1") {
    statusText = "1학년 1반 교실. ← 초등학교 내부";
    if (!class1EntrySpoken) {
      class1EntrySpoken = true;
      queueNarrationChain([
        { text: "와 여기 정말 귀엽다.", duration: 2000 },
        { text: "한국 지도도 있고 칠판이 초록색이잖아!", duration: 2500 },
        { text: "안에 좀 더 둘러볼까?", duration: 2000 },
      ]);
    }
    if (girl.pos.x < marginX) {
      startMapTransition("schoolInterior", createVector(width - marginX, girl.pos.y));
      return;
    }
    if (lastEnteredMap !== currentMap) playSlideDoorOnce("class1");
  }
  if (currentMap === "library") {
    statusText = "도서관. ↓ 초등학교 내부";
    if (!libraryEntrySpoken) {
      libraryEntrySpoken = true;
      queueNarrationChain([
        { text: "여기 도서관 냄새 되게 좋다.\n만화책방 냄새 나.", duration: 3000 },
        { text: "어? 저기 빛나는게 보이네?\n저건 뭐지?", duration: 3000 }
      ]);
    }
    if (girl.pos.y > height - marginY) {
      startMapTransition("schoolInterior", createVector(width/2, marginY + height * (100 / BASE_HEIGHT)));
      return;
    }
    if (lastEnteredMap !== currentMap) playRoomOpenOnce("library");
  }
  if (currentMap === "schoolyard") {
    statusText = "운동장. → 초등학교 입구";
    if (girl.pos.x > width - marginX) {
      startMapTransition("schoolEntrance", createVector(marginX, girl.pos.y));
    }
    let inCapsuleZone = girl.pos.x > width / 2 - width * (50 / BASE_WIDTH) && girl.pos.x < width / 2 + width * (50 / BASE_WIDTH) && girl.pos.y > height / 2 - height * (50 / BASE_HEIGHT) && girl.pos.y < height / 2 + height * (50 / BASE_HEIGHT);
    if (!timeCapsuleEvent.triggered && inCapsuleZone) timeCapsuleEvent.tryTrigger(true);
  }
  if (currentMap === "mansion") {
    statusText = "저택 입구. ↑ 저택 내부 / ← 골목으로 돌아가기";
    if (!mansionEntrySpoken) {
      mansionEntrySpoken = true;
      queueNarrationChain([
        { text: "아무도 안계세요?", duration: 2000 },
        { text: "흠... 아무도 없나보네. 그나저나 참 정감가는 정원이다.", duration: 3000 },
      ]);
    }
    if (girl.pos.x < marginX+400) {
      startMapTransition("alley", createVector(width - marginX - width * (200 / BASE_WIDTH), girl.pos.y));
      return;
    }
    // 상단 접근 시 내부로 강제 이동 (Y축 중간 지점 기준)
    if (girl.pos.y < height / 2-200) {
      startMapTransition("mansionInterior", createVector(width/2, height - marginY - height * (50 / BASE_HEIGHT)));
      return;
    }
    // 하단 이동 제한
    if (girl.pos.y > mapMaxY) {
      girl.pos.y = mapMaxY;
      if (!activeNarration && narrationQueue.length === 0) narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
    }
  }
  if (currentMap === "mansionInterior") {
    statusText = "저택 내부. ↑ 저택 입구 / ← 누군가의 방";
    if (!mansionInteriorEntrySpoken) {
      mansionInteriorEntrySpoken = true;
      queueNarrationChain([
        { text: "음... 나도 모르게 여기 들어와버렸네.", duration: 3000 },
        { text: "근데 여기 이집 사람 사는 곳 맞아?", duration: 3000 },
        { text: "왼쪽에 문이 보이네... 엄마의 방이라고?", duration: 3000 },
        { text: "왜 이렇게 더럽지... 설마 폐가?! 아닌데... 흔적이 있긴 한데...", duration: 3500 },
      ]);
    }
    if (girl.pos.y > height - marginY) {
      startMapTransition("mansion", createVector(width/2, marginY + height * (300 / BASE_HEIGHT)));
      return;
    }
    if (girl.pos.x < marginX) {
      startMapTransition("momsRoom", createVector(width - marginX, girl.pos.y));
      return;
    }
    if (lastEnteredMap !== currentMap) {
      narrationQueue.push(new Narration("여긴 저택 내부구나.\n누군가의 방이 보인다.", 3000));
    }
  }
  if (currentMap === "momsRoom") {
    statusText = "누군가의 방. → 저택 내부";
    if (!momsRoomEntrySpoken) {
      narrationQueue.push(new Narration("여긴 누군가의 방이야.\n방 주인은 누구일까?", 3000));
      momsRoomEntrySpoken = true;
    }
    if (girl.pos.x > width - marginX) {
      startMapTransition("mansionInterior", createVector(marginX, girl.pos.y));
      return;
    }
    // 맵 이동 범위 제한 추가
    if (girl.pos.y < mapMinY) {
      girl.pos.y = mapMinY;
    }
    if (girl.pos.y > mapMaxY) {
      girl.pos.y = mapMaxY;
    }
  }
  // schoolEntrance <-> schoolInterior 출입
  if (currentMap === "schoolEntrance" && lastEnteredMap === "schoolInterior") playRoomOpenOnce("schoolEntrance");
  if (currentMap === "schoolInterior" && lastEnteredMap === "schoolEntrance") playRoomOpenOnce("schoolInterior");
  // schoolInterior <-> class1 출입 (슬라이드 도어)
  if (currentMap === "schoolInterior" && lastEnteredMap === "class1") playSlideDoorOnce("class1");
  if (currentMap === "class1" && lastEnteredMap === "schoolInterior") playSlideDoorOnce("class1");
  // schoolInterior <-> library 출입
  if (currentMap === "schoolInterior" && lastEnteredMap === "library") playRoomOpenOnce("schoolInterior");
  if (currentMap === "library" && lastEnteredMap === "schoolInterior") playRoomOpenOnce("library");
  // mansion <-> mansionInterior 출입
  if (currentMap === "mansion" && lastEnteredMap === "mansionInterior") playRoomOpenOnce("mansion");
  if (currentMap === "mansionInterior" && lastEnteredMap === "mansion") playRoomOpenOnce("mansionInterior");
}

function queueNarrationChain(textArray) {
  for (let i = 0; i < textArray.length; i++) {
    narrationQueue.push(new Narration(textArray[i].text, textArray[i].duration));
  }
}

function playRoomOpenOnce(mapName) {
  if (lastRoomOpenPlayedMap !== mapName) {
    roomOpenSound.play();
    lastRoomOpenPlayedMap = mapName;
  }
}

function playSlideDoorOnce(mapName) {
  if (lastSlideDoorPlayedMap !== mapName) {
    slideDoorSound.rate(1.5);
    slideDoorSound.setVolume(1.7);
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
    
    // shine 상태 초기화 (found 상태는 유지)
    if (shineTriggers[newMap]) {
      let wasFound = shineState.found; // 현재 found 상태 저장
      let wasTriggered = shineTriggers[newMap].triggered; // 현재 triggered 상태 저장
      let wasAdded = shineTriggers[newMap].added; // 현재 added 상태 저장
      
      shineState = {
        found: wasFound, // found 상태 유지
        animating: false,
        x: 0, y: 0, w: 0, h: 0, t: 0,
        targetX: 0, targetY: 0,
        phase: 'idle',
        flyStartX: 0, flyStartY: 0,
        flyTargetX: 0, flyTargetY: 0,
        flyProgress: 0
      };
      
      // 맵 전환 시 triggered와 added 상태도 유지
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

// 다음 스테이지 버튼 그리기 함수 추가
function drawNextStageButton() {
  if (!nextStageButton.visible) return;
  
  // 버튼 크기와 위치 설정
  nextStageButton.w = width * 0.2;
  nextStageButton.h = nextStageButton.w * 0.3;
  nextStageButton.x = width - nextStageButton.w - 32;
  nextStageButton.y = height - nextStageButton.h - 32;
  
  // 마우스 호버 체크
  nextStageButton.hover = mouseX > nextStageButton.x && 
                         mouseX < nextStageButton.x + nextStageButton.w &&
                         mouseY > nextStageButton.y && 
                         mouseY < nextStageButton.y + nextStageButton.h;
  
  // 버튼 그리기
  push();
  fill(nextStageButton.hover ? '#FFBD65' : '#FFEBD1');
  stroke('#341C14');
  strokeWeight(3);
  rect(nextStageButton.x, nextStageButton.y, nextStageButton.w, nextStageButton.h, 16);
  
  // 텍스트 그리기
  fill('#341C14');
  textAlign(CENTER, CENTER);
  textSize(24);
  text("다음 단계로", nextStageButton.x + nextStageButton.w/2, nextStageButton.y + nextStageButton.h/2);
  pop();
}

// mouseReleased 함수 추가
function mouseReleased() {
  isDraggingList = false;
}

// mouseDragged 함수 추가
function mouseDragged() {
  if (isDraggingList && showListModal) {
    const deltaY = lastMouseY - mouseY;
    lastMouseY = mouseY;
    
    // 스크롤 범위 제한
    const maxScroll = Math.max(0, listContentHeight - height * 0.45);
    listScrollY = constrain(listScrollY + deltaY, 0, maxScroll);
  }
}

// mouseWheel 함수 추가
function mouseWheel(event) {
  if (showListModal) {
    const scrollAmount = event.delta * 2;
    const maxScroll = Math.max(0, listContentHeight - height * 0.45);
    listScrollY = constrain(listScrollY + scrollAmount, 0, maxScroll);
    return false; // 기본 스크롤 동작 방지
  }
}