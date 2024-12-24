import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadsService {

  baseUrl:string;

  constructor(
    private http: HttpClient,
    private data: DataService
  ) { 
    this.baseUrl = this.data.baseUrl;
  }


  // Método para buscar músicas
  getMusics(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/music`);
  }

  // Método para baixar música
  downloadMusic(url: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/helena/file/${url}`, { responseType: 'blob' });
  }

  // Método para buscar vídeos
  getVideos(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/video`);
  }

  // Método para baixar vídeo
  downloadVideo(url: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/helena/file/${url}`, { responseType: 'blob' });
  }
}
