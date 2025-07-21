class Paddle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.PADDLE.WIDTH;
        this.height = CONFIG.PADDLE.HEIGHT;
        this.speed = CONFIG.PADDLE.SPEED;
    }

    update(mouseX, keys, canvasWidth) {
        // Keyboard controls
        if (keys['a'] || keys['arrowleft']) {
            this.x -= this.speed;
        }
        if (keys['d'] || keys['arrowright']) {
            this.x += this.speed;
        }
        
        // Mouse controls
        this.x = mouseX - this.width / 2;
        
        // Keep within bounds
        this.x = Math.max(0, Math.min(canvasWidth - this.width, this.x));
    }

    render(ctx) {
        const gradient = ctx.createLinearGradient(0, this.y, 0, this.y + this.height);
        gradient.addColorStop(0, CONFIG.PADDLE.COLOR);
        gradient.addColorStop(1, '#44a08d');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}