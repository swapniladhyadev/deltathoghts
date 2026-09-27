/* ==========================================================================
   BoardNotes AI - Memory-Optimized YouTube Player Engine
   ========================================================================== */

window.YouTubeEngine = {
  currentVideoId: null,

  extractVideoId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  },

  loadVideo(videoId, containerId = "youtube-player-container") {
    const container = document.getElementById(containerId);
    if (!container || !videoId) return;

    // Avoid unnecessary iframe reload if same video
    if (this.currentVideoId === videoId && container.querySelector('#yt-iframe')) {
      return;
    }

    this.currentVideoId = videoId;

    // Destroy existing iframe element to release hardware memory
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'yt-iframe';
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=0&rel=0`;
    iframe.title = 'YouTube Lecture Player';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;

    container.appendChild(iframe);
  },

  seekTo(seconds) {
    const iframe = document.getElementById("yt-iframe");
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: 'seekTo',
          args: [seconds, true]
        }), '*');

        iframe.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: 'playVideo',
          args: []
        }), '*');
      } catch (err) {
        console.warn("YouTubeEngine postMessage error", err);
      }
    }
  },

  timestampToSeconds(tsString) {
    if (!tsString) return 0;
    const cleanStr = tsString.replace(/\[|\]/g, '').trim();
    const parts = cleanStr.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  }
};
