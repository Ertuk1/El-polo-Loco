/**
 * Creates a singleton MusicManager responsible for handling background music playback.
 * Initializes the audio element, loop settings, volume, and start offset.
 */

class MusicManager {
    static instance;
    music;

    constructor() {
        if (MusicManager.instance) {
            return MusicManager.instance;
        }

        this.music = new Audio('audio/BackgroundMusic.mp3');
        this.music.loop = true;
        this.music.volume = 0.15;
        this.startOffset = 4;
        this.wasStopped = true;
        MusicManager.instance = this;
    }
    /**
 * Starts music playback if audio is unlocked and not muted.
 * If the music was previously stopped, playback begins from the configured start offset.
 */

    play() {
        if (GLOBAL_MUTE || !AUDIO_UNLOCKED) return;

        if (this.wasStopped) {
            this.music.currentTime = this.startOffset;
        }

        this.music.play().catch(() => { });
        this.wasStopped = false;
    }

    /**
     * Stops the music completely, resets playback to the beginning,
     * and marks the music as stopped so the next play() call restarts at the offset.
     */

    stop() {
        this.music.pause();
        this.music.currentTime = 0;
        this.wasStopped = true;
    }

    /**
     * Pauses the music without resetting the playback position.
     */

    pause() {
        this.music.pause();
    }

    /**
     * Resumes music playback if audio is unlocked and not muted.
     * Does not reset playback to the start offset.
     */

    resume() {
        if (!GLOBAL_MUTE && AUDIO_UNLOCKED) {
            this.wasStopped = false;
            this.music.play().catch(() => { });
        }
    }

    /**
     * Mutes or unmutes the background music.
     * Automatically pauses when muted and resumes when unmuted.
     * @param {boolean} muted - Whether the music should be muted.
     */

    setMuted(muted) {
        this.music.muted = muted;
        if (muted) this.pause();
        else this.resume();
    }
}

const MUSIC = new MusicManager();
