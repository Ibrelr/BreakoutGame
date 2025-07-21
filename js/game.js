class BreakoutGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.levelElement = document.getElementById('level');
        this.gameOverElement = document.getElementById('gameOver');
        this.inputHandler = new InputHandler();
        this.effectsHandler = new EffectsHandler();

        this.init();
        this.gameLoop();
    }

    init() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.ballLaunched = false;
        this.score = 0;
        this.lives = CONFIG.GAME.INITIAL_LIVES;
        this.level = 1;

        // Create entities
        this.paddle = new Paddle(
            this.canvas.width / 2 - CONFIG.PADDLE.WIDTH / 2,
            this.canvas.height - 30
        );

        this.ball = new Ball(
            this.paddle.x + this.paddle.width / 2,
            this.paddle.y - CONFIG.BALL.RADIUS - 1
        );
        this.ball.speedX = 0;
        this.ball.speedY = 0;
        this.ballLaunched = false;

        this.createBricks();
        this.inputHandler.setupMouseControls(this.canvas);
        this.inputHandler.setupTouchControls(this.canvas);
        this.updateDisplay();

        // Launch ball on click or space
        this.canvas.addEventListener('click', () => this.launchBall());
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.gameRunning && !this.ballLaunched) {
                e.preventDefault();
                this.launchBall();
            }
        });
    }

    createBricks() {
        this.bricks = [];
        const rows = 5 + Math.floor(this.level / 3);
        const cols = 10;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = c * (CONFIG.BRICKS.WIDTH + CONFIG.BRICKS.PADDING) + 35;
                const y = r * (CONFIG.BRICKS.HEIGHT + CONFIG.BRICKS.PADDING) + 50;
                this.bricks.push(new Brick(x, y, r));
            }
        }
    }

    update() {
        if (!this.gameRunning || this.gamePaused) return;
        this.updatePaddle();
        this.updateBall();
        this.checkCollisions();
        this.checkWinCondition();
    }

    updatePaddle() {
        // Paddle always follows mouse
        if (this.inputHandler.mouseX !== undefined) {
            this.paddle.x = this.inputHandler.mouseX - this.paddle.width / 2;
        }
        // Keyboard fallback
        if (this.inputHandler.keys['a'] || this.inputHandler.keys['arrowleft']) {
            this.paddle.x -= CONFIG.PADDLE.SPEED;
        }
        if (this.inputHandler.keys['d'] || this.inputHandler.keys['arrowright']) {
            this.paddle.x += CONFIG.PADDLE.SPEED;
        }
        // Keep paddle within bounds
        this.paddle.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, this.paddle.x));
    }

    updateBall() {
        if (!this.ballLaunched) {
            // Ball sits on paddle before launch
            this.ball.x = this.paddle.x + this.paddle.width / 2;
            this.ball.y = this.paddle.y - this.ball.radius - 1;
            return;
        }
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;
        // Wall collisions
        if (this.ball.x <= this.ball.radius || this.ball.x >= this.canvas.width - this.ball.radius) {
            this.ball.speedX = -this.ball.speedX;
            try { this.effectsHandler.createImpactEffect(this.ball.x, this.ball.y); } catch (e) {}
        }
        if (this.ball.y <= this.ball.radius) {
            this.ball.speedY = -this.ball.speedY;
            try { this.effectsHandler.createImpactEffect(this.ball.x, this.ball.y); } catch (e) {}
        }
        // Bottom wall (lose life)
        if (this.ball.y >= this.canvas.height - this.ball.radius) {
            this.loseLife();
        }
    }

    checkCollisions() {
        // Paddle collision
        if (CollisionDetector.ballPaddle(this.ball, this.paddle)) {
            CollisionDetector.handlePaddleCollision(this.ball, this.paddle);
            try { this.effectsHandler.createImpactEffect(this.ball.x, this.paddle.y); } catch (e) {}
        }
        // Brick collisions
        this.bricks.forEach(brick => {
            if (CollisionDetector.ballBrick(this.ball, brick)) {
                brick.visible = false;
                this.score += brick.points;
                this.updateDisplay();
                CollisionDetector.handleBrickCollision(this.ball, brick);
                try { this.effectsHandler.createBrickExplosion(brick); } catch (e) {}
                // Increase ball speed slightly
                const speedIncrease = CONFIG.GAME.SPEED_INCREASE;
                this.ball.speedX *= speedIncrease;
                this.ball.speedY *= speedIncrease;
                // Cap max speed
                const currentSpeed = Math.sqrt(this.ball.speedX * this.ball.speedX + this.ball.speedY * this.ball.speedY);
                if (currentSpeed > CONFIG.BALL.MAX_SPEED) {
                    this.ball.speedX = (this.ball.speedX / currentSpeed) * CONFIG.BALL.MAX_SPEED;
                    this.ball.speedY = (this.ball.speedY / currentSpeed) * CONFIG.BALL.MAX_SPEED;
                }
            }
        });
    }

    checkWinCondition() {
        const visibleBricks = this.bricks.filter(brick => brick.visible);
        if (visibleBricks.length === 0) {
            this.nextLevel();
        }
    }

    nextLevel() {
        this.level++;
        this.ballLaunched = false;
        this.ball.speedX = 0;
        this.ball.speedY = 0;
        this.ball.x = this.paddle.x + this.paddle.width / 2;
        this.ball.y = this.paddle.y - this.ball.radius - 1;
        this.createBricks();
        this.updateDisplay();
    }

    loseLife() {
        this.lives--;
        this.updateDisplay();
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.resetBall();
        }
    }

    resetBall() {
        this.ballLaunched = false;
        this.ball.speedX = 0;
        this.ball.speedY = 0;
        this.ball.x = this.paddle.x + this.paddle.width / 2;
        this.ball.y = this.paddle.y - this.ball.radius - 1;
    }

    gameOver() {
        this.gameRunning = false;
        document.getElementById('gameOverTitle').textContent = 'Game Over!';
        document.getElementById('finalScore').textContent = `Final Score: ${this.score}`;
        this.gameOverElement.style.display = 'block';
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw ball
        this.ctx.save();
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
        // Draw paddle
        this.paddle.render(this.ctx);
        // Draw bricks
        this.bricks.forEach(brick => {
            if (brick.visible) {
                brick.render(this.ctx);
            }
        });
        // Draw game paused text
        if (this.gamePaused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        }
        // Instructions for launching ball
        if (this.gameRunning && !this.ballLaunched) {
            this.ctx.fillStyle = '#ffff00';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('KLIKK PÅ CANVAS ELLER TRYKK SPACE FOR Å STARTE BALLEN!', this.canvas.width / 2, this.canvas.height / 2 + 50);
        }
    }

    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.livesElement.textContent = this.lives;
        this.levelElement.textContent = this.level;
    }

    gameLoop() {
        if (!this.frameCount) this.frameCount = 0;
        this.frameCount++;
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    start() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gamePaused = false;
            this.gameOverElement.style.display = 'none';
        }
    }

    pause() {
        this.gamePaused = !this.gamePaused;
    }

    reset() {
        this.init();
        this.gameRunning = false;
        this.gameOverElement.style.display = 'none';
    }

    restart() {
        this.reset();
        this.start();
    }

    launchBall() {
        if (this.gameRunning && !this.ballLaunched) {
            this.ball.speedX = CONFIG.BALL.SPEED;
            this.ball.speedY = -CONFIG.BALL.SPEED;
            this.ballLaunched = true;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        window.game = new BreakoutGame();
        window.game.render();
    } catch (error) {
        console.error('Error initializing game:', error);
        alert('Error initializing game: ' + error.message);
    }
});