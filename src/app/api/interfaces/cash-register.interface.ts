export interface CashRegisterDto {
  id: number;
  name?: string;
  initialCash: number;
  date: string;
  open: boolean;
  totalCash?: number;
  userId: string | null;
}

export interface CreateCashRegisterDto {
  name?: string;
  initialCash: number;
  date: Date;
}

export interface OpenCashRegisterDto {
  initialCash: number;
  userId: string;
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
