const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 400;

// Load background image
const background = new Image();
background.src = 'assets/background.png'; // Path to the background image

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

// Paddle positions and speeds
const paddleSpeed = 10; // Speed of both paddles
const aiMistakeChance = 22; // Probability of the AI making a mistake
let playerPaddle = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight };
let aiPaddle = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight };

// Ball properties
let ball = { x: canvas.width / 2, y: canvas.height / 2, size: ballSize, speedX: 5, speedY: 3 };

// Control settings
document.addEventListener('keydown', movePaddle);
document.addEventListener('keyup', stopPaddle);

function movePaddle(event) {
    if (event.key === 'ArrowUp') {
        playerPaddle.y -= paddleSpeed;
    } else if (event.key === 'ArrowDown') {
        playerPaddle.y += paddleSpeed;
    }
}

function stopPaddle(event) {
    // No specific action required for stopping the paddle, just handling the movement
}

function draw() {
    // Draw background
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // Update ball position
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collision with top and bottom walls
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.speedY = -ball.speedY;
    }

    // Ball collision with paddles
    if (
        (ball.x - ball.size < playerPaddle.x + playerPaddle.width &&
         ball.y > playerPaddle.y &&
         ball.y < playerPaddle.y + playerPaddle.height) ||
        (ball.x + ball.size > aiPaddle.x &&
         ball.y > aiPaddle.y &&
         ball.y < aiPaddle.y + aiPaddle.height)
    ) {
        ball.speedX = -ball.speedX;
    }

    // Ball reset if it goes off the sides
    if (ball.x - ball.size < 0 || ball.x + ball.size > canvas.width) {
        // Reset ball position and speed
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.speedX = -ball.speedX;
        ball.speedY = 3;
    }

    // AI paddle movement with random mistakes
    if (Math.random() < aiMistakeChance) {
        // Randomly move AI paddle up or down to simulate mistakes
        aiPaddle.y += (Math.random() < 0.5 ? -paddleSpeed : paddleSpeed);
    } else {
        // Follow the ball with some constraints
        if (aiPaddle.y + aiPaddle.height / 2 < ball.y) {
            aiPaddle.y += paddleSpeed;
        } else {
            aiPaddle.y -= paddleSpeed;
        }
    }

    // Ensure paddles don't go out of bounds
    playerPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, playerPaddle.y));
    aiPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, aiPaddle.y));
}

// Game loop
setInterval(draw, 1000 / 120); // 120 frames per second

// Initialize game
background.onload = () => {
    draw();
};
