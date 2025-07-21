const CONFIG = {
    CANVAS: {
        WIDTH: 800,
        HEIGHT: 600
    },
    PADDLE: {
        WIDTH: 150,
        HEIGHT: 15,
        SPEED: 8,
        COLOR: '#4ecdc4'
    },
    BALL: {
        RADIUS: 8,
        SPEED: 2.5,      // Slower starting speed
        MAX_SPEED: 5,    // Lower max speed
        COLOR: '#4ecdc4'
    },
    BRICKS: {
        WIDTH: 75,
        HEIGHT: 25,
        PADDING: 5,
        COLORS: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']
    },
    GAME: {
        INITIAL_LIVES: 3,
        SPEED_INCREASE: 1.01 // Slower speed increase
    }
};