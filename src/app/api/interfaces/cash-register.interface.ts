export interface CashRegisterDto {
  id: number;
  name?: string;
  initialCash: number;
  date: string;
  open: boolean;
  totalCash?: number;
}

export interface CreateCashRegisterDto {
  name?: string;
  initialCash: number;
  date: Date;
}

export interface OpenCashRegisterDto {
  initialCash: number;
}

export interface CashRegisterHistoryDto {
  id: number;
  name: string;
  cashRegisterId: number;
  totalCash: number;
  employedId: string;
  date: Date;
  nombreEmpleado: string;
}
