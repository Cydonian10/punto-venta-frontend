import { CategoryDto } from './category.interface';
import { UnitDto } from './unit.interface';

export interface ProductsResposne {
  totalPages: number;
  data: ProductDto[];
}

export interface ProductDto {
  id: number;
  stock: number;
  salePrice: number;
  purchasePrice: number;
  purchaseDesc: number;
  image: null;
  type: string;
  description: string;
  size: string;
  condicionDiscount: string;
  name: string;
  category: CategoryDto;
  unitMeasurement: UnitDto;
  quantitySale: number;
  barCode: number;
  inputActive?: boolean;
}

export interface ProductTable {
  id: number;
  stock: number;
  salePrice: number;
  purchasePrice: number;
  purchaseDesc: number;
  image: null | string;
  type: string;
  description: string;
  size: string;
  condicionDiscount: string;
  name: string;
  categoryName: string;
  unit: string;
  barCode: number;
  quantitySale: number;
  inputActive?: boolean;
}

export interface ProductCrearDto {
  stock: number;
  salePrice: number;
  purchasePrice: number;
  purchaseDesc: number;
  type: string;
  description: string;
  size: string;
  barCode: number;
  quantitySale: number;
  categoryId: CategoryDto['id'];
  unitMeasurementId: UnitDto['id'];
  condicionDiscount: string;
  name: string;
}

export interface ProductUpdateDto extends ProductCrearDto {}

export interface FilterProductDto {
  name: string | null;
  price: number | null;
  stock: number | null;
  barCode: number | null;
}

export interface HistoryProductPrice {
  id: number;
  productId: number;
  oldPrice: number;
  name: string;
  date: string;
}
