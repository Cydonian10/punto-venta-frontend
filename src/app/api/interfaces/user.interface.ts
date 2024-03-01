export interface CustomerDto {
  id: string;
  email: string;
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
