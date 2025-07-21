class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = CONFIG.BALL.RADIUS;
        this.speedX = CONFIG.BALL.SPEED;
        this.speedY = -CONFIG.BALL.SPEED;
        this.maxSpeed = CONFIG.BALL.MAX_SPEED;
        
        console.log('Ball created at:', x, y, 'with speed:', this.speedX, this.speedY);
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    render(ctx) {
        ctx.save();
        ctx.shadowColor = CONFIG.BALL.COLOR;
        ctx.shadowBlur = 20;
        ctx.fillStyle = CONFIG.BALL.COLOR;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    reset(x, y) {
        console.log('Ball.reset() called');
        this.x = x;
        this.y = y;
        this.speedX = CONFIG.BALL.SPEED;
        this.speedY = -CONFIG.BALL.SPEED;
        console.log('Ball reset to:', x, y, 'with speed:', this.speedX, this.speedY);
    }

    increaseSpeed() {
        this.speedX *= CONFIG.GAME.SPEED_INCREASE;
        this.speedY *= CONFIG.GAME.SPEED_INCREASE;
        
        const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        if (currentSpeed > this.maxSpeed) {
            this.speedX = (this.speedX / currentSpeed) * this.maxSpeed;
            this.speedY = (this.speedY / currentSpeed) * this.maxSpeed;
        }
        console.log('Ball speed increased to:', this.speedX, this.speedY);
    }
}