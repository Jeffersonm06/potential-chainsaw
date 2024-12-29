import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Config } from '../interfaces/config';
import { FormsModule } from '@angular/forms'; 

@Component({
    selector: 'app-config',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './config.component.html',
    styleUrl: './config.component.scss'
})
export class ConfigComponent implements OnInit {
  
  config:Config = {
    rota:'',
    voice_response: false
  }

  constructor(
    private data: DataService,
  ) { }

  ngOnInit() { 
    this.config = this.data.config;
  }

  confirm(){
    this.data.settings(this.config);
  }
}