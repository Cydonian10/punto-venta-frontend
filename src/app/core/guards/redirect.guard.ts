import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const redirectGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService)
  const router = inject(Router)
  const isValidToken = tokenService.isValidToken()
  if(isValidToken) {
    router.navigate(["/admin"])
  }
  return true;
};
