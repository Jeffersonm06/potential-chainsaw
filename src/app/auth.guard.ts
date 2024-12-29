import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isLoged = await auth.compareUser();
  if (isLoged) {
    return true; // Usuário autenticado
  } else {
    return router.parseUrl('/form'); // Redirecionar para a página de login
  }
};