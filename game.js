const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Fixed canvas size for mobile screens
const canvasWidth = 360;
const canvasHeight = 540;

// Set canvas size
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Game variables
let gameSpeed = 3;
let gravity = 0.5;
let isJumping = false;
let jumpPower = 12;
let playerYVelocity = 0;
let playerX = 50;
let playerY = canvasHeight - 150;
let obstacles = [];
let score = 0;
let isGameOver = false;

// Load images
const playerImg = new Image();
playerImg.src = './1.png'; // replace with the actual path to the player image

const obstacleImg = new Image();
obstacleImg.src = './obs.png'; // replace with the actual path to the obstacle image

// Load background images
const background1Img = new Image();
background1Img.src = './bg.png'; // replace with the actual path to the first background image

const background2Img = new Image();
background2Img.src = './bg.png'; // replace with the actual path to the second background image

// Background layers
const background1 = {
    x1: 0,
    x2: canvasWidth,
    speed: 0.5, // Slowest layer (farthest away)
    draw: function() {
        ctx.drawImage(background1Img, this.x1, 0, canvasWidth, canvasHeight);
        ctx.drawImage(background1Img, this.x2, 0, canvasWidth, canvasHeight);
    },
    update: function() {
        this.x1 -= this.speed;
        this.x2 -= this.speed;

        if (this.x1 <= -canvasWidth) {
            this.x1 = canvasWidth;
        }
        if (this.x2 <= -canvasWidth) {
            this.x2 = canvasWidth;
        }

        this.draw();
    }
};

const background2 = {
    x1: 0,
    x2: canvasWidth,
    speed: 1, // Faster layer (closer to player)
    draw: function() {
        ctx.drawImage(background2Img, this.x1, 0, canvasWidth, canvasHeight);
        ctx.drawImage(background2Img, this.x2, 0, canvasWidth, canvasHeight);
    },
    update: function() {
        this.x1 -= this.speed;
        this.x2 -= this.speed;

        if (this.x1 <= -canvasWidth) {
            this.x1 = canvasWidth;
        }
        if (this.x2 <= -canvasWidth) {
            this.x2 = canvasWidth;
        }

        this.draw();
    }
};

// Player object
const player = {
    width: 50, 
    height: 50, 
    draw: function() {
        ctx.drawImage(playerImg, playerX, playerY, this.width, this.height);
    },
    update: function() {
        if (isJumping) {
            playerYVelocity = -jumpPower;
            isJumping = false;
        }
        playerY += playerYVelocity;
        playerYVelocity += gravity;

        if (playerY + this.height >= canvasHeight) {
            playerY = canvasHeight - this.height;
            playerYVelocity = 0;
        }

        this.draw();
    }
};

// Obstacle object
function Obstacle() {
    this.width = 30;
    this.height = 35;
    this.x = canvasWidth;
    this.y = canvasHeight - this.height;

    this.draw = function() {
        ctx.drawImage(obstacleImg, this.x, this.y, this.width, this.height);
    };

    this.update = function() {
        this.x -= gameSpeed;
        this.draw();
    };
}

// Generate obstacles
function generateObstacles() {
    if (Math.random() < 0.005) {
        obstacles.push(new Obstacle());
    }

    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

// Check collision
function checkCollision(obstacle) {
    if (
        playerX + 15 < obstacle.x + obstacle.width &&
        playerX + player.width > obstacle.x + 15 &&
        playerY < obstacle.y + obstacle.height &&
        playerY + player.height > obstacle.y
    ) {
        return true;
    }
    return false;
}

// Game over
function gameOver() {
    isGameOver = true;
    ctx.fillStyle = 'white';
    ctx.font = '35px Arial';
    ctx.fillText('Game Over', canvasWidth / 2 - 80, canvasHeight / 2);
    ctx.fillText('Score: ' + score, canvasWidth / 2 - 80, canvasHeight / 2 + 40);

    // Show the restart button
    const restartButton = document.getElementById('restartButton');
    restartButton.style.display = 'block';
}

// Restart game
function restartGame() {
    isGameOver = false;
    score = 0;
    playerYVelocity = 0;
    playerY = canvasHeight - 150;
    obstacles = [];
    document.getElementById('restartButton').style.display = 'none';
    updateGame();
}

// Add event listener to the restart button
document.getElementById('restartButton').addEventListener('click', restartGame);

// Update game
function updateGame() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Update backgrounds
    background1.update();
    background2.update();

    player.update();
    generateObstacles();

    obstacles.forEach(obstacle => {
        obstacle.update();

        if (checkCollision(obstacle)) {
            gameOver();
        }
    });

    score++;
    ctx.fillStyle = 'white';
    ctx.font = '25px Arial';
    ctx.fillText('Score: ' + score, 20, 30);

    requestAnimationFrame(updateGame);
}

// Handle touch events
canvas.addEventListener('touchstart', () => {
    if (playerY + player.height >= canvasHeight) {
        isJumping = true;
    }
});

// Handle mouse click events
canvas.addEventListener('mousedown', () => {
    if (playerY + player.height >= canvasHeight) {
        isJumping = true;
    }
});

// Start the game
updateGame();
