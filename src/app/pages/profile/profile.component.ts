import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { User } from '../interfaces/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  baseUrl: string;

  userId: number = 0;
  user: User = {
    id: 0,
    name: '',
    email: '',
    photos: [],
    voices: []
  };
  profilePic: string = '';

  public alertButtons = [
    {
      text: 'Não',
      role: 'cancel',
      handler: () => {
        this.alterPath = '';
      },
    },
    {
      text: 'Sim',
      role: 'confirm',
      handler: () => {
        this.alterPhoto(this.alterPath);
      },
    },
  ];
  public alertDeleteButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        this.alterPath = '';
      },
    },
    {
      text: 'Sim',
      role: 'confirm',
      handler: () => {
        this.deleteUser();
      },
    },
  ];
  isToastOpen = false;
  isAlertOpen = false;
  isAlertDeleteOpen = false;
  toastMessage: string = '';
  alterPath: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private data: DataService,
  ) { 
    this.baseUrl = this.data.baseUrl;
  }

  ngOnInit() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.userId = parseInt(user.id, 10);
      if (isNaN(this.userId)) {
        this.router.navigate(['/form']);
      } else {
        this.getUserInfo();
      }
    } else {
      this.router.navigate(['/form']);
    }
  }

  // Obter informações do usuário logado
  getUserInfo() {
    this.userService.getUserInfo(this.userId).subscribe(
      (user) => {
        this.user = user;
        console.log('Informações do usuário carregadas:', this.user);
      },
      (error) => {
        console.error('Erro ao carregar informações do usuário:', error);
        this.router.navigate(['/form']);
      }
    );
  }

  // Atualizar informações do usuário
  updateUser() {
    const formData = new FormData();
    formData.append('name', this.user.name);
    formData.append('email', this.user.email);

    // Adiciona os arquivos de voz e foto ao FormData, verificando se existem
    this.user.voices.forEach(file => {
      if (file instanceof Blob) {
        formData.append('voices', file, file.name);
      } else {
        console.error('Arquivo de voz inválido', file);
      }
    });

    this.user.photos.forEach(file => {
      if (file instanceof Blob) {
        formData.append('photos', file, file.name);
      } else {
        console.error('Arquivo de foto inválido', file);
      }
    });

    this.userService.updateUser(this.userId, formData).subscribe(
      (response) => {
        console.log('Usuário atualizado com sucesso', response);
      },
      (error) => {
        console.error('Erro ao atualizar informações do usuário', error);
      }
    );
  }

  async deleteUser() {
    this.userService.deleteUser(this.userId).subscribe(
      (response) => {
        console.log('Usuário excluído com sucesso', response);
        localStorage.removeItem('user');
        this.router.navigate(['/form']);
      },
      (error) => {
        console.error('Erro ao excluir usuário', error);
      }
    );
  }

  addFiles(event: Event, type: string) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files) {
      const files = Array.from(inputElement.files);
      console.log(`Arquivos selecionados (${type}):`, files);

      if (type === 'photo') {
        this.user.photos = [...this.user.photos, ...files];
      } else if (type === 'voice') {
        this.user.voices = [...this.user.voices, ...files];
      }
    }
  }

  alterPhoto(path: string) {
    this.userService.alterPhoto(this.user.name, path).subscribe(
      (response) => {
        this.toastMessage = response.message;
        this.setOpen(true);
        this.profilePic = path;
      },
      (error) => {
        this.toastMessage = 'Erro ao alterar a foto de perfil';
        this.setOpen(true);
        console.error('Erro ao alterar a foto', error);
      }
    );
  }

  setOpenAlertDelete(isOpen: boolean) {
    this.isAlertDeleteOpen = isOpen;
  }

  setOpenAlert(isOpen: boolean, path: any) {
    this.isAlertOpen = isOpen;
    this.alterPath = path;
    console.log(path);
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  setResult(ev: any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }
}
