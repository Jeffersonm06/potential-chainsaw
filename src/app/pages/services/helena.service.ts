import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class HelenaService {
  baseUrl: string;

  constructor(
    private http: HttpClient, 
    private data: DataService
  ) {
    this.baseUrl = this.data.baseUrl + '/helena';
    console.log(this.baseUrl)
  }

  // Envia uma mensagem para o servidor
  sendMessage(userInput: string, userName: string): Observable<any> {
    const body = {
      text: userInput,
      user_name: userName,
    };
    return this.http.post<any>(`${this.baseUrl}/chat`, body);
  }

  // Baixa um arquivo a partir de uma URL
  downloadFile(url: string): Observable<Blob> {
    const encodedUrl = encodeURIComponent(url);
    const fileUrl = `${this.baseUrl}/file/${encodedUrl}`;
    return this.http.get(fileUrl, { responseType: 'blob' });
  }
}
