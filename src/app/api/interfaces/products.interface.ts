import { CategoryDto } from "./category.interface";
import { UnitDto } from "./unit.interface";


export interface ProductsResposne {
  totalPages:number,
  data: ProductDto[]
}


export interface ProductDto {
  id:                number;
  stock:             number;
  salePrice:         number;
  purchasePrice:     number;
  purchaseDesc:      number;
  image:             null;
  type:              string;
  description:       string;
  size:              string;
  condicionDiscount: string;
  name:              string;
  category:          CategoryDto;
  unitMeasurement:   UnitDto;
}

export interface ProductCrearDto {
  stock:             number;
  salePrice:         number;
  purchasePrice:     number;
  purchaseDesc:      number;
  type:              string;
  description:       string;
  size:              string;
  categoryId:        CategoryDto["id"];
  unitMeasurementId: UnitDto["id"];
  condicionDiscount: string;
  name:              string;
}

export interface ProductUpdateDto extends ProductCrearDto {}

export interface FilterProductDto {
  name: string | null;
  price: number | null;
  stock: number | null;
}

export interface HistoryProductPrice {
  id:number,
  productId:number,
  oldPrice:number,
  name:string,
  date:string
}