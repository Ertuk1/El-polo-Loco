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
        this.startOffset = 4; 
        this.wasStopped = true;
        MusicManager.instance = this;
    }
play() {
    if (GLOBAL_MUTE || !AUDIO_UNLOCKED) return;

    if (this.wasStopped) {
        this.music.currentTime = this.startOffset;   // ⬅️ jump to 4 seconds
    }

    this.music.play().catch(() => {});
    this.wasStopped = false;
}

stop() {
    this.music.pause();
    this.music.currentTime = 0;
    this.wasStopped = true;   // ⬅️ next play() will jump to 4 seconds
}


    pause() {
        this.music.pause();
    }

resume() {
    if (!GLOBAL_MUTE && AUDIO_UNLOCKED) {
        this.wasStopped = false;   // ⬅️ resume should NOT restart at 4s
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
