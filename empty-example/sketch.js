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
	constructor(text, duration = 2000) {
		this.text = text;
		this.duration = duration;
		this.startTime = millis();
		this.active = true;
	}

	update() {
		if (millis() - this.startTime > this.duration) {
			this.active = false;
		}
	}

	draw() {
		if (this.active) {
			fill(0, 200);
			rect(0, height - 200, width, 150);
			fill(255);
			textAlign(CENTER, CENTER);
			textSize(24);
			text(this.text, width / 2, height - 125);
		}
	}
}

class PixelGirl {
	constructor(x, y, size) {
		this.pos = createVector(x, y);
		this.size = size;
		this.speed = 2;
		this.direction = 'front'; // front, back, left, right
	}

	update() {
		if (keyIsDown(LEFT_ARROW)) {
			this.pos.x -= this.speed;
			this.direction = 'left';
		} else if (keyIsDown(RIGHT_ARROW)) {
			this.pos.x += this.speed;
			this.direction = 'right';
		} else if (keyIsDown(UP_ARROW)) {
			this.pos.y -= this.speed;
			this.direction = 'back';
		} else if (keyIsDown(DOWN_ARROW)) {
			this.pos.y += this.speed;
			this.direction = 'front';
		}
	}

	draw() {
		push();
		translate(this.pos.x, this.pos.y);
		if (this.direction === 'right') {
			scale(-1, 1);
			this.drawLeft();
		} else if (this.direction === 'left') {
			this.drawLeft();
		} else if (this.direction === 'back') {
			this.drawBack();
		} else {
			this.drawFront();
		}
		pop();
	}

	drawFront() {
		let s = this.size;
		let skin = color(255, 220, 180);
		let hair = color(120, 60, 60);
		let dress = color(200, 100, 100);
		let eye = color(30);

		fill(hair);
		rect(-3*s, -2*s, s, s);
		rect(-1*s, -3*s, s, s);
		rect(0, -3*s, s, s);
		rect(2*s, -2*s, s, s);

		fill(skin);
		rect(-1*s, -1*s, s, s);
		rect(0, -1*s, s, s);
		rect(1*s, -1*s, s, s);
		rect(-1*s, 0, s, s);
		rect(0, 0, s, s);
		rect(1*s, 0, s, s);

		fill(eye);
		rect(0, 0, s/2, s/2);

		fill(dress);
		rect(-1*s, 1*s, s, s);
		rect(0, 1*s, s, s);
		rect(1*s, 1*s, s, s);
		rect(-2*s, 2*s, s, s);
		rect(-1*s, 2*s, s, s);
		rect(0, 2*s, s, s);
		rect(1*s, 2*s, s, s);
		rect(2*s, 2*s, s, s);

		fill(skin);
		rect(-1*s, 3*s, s, s);
		rect(1*s, 3*s, s, s);
	}

	drawBack() {
		let s = this.size;
		let skin = color(255, 220, 180);
		let hair = color(120, 60, 60);
		let dress = color(200, 100, 100);

		fill(hair);
		rect(-2*s, -2*s, s, s);
		rect(-1*s, -3*s, s, s);
		rect(0, -3*s, s, s);
		rect(1*s, -2*s, s, s);
		rect(-1*s, -1*s, s, s);
		rect(0, -1*s, s, s);

		fill(dress);
		rect(-1*s, 1*s, s, s);
		rect(0, 1*s, s, s);
		rect(1*s, 1*s, s, s);
		rect(-2*s, 2*s, s, s);
		rect(-1*s, 2*s, s, s);
		rect(0, 2*s, s, s);
		rect(1*s, 2*s, s, s);
		rect(2*s, 2*s, s, s);

		fill(skin);
		rect(-1*s, 3*s, s, s);
		rect(1*s, 3*s, s, s);
	}

