// Set up canvas
var canvas = document.getElementById("myCanvas");
var container = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = container.offsetWidth;
canvas.height = container.offsetHeight;

// Getting elements
var scoreText = document.getElementById("score");
var livesText = document.getElementById("lives");
// var restartButton = document.getElementById("restart");
// restartButton.onclick = initialize;

// Setting up global variables
var ball = {
  radius: 10,
  x: canvas.width / 2,
  y: canvas.height - 50,
  speed: 5,
  dx: 3,
  dy: -4
};

var paddle = {
  width: 160,
  height: 10,
  x: 0,
  y: 0
};

var bricks = [];
var rowCount = 3;
var colCount = Math.floor((container.offsetWidth-160)/80);
var offsetTop = 30;
var offsetLeft = 15;
var lives;
var score;
var numBricks;
var yellowBrick;
var blueBrick;
var redBrick;
var loop;



// sounds
const BRICK_HIT = new Audio();
BRICK_HIT.src = "assets/sounds/brick_hit.mp3";

const WALL_HIT = new Audio();
WALL_HIT.src = "assets/sounds/wall.mp3";

const LIFE_LOST = new Audio();
LIFE_LOST.src = "assets/sounds/life_lost.mp3";

const PADDLE_HIT = new Audio();
PADDLE_HIT.src = "assets/sounds/paddle_hit.mp3";

const WIN = new Audio();
WIN.src = "assets/sounds/win.mp3";

const BG = new Audio();
BG.src = "assets/sounds/stranger_things.mp3";
// BG.loop = true;
BG.volume = 0.2
BG.play()
BG.addEventListener('timeupdate', function(){
  var buffer = 0.23
  if(this.currentTime > this.duration - buffer){
      this.currentTime = 0
      this.play()
  }
});
// Set up key listeners
var rightPressed = false;
var leftPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);




// A utility function to draw a rectangle with rounded corners.

function roundedRect(ctx, x, y, width, height, radius, color) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height);
  ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
  ctx.lineTo(x + width, y + radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}
    
// Call function to update game every 30 ms
initialize();
var intervalID = setInterval(updateGame, 30);

function gameState(flag) {
   if(flag)
     intervalID =  setInterval(updateGame, 30);
   else
     clearInterval(intervalID);
}

// Function to setup starting parameters
function initialize() {
  // Set up lives and score
  lives = 3;
  // livesText.innerHTML = lives;
  score = 0;
  scoreText.innerHTML = score;
  numBricks = 0;

  // Set up ball and paddle
  reset();

  // Set up bricks
  var colors = ["blue", "yellow", "red"];
  for (var c = 0; c < colCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < rowCount; r++) {
      var brick = {
        width: 80,
        height: 60,
        padding: 10,
        x: 0,
        y: 0,
        color: colors[r],
        status: 1
      };
      bricks[c][r] = brick;
      numBricks += 1;
    }
  }
}

// Draw ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

// draw paddle
function drawPaddle() {
  roundedRect(ctx,paddle.x, paddle.y, paddle.width, paddle.height,10,'#3DE7D2')
}


// preload images
function blue() {
  blueBrick = new Image();
  blueBrick.onload = function() {
      loop = setInterval(function() {
        drawBricks();
      }, 1000/30);
  };
  blueBrick.src = "assets/blue.png";
}
blue()
function yellow() {
  yellowBrick = new Image();
  yellowBrick.onload = function() {
      loop = setInterval(function() {
        drawBricks();
      }, 1000/30);
  };
  yellowBrick.src = "assets/yellow.png";
}
yellow()
function red() {
  redBrick = new Image();
  redBrick.onload = function() {
      loop = setInterval(function() {
        drawBricks();
      }, 1000/30);
  };
  redBrick.src = "assets/red.png";
}
red()
// draw bricks
function drawBricks() {
  for (var c = 0; c < colCount; c++) {
    for (var r = 0; r < rowCount; r++) {
      var brick = bricks[c][r];
      if (brick.status == 1) {
        brick.x = c * (brick.width + brick.padding) + offsetLeft;
        brick.y = r * (brick.height + brick.padding) + offsetTop;
        if (brick.color==='blue'){
          ctx.drawImage(blueBrick, brick.x, brick.y)
        }
else if (brick.color==="yellow"){
  ctx.drawImage(yellowBrick, brick.x, brick.y)
}else if (brick.color==="red"){
  ctx.drawImage(redBrick, brick.x, brick.y)
}
        else{
        roundedRect(ctx,brick.x, brick.y, brick.width, brick.height,2,brick.color)}
      }
    }
  }
}

