import { Component, OnInit } from '@angular/core';
import { RodrigoService } from '../../services/rodrigo.service';
import { DataService } from '../../services/data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-files',
    standalone: true,
    imports: [],
    templateUrl: './files.component.html',
    styleUrl: './files.component.scss'
})
export class FilesComponent implements OnInit {

  baseUrl: string;
  files: File[] = [];
  loading: boolean = false;
  currentfile: string = '';
  sanitizedFileUrl: SafeResourceUrl | null = null;
  isModalOpen = false;
  girdButton: 'active' | '' = '';
  listButton: 'active' | '' = 'active';
  filesIn: 'list' | 'grid' = 'list';

  constructor(
    private rodrigo: RodrigoService,
    private data: DataService,
    private sanitizer: DomSanitizer,
  ) {
    this.baseUrl = this.data.baseUrl;
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

  ngOnInit() {
    this.fetchFiles();
  }

  setOpen(isOpen: boolean, file: string) {
    this.isModalOpen = isOpen;
    this.currentfile = file;

    if (file) {
      const unsafeUrl = `${this.baseUrl}/rodrigo/files/p/${file}`;
      this.sanitizedFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
    } else {
      this.sanitizedFileUrl = null;
    }
  }

  // Usando Observable para buscar arquivos
  fetchFiles() {
    this.loading = true;
    this.rodrigo.listFiles().subscribe({
      next: (response: File[]) => {
        this.files = response;
      },
      error: (err) => {
        console.error('Erro ao listar os arquivos:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // Usando Observable para abrir e baixar arquivo
  openFile(filename: string) {
    this.rodrigo.getFile(filename).subscribe({
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
      },
      error: (err) => {
        console.error('Erro ao baixar o arquivo:', err);
      }
    });
  }

}
