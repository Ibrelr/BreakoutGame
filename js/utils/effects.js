class EffectsHandler {
    createParticle(x, y, color) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.background = color;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        const dx = (Math.random() - 0.5) * 100;
        const dy = (Math.random() - 0.5) * 100;
        particle.style.setProperty('--dx', dx + 'px');
        particle.style.setProperty('--dy', dy + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 600);
    }

    createBrickExplosion(brick) {
        const centerX = brick.x + brick.width / 2;
        const centerY = brick.y + brick.height / 2;
        
        for (let i = 0; i < 12; i++) {
            this.createParticle(centerX, centerY, brick.color);
        }
    }

    createImpactEffect(x, y) {
        for (let i = 0; i < 8; i++) {
            this.createParticle(x, y, '#4ecdc4');
        }
    }
}