import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.user() as any;
  if (auth.isAuthenticated() && user?.role === 'admin') return true;
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
