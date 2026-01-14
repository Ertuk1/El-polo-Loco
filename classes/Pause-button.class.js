class PauseButton {
    constructor(canvas, onClick) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.onClick = onClick;
        
        // Match mute button styling
        this.buttonConfig = {
x: 0.88,   // Left of mute button (mute is at 0.944)
    y: 0.175,  // Same y as mute button
    size: 0.04 // Your preferred size
        };
        
        this.handleClick = this.handleClick.bind(this);
        this.handleTouch = this.handleTouch.bind(this);
        canvas.addEventListener('click', this.handleClick);
        canvas.addEventListener('touchstart', this.handleTouch);
    }
    
    getButtonPx() {
        return {
            x: this.buttonConfig.x * 720,
            y: this.buttonConfig.y * 480,
            size: this.buttonConfig.size * 720
        };
    }
    
    draw() {
        const btn = this.getButtonPx();
        
        // Draw background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(btn.x, btn.y, btn.size, btn.size);
        
        // Draw pause symbol (two vertical bars)
        this.ctx.fillStyle = 'white';
        const barWidth = btn.size * 0.25;
        const barHeight = btn.size * 0.6;
        const barY = btn.y + btn.size * 0.2;
        const spacing = btn.size * 0.15;
        
        // Left bar
        this.ctx.fillRect(btn.x + spacing, barY, barWidth, barHeight);
        // Right bar
        this.ctx.fillRect(btn.x + btn.size - spacing - barWidth, barY, barWidth, barHeight);
    }
    
    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const canvasX = (event.clientX - rect.left) * scaleX;
        const canvasY = (event.clientY - rect.top) * scaleY;
        const btn = this.getButtonPx();
        const hitSize = btn.size * 1.5; // 50% larger hit area like mute button
        const offset = (hitSize - btn.size) / 2;
        
        if (
            canvasX >= btn.x - offset &&
            canvasX <= btn.x + btn.size + offset &&
            canvasY >= btn.y - offset &&
            canvasY <= btn.y + btn.size + offset
        ) {
            this.onClick();
        }
    }
    
    handleTouch(event) {
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const touch = event.touches[0];
        const canvasX = (touch.clientX - rect.left) * scaleX;
        const canvasY = (touch.clientY - rect.top) * scaleY;
        const btn = this.getButtonPx();
        const hitSize = btn.size * 1.5; // 50% larger hit area
        const offset = (hitSize - btn.size) / 2;
        
        if (
            canvasX >= btn.x - offset &&
            canvasX <= btn.x + btn.size + offset &&
            canvasY >= btn.y - offset &&
            canvasY <= btn.y + btn.size + offset
        ) {
            this.onClick();
        }
    }
    
    remove() {
        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('touchstart', this.handleTouch);
    }
}