class MusicManager {
    static instance;
    music;

    constructor() {
        if (MusicManager.instance) {
            return MusicManager.instance;
        }

        this.music = new Audio('audio/BackgroundMusic.mp3');
        this.music.loop = true;
        this.music.volume = 0.5;

        MusicManager.instance = this;
    }

    play() {
        if (GLOBAL_MUTE || !AUDIO_UNLOCKED) return;
        this.music.play().catch(() => {});
    }

    stop() {
        this.music.pause();
        this.music.currentTime = 0;
    }

    pause() {
        this.music.pause();
    }

    resume() {
        if (!GLOBAL_MUTE && AUDIO_UNLOCKED) {
            this.music.play().catch(() => {});
        }
    }

    setMuted(muted) {
        this.music.muted = muted;
        if (muted) this.pause();
        else this.resume();
    }
}

const MUSIC = new MusicManager();
