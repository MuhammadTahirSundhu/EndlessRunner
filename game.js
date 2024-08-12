const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Fixed canvas size for mobile screens
const canvasWidth = 360;
const canvasHeight = 640;

// Set canvas size
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Game variables
let gameSpeed = 1;
let gravity = 1;
let isJumping = false;
let jumpPower = 20;
let playerYVelocity = 0;
let playerX = 50;
let playerY = canvasHeight - 150;
let obstacles = [];
let score = 0;
let isGameOver = false;

// Player object
const player = {
    width: 20,
    height: 20,
    draw: function() {
        ctx.fillStyle = 'green';
        ctx.fillRect(playerX, playerY, this.width, this.height);
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
    this.width = 20;
    this.height = 20;
    this.x = canvasWidth;
    this.y = canvasHeight - this.height;

    this.draw = function() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    this.update = function() {
        this.x -= gameSpeed;
        this.draw();
    };
}

// Generate obstacles
function generateObstacles() {
    if (Math.random() < 0.01) {
        obstacles.push(new Obstacle());
    }

    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

// Check collision
function checkCollision(obstacle) {
    if (
        playerX < obstacle.x + obstacle.width &&
        playerX + player.width > obstacle.x &&
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
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvasWidth / 2 - 80, canvasHeight / 2);
    ctx.fillText('Score: ' + score, canvasWidth / 2 - 80, canvasHeight / 2 + 40);
}

// Update game
function updateGame() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    player.update();
    generateObstacles();

    obstacles.forEach(obstacle => {
        obstacle.update();

        if (checkCollision(obstacle)) {
            gameOver();
        }
    });

    score++;
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 20, 30);

    requestAnimationFrame(updateGame);
}

// Handle touch events
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