// detect if ball hit brick
function collision() {
  for (var c = 0; c < colCount; c++) {
    for (var r = 0; r < rowCount; r++) {
      var brick = bricks[c][r];
      if (brick.status == 1) {
        if (
          ball.x + ball.radius > brick.x &&
          ball.x - ball.radius < brick.x + brick.width &&
          ball.y + ball.radius > brick.y &&
          ball.y - ball.radius < brick.y + brick.height
        ) {
          BRICK_HIT.play();
          ball.dy *= -1;
          brick.status = 0;
          score += 10;
          scoreText.innerHTML = score;
          numBricks -= 1;
          if (numBricks == 0) {
            WIN.play()
            showResult(true)
            ball.dx = 0;
            ball.dy = 0;
          }
        }
      }
    }
  }
}

// reset ball and paddle position
function reset() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 50;
  ball.dx = 3;
  ball.dy = -4;

  paddle.x = (canvas.width - paddle.width) / 2;
  paddle.y = canvas.height - paddle.height * 2;
}

// handle key presses
function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

// Update screen to reflect state of game.
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();

  // bounce off edges and paddles
  if (
    ball.x + ball.dx > canvas.width - ball.radius ||
    ball.x + ball.dx < ball.radius
  ) {
    WALL_HIT.play()
    ball.dx *= -1;
  }
  if (ball.y + ball.dy < ball.radius) {
    ball.dy *= -1;
    WALL_HIT.play()
  } else if (ball.y + ball.dy > paddle.y - ball.radius) {
    PADDLE_HIT.play()
    if (
      ball.x + ball.radius > paddle.x &&
      ball.x - ball.radius < paddle.x + paddle.width
    ) {
      // calculate angle of ball from where it hits the paddle
      var angle =
        ((Math.PI / 2) * (paddle.x + paddle.width / 2 - ball.x)) /
        (paddle.width / 2);
      ball.dx = -1 * (Math.sin(angle) * ball.speed);
      ball.dy = -1 * (Math.cos(angle) + ball.speed);
    } else {
      LIFE_LOST.play()
      lives -= 1;
      livesText.innerHTML = lives;
      reset();
      if (lives < 1) {
        showResult(win=false)
        ball.dx = 0;
        ball.dy = 0;
      }
    }
  }

  // update paddle
  if (rightPressed && paddle.x < canvas.width - paddle.width) {
    paddle.x += 7;
  } else if (leftPressed && paddle.x > 0) {
    paddle.x -= 7;
  }

  
  // update ball position
  ball.x += ball.dx;
  ball.y += ball.dy;

  // check for collisions
  collision();
}

canvas.addEventListener('mousemove',(e)=>{
  paddle.x = e.clientX-75
})
canvas.addEventListener("touchmove",(e)=>{
  paddle.x = e.touches[0].clientX-75
  // console.log(e)
})

function showResult(win=false){
  BG.pause()
  document.querySelector("section").style.display="flex"
  document.querySelector("section").style.opacity=1
  if (win=='pause'){
    document.querySelector(".result_title").innerHTML="PAUSE"
    gameState(false)
  }
  else if (win){
    document.querySelector(".result_title").innerHTML="WIN"
  }
  else{
    document.querySelector(".result_title").innerHTML="LOST"
  }
  document.querySelector(".final_score").innerHTML = score;
}

document.querySelector(".pause").addEventListener('click',()=>{
  showResult('pause')
})

document.querySelector(".retry").addEventListener('click',()=>{
  location.reload()
})

document.querySelector(".next").addEventListener('click',()=>{
  document.querySelector("section").style.display="none"
  gameState(true)
  BG.play()
})
