class MusicPlayer {
    constructor() {
        this.isPlaying = false;
        this.isShuffleMode = false;
        this.currentTrack = null;
        this.currentTrackIndex = 0;
        this.trackDuration = 0; // in seconds
        this.currentTime = 0; // in seconds
        this.progressInterval = null;
        this.timerSeconds = 0; // sleep timer in seconds
        this.timerInterval = null;

        // Track database - organized by category
        this.trackLibrary = {
            'white-noise': [
                { name: 'Forest Lullaby', duration: 120, category: 'White Noise' },
                { name: 'Healing Sleep Atmosphere', duration: 360, category: 'White Noise' },
                { name: 'Natural Sleep Background With Jungle Ambience', duration: 120, category: 'White Noise' }
            ],
            'nature-sounds': [
                { name: 'Rain on Window', duration: 240, category: 'Nature Sounds' },
                { name: 'Ocean Waves', duration: 180, category: 'Nature Sounds' },
                { name: 'Forest Birds', duration: 300, category: 'Nature Sounds' },
                { name: 'Thunderstorm', duration: 420, category: 'Nature Sounds' },
                { name: 'Campfire Crackling', duration: 360, category: 'Nature Sounds' }
            ],
            'ambient-noise': [
                { name: 'Pure White Noise', duration: 720, category: 'Ambient Noise' },
                { name: 'Pink Noise', duration: 720, category: 'Ambient Noise' },
                { name: 'Brown Noise', duration: 720, category: 'Ambient Noise' },
                { name: 'Binaural Beats', duration: 120, category: 'Ambient Noise' },
                { name: 'Static Noise', duration: 480, category: 'Ambient Noise' },
                { name: 'Ambient Drone', duration: 360, category: 'Ambient Noise' }
            ],
            'mechanical-sounds': [
                { name: 'Fan Noise', duration: 720, category: 'Mechanical Sounds' },
                { name: 'Air Conditioner', duration: 600, category: 'Mechanical Sounds' },
                { name: 'Hair Dryer', duration: 180, category: 'Mechanical Sounds' },
                { name: 'Washing Machine', duration: 60, category: 'Mechanical Sounds' }
            ],
            'urban-ambience': [
                { name: 'Coffee Shop', duration: 240, category: 'Urban Ambience' },
                { name: 'Library Silence', duration: 480, category: 'Urban Ambience' },
                { name: 'City Traffic', duration: 360, category: 'Urban Ambience' },
                { name: 'Train Journey', duration: 180, category: 'Urban Ambience' }
            ]
        };

        this.init();
    }

