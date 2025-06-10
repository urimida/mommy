// =====================
// 전역 변수
// =====================
let lookAroundTimer = 0;
let lookAroundCount = 0;
let lookAroundDelay = 600;

let scene = 0;
let girl;
let currentMap = "none";
let narrationQueue = [];
let activeNarration = null;
let statusText = "";
let alleyIntroShown = false;
let timeCapsuleEvent;
let capsuleChoiceActive = false;
let showLetter = false;
let letterStartTime = 0;
let letterDuration = 4000;
let alleyIntroStep = 0;
let jumpOnce = false;
let jumpVelocity = 0;
let gravity = 0.5;
let isJumping = false;
const MARGIN = 180;
let lastEnteredMap = "";
let mapEntryTime = 0;
let lookAroundStartTime = 0;
let lookingAround = false;

let alleyImg;
let girlFront1, girlFront2, girlBack1, girlBack2, girlLeft1, girlLeftStop;
let walkTimer = 0;
let walkInterval = 300;
let isWalking = false;

let lookAroundPhase = 0; // 0 = 뒤, 1 = 멈춤, 2 = 앞
let lookAroundDuration = 1500;
let lookPauseDuration = 1000; // 추가: 멈추는 시간

let drawW, drawH, bgOffsetX, bgOffsetY;
let bgmScared, bgmMemories;
let currentBgm = null;
let alleyMusicSwitched = false;
let bgmScaredPlayed = false; // 전역에 추가

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
    this.shouldFadeOut = shouldFadeOut; // 👈 추가
  }

  update() {
    if (this.shouldFadeOut && millis() - this.startTime > this.duration) {
      this.active = false;
    }
  }

  draw() {
    fill(0, 200);
    rect(0, height - 200, width, 150);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text(this.text, width / 2, height - 125);
  }
}

class PixelGirl {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.prevPos = this.pos.copy(); // 💡 이동 제한 대비
    this.speed = 2;
    this.direction = "front"; // 방향 상태
    this.frameToggle = false;
  }

  update() {
    if (activeNarration) return;

    isWalking = false;

    // 키 입력 처리
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

    // 점프 처리
    if (isJumping) {
      this.pos.y += jumpVelocity;
      jumpVelocity += gravity;
      if (this.pos.y >= height / 2) {
        this.pos.y = height / 2;
        isJumping = false;
      }
    }

    // 프레임 토글
    if (isWalking && millis() - walkTimer > walkInterval) {
      this.frameToggle = !this.frameToggle;
      walkTimer = millis();
    }
  }
}

