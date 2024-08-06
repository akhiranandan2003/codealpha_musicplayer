document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('audio');
  const playPauseButton = document.getElementById('play-pause');
  const prevButton = document.getElementById('prev');
  const nextButton = document.getElementById('next');
  const volumeControl = document.getElementById('volume');
  const searchInput = document.getElementById('search');
  const playlistElement = document.getElementById('playlist');

  let songs = [];
  let currentSongIndex = 0;
  let isPlaying = false;

  fetch('songs.json')
    .then(response => response.json())
    .then(data => {
      songs = data;
      renderPlaylist(songs);
      loadSong(songs[currentSongIndex]);
    });

  playPauseButton.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      playPauseButton.textContent = 'Play';
    } else {
      audio.play();
      playPauseButton.textContent = 'Pause';
    }
    isPlaying = !isPlaying;
  });

  prevButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(songs[currentSongIndex]);
    if (isPlaying) audio.play();
  });

  nextButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(songs[currentSongIndex]);
    if (isPlaying) audio.play();
  });

  volumeControl.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
  });

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filteredSongs = songs.filter(song =>
      song.title.toLowerCase().includes(query) || 
      song.artist.toLowerCase().includes(query)
    );
    renderPlaylist(filteredSongs);
  });

  function loadSong(song) {
    audio.src = song.url;
    document.getElementById('play-pause').textContent = 'Play';
    isPlaying = false;
  }

  function renderPlaylist(songs) {
    playlistElement.innerHTML = '';
    songs.forEach((song, index) => {
      const li = document.createElement('li');
      li.className = 'playlist-item';
      li.textContent = `${song.title} - ${song.artist}`;
      li.addEventListener('click', () => {
        currentSongIndex = index;
        loadSong(song);
        if (isPlaying) audio.play();
      });
      playlistElement.appendChild(li);
    });
  }
});
