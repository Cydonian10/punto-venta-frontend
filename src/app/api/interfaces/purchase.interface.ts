export interface PurchaseCrearDto {
  taxes: number;
  date: Date;
  supplierId: number;
  details: ProductPuchaseDetailCrearDto[];
}

interface ProductPuchaseDetailCrearDto {
  quantity: number;
  productId: number;
  purchasePrice: number;
}

export interface PurchaseDto {
  id: number;
  totalPrice: number;
  taxes: number;
  date: Date;
  vaucherNumber: number;
  supplier: SupplierPurchaseDto;
  products: ProductPurchaseDto[];
}

export interface ProductPurchaseDto {
  quantity: number;
  subTotal: number;
  productName: string;
  productUnit: string;
}

export interface SupplierPurchaseDto {
  name: string;
  adress: string;
  phone: string;
}
