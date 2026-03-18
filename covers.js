class CoverPlayer {
  constructor() {
    this.idx = 0;
    this.playing = false;
    this.songs = [
      { title: 'No Surprises',  artist: 'Radiohead Cover',   file: 'audios/New Recording 2.mp3' },
      { title: 'Lovers Rock',   artist: 'TV Girl',           file: 'audios/Lovers rock cover try 2.mp3' },
      { title: 'City of Stars', artist: 'Ryan Gosling',      file: 'audios/City of star.mp3' },
      { title: 'Remember You',  artist: 'Adventure Time',    file: 'audios/Remember you-1.m4a' },
      { title: 'I love you so', artist: 'The walter',       file: 'audios/I love you so.mp3' },
      { title: 'Moon song',     artist: 'Karen O',          file: 'audios/The moon song.m4a' },
      { title: 'The Night We Met', artist: 'Lord Huron',       file: 'audios/The night we met.m4a' },
      { title: 'how to disappear completely', artist: 'Radiohead',         file: 'audios/how to disappear completely.mp3' },
    ];

    this.audio    = document.getElementById('audio-player');
    this.playBtn  = document.getElementById('play-btn');
    this.prevBtn  = document.getElementById('prev-btn');
    this.nextBtn  = document.getElementById('next-btn');
    this.vinyl    = document.getElementById('vinyl-disc');
    this.tonearm  = document.getElementById('tonearm');
    this.progress = document.getElementById('progress');
    this.progBar  = document.getElementById('progress-bar');
    this.currTime = document.getElementById('current-time');
    this.durEl    = document.getElementById('duration');
    this.titleEl  = document.getElementById('current-song');
    this.artistEl = document.getElementById('current-artist');

    this.playIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    this.pauseIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

    this.loadSong(0, false);
    this.bindEvents();
    window.player = this;
  }

  loadSong(i, autoplay = false) {
    this.idx = i;
    const s = this.songs[i];
    this.audio.src = s.file;
    this.titleEl.textContent  = s.title;
    this.artistEl.textContent = s.artist;
    this.setPlaying(false);
    this.updateActive();
    if (autoplay) this.play();
  }

  bindEvents() {
    this.playBtn.addEventListener('click', () => this.toggle());
    this.prevBtn.addEventListener('click', () => this.loadSong((this.idx - 1 + this.songs.length) % this.songs.length, this.playing));
    this.nextBtn.addEventListener('click', () => this.loadSong((this.idx + 1) % this.songs.length, this.playing));
    this.progBar.addEventListener('click', e => {
      const pct = e.offsetX / this.progBar.clientWidth;
      if (this.audio.duration) this.audio.currentTime = pct * this.audio.duration;
    });
    this.audio.addEventListener('timeupdate', () => this.onProgress());
    this.audio.addEventListener('loadedmetadata', () => {
      this.durEl.textContent = this.fmt(this.audio.duration);
    });
    this.audio.addEventListener('ended', () => this.loadSong((this.idx + 1) % this.songs.length, true));
    this.vinyl.addEventListener('click', () => this.toggle());
  }

  toggle() { this.playing ? this.pause() : this.play(); }

  play() {
    this.audio.play().then(() => this.setPlaying(true)).catch(err => {
      this.titleEl.textContent = 'Unable to play — check audio files';
    });
  }

  pause() {
    this.audio.pause();
    this.setPlaying(false);
  }

  setPlaying(state) {
    this.playing = state;
    this.playBtn.innerHTML = state ? this.pauseIcon : this.playIcon;
    if (state) {
      this.vinyl.classList.add('spinning');
      this.tonearm && this.tonearm.classList.add('on-record');
    } else {
      this.vinyl.classList.remove('spinning');
      this.tonearm && this.tonearm.classList.remove('on-record');
    }
  }

  onProgress() {
    const { currentTime, duration } = this.audio;
    if (!duration) return;
    this.progress.style.width = (currentTime / duration * 100) + '%';
    this.currTime.textContent = this.fmt(currentTime);
  }

  fmt(t) {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  updateActive() {
    document.querySelectorAll('.cover-card').forEach((c, i) => {
      c.classList.toggle('active', i === this.idx);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => new CoverPlayer());

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.code === 'Space') { e.preventDefault(); document.getElementById('play-btn').click(); }
  if (e.code === 'ArrowLeft') document.getElementById('prev-btn').click();
  if (e.code === 'ArrowRight') document.getElementById('next-btn').click();
});
