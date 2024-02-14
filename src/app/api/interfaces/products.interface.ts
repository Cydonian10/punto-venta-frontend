import { CategoryDto } from "./category.interface";
import { UnitDto } from "./unit.interface";

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