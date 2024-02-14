export interface SupplierDto {
  id:number,
  name:   string;
  adress: string;
  phone:  string;
}

export interface SupplierCrearDto extends Omit<SupplierDto,"id"> {}