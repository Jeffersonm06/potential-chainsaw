import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-commands',
  standalone: true,
  imports: [],
  templateUrl: './commands.component.html',
  styleUrl: './commands.component.scss'
})
export class CommandsComponent implements OnInit {
  commandList: { title: string; instructions: string }[] = [
    {
      title: 'Baixar músicas (Helena)',
      instructions: 'Envie para a Helena a mensagem "baixar música"(ou algo semelhante), seguido de dois pontos ":" e o nome da música de dejesa baixar.'
    },
    {
      title: 'Baixe do tiktok (Helena)',
      instructions: 'Envie para a Helena a mensagem "baixar do tiktok" (ou algo semelhante) e a url/link do vídeo de dejesa baixar.'
    },
    {
      title: 'Envie um email (Rodrigo)',
      instructions: 'Envie para o Rodrigo a mensagem "Envie um email" (ou algo semelhante). Será exibido um formulário. <br> O primeiro input é para o/s destinatário/s, em seguida peencha com o assunto do email, e por fim o corpo do email.'
    }
  ]

  constructor() { }

  ngOnInit() {
  }
}