function preload() {
  startBgImg = loadImage("img/start_background.png");
  startButtonImg = loadImage("img/game_start.png");
  alleyImg = loadImage("img/alley_background.png");
  mansionImg = loadImage("img/mansion_background.png");
  elementaryImg = loadImage("img/elementary_background.png");
  schoolroomImg = loadImage("img/schoolroom_background.png");
  schoolyardImg = loadImage("img/schoolyard_background.png");
  classroomImg = loadImage("img/classroom_background.png");
  libraryImg = loadImage("img/library_background.png");

  // 캐릭터 이미지
  girlFront1 = loadImage("img/girl-frontside.png");
  girlFront2 = loadImage("img/girl-frontside2.png");
  girlBack1 = loadImage("img/girl-backside.png");
  girlBack2 = loadImage("img/girl-backside2.png");
  girlLeft1 = loadImage("img/girl-leftside.png");
  girlLeftStop = loadImage("img/girl-leftside-stop.png");

  soundFormats("mp3");
  bgmScared = loadSound("music/scared1.mp3");
  bgmMemories = loadSound("music/memories1.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  girl = new PixelGirl(width / 2, height / 2);
  girl.prevPos = girl.pos.copy(); // ✅ 초기 위치 저장 안 해주면 오류 발생 가능

  timeCapsuleEvent = new GameEvent("타임캡슐", (count) => {
    narrationQueue.push(
      new Narration("저기 뭔가 묻혀있는 자국이 보인다...\n한번 파볼까?")
    );
    capsuleChoiceActive = true;
  });
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
    bgmScaredPlayed = true; // 재생 표시
  }

  if (scene === 6) {
    // === 1. 맵에 맞는 배경 이미지 불러오기 ===
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
      default:
        bg = alleyImg;
    }

    // === 2. 캔버스 비율에 맞게 이미지 크기 조절 ===
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

    // === 3. 골목 진입 시 인트로 대사 ===
    if (currentMap === "alley") {
      handleAlleyIntro();
    }

    // === 4. 맵 이동 로직 및 상태 텍스트 ===
    updateMapLogic();
    drawMap();

    // === 5. 캐릭터 이동 및 애니메이션 처리 ===
    girl.update();
    push();
    translate(girl.pos.x, girl.pos.y);
    scale(0.5);

    const imgW = 64;
    const offsetY = -64;

    if (girl.direction === "left") {
      // 왼쪽 볼 때는 왼쪽 어깨 기준 (기존과 동일)
      image(girl.frameToggle ? girlLeft1 : girlLeftStop, 0, offsetY);
    } else if (girl.direction === "right") {
      // 오른쪽 볼 때는 오른쪽 어깨 기준 (뒤집되 기준 위치 보정)
      scale(-1, 1);
      image(girl.frameToggle ? girlLeft1 : girlLeftStop, -imgW, offsetY);
    } else if (girl.direction === "back") {
      image(girl.frameToggle ? girlBack2 : girlBack1, -imgW / 2, offsetY);
    } else {
      image(girl.frameToggle ? girlFront2 : girlFront1, -imgW / 2, offsetY);
    }
    pop();

    // === 6. 편지 UI 출력 ===
    if (showLetter) {
      drawLetter();
      if (millis() - letterStartTime > letterDuration) {
        showLetter = false;
      }
    }

    // === 7. 선택 버튼 UI 출력 ===
    if (capsuleChoiceActive) {
      drawChoiceButtons();
    }
  }

  // === 8. 타이틀 및 프롤로그 처리 ===
  else if (scene === 0) {
    drawTitleScreen();
  } else if (scene >= 1 && scene <= 5) {
    handlePrologue();
  }

  // === 9. 내레이션 큐 실행 ===
  if (activeNarration) {
    activeNarration.draw(); // 먼저 그려줌 (계속 보여지게)

    activeNarration.update();

    // 다음 내레이션으로 바로 이어지게
    if (!activeNarration.active && narrationQueue.length > 0) {
      activeNarration = narrationQueue.shift();
      activeNarration.shouldFadeOut = false;
    } else if (!activeNarration.active) {
      activeNarration = null;
    }
  } else if (narrationQueue.length > 0) {
    activeNarration = narrationQueue.shift();
    activeNarration.shouldFadeOut = true;
  }
}

