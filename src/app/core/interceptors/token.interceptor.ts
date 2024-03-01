import { HttpContext, HttpContextToken, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';



const CHECK_TOKEN = new HttpContextToken<boolean>(() => false)

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  
  const tokenService = inject(TokenService)

  if(req.context.get(CHECK_TOKEN)) {
      return addToken(req,next,tokenService.getToken()?.token);
  }
  
  return next(req);

};


export function checkToken() {
  return new HttpContext().set(CHECK_TOKEN,true)
}


function addToken( req: HttpRequest<unknown> ,  next: HttpHandlerFn ,token?:string) {
 
  if(token) {
    const authRequest = req.clone({
      headers: req.headers.set("Authorization",`Bearer ${token}`)
    })
    return next(authRequest);
  }
  return next(req)
}


