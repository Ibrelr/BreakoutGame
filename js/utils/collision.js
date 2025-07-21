class CollisionDetector {
    static ballPaddle(ball, paddle) {
        return ball.y + ball.radius >= paddle.y &&
               ball.x >= paddle.x &&
               ball.x <= paddle.x + paddle.width &&
               ball.speedY > 0;
    }

    static ballBrick(ball, brick) {
        if (!brick.visible) return false;
        
        return ball.x + ball.radius >= brick.x &&
               ball.x - ball.radius <= brick.x + brick.width &&
               ball.y + ball.radius >= brick.y &&
               ball.y - ball.radius <= brick.y + brick.height;
    }

    static handlePaddleCollision(ball, paddle) {
        const hitPos = (ball.x - paddle.x) / paddle.width;
        const angle = (hitPos - 0.5) * Math.PI / 3;
        
        const speed = Math.sqrt(ball.speedX * ball.speedX + ball.speedY * ball.speedY);
        ball.speedX = speed * Math.sin(angle);
        ball.speedY = -speed * Math.cos(angle);
    }

    static handleBrickCollision(ball, brick) {
        const ballCenterX = ball.x;
        const ballCenterY = ball.y;
        const brickCenterX = brick.x + brick.width / 2;
        const brickCenterY = brick.y + brick.height / 2;
        
        const dx = ballCenterX - brickCenterX;
        const dy = ballCenterY - brickCenterY;
        
        if (Math.abs(dx) > Math.abs(dy)) {
            ball.speedX = -ball.speedX;
        } else {
            ball.speedY = -ball.speedY;
        }
    }
}