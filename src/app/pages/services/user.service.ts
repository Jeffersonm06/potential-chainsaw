import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl:string; 
  constructor(
    private http: HttpClient,
    private data: DataService
  ) { 
    this.baseUrl = this.data.baseUrl;
  }

  // Cadastro de usuário
  registerUser(name: string, password: string, email: string): Observable<any> {
    const userData = { name, password, email };
    return this.http.post(`${this.baseUrl}/users/register`, userData);
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

  // Atualizar informações do usuário
  updateUser(userId: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${userId}`, formData);
  }

  // Deletar usuário
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${userId}`);
  }

  // Lista os usuários disponíveis
  listarUsuarios(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/read_users`);
  }

  alterPhoto(user_name: string, path: string): Observable<any> {
    console.log('dados enviados:', user_name, ' ', path);
    return this.http.put(this.baseUrl + '/users_data/photos', { user_name, path });
  }
}