function mousePressed() {
  if (scene === 0) {
    const btnW = 200;
    const btnH = 80;
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

  if (capsuleChoiceActive) {
    if (
      mouseX > width / 2 - 110 &&
      mouseX < width / 2 - 10 &&
      mouseY > height - 100 &&
      mouseY < height - 60
    ) {
      capsuleChoiceActive = false;
      showLetter = true;
      letterStartTime = millis();
    } else if (
      mouseX > width / 2 + 10 &&
      mouseX < width / 2 + 110 &&
      mouseY > height - 100 &&
      mouseY < height - 60
    ) {
      capsuleChoiceActive = false;
      narrationQueue.push(new Narration("...그냥 두기로 했다."));
    }
    if (
      mouseX > width / 2 - 110 &&
      mouseX < width / 2 - 10 &&
      mouseY > height - 100 &&
      mouseY < height - 60
    ) {
      capsuleChoiceActive = false;
      showLetter = true;
      letterStartTime = millis();
      narrationQueue.push(
        new Narration("작은 상자가 나왔다... 이건... 타임캡슐?!")
      );
    }
  }
}

// =====================
// 유틸
// =====================

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
    // 흔들림 효과 적용
    let shakeX = random(-10, 10);
    let shakeY = random(-10, 10);
    translate(shakeX, shakeY);
  }

  fill(255);
  textSize(32);
  text(texts[scene - 1], width / 2, height / 2);

  pop();
}
function updateMapLogic() {
  if (currentMap !== lastEnteredMap) {
    lastEnteredMap = currentMap;
    mapEntryTime = millis();
  }

  if (currentMap === "alley") {
    handleAlleyIntro();
    statusText = "여긴 낯선 골목이야. ↑ 초등학교 입구 / → 저택 입구";

    if (girl.pos.y < MARGIN) {
      currentMap = "schoolEntrance";
      girl.pos.y = height - MARGIN;
    }
    if (girl.pos.x > width - MARGIN) {
      currentMap = "mansion";
      girl.pos.x = MARGIN;
    }
  }

  if (currentMap === "schoolEntrance") {
    statusText = "초등학교 입구. ↑ 학교 내부 / ↓ 골목 / ← 운동장";

    let blocked = false;
    const topLimit = height / 2 - 220;

    // ← 운동장 (항상 가능)
    if (girl.pos.x < MARGIN) {
      currentMap = "schoolyard";
      girl.pos.x = width - MARGIN;
      girl.prevPos = girl.pos.copy();
      return;
    }

    // ↓ 골목
    if (girl.pos.y > height - MARGIN) {
      currentMap = "alley";
      girl.pos.y = MARGIN;
      girl.prevPos = girl.pos.copy();
      return;
    }

    // ↑ 학교 내부 (중앙 30%에서만 가능)
    if (
      girl.pos.y < MARGIN + 100 &&
      girl.pos.x > width * 0.35 &&
      girl.pos.x < width * 0.65
    ) {
      currentMap = "schoolInterior";
      girl.pos.y = height - MARGIN;
      girl.prevPos = girl.pos.copy();
      return;
    }

    // 위쪽으로 가더라도 중앙 아닌 경우는 제한
    if (
      girl.pos.y < topLimit &&
      (girl.pos.x < width * 0.35 || girl.pos.x > width * 0.65)
    ) {
      girl.pos.y = topLimit;
      blocked = true;
    }

    // 차단 처리
    if (blocked) {
      girl.pos = girl.prevPos.copy();
      if (!activeNarration && narrationQueue.length === 0) {
        narrationQueue.push(new Narration("그쪽으로는 갈 수 없어."));
      }
    } else {
      girl.prevPos = girl.pos.copy();
    }
  }

  if (currentMap === "schoolInterior") {
    statusText = "초등학교 내부. ↑ 도서관 / ↓ 초등학교 입구 / → 1학년 1반";

    if (girl.pos.y < MARGIN) {
      currentMap = "library";
      girl.pos.y = height - MARGIN;
    }
    if (girl.pos.y > height - MARGIN) {
      currentMap = "schoolEntrance";
      girl.pos.y = MARGIN;
    }
    if (girl.pos.x > width - MARGIN) {
      currentMap = "class1";
      girl.pos.x = MARGIN;
    }
  }

  if (currentMap === "class1") {
    statusText = "1학년 1반 교실. ← 초등학교 내부";
    if (girl.pos.x < MARGIN) {
      currentMap = "schoolInterior";
      girl.pos.x = width - MARGIN;
    }
  }

  if (currentMap === "library") {
    statusText = "도서관. ↓ 초등학교 내부";
    if (girl.pos.y > height - MARGIN) {
      currentMap = "schoolInterior";
      girl.pos.y = MARGIN + 100;
    }
  }

  if (currentMap === "schoolyard") {
    statusText = "운동장. → 초등학교 입구";
    if (girl.pos.x > width - MARGIN) {
      currentMap = "schoolEntrance";
      girl.pos.x = MARGIN;
    }

    let inCapsuleZone =
      girl.pos.x > width / 2 - 50 &&
      girl.pos.x < width / 2 + 50 &&
      girl.pos.y > height / 2 - 50 &&
      girl.pos.y < height / 2 + 50;

    if (!timeCapsuleEvent.triggered && inCapsuleZone) {
      timeCapsuleEvent.tryTrigger(true);
    }
  }

  if (currentMap === "mansion") {
    statusText = "저택 입구. ← 골목으로 돌아가기";
    if (girl.pos.x < MARGIN) {
      currentMap = "alley";
      girl.pos.x = width - MARGIN;
    }
  }
}

