// created variable names
var snake;
var snakeLength;
var snakeSize;
var snakeDirection;

var food;

var context;
var screenWidth;
var screenHeight;

var gameState;
var gameOverMenu;
var restartButton;
var playHUD;
var scoreboard;

// created order to run functions
gameInit();
snakeInit();
foodInit();
setInterval(gameLoop, 1000 / 30);

// first function run
function gameInit() {
  var canvas = document.getElementById("game-screen");
  context = canvas.getContext("2d");

  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  canvas.width = screenWidth;
  canvas.height = screenHeight;

  document.addEventListener("keydown", keyboardHandler);
  document.addEventListener("keydown", startGame);

  gameOverMenu = document.getElementById("gameOver");
  centerMenuPosition(gameOverMenu);

  restartButton = document.getElementById("restartButton");
  restartButton.addEventListener("click", gameRestart);

  playHUD = document.getElementById("playHUD");
  scoreboard = document.getElementById("scoreboard");

  function startGame(event) {
    setState("PLAY");
  }
}

// inside game init I set state to play and this runs
function gameLoop() {
  gameDraw();
  drawScoreboard();
  if (gameState == "PLAY") {
    snakeUpdate();
    snakeDraw();
    foodDraw();
    displayMenu(playHUD);
  } else if (gameState == "GAME OVER") {
    displayMenu(gameOverMenu);
  }
}

// first function run inside gameLoop
function gameDraw() {
  context.fillStyle = "rgb(167, 213, 120)";
  context.fillRect(0, 0, screenWidth, screenHeight);
}

//function to run when new game button is pressed
function gameRestart() {
  snakeInit();
  foodInit();
  hideMenu(gameOverMenu);
  setState("PLAY");
}

// second function run
function snakeInit() {
  snake = [];
  snakeLength = 1;
  snakeSize = 25;
  snakeDirection = "DOWN";

  for (var index = snakeLength - 1; index >= 0; index--) {
    snake.push({
      x: index,
      y: 0,
    });
  }
}

// second function run inside gameLoop
function snakeDraw() {
  for (var index = 0; index < snake.length; index++) {
    context.fillStyle = "rgb(129, 101, 8)";
    context.fillRect(
      snake[index].x * snakeSize,
      snake[index].y * snakeSize,
      snakeSize,
      snakeSize
    );
  }
}

// first function run inside gameLoop
function snakeUpdate() {
  var snakeHeadX = snake[0].x;
  var snakeHeadY = snake[0].y;

  if (snakeDirection == "DOWN") {
    snakeHeadY++;
  } else if (snakeDirection == "RIGHT") {
    snakeHeadX++;
  } else if (snakeDirection == "UP") {
    snakeHeadY--;
  } else if (snakeDirection == "LEFT") {
    snakeHeadX--;
  }

  checkFoodCollision(snakeHeadX, snakeHeadY);
  checkWallCollision(snakeHeadX, snakeHeadY);
  checkSnakeCollision(snakeHeadX, snakeHeadY);

  var snakeTail = snake.pop();
  snakeTail.x = snakeHeadX;
  snakeTail.y = snakeHeadY;
  snake.unshift(snakeTail);
}

// third function run
function foodInit() {
  food = {
    x: 0,
    y: 0,
  };

  setFoodPosition();
}

// draws new food after it is eaten
function foodDraw() {
  context.fillStyle = "red";
  context.fillRect(
    food.x * snakeSize,
    food.y * snakeSize,
    snakeSize,
    snakeSize
  );
}

// sets food position
function setFoodPosition() {
  var randomX = Math.floor(Math.random() * screenWidth);
  var randomY = Math.floor(Math.random() * screenHeight);

  food.x = Math.floor(randomX / snakeSize);
  food.y = Math.floor(randomY / snakeSize);
}

// listens to which arrow the player is pressing
function keyboardHandler(event) {
  if (event.keyCode == "39" && snakeDirection != "LEFT") {
    snakeDirection = "RIGHT";
  } else if (event.keyCode == "40" && snakeDirection != "UP") {
    snakeDirection = "DOWN";
  } else if (event.keyCode == "37" && snakeDirection != "RIGHT") {
    snakeDirection = "LEFT";
  } else if (event.keyCode == "38" && snakeDirection != "DOWN") {
    snakeDirection = "UP";
  }
}

// checking if food is eaten
function checkFoodCollision(snakeHeadX, snakeHeadY) {
  if (snakeHeadX == food.x && snakeHeadY == food.y) {
    snake.push({
      x: 0,
      y: 0,
    });
    snakeLength++;

    var randomX = Math.floor(Math.random() * screenWidth);
    var randomY = Math.floor(Math.random() * screenHeight);

    food.x = Math.floor(randomX / snakeSize);
    food.y = Math.floor(randomY / snakeSize);
  }
}

// checking if player died on wall
function checkWallCollision(snakeHeadX, snakeHeadY) {
  if (
    snakeHeadX * snakeSize >= screenWidth ||
    snakeHeadX * snakeSize < 0 ||
    snakeHeadY * snakeSize >= screenHeight ||
    snakeHeadY * snakeSize < 0
  ) {
    setState("GAME OVER");
    return;
  }
}

// checking if player ran into own body
function checkSnakeCollision(snakeHeadX, snakeHeadY) {
  for (var index = 1; index < snake.length; index++) {
    if (snakeHeadX == snake[index].x && snakeHeadY == snake[index].y) {
      setState("GAME OVER");
    }
  }
}

// setting the state of the game
function setState(state) {
  gameState = state;
  showMenu = state;
}

// gameover menu
function displayMenu(menu) {
  menu.style.visibility = "visible";
}

function hideMenu(menu) {
  menu.style.visibility = "hidden";
}

function centerMenuPosition(menu) {
  menu.style.top = screenHeight / 2 - menu.offsetHeight / 2 + "px";
  menu.style.left = screenWidth / 2 - menu.offsetWidth / 2 + "px";
}

// scoreboard
function drawScoreboard() {
  scoreboard.innerHTML = "Length: " + snakeLength;
}
