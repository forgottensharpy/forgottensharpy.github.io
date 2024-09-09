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
const playerPaddleSpeed = 6; // Speed of the player paddle
const aiPaddleSpeed = 4; // Speed of the AI paddle
const aiMistakeChance = 22; // Probability of the AI making a mistake
let playerPaddle = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight };
let aiPaddle = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight };

// Ball properties
let ball = { x: canvas.width / 2, y: canvas.height / 2, size: ballSize, speedX: 5, speedY: 3 };

// Scores
let playerScore = 0;
let aiScore = 0;

// Control settings
document.addEventListener('keydown', movePaddle);
document.addEventListener('keyup', stopPaddle);

function movePaddle(event) {
    if (event.key === 'ArrowUp') {
        playerPaddle.y -= playerPaddleSpeed;
    } else if (event.key === 'ArrowDown') {
        playerPaddle.y += playerPaddleSpeed;
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
    if (ball.x - ball.size < 0) {
        // Player scores
        aiScore++;
        resetBall();
    } else if (ball.x + ball.size > canvas.width) {
        // AI scores
        playerScore++;
        resetBall();
    }

    // AI paddle movement with random mistakes
    if (Math.random() < aiMistakeChance) {
        // Randomly move AI paddle up or down to simulate mistakes
        aiPaddle.y += (Math.random() < 0.5 ? -aiPaddleSpeed : aiPaddleSpeed);
    } else {
        // Follow the ball with AI's slower speed
        if (ball.y > aiPaddle.y + aiPaddle.height / 2) {
            aiPaddle.y += aiPaddleSpeed;
        } else {
            aiPaddle.y -= aiPaddleSpeed;
        }
    }

    // Ensure paddles don't go out of bounds
    playerPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, playerPaddle.y));
    aiPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, aiPaddle.y));

    // Draw scores
    ctx.fillStyle = '#fff';
    ctx.font = '30px "Resist Sans", sans-serif'; // Use Resist Sans font
    ctx.textAlign = 'center';
    ctx.fillText(`Player: ${playerScore}`, canvas.width / 4, 30);
    ctx.fillText(`AI: ${aiScore}`, 3 * canvas.width / 4, 30);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = -ball.speedX;
    ball.speedY = 3;
}

// Game loop
setInterval(draw, 1000 / 60); // 60 frames per second

// Initialize game
background.onload = () => {
    draw();
};