    init() {
        // Initialize the music player UI if it exists
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Set up event listeners for control buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('#music-player-play-pause')) {
                this.togglePlayPause();
            } else if (e.target.closest('#music-player-next')) {
                this.nextTrack();
            } else if (e.target.closest('#music-player-previous')) {
                this.previousTrack();
            } else if (e.target.closest('#music-player-shuffle')) {
                this.toggleShuffle();
            } else if (e.target.closest('#music-player-timer')) {
                this.showTimerModal();
            } else if (e.target.closest('#music-player-close')) {
                this.hidePanel();
            } else if (e.target.closest('.timer-option')) {
                this.setTimer(e.target.closest('.timer-option').dataset.timer);
            } else if (e.target.closest('#timer-modal-close')) {
                this.hideTimerModal();
            }
        });
    }

    playTrack(trackName, category = null) {
        // Find the track in our library
        let foundTrack = null;
        let trackList = [];
        let trackIndex = 0;

        // Search all categories for the track
        for (const [cat, tracks] of Object.entries(this.trackLibrary)) {
            const trackFound = tracks.find(track => track.name === trackName);
            if (trackFound) {
                foundTrack = trackFound;
                trackList = tracks;
                trackIndex = tracks.indexOf(trackFound);
                break;
            }
        }

        if (!foundTrack) {
            // If not found in library, create a generic track
            foundTrack = {
                name: trackName,
                duration: 180, // default 3 minutes
                category: category || 'Music'
            };
            trackList = [foundTrack];
            trackIndex = 0;
        }

        this.currentTrack = foundTrack;
        this.currentTrackIndex = trackIndex;
        this.currentTrackList = trackList;
        this.trackDuration = foundTrack.duration;
        this.currentTime = 0;
        this.isPlaying = true;

        this.showPanel();
        this.updatePlayerDisplay();
        this.startProgress();
    }

    showPanel() {
        const panel = document.getElementById('music-control-panel');
        if (panel) {
            panel.classList.add('visible');
        }
    }

    hidePanel() {
        const panel = document.getElementById('music-control-panel');
        if (panel) {
            panel.classList.remove('visible');
        }
        this.stopProgress();
        this.clearTimer();
        this.isPlaying = false;
    }

    togglePlayPause() {
        this.isPlaying = !this.isPlaying;

        if (this.isPlaying) {
            this.startProgress();
        } else {
            this.stopProgress();
        }

        this.updatePlayPauseButton();
    }

    nextTrack() {
        if (!this.currentTrackList || this.currentTrackList.length === 0) return;

        if (this.isShuffleMode) {
            // Random track selection
            this.currentTrackIndex = Math.floor(Math.random() * this.currentTrackList.length);
        } else {
            // Next track in sequence
            this.currentTrackIndex = (this.currentTrackIndex + 1) % this.currentTrackList.length;
        }

        this.currentTrack = this.currentTrackList[this.currentTrackIndex];
        this.trackDuration = this.currentTrack.duration;
        this.currentTime = 0;
        this.isPlaying = true;

        this.updatePlayerDisplay();
        this.startProgress();
    }

    previousTrack() {
        if (!this.currentTrackList || this.currentTrackList.length === 0) return;

        if (this.isShuffleMode) {
            // Random track selection
            this.currentTrackIndex = Math.floor(Math.random() * this.currentTrackList.length);
        } else {
            // Previous track in sequence
            this.currentTrackIndex = this.currentTrackIndex === 0
                ? this.currentTrackList.length - 1
                : this.currentTrackIndex - 1;
        }

        this.currentTrack = this.currentTrackList[this.currentTrackIndex];
        this.trackDuration = this.currentTrack.duration;
        this.currentTime = 0;
        this.isPlaying = true;

        this.updatePlayerDisplay();
        this.startProgress();
    }

    toggleShuffle() {
        this.isShuffleMode = !this.isShuffleMode;

        const shuffleBtn = document.getElementById('music-player-shuffle');
        if (shuffleBtn) {
            shuffleBtn.classList.toggle('active', this.isShuffleMode);
        }
    }

    showTimerModal() {
        const modal = document.getElementById('sleep-timer-modal');
        if (modal) {
            modal.classList.add('visible');
        }
    }

    hideTimerModal() {
        const modal = document.getElementById('sleep-timer-modal');
        if (modal) {
            modal.classList.remove('visible');
        }
    }

    setTimer(timerValue) {
        this.clearTimer();

        if (timerValue === 'off') {
            this.timerSeconds = 0;
        } else if (timerValue === 'song-end') {
            this.timerSeconds = this.trackDuration - this.currentTime;
        } else {
            // Parse timer value (e.g., "5min", "1hr")
            const minutes = parseInt(timerValue);
            this.timerSeconds = minutes * 60;
        }

        if (this.timerSeconds > 0) {
            this.startTimer();
        }

        this.hideTimerModal();
        this.updateTimerDisplay();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timerSeconds--;
            this.updateTimerDisplay();

            if (this.timerSeconds <= 0) {
                this.hidePanel();
                this.clearTimer();
            }
        }, 1000);
    }

    clearTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.timerSeconds = 0;
    }

    startProgress() {
        this.stopProgress();

        this.progressInterval = setInterval(() => {
            if (this.isPlaying) {
                this.currentTime++;
                this.updateProgressBar();

                // Auto-advance to next track when current ends
                if (this.currentTime >= this.trackDuration) {
                    this.nextTrack();
                }
            }
        }, 1000);
    }

    stopProgress() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    updatePlayerDisplay() {
        const trackTitle = document.getElementById('music-player-track-title');
        const trackCategory = document.getElementById('music-player-track-category');

        if (trackTitle && this.currentTrack) {
            trackTitle.textContent = this.currentTrack.name;
        }

        if (trackCategory && this.currentTrack) {
            trackCategory.textContent = this.currentTrack.category;
        }

        this.updatePlayPauseButton();
        this.updateProgressBar();
    }

    updatePlayPauseButton() {
        const playPauseBtn = document.getElementById('music-player-play-pause');
        const icon = playPauseBtn ? playPauseBtn.querySelector('i') : null;

        if (icon) {
            icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
    }

    updateProgressBar() {
        const progressBar = document.getElementById('music-progress-bar');
        const currentTimeEl = document.getElementById('music-current-time');
        const totalTimeEl = document.getElementById('music-total-time');

        if (progressBar) {
            const progress = (this.currentTime / this.trackDuration) * 100;
            progressBar.style.width = `${progress}%`;
        }

        if (currentTimeEl) {
            currentTimeEl.textContent = this.formatTime(this.currentTime);
        }

        if (totalTimeEl) {
            totalTimeEl.textContent = this.formatTime(this.trackDuration);
        }
    }

    updateTimerDisplay() {
        const timerBtn = document.getElementById('music-player-timer');

        if (timerBtn && this.timerSeconds > 0) {
            timerBtn.classList.add('active');
            // You could add a timer countdown display here if desired
        } else if (timerBtn) {
            timerBtn.classList.remove('active');
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer();
});