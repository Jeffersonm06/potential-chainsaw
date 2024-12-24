import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { Config } from '../interfaces/config';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit {

  config: Config = this.getSettings();
  baseUrl: string = this.config.rota;

  user: User = {
    id: 0,
    name: '',
    email: '',
    photos: [],
    voices: []
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
    this.getUserStorage();
  }

  ngOnInit(): void { }

  getUserStorage() {
    try {
      const userString = localStorage.getItem('user');

      // Verificar se o valor não é null e se é um número válido
      if (userString) {
        const user = JSON.parse(userString);

        this.user.id = parseInt(user.id, 10);
        console.log(user.id);

        if (isNaN(this.user.id)) {
          return;
        } else {
          const user = this.getUserInfo();
          return user;
        }
      } else {
        return;
      }
    } catch {
      return;
    }
  }

  async getUserInfo(): Promise<User> {
    try {
      const response = await this.getUserData(this.user.id).toPromise();
      this.user.name = response.name;
      this.user.email = response.email;
      this.user.photos = response.photos || [];
      this.user.voices = response.voices || [];
      console.log(response);
    } catch (error) {
      console.error('Erro ao obter informações do usuário', error);
    }

    return this.user;
  }

  settings(config: Config) {
    const settingsString = JSON.stringify(config);
    localStorage.setItem('config', settingsString);
  }

  getSettings() {
    try {
      const config = localStorage.getItem('config');
      this.config = config ? JSON.parse(config) : {};
    } catch {
      this.config = { rota: '', voice_response: false }; // Ambiente fora do navegador
    }
    return this.config;
  }

  getUserData(userId: number): Observable<any> {
    const url = `${this.baseUrl}/users/${userId}`;
    console.log(url);
    return this.http.get<any>(url);
  }

}