	drawLeft() {
		let s = this.size;
		let skin = color(255, 220, 180);
		let hair = color(120, 60, 60);
		let dress = color(200, 100, 100);

		fill(hair);
		rect(-2*s, -3*s, s, s);
		rect(-1*s, -3*s, s, s);
		rect(-1*s, -2*s, s, s);

		fill(skin);
		rect(-1*s, -1*s, s, s);
		rect(-1*s, 0, s, s);

		fill(dress);
		rect(-1*s, 1*s, s, s);
		rect(-2*s, 2*s, s, s);
		rect(-1*s, 2*s, s, s);
		rect(0, 2*s, s, s);

		fill(skin);
		rect(-1*s, 3*s, s, s);
	}
}

// =====================
// 전역 변수
// =====================

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

// =====================
// p5 기본
// =====================

function setup() {
	createCanvas(windowWidth, windowHeight);
	textAlign(CENTER, CENTER);
	fill(255);
	scene = 0;

	girl = new PixelGirl(width / 2, height / 2, 5);

	timeCapsuleEvent = new GameEvent("타임캡슐", (count) => {
		narrationQueue.push(new Narration("저기 뭔가 묻혀있는 자국이 보인다...\n한번 파볼까?"));
		capsuleChoiceActive = true;
	});
}

function draw() {
	background(0);

	if (scene === 0) {
		drawTitleScreen();
		return;
	}

	if (scene >= 1 && scene <= 5) {
		handlePrologue();
		return;
	}

	if (scene === 6 && !alleyIntroShown) {
		narrationQueue.push(new Narration("여기가 어디지?\n난생 처음 보는 골목인데...", 3000));
		narrationQueue.push(new Narration("어떡해... 왜 여기 왔는지 기억이 안나.", 3000));
		narrationQueue.push(new Narration("좀 둘러보며 돌아갈 방법을 찾아야겠다.", 3000));
		alleyIntroShown = true;
	}

	updateMapLogic();
	drawMap();
	girl.update();
	girl.draw();

	if (showLetter) {
		drawLetter();
		if (millis() - letterStartTime > letterDuration) showLetter = false;
	}
	if (capsuleChoiceActive) drawChoiceButtons();

	if (activeNarration) {
		activeNarration.update();
		activeNarration.draw();
		if (!activeNarration.active) activeNarration = null;
	} else if (narrationQueue.length > 0) {
		activeNarration = narrationQueue.shift();
	}
}

function mousePressed() {
	if (scene === 0) {
		if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
			mouseY > height / 2 + 50 && mouseY < height / 2 + 110) {
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
		if (mouseX > width / 2 - 110 && mouseX < width / 2 - 10 &&
			mouseY > height - 100 && mouseY < height - 60) {
			capsuleChoiceActive = false;
			showLetter = true;
			letterStartTime = millis();
		} else if (mouseX > width / 2 + 10 && mouseX < width / 2 + 110 &&
			mouseY > height - 100 && mouseY < height - 60) {
			capsuleChoiceActive = false;
			narrationQueue.push(new Narration("...그냥 두기로 했다."));
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
		"정신을 차려보니,\n낯선 골목에 와 있었다..."
	];
	fill(255);
	textSize(32);
	text(texts[scene - 1], width / 2, height / 2);
}

function updateMapLogic() {
	if (currentMap === "alley") {
		statusText = "여긴 낯선 골목이야.\n↑ 저택 / ↓ 초등학교";
		if (girl.pos.y < 10) {
			currentMap = "mansion";
			girl.pos.y = height - 20;
		}
		if (girl.pos.y > height - 10) {
			currentMap = "elementary";
			girl.pos.y = 20;
			narrationQueue.push(new Narration("여기... 우리 엄마가 다녔던 학교 아니야?"));
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
	text("“어른이 된 은주에게...\n은주야, 잘 지내고 있니?\n요즘도 책 좋아하니?”", width / 2, height - 150);
}

function drawTitleScreen() {
	background(0);
	fill(255);
	textAlign(CENTER, CENTER);
	textSize(80);
	text("시간 너머의...", width / 2, height / 2 - 100);
	fill(255);
	rect(width / 2 - 100, height / 2 + 50, 200, 60, 20);
	fill(0);
	textSize(24);
	text("Game Start", width / 2, height / 2 + 80);
}