function drawMap() {
  fill(100);
  textSize(16);
  textAlign(LEFT, TOP);
  text(statusText, 20, 20);
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
  text(
    "“어른이 된 은주에게...\n은주야, 잘 지내고 있니?\n요즘도 책 좋아하니?”",
    width / 2,
    height - 150
  );
}

function drawTitleScreen() {
  // 배경 이미지 출력
  image(startBgImg, 0, 0, width, height);

  // 버튼 이미지 출력
  const btnW = 200;
  const btnH = 80;
  const btnX = width / 2 - btnW / 2;
  const btnY = height * 0.75;

  image(startButtonImg, btnX, btnY, btnW, btnH);
}

function handleAlleyIntro() {
  if (alleyIntroStep === 0) {
    narrationQueue.push(new Narration("으어... 뭐야! 여기가 어디지?", 2500));
    alleyIntroStep++;
  } else if (
    alleyIntroStep === 1 &&
    !activeNarration &&
    narrationQueue.length === 0
  ) {
    narrationQueue.push(
      new Narration(
        "목걸이를 집어던지고.. 왜 기억이 안나지?\n우선 휴대폰을 봐야겠다...",
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
      new Narration("휴대폰이 작동하지 않잖아... 여기 대체 뭐야?", 2800)
    );
    alleyIntroStep++;
  } else if (
    alleyIntroStep === 4 &&
    !activeNarration &&
    narrationQueue.length === 0
  ) {
    narrationQueue.push(
      new Narration("날짜부터 위치까지 Nan? 아무것도 제대로 안뜨네.", 2800)
    );
    lookAroundStartTime = millis();
    lookingAround = true;
    alleyIntroStep++;
  } else if (
    alleyIntroStep === 5 &&
    !activeNarration &&
    narrationQueue.length === 0
  ) {
    narrationQueue.push(
      new Narration(
        "흠... 낙담하지마! 방법만 찾는다면\n집으로 돌아갈 수 있을 거야.",
        2500
      )
    );
    alleyIntroStep++;
  } else if (
    alleyIntroStep === 6 &&
    !activeNarration &&
    narrationQueue.length === 0
  ) {
    narrationQueue.push(
      new Narration("아직 겁내기엔 이르지.\n차분히 주변부터 살펴보자.", 2500)
    );
    alleyIntroStep++;
  } else if (
    alleyIntroStep === 7 &&
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
  }

  // 두리번 연출
  else if (alleyIntroStep === 8) {
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
      // 뒤를 본 후 멈추는 시간 (여기서 아무것도 안 바뀌게)
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
          new Narration("뭐야... 그런데 이 거리, 은근히 예쁜데?", 2500)
        );
      }
    }
  } else if (
    alleyIntroStep === 9 &&
    !activeNarration &&
    narrationQueue.length === 0
  ) {
    narrationQueue.push(new Narration("조금 돌아다녀볼까?", 2500));

    // 🎵 새로운 BGM 재생
    if (!alleyMusicSwitched) {
      currentBgm = bgmMemories;
      currentBgm.setLoop(true);
      currentBgm.setVolume(0.5);
      currentBgm.play();
      alleyMusicSwitched = true;
    }

    alleyIntroStep++;
  }
}

// 🎵 인트로 끝난 후 음악 전환
if (
  alleyIntroStep >= 7 &&
  !activeNarration &&
  narrationQueue.length === 0 &&
  !alleyMusicSwitched
) {
  if (currentBgm && currentBgm.isPlaying()) {
    currentBgm.stop();
  }
  currentBgm = bgmMemories;
  currentBgm.setLoop(true);
  currentBgm.setVolume(0.5);
  currentBgm.play();
  alleyMusicSwitched = true;
}
