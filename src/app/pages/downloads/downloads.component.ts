import { Component, OnInit } from '@angular/core';
import { DownloadsService } from '../../services/downloads.service';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-downloads',
    standalone: true,
    imports: [],
    templateUrl: './downloads.component.html',
    styleUrl: './downloads.component.scss'
})
export class DownloadsComponent implements OnInit {

  baseUrl: string;

  musics: { url: string; playing: boolean }[] = [];
  videos: string[] = [];

  girdButton: 'active' | '' = '';
  listButton: 'active' | '' = 'active';
  filesIn: 'list' | 'grid' = 'list';

  constructor(
    private downloadService: DownloadsService,
    private data: DataService
  ) { 
    this.baseUrl = this.data.baseUrl;
  }

  ngOnInit() {
    this.getMusics();
    this.getVideos();
  }

  changeFilesIn(fIn: 'list' | 'grid') {
    this.filesIn = fIn;
    if (fIn == 'list') {
      this.girdButton = '';
      this.listButton = 'active'
    } else {
      this.girdButton = 'active';
      this.listButton = '';
    }
  }

  // Usando Observable para obter músicas
  getMusics() {
    this.downloadService.getMusics().subscribe({
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

  // Usando Observable para obter vídeos
  getVideos() {
    this.downloadService.getVideos().subscribe({
      next: (response) => {
        this.videos = response.video_files;
      },
      error: (error) => {
        console.log('Error fetching video files', error);
      }
    });
  }

  // Usando Observable para download de música
  downloadMusic(url: string) {
    this.downloadService.downloadMusic(url).subscribe({
      next: (blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', url); // Nome do arquivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error: (error) => {
        console.log('Error downloading music', error);
      }
    });
  }

  // Usando Observable para download de vídeo
  downloadVideo(url: string) {
    this.downloadService.downloadVideo(url).subscribe({
      next: (blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', url); // Nome do arquivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error: (error) => {
        console.log('Error downloading video', error);
      }
    });
  }

  // Função para tocar música
  playAudio(url: string) {
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

  // Função para pausar a música
  pauseAudio() {
    const audio = document.getElementById('audio') as HTMLAudioElement | null;
    if (audio) {
      audio.pause();
      // Encontrar a música que está tocando e marcar como pausada
      const playingMusic = this.musics.find((music) => music.playing);
      if (playingMusic) {
        playingMusic.playing = false;
      }
    }
  }

}
