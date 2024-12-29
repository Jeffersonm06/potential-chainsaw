import { Component } from '@angular/core';
import { DownloadsService } from '../../services/downloads.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-player',
  imports: [],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {

  baseUrl: string;

  typeMedia: 'music' | 'video' = 'music';
  musics: { url: string; playing: boolean }[] = [];
  videos: { url: string; playing: boolean }[] = [];
  currentMusic: { url: string; playing: boolean } = { url: '', playing: false };
  currentVideo: { url: string; playing: boolean } = { url: '', playing: false };

  constructor(
    private media: DownloadsService,
    private data: DataService,
  ) {
    this.getMusics();
    this.getVideos();
    this.baseUrl = data.baseUrl;
  }

  getMusics() {
    this.media.getMusics().subscribe({
      next: (response) => {
        this.musics = response.music_files.map((url: string) => ({
          url,
          playing: false, // Inicialmente, nenhuma música está tocando
        }));
      },
      error: (error) => {
        console.log('Error fetching music files', error);
      }
    });
  }

  getVideos() {
    this.media.getVideos().subscribe({
      next: (response) => {
        this.videos = response.video_files.map((url: string) => ({
          url,
          playing: false,
        }));
      },
      error: (error) => {
        console.log('Error fetching video files', error);
      }
    });
  }

  playMusic(url: string) {
    const audio = document.getElementById('audio') as HTMLAudioElement | null;
    if (audio) {
      // Parar qualquer música que esteja tocando
      this.musics.forEach((music) => (music.playing = false));

      // Definir a música atual como tocando
      const currentMusic = this.musics.find((music) => music.url === url);
      if (currentMusic) {
        currentMusic.playing = true;
      }

      audio.volume = 0.1;
      audio.src = `${this.baseUrl}/media/music/${url}`;
      audio.play();
    }
  }

  playVideo(url: string) {
    const video = document.getElementById('video') as HTMLVideoElement | null;
    if (video) {
      // Parar qualquer música que esteja tocando
      this.musics.forEach((music) => (music.playing = false));

      const encodedUrl = encodeURIComponent(url);
      video.volume = 0.1;
      video.load();
      this.currentVideo = {
        url:`${this.baseUrl}/helena/file/${encodedUrl}`,
        playing: true,
    }
    video.play().catch((err) => console.error('Erro ao reproduzir vídeo:', err));
  }
}

stopMusic() {
  this.musics.forEach((music) => {
    music.playing = false;
  });
}

stopVideo() {
  this.videos.forEach((video) => {
    video.playing = false;
  });
}
}
