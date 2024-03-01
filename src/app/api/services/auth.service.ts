import { TokenService } from "@/core/services/token.service";
import { HttpClient } from "@angular/common/http";
import { Injectable, computed, inject, signal } from "@angular/core";
import { AuthLoginDto, AuthRespuesta, AuthUser, User } from '../interfaces/auth.interface';
import { environment } from "../../../environments/environment.development";
import { checkToken } from "@/core/interceptors/token.interceptor";
import { switchMap, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  #http = inject(HttpClient)
  #tokenService = inject(TokenService)
  #url = environment.apiUrl + "/api/auth"

  #user = signal<AuthUser | null>(null);

  public user = computed(() => this.#user());

  login(authLoginDto:AuthLoginDto) {
    return this.#http.post<AuthRespuesta>(`${this.#url}/login`, authLoginDto).pipe(
      tap(( resp) =>  this.#tokenService.saveToken(resp)),
      switchMap(() => this.profile() )
    )
  }

  profile() {
    return this.#http.get<AuthUser>(`${this.#url}/profile`, { context: checkToken() })
      .pipe(tap((resp) => this.#user.set(resp) ))
  }
}