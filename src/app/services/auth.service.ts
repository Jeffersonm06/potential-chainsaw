import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../pages/interfaces/user';
import { Router } from '@angular/router';
import { Config } from '../pages/interfaces/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  config: Config = this.getSettings();

  user: User = {
    id: 0,
    name: '',
    email: '',
    photos: [],
    voices: []
  };

  baseUrl: string;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.baseUrl = this.config.rota+'/api';
  }

  // Login de usuário
  loginUser(name: string, password: string): Observable<any> {
    const credentials = { name, password };
    return this.http.post(`${this.baseUrl}/users/login`, credentials);
  }

  // Exibir informações do usuário
  getUserInfo(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userId}`);
  }

  async compareUser(): Promise<boolean> {
    const userString = this.getUserStorage();
    if (userString) {
      try {
        const user = await this.getUserInfo(this.user.id).toPromise();
        if (user) {
          await this.setUserInfo();
          return true; // Usuário autenticado
        } else {
          return false; // Usuário não encontrado no backend
        }
      } catch (error) {
        return false; // Erro ao validar usuário
      }
    } else {
      return false; // Usuário não existe no localStorage
    }
  } 

  getUserStorage(): string | null {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);

        // Garantir que o ID seja válido
        this.user.id = parseInt(user.id, 10);
        if (!isNaN(this.user.id)) {
          return userString;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async setUserInfo(): Promise<User | undefined> {
    try {
      const response = await this.getUserInfo(this.user.id).toPromise();
      this.user.name = response.name;
      this.user.email = response.email;
      this.user.photos = response.photos || [];
      this.user.voices = response.voices || [];
    } catch (error) {
      return;
    }

    return this.user;
  }

  getSettings() {
    try {
      const config = localStorage.getItem('config');
      this.config = config ? JSON.parse(config) : {};
    } catch {
      this.config = { rota: '', voice_response: false };
    }
    return this.config;
  }
}
