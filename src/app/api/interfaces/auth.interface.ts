export interface AuthRegisterDto {
  email:    string;
  password: string;
  username: string;
  birthday: Date;
  salary:   number;
  rol:      string;
}

export interface AuthLoginDto {
  email:    string;
  password: string;
}


export interface ClaimAsignarDto {
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