/**
 * StartScreen class displaying the game's main menu and instructions.
 * Provides play button and how-to-play interface.
 */
class StartScreen {
    /**
     * Initializes the start screen with canvas and start callback.
     * @param {HTMLCanvasElement} canvas - The game canvas element.
     * @param {Function} startCallback - Function to call when play button is clicked.
     */
    constructor(canvas, startCallback) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.startCallback = startCallback;
        this.playButton = { x: 260, y: 320, width: 200, height: 60 };
        this.instructionsButton = { x: 260, y: 400, width: 200, height: 60 };
        this.backButton = { x: 260, y: 420, width: 200, height: 60 };
        this.showingInstructions = false;
        this.startImage = new Image();
        this.startImage.src = 'IMG/9_intro_outro_screens/start/startscreen_2.png';
        this.handleClick = this.handleClick.bind(this);
    }
    
    /**
     * Displays the start screen and attaches event listeners.
     */
    show() {
        this.startImage.onload = () => this.draw();
        this.draw();
        this.canvas.addEventListener('click', this.handleClick);
        this.canvas.addEventListener('touchstart', this.handleClick);
        this.canvas.addEventListener('mousemove', this.handleHover.bind(this));
    }

    /**
     * Draws the start screen or instructions screen based on current state.
     */
    draw() {
        const { ctx, canvas, playButton, instructionsButton, backButton } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.showingInstructions) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'white';
            ctx.font = '48px zabras';
            ctx.textAlign = 'center';
            ctx.fillText('HOW TO PLAY', canvas.width / 2, 80);

            ctx.font = '24px zabras';
            ctx.textAlign = 'left';
            const instructions = [
                'CONTROLS:',
                '•  UP ARROW / SPACE: Jump',
                '•  LEFT ARROW: Move Left',
                '•  RIGHT ARROW: Move Right',
                '',
                'GAMEPLAY:',
                '• Jump on chickens to defeat them',
                '• Collect bottles and throw them with D',
                '• Collect coins for permanent movespeed boost',
                '• Avoid touching enemies',
                '• Defeat the endboss to win!',
                '',
                'MOBILE: Use the on-screen controls'
            ];

            let yPos = 140;
            instructions.forEach(line => {
                ctx.fillText(line, 50, yPos);
                yPos += 30;
            });

            ctx.fillStyle = 'black';
            ctx.fillRect(backButton.x, backButton.y, backButton.width, backButton.height);
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.font = '36px zabras';
            ctx.fillText('BACK', backButton.x + backButton.width / 2, backButton.y + 35);
        } else {
            ctx.drawImage(this.startImage, 0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'black';
            ctx.font = '66px zabras';
            ctx.textAlign = 'center';
            ctx.fillText('PLAY', playButton.x + playButton.width / 2, playButton.y + 38);

            ctx.fillStyle = 'black';
            ctx.font = '36px zabras';
            ctx.fillText('HOW TO PLAY', instructionsButton.x + instructionsButton.width / 2, instructionsButton.y + 35);
        }
    }

    /**
     * Handles mouse hover to change cursor when over buttons.
     * @param {MouseEvent} event - The mouse move event.
     */
    handleHover(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (event.clientX || event.touches?.[0].clientX) - rect.left;
        const y = (event.clientY || event.touches?.[0].clientY) - rect.top;
        const canvasX = x * scaleX;
        const canvasY = y * scaleY;

        let isHoveringButton = false;

        if (this.showingInstructions) {
            if (
                canvasX >= this.backButton.x &&
                canvasX <= this.backButton.x + this.backButton.width &&
                canvasY >= this.backButton.y &&
                canvasY <= this.backButton.y + this.backButton.height
            ) {
                isHoveringButton = true;
            }
        } else {
            if (
                (canvasX >= this.playButton.x &&
                canvasX <= this.playButton.x + this.playButton.width &&
                canvasY >= this.playButton.y &&
                canvasY <= this.playButton.y + this.playButton.height) ||
                (canvasX >= this.instructionsButton.x &&
                canvasX <= this.instructionsButton.x + this.instructionsButton.width &&
                canvasY >= this.instructionsButton.y &&
                canvasY <= this.instructionsButton.y + this.instructionsButton.height)
            ) {
                isHoveringButton = true;
            }
        }

        this.canvas.style.cursor = isHoveringButton ? 'pointer' : 'default';
    }

    /**
     * Converts event coordinates to canvas coordinates accounting for scaling.
     * @param {Event} event - The mouse or touch event.
     * @returns {Object} Object with canvasX and canvasY properties.
     */
    getCanvasCoords(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const clientX = event.clientX || event.touches?.[0].clientX;
        const clientY = event.clientY || event.touches?.[0].clientY;

        return {
            canvasX: (clientX - rect.left) * scaleX,
            canvasY: (clientY - rect.top) * scaleY
        };
    }

    /**
     * Checks if coordinates are inside a button area.
     * @param {number} x - X-coordinate to check.
     * @param {number} y - Y-coordinate to check.
     * @param {Object} btn - Button object with position and dimensions.
     * @returns {boolean} True if coordinates are inside button.
     */
    isInside(x, y, btn) {
        return (
            x >= btn.x &&
            x <= btn.x + btn.width &&
            y >= btn.y &&
            y <= btn.y + btn.height
        );
    }

    /**
     * Handles click and touch events on buttons.
     * @param {Event} event - The click or touch event.
     */
    handleClick(event) {
        event.preventDefault();

        const { canvasX, canvasY } = this.getCanvasCoords(event);

        if (this.showingInstructions) {
            if (this.isInside(canvasX, canvasY, this.backButton)) {
                this.showingInstructions = false;
                this.draw();
            }
            return;
        }

        if (this.isInside(canvasX, canvasY, this.playButton)) {
            this.startPlay();
        } 
        else if (this.isInside(canvasX, canvasY, this.instructionsButton)) {
            this.showingInstructions = true;
            this.draw();
        }
    }

    /**
     * Starts the game by recreating the canvas and calling the start callback.
     */
    startPlay() {
        const newCanvas = recreateCanvas();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.startCallback(newCanvas);
    }
}