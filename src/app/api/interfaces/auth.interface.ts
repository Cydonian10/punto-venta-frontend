export interface AuthRegisterDto {
  email: string;
  password: string;
  username: string;
  birthday: Date;
  salary: number;
  rol: string;
}

export interface AuthLoginDto {
  email: string;
  password: string;
}

export interface ClaimAsignarDto {
  email: string;
  roles: string[];
}

export interface RoleAsignarDto {
  email: string;
  roles: string[];
}

export interface ClaimRemoveDto extends ClaimAsignarDto {}

export interface RolAsignarDto extends ClaimAsignarDto {}

export interface RolRemoveDto extends ClaimAsignarDto {}

export interface Profile {
  id: string | null;
  birthday: string;
  email: string | null;
  emailConfirmed: boolean;
  salary: number;
}

export interface AuthRespuesta {
  token: string;
  expiración: string;
}

export interface AuthUser {
  usuario: User;
  roles: any[];
  claims: any[];
}

export interface User {
  id: string;
  name: string;
  birthday: Date;
  email: string;
  emailConfirmed: boolean;
  salary: number;
}
