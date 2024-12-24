import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HelenaService } from '../services/helena.service';
import { DownloadsService } from '../services/downloads.service';
import { DataService } from '../services/data.service';
import { User } from '../interfaces/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-helena',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    LoadingComponent],
  templateUrl: './helena.component.html',
  styleUrl: './helena.component.scss'
})
export class HelenaComponent implements OnInit {
  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef;
  @ViewChild('input', { static: false }) input!: ElementRef;

  baseUrl: string;
  user: User;

  userInput: string = '';
  messages: {
    type?: string;
    url?: string;
    text: string;
    sender: string;
    music?: {
      url: string;
      playing: boolean
    };
    video?: {
      url: string;
      playing: boolean
    };
    status: string
  }[] = [];

  loading: boolean = false;

  userList: { name: string }[] = [];
  isKeyboardOpen: boolean = false;
  keyboardHeight: number = 0;

  constructor(
    private helena: HelenaService,
    private downloadService: DownloadsService,
    private data: DataService
  ) {
    this.baseUrl = this.data.baseUrl;
    this.user = this.data.user;
  }

  ngOnInit(): void {

  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      setTimeout(() => {
        element.scrollTop = element.scrollHeight; // Scroll para o final
      }, 50);
    }
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({ text: this.userInput, sender: 'Você', status: 'success' });

    this.helena.sendMessage(this.userInput, this.user.name).subscribe({
      next: (response) => {
        this.handleResponse(response);
      },
      error: (error) => {
        console.error('Erro ao enviar mensagem:', error);
        this.messages.push({
          text: 'Erro ao enviar mensagem.',
          sender: 'Erro',
          status: 'danger'
        });
      }
    });
    this.loading = true;
    this.userInput = ''; // Limpar input
    this.scrollToBottom();
  }


  handleResponse(data: any) {
    if (!data) {
      this.addMessage('Helena', 'response', 'Nenhuma resposta do servidor.', 'warning');
      return;
    }

    switch (data.type) {
      case 'response':
        this.addMessage('Helena', 'response', data.message || data.description, data.status || 'info');
        break;

      case 'music':
        this.addMessage('Helena', 'music', data.message, data.status || 'info', { url: data.url, playing: false });
        break;

      case 'ttk':
        this.addMessage('Helena', 'video', data.message, data.status || 'info', undefined, { url: data.url, playing: false });
        break;

      default:
        this.addMessage('Helena', 'error', 'Resposta desconhecida do servidor.', 'warning');
    }
  }


  addMessage(
    sender: string,
    type: string,
    text: string,
    status: string,
    music?: { url: string; playing: boolean },
    video?: { url: string; playing: boolean }
  ) {
    const message = {
      type,
      text,
      sender,
      status,
      music: music || undefined,
      video: video || undefined
    };

    this.messages.push(message);
    this.scrollToBottom();
    this.loading = false;

  }

  downloadFile(url: string) {
    console.log(url)
    this.helena.downloadFile(url).subscribe({
      next: (blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', url); // Nome do arquivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error: () => {
        this.messages.push({
          text: 'Erro ao baixar a música.',
          sender: 'bot',
          status: 'failed'
        });
      }
    });
  }

  playAudio(url: string) {
    const audio = document.getElementById('audio') as HTMLAudioElement | null;
    if (audio) {
      this.stopAudio(); // Parar qualquer áudio tocando
      const currentMessage = this.messages.find((msg) => msg.music?.url === url);
      if (currentMessage?.music) {
        currentMessage.music.playing = true;
      }
      audio.volume = 0.1;
      audio.src = `${this.baseUrl}/media/music/${url}`;
      audio.play();
    }
  }

  stopAudio() {
    const audio = document.getElementById('audio') as HTMLAudioElement | null;
    if (audio) {
      audio.pause();
      const playingMessage = this.messages.find((msg) => msg.music?.playing);
      if (playingMessage?.music) {
        playingMessage.music.playing = false;
      }
    }
  }

  pauseAudio() {
    this.stopAudio(); // Usando a função stopAudio para pausar a música
  }
}

