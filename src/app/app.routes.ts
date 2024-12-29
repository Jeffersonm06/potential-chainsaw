import { Routes } from '@angular/router';
import { HelenaComponent } from './pages/helena/helena.component';
import { RodrigoComponent } from './pages/rodrigo/rodrigo.component';
import { ConfigComponent } from './pages/config/config.component';
import { FilesComponent } from './pages/files/files.component';
import { FormComponent } from './pages/form/form.component';
import { DownloadsComponent } from './pages/downloads/downloads.component';
import { ManualComponent } from './pages/manual/manual.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UsersComponent } from './pages/users/users.component';
import { CommandsComponent } from './pages/commands/commands.component';
import { authGuard } from './auth.guard';
import { PlayerComponent } from './pages/player/player.component';

export const routes: Routes = [
    { path: '', component: HelenaComponent, canActivate: [authGuard] },
    { path: 'rodrigo', component: RodrigoComponent, canActivate: [authGuard] },
    { path: 'config', component: ConfigComponent },
    { path: 'files', component: FilesComponent, canActivate: [authGuard] },
    { path: 'form', component: FormComponent },
    { path: 'commands', component: CommandsComponent, canActivate: [authGuard] },
    { path: 'downloads', component: DownloadsComponent, canActivate: [authGuard] },
    { path: 'manual', component: ManualComponent, canActivate: [authGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'users', component: UsersComponent, canActivate: [authGuard] },
    { path: 'player', component: PlayerComponent, canActivate: [authGuard] },
];
