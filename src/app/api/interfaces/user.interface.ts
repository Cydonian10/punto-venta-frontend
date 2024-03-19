export interface CustomerDto {
  id: string;
  email: string;
  name: string;
}

export interface EmployedDto {
  id: string;
  email: string;
}

export interface UserFull {
  id: string;
  email: string;
  name: null;
  roles: string[];
  age: number;
  salary: number;
  claims: any[];
}

export enum Rol {
  Empleado = 'Empleado',
  Admin = 'Admin',
  Vendedor = 'Vendedor',
}

export interface EmployedRoles {
  usuario: Employed;
  roles: any[];
  claims: any[];
}

export interface Employed {
  id: string;
  name: string;
  birthday: Date;
  email: string;
  age: number;
  salary: number;
  roles: any[];
  claims: any[];
}

export interface UpdateEmployedDto {
  name: string;
  birthday: Date;
  email: string;
  salary: number;
}

export interface Customer {
  id: string;
  email: string;
  name: string;
}
