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
        this.startImage.onload = () => {
            this.draw();
        };
        this.draw();
        this.canvas.addEventListener('click', this.handleClick);
        this.canvas.addEventListener('touchstart', this.handleClick);
    }

    draw() {
        const { ctx, canvas, playButton } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.startImage, 0, 0, canvas.width, canvas.height);

        // Draw play button
        ctx.fillStyle = '#fdd835';
        ctx.fillRect(playButton.x, playButton.y, playButton.width, playButton.height);

        ctx.fillStyle = 'black';
        ctx.font = '28px zabras';
        ctx.textAlign = 'center';
        ctx.fillText('PLAY', playButton.x + playButton.width / 2, playButton.y + 38);
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (event.clientX || event.touches?.[0].clientX) - rect.left;
        const y = (event.clientY || event.touches?.[0].clientY) - rect.top;

        if (
            x >= this.playButton.x &&
            x <= this.playButton.x + this.playButton.width &&
            y >= this.playButton.y &&
            y <= this.playButton.y + this.playButton.height
        ) {
            this.startPlay();
        }
    }

    startPlay() {
        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('touchstart', this.handleClick);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.startCallback(); // call the main game start function
    }
}
