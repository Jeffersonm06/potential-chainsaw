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

export const routes: Routes = [
    { path: '', component: HelenaComponent },
    { path: 'rodrigo', component: RodrigoComponent },
    { path: 'config', component: ConfigComponent },
    { path: 'files', component: FilesComponent },
    { path: 'form', component: FormComponent },
    { path: 'commands', component: CommandsComponent },
    { path: 'downloads', component: DownloadsComponent },
    { path: 'manual', component: ManualComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'users', component: UsersComponent },
];
