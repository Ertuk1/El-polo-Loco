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
            this.instructionsButton = { x: 260, y:  240, width: 200, height: 60 };
            this.impressumButton = { x: 260, y:400, width: 200, height: 60 };

            this.backButton = {
                x: (this.canvas.width - 200) / 2,
                y: (this.canvas.height - 60) / 2,
                width: 200,
                height: 60
            };

            this.showingInstructions = false;
            this.startImage = new Image();
            this.startImage.src = 'IMG/9_intro_outro_screens/start/startscreen_2.png';
            this.handleClick = this.handleClick.bind(this);
            this.lastTouchTime = 0;
            this.hoveringBack = false
        }

        /**
         * Displays the start screen and attaches event listeners.
         */
        show() {
            this.startImage.onload = () => this.draw();
            this.draw();
            this.canvas.addEventListener('click', this.handleClick);
            this.canvas.addEventListener('touchstart', this.handleClick, { passive: true });
            this.canvas.addEventListener('mousemove', this.handleHover.bind(this));
        }

        /**
         * Draws the start screen or instrucitons depending on state.
         */
        draw() {
            const { ctx, canvas } = this;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.showingInstructions ? this.drawInstructions() : this.drawStartScreen();
        }

        /**
         * Draws the start screen with Play and How to Play buttons.
         */
        drawStartScreen() {
            const { ctx, canvas, playButton, instructionsButton } = this;
            ctx.drawImage(this.startImage, 0, 0, canvas.width, canvas.height);
            this.drawButton(playButton, 'PLAY', 66);
            this.drawButton(instructionsButton, 'HOW TO PLAY', 36);
            this.drawButton(this.impressumButton, 'IMPRESSUM', 36);
        }

        /**
         * draws the instructions screen with back button
         */
        drawInstructions() {
            const { ctx, canvas, backButton } = this;
            this.drawOverlay();
            this.drawInstructionText();
            this.drawButton(backButton, 'BACK', 36);
        }

        /**
         * draws a semi-transparent overla.
         */
        drawOverlay() {
            const { ctx, canvas } = this;
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        /**
         * draws how to play text 
         */
        drawInstructionText() {
            const { ctx, canvas } = this;
            ctx.fillStyle = 'white';
            ctx.font = '48px zabras';
            ctx.textAlign = 'center';
            ctx.fillText('HOW TO PLAY', canvas.width / 2, 80);

            ctx.font = '24px zabras';
            ctx.textAlign = 'left';

            const lines = [
                'CONTROLS:',
                '•  UP ARROW / SPACE: Jump',
                '•  LEFT ARROW: Move Left',
                '•  RIGHT ARROW: Move Right',
                '•  D: Throw Bottle',
                '',
                'GAMEPLAY:',
                '• Jump on chickens to defeat them',
                '• Collect bottles and throw them with D',
                '• Collect coins for permanent movespeed boost',
            ];

            let y = 140;
            lines.forEach(line => ctx.fillText(line, 50, y += 30));
        }

        /**
         * Draws a button with text.
         * @param {Object} btn - Button‑Object with x, y, width, height.
         * @param {string} text - Text in Button.
         * @param {number} fontSize - fontsize.
         */
        drawButton(btn, text, fontSize) {
            this.applyButtonStyle(text, fontSize);
            this.drawButtonText(btn, text, fontSize);
        }

        /**
         * Applies visual styling to a button before drawing its text.
         * Handles glow, font size, and text color depending on the button type.
         *
         * @param {string} text - The label of the button (e.g., "PLAY", "HOW TO PLAY", "BACK").
         * @param {number} fontSize - The base font size used for the button text.
         */

        applyButtonStyle(text, fontSize) {
            const { ctx } = this;

            if (text === 'BACK') {
                ctx.shadowColor = 'white';
                ctx.shadowBlur = 35;
                ctx.fillStyle = 'white';
                ctx.font = `${fontSize + 10}px zabras`;
            } else {
                ctx.shadowBlur = 0;
                ctx.fillStyle = 'black';
                ctx.font = `${fontSize}px zabras`;
            }
        }

        /**
         * Draws the text of a button at the correct position.
         * Assumes styling has already been applied by applyButtonStyle().
         *
         * @param {Object} btn - Button object containing x, y, width, and height.
         * @param {string} text - The text to display inside the button.
         * @param {number} fontSize - The base font size used for vertical alignment.
         */
        drawButtonText(btn, text, fontSize) {
            const { ctx } = this;

            ctx.textAlign = 'center';
            ctx.fillText(
                text,
                btn.x + btn.width / 2,
                btn.y + btn.height / 2 + fontSize / 4
            );

            ctx.shadowBlur = 0;
        }

        /**
         * Handles mouse hover and updates cursor style.
         * @param {MouseEvent} event - The mouse move event.
         */
        handleHover(event) {
            const { canvasX, canvasY } = this.getScaledCoords(event);
            const isHovering = this.isHoveringAnyButton(canvasX, canvasY);
            this.canvas.style.cursor = isHovering ? 'pointer' : 'default';
        }

        /**
         * Converts raw mouse/touch coordinates into scaled canvas coordinates.
         * @param {MouseEvent|TouchEvent} event - Input event.
         * @returns {{canvasX: number, canvasY: number}} Scaled coordinates.
         */
        getScaledCoords(event) {
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
         * Checks whether the mouse is hovering over any active button.
         * @param {number} x - Scaled canvas X coordinate.
         * @param {number} y - Scaled canvas Y coordinate.
         * @returns {boolean} True if hovering over a button.
         */
        isHoveringAnyButton(x, y) {
            if (this.showingInstructions) {
                return this.isInside(x, y, this.backButton);
            }
            return (
                this.isInside(x, y, this.playButton) ||
                this.isInside(x, y, this.instructionsButton) ||
                this.isInside(x, y, this.impressumButton)
            );
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
    if (this.ignoreClick(event)) return;
    if (event.type === 'touchstart') this.lastTouchTime = Date.now();

    const { canvasX, canvasY } = this.getCanvasCoords(event);

    if (this.showingInstructions) {
        this.handleInstructionButtons(canvasX, canvasY);
        return;
    }

    this.handleMainButtons(canvasX, canvasY);
    }

    /**
     * Checks if a click should be ignored due to recent touch.
     * @param {Event} event
     * @returns {boolean} True if click should be ignored.
     */
    ignoreClick(event) {
    return event.type === 'click' && Date.now() - this.lastTouchTime < 125;
    }

    /**
     * Handles buttons shown during instructions screen.
     * @param {number} x - X coordinate on canvas.
     * @param {number} y - Y coordinate on canvas.
     */
    handleInstructionButtons(x, y) {
    if (this.isInside(x, y, this.backButton)) {
        this.showingInstructions = false;
        this.draw();
    }
    }

    /**
     * Handles main menu buttons.
     * @param {number} x - X coordinate on canvas.
     * @param {number} y - Y coordinate on canvas.
     */
    handleMainButtons(x, y) {
    if (this.isInside(x, y, this.playButton)) this.startPlay();
    else if (this.isInside(x, y, this.instructionsButton)) {
        this.showingInstructions = true;
        this.draw();
    }
    else if (this.isInside(x, y, this.impressumButton)) this.openImpressum();
    }


    /**
     * Opens the external Impressum page in a new tab.
     */
    openImpressum() {
        window.open('Impressum.html', '_blank');
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