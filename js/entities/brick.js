class Brick {
    constructor(x, y, row) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.BRICKS.WIDTH;
        this.height = CONFIG.BRICKS.HEIGHT;
        this.color = CONFIG.BRICKS.COLORS[row % CONFIG.BRICKS.COLORS.length];
        this.visible = true;
        this.points = (5 - row) * 10; // Higher rows (lower numbers) = more points
    }

    render(ctx) {
        if (!this.visible) return;
        
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    destroy() {
        this.visible = false;
    }
}