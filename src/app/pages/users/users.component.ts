import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  baseUrl: string;
  userList: any[] = [];
  message: string = '';

  constructor(
    private userService: UserService,
    private data: DataService,
  ) {
    this.baseUrl = this.data.baseUrl;
  }

  ngOnInit() {
    this.listarUsuarios();
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.listarUsuarios();
      event.target.complete();
    }, 2000);
  }

  listarUsuarios() {
    this.userService.listarUsuarios().subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.userList = response.users;
          this.message = '';
        } else {
          this.message = 'Nenhum usuário encontrado.';
        }
      },
      error: (error) => {
        this.message = 'Erro ao buscar usuários.';
        console.error('Erro ao buscar usuários:', error);
      }
    });
  }

}
