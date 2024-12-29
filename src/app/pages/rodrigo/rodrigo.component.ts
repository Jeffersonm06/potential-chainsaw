import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RodrigoService } from '../../services/rodrigo.service';
import { DataService } from '../../services/data.service';
import { User } from '../interfaces/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
    selector: 'app-rodrigo',
    standalone: true,
    imports: [FormsModule, CommonModule, LoadingComponent],
    templateUrl: './rodrigo.component.html',
    styleUrl: './rodrigo.component.scss'
})
export class RodrigoComponent implements OnInit {

  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef;

  userInput: string = '';

  user: User;

  messages: {
    type?: string;
    text: string;
    sender: string;
    subject?: string;
    body?: string;
    numberInput?: number;
    url?: string;
    status: string;
    emailList?: string; // Adicionado aqui
  }[] = [];

  userList: { name: string }[] = [];
  isKeyboardOpen: boolean = false;
  keyboardHeight: number = 0;

  merge_pdfs: FileList | null = null;
  html_pdf: File | null = null;
  pdf_text: File | null = null;
  filename: string = ''

  loading: boolean = false;

  constructor(
    private rodrigo: RodrigoService,
    private data: DataService
  ) {
    this.user = this.data.user;
  }

  ngOnInit(): void {
    //this.addMessage('Rodrigo', 'response', 'success', { type: 'html_pdf' })
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      setTimeout(() => {
        element.scrollTop = element.scrollHeight; // Scroll para o final
      }, 50); // Timeout para garantir que o DOM foi atualizado
    }
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({ text: this.userInput, sender: 'Você', status: 'success' });

    this.rodrigo.sendMessage(this.userInput, this.user.name).subscribe({
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
      this.addMessage('Rodrigo', 'Nenhuma resposta do servidor.', 'warning');
      return;
    }

    switch (data.type) {
      case 'response':
        this.addMessage('Rodrigo', data.message || data.description, data.status);
        break;

      case 'form':
        this.addMessage('Rodrigo', data.message, data.status, { type: data.type });
        break;

      case 'pdf':
        this.addMessage('Rodrigo', data.message, data.status, { type: data.type, url: data.path });
        break;

      case 'merge_pdf':
      case 'html_pdf':
      case 'text_pdf':
        this.addMessage('Rodrigo', data.message, data.status, { type: data.type });
        break;

      default:
        this.addMessage('Rodrigo', 'Resposta desconhecida do servidor.', 'warning');
        break;
    }
  }

  addMessage(
    sender: string,
    text: string,
    status: string,
    options: {
      type?: string,
      subject?: string,
      body?: string,
      numberInput?: number,
      url?: string,
      emailList?: string
    } = {}
  ) {
    this.messages.push({
      type: options.type,
      text,
      sender,
      status,
      subject: options.subject,
      body: options.body,
      numberInput: options.numberInput,
      url: options.url,
      emailList: options.emailList,
    });
    this.loading = false;

  }

  // Processa texto de PDF com OCR
  processPdf() {
    this.loading = true;
    if (this.pdf_text) {
      this.rodrigo.processPdfWithOCR(this.pdf_text).subscribe({
        next: (data) => this.handleResponse(data),
        error: (err) => console.error('Erro ao processar PDF:', err),
      });
    } else {
      console.error('Texto do PDF não fornecido.');
    }
  }

  // Converte HTML para PDF
  convertHtmlToPdf() {
    this.loading = true;
    if (this.html_pdf && this.filename) {
      const formData = new FormData();
      formData.append('html', this.html_pdf);
      formData.append('name', this.filename);

      this.rodrigo.convertHtmlToPdf(formData).subscribe({
        next: (data) => this.handleResponse(data),
        error: (err) => console.error('Erro ao converter HTML para PDF:', err),
      });
    } else {
      console.error('HTML ou nome do arquivo não fornecido.');
    }
  }

  // Mescla múltiplos PDFs em um único arquivo
  mergePdfs() {
    this.loading = true;
    if (this.merge_pdfs && this.filename) {
      const formData = new FormData();
      formData.append('output_name', this.filename);

      Array.from(this.merge_pdfs).forEach((file) => {
        formData.append('pdf_files', file, file.name);
      });

      this.rodrigo.mergePdfs(formData).subscribe({
        next: (data) => this.handleResponse(data),
        error: (err) => console.error('Erro ao mesclar PDFs:', err),
      });
    } else {
      console.error('Por favor, selecione arquivos PDF e forneça um nome para o arquivo resultante.');
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.merge_pdfs = input.files;
    }
  }

  onSingleFileChange(event: Event, target: 'html_pdf' | 'pdf_text') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (target === 'html_pdf') {
        this.html_pdf = input.files[0];
      } else if (target === 'pdf_text') {
        this.pdf_text = input.files[0];
      }
    }
  }

  submitForm(numberInput: number, index: number) {
    this.loading = true;
    const message = this.messages[index];

    if (!message.emailList || !message.subject || !message.body) {
      console.error('Todos os campos são obrigatórios.');
      return;
    }

    const emailArray = message.emailList.split(',').map(email => email.trim());
    const payload = {
      emails: emailArray,
      subject: message.subject,
      body: message.body,
      numberInput: numberInput,
    };

    this.rodrigo.sendEmails(payload).subscribe({
      next: (data) => {
        if (data.message) {
          this.handleResponse({
            type: data.type,
            text: `${data.message}`,
            sender: 'Rodrigo',
            status: data.status,
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao enviar e-mails:', error);
      }
    });
  }

  // Baixar arquivo
  downloadFile(filename: string) {
    this.rodrigo.getPdf(filename).subscribe({
      next: (blob) => {
        // Criar uma URL temporária para o arquivo e baixá-lo
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename; // Nome do arquivo para download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Feedback para o usuário
        console.log('Arquivo baixado com sucesso:', filename);
      },
      error: (err) => {
        console.error('Erro ao baixar o arquivo:', err);
        // Feedback de erro para o usuário
        alert('Erro ao baixar o arquivo. Por favor, tente novamente.');
      }
    });
  }
}