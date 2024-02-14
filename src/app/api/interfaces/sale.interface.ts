import { CustomerDto, EmployedDto } from "./user.interface";

export interface SaleCrearDto {
  taxex:          number;
  date:           Date;
  customerId:     string;
  cashRegisterId: number;
  saleDetails:    SaleDetailCrearDto[];
}

interface SaleDetailCrearDto {
  quantity:  number;
  productId: number;
  name:      string;
  unitPrice: number;
  discount:  number;
}


export interface SaleDto {
  id:            string;
  totalPrice:    number;
  taxes:         number;
  date:          Date;
  vaucherNumber: number;
  customer:      CustomerDto;
  employed:      EmployedDto;
  cashRegister:  SaleCashRegister;
  products:      SaleProductDto[];
}

export interface SaleCashRegister {
  initialCash: number;
  date:        Date;
  open:        boolean;
}

export interface SaleProductDto {
  quantity:          number;
  subTotal:          number;
  descuento:         number;
  productStock:      number;
  productSalePrice:  number;
  productSize:       string;
  productName:       string;
  productUnitSymbol: string;
}
