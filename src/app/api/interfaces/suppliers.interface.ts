export interface SupplierDto {
  id: number;
  name: string;
  adress: string;
  phone: string;
}

export interface CreateSupplierDto extends Omit<SupplierDto, 'id'> {}
