class StartScreen {
    constructor(canvas, startCallback) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.startCallback = startCallback; // function to call when "Play" is clicked
        this.playButton = { x: 260, y: 320, width: 200, height: 60 };
        this.startImage = new Image();
        this.startImage.src = 'IMG/9_intro_outro_screens/start/startscreen_2.png';
        this.handleClick = this.handleClick.bind(this); // keep 'this' context
    }
    show() {
        this.startImage.onload = () => this.draw();
        this.draw();
        this.canvas.addEventListener('click', this.handleClick);
        this.canvas.addEventListener('touchstart', this.handleClick);
        this.canvas.addEventListener('mousemove', this.handleHover.bind(this));
    }

    draw() {
        const { ctx, canvas, playButton } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.startImage, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'black';
        ctx.font = '66px zabras';
        ctx.textAlign = 'center';
        ctx.fillText('PLAY', playButton.x + playButton.width / 2, playButton.y + 38);
    }

    handleHover(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (event.clientX || event.touches?.[0].clientX) - rect.left;
        const y = (event.clientY || event.touches?.[0].clientY) - rect.top;
        const canvasX = x * scaleX;
        const canvasY = y * scaleY;

        if (
            canvasX >= this.playButton.x &&
            canvasX <= this.playButton.x + this.playButton.width &&
            canvasY >= this.playButton.y &&
            canvasY <= this.playButton.y + this.playButton.height
        ) {
            this.canvas.style.cursor = 'pointer';
        } else {
            this.canvas.style.cursor = 'default';
        }
    }

    handleClick(event) {
        event.preventDefault(); // Prevent default touch behavior
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (event.clientX || event.touches?.[0].clientX) - rect.left;
        const y = (event.clientY || event.touches?.[0].clientY) - rect.top;
        const canvasX = x * scaleX;
        const canvasY = y * scaleY;

        if (
            canvasX >= this.playButton.x &&
            canvasX <= this.playButton.x + this.playButton.width &&
            canvasY >= this.playButton.y &&
            canvasY <= this.playButton.y + this.playButton.height
        ) {
            this.startPlay();
        }
    }

    startPlay() {
        const newCanvas = recreateCanvas();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.startCallback(newCanvas);
    }
}
