import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class RodrigoService {

  baseUrl: string;

  constructor(
    private http: HttpClient,
    private data: DataService) {
    this.baseUrl = this.data.baseUrl;
  }

  // Envia uma mensagem para o servidor
  sendMessage(userInput: string, userName: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/chat`, {
      text: userInput,
      user_name: userName,
    });
  }

  sendEmails(payload: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/send-emails', payload);
  }

  listFiles(): Observable<File[]> {
    return this.http.get<File[]>(this.baseUrl + '/files')
  }

  getFile(filename: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/files/${filename}`, {
      responseType: 'blob' // Define o tipo de resposta como Blob
    });
  }

  getPdf(filename: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/files/p/${filename}`, {
      responseType: 'blob' // Define o tipo de resposta como Blob
    });
  }

  // Processa PDF com OCR
  processPdfWithOCR(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.baseUrl}/text_pdf`, formData);
  }

  // Serviço para converter HTML para PDF
  convertHtmlToPdf(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/html_pdf`, formData);
  }

  // Mescla PDFs
  mergePdfs(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/merge_pdfs`, formData);
  }
}