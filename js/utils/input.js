class InputHandler {
    constructor() {
        this.keys = {};
        this.mouseX = 400; // Default to center of canvas
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            console.log('Key pressed:', e.key);
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    setupMouseControls(canvas) {
        // Fix mouse coordinates by getting proper canvas position
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            
            this.mouseX = (e.clientX - rect.left) * scaleX;
            console.log('Mouse moved - Raw:', e.clientX - rect.left, 'Scaled:', this.mouseX);
        });
        
        canvas.addEventListener('click', (e) => {
            console.log('Canvas clicked at:', this.mouseX);
        });
        
        // Also listen on document for better responsiveness
        document.addEventListener('mousemove', (e) => {
            if (e.target === canvas) {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                this.mouseX = (e.clientX - rect.left) * scaleX;
            }
        });
    }

    setupTouchControls(canvas) {
        canvas.addEventListener('touchstart', (e) => {
            // No preventDefault here!
            console.log('Touch start');
        }, { passive: true });
        
        canvas.addEventListener('touchmove', (e) => {
            // Only preventDefault if needed (e.g., to avoid scrolling when interacting with canvas)
            // e.preventDefault(); // Commented out to avoid scroll conflict
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const scaleX = canvas.width / rect.width;
            this.mouseX = (touch.clientX - rect.left) * scaleX;
            console.log('Touch moved to:', this.mouseX);
        }, { passive: true });
    }
}