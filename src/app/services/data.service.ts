import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../pages/interfaces/user';
import { Config } from '../pages/interfaces/config';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit {

  baseUrl: string;

  user: User = {
    id: 0,
    name: '',
    email: '',
    photos: [],
    voices: []
  };

  config: Config;

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any,
    private auth: AuthService,
  ) {
    this.auth.getUserStorage();
    this.config = this.auth.getSettings();
    this.baseUrl = this.config.rota+'/api';
  }

  ngOnInit(): void { }

  settings(config: Config) {
    const settingsString = JSON.stringify(config);
    localStorage.setItem('config', settingsString);
  }

  getUserData(userId: number): Observable<any> {
    const url = `${this.baseUrl}/users/${userId}`;
    console.log(url);
    return this.http.get<any>(url);
  }

}
