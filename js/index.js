// ===== Game Constants & Variables =====
let inputDir = { x: 0, y: 0 };
let speed = 10;
let score = 0;
let lastPaintTime = 0;

const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const moveSound = new Audio("music/move.mp3");
const musicSound = new Audio("music/music.mp3");

let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// ===== High Score =====
let hiscore = localStorage.getItem("hiscore");
let hiscoreval = hiscore ? JSON.parse(hiscore) : 0;
localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
hiscoreBox.innerHTML = "HiScore: " + hiscoreval;

// ===== Main Game Loop =====
function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
  lastPaintTime = ctime;
  gameEngine();
}

window.requestAnimationFrame(main);

// ===== Game Logic =====
function isCollide(snake) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }

  if (
    snake[0].x >= 18 ||
    snake[0].x <= 0 ||
    snake[0].y >= 18 ||
    snake[0].y <= 0
  ) {
    return true;
  }

  return false;
}

function gameEngine() {
  // Game Over
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    inputDir = { x: 0, y: 0 };
    alert("Game Over! Press any key to play again");
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    musicSound.play();
  }

  // Eat food
  if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
    foodSound.play();
    score++;
    scoreBox.innerHTML = "Score: " + score;

    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
    }

    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });

    food = {
      x: Math.floor(Math.random() * 16) + 2,
      y: Math.floor(Math.random() * 16) + 2,
    };
  }

  // Move snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }

  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // Draw
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    const el = document.createElement("div");
    el.style.gridRowStart = e.y;
    el.style.gridColumnStart = e.x;
    el.classList.add(index === 0 ? "head" : "snake");
    board.appendChild(el);
  });

  const foodEl = document.createElement("div");
  foodEl.style.gridRowStart = food.y;
  foodEl.style.gridColumnStart = food.x;
  foodEl.classList.add("food");
  board.appendChild(foodEl);
}

// ===== Controls =====
window.addEventListener("keydown", (e) => {
  moveSound.play();
  switch (e.key) {
    case "ArrowUp":
      inputDir = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      inputDir = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      inputDir = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      inputDir = { x: 1, y: 0 };
      break;
  }
});

// Start background music
musicSound.play();
