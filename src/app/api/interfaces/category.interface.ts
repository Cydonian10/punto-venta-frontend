export interface CategoryDto {
  id: number
  name: string
  description: string
}

export interface CategoryCrearDto {
  name:        string;
  description: string;
}

export interface UpdateCategoryDto extends CategoryCrearDto {}

