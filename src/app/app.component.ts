import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { DataService } from './pages/services/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'MyHome';
  menu: 'menu-open' | 'menu-close' = 'menu-open';
  page: 'page-full' | 'page-slin' = 'page-slin';

  isOpen: boolean = true;

  pages: { link: string; name: string; icon: string }[] = [
    { link: '', name: 'Helena', icon: 'bi bi-chat-dots' },
    { link: 'rodrigo', name: 'Rodrigo', icon: 'bi bi-chat-dots-fill' },
    { link: 'config', name: 'Config', icon: 'bi bi-gear-fill' },
    { link: 'files', name: 'Files', icon: 'bi bi-file-earmark-medical-fill' },
    { link: 'downloads', name: 'Downloads', icon: 'bi bi-download' },
    { link: 'manual', name: 'Manual', icon: 'bi bi-journal-text' },
    { link: 'commands', name: 'Comandos', icon: 'bi bi-terminal-fill' },
    { link: 'profile', name: 'Profile', icon: 'bi bi-person-circle' },
    { link: 'users', name: 'Users', icon: 'bi bi-people-fill' },
  ]

  currentPage: string = this.pages[0].name;

  constructor(
    private data: DataService
  ) {
  }

  ngOnInit(): void {
    const width = window.innerWidth;
    if(width < 640){
      this.toggleMenu()
    }
  }

  toggleMenu() {
    if (this.isOpen == true) {
      this.menu = 'menu-close';
      this.page = 'page-full';
      this.isOpen = false;
    } else {
      this.menu = 'menu-open';
      this.page = 'page-slin'
      this.page = this.page;
      this.isOpen = true;
    }
    console.log(this.menu);
    console.log(this.page);
  }

  selectPage(page: string) {
    this.currentPage = page
  }
}
