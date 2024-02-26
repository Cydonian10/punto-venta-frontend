export interface UnitDto {
  id: number;
  name: string;
  symbol: string;
}

export interface UnitCrearDto extends Omit<UnitDto, 'id'> {}

export interface UnitUpdateDto extends Omit<UnitDto, 'id'> {}
