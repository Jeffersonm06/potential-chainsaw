import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-form',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss'
})
export class FormComponent {
  name: string = '';
  password: string = '';
  email: string = '';

  constructor(
    private userService: UserService,
     private router: Router,
     private auth: AuthService 
    ) {}

  // Método de registro com Observable
  register() {
    this.userService.registerUser(this.name, this.password, this.email).subscribe({
      next: (response) => {
        console.log('Usuário registrado com sucesso', response);
      },
      error: (error) => {
        console.error('Erro ao registrar usuário', error);
      }
    });
  }  

  // Método de login com Observable
  login() {
    this.auth.loginUser(this.name, this.password).subscribe({
      next: (response) => {
        console.log('Usuário logado com sucesso', response);
        localStorage.setItem('user', JSON.stringify(response.user)); // Serializar o objeto para string
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        console.error('Erro ao fazer login', error);
      }
    });
  }
}
