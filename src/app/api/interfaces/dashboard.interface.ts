export interface Dashboard {
  totalInventoryPrice: number;
  totalInventoryCost: number;
  top3SelledProduct: DashboardProduct[];
  top3leastSellingProducts: DashboardProduct[];
  totalSalesPrice: number;
  totalProducts: number;
  productsOutOfStock: DashboardProduct[];
  topSales: TopSale[];
}

export interface DashboardProduct {
  name: string;
  stock: number;
  quantitySale: number;
  unitSymbol: string;
}

export interface TopSale {
  customerId: string;
  userName: string;
  totalSales: number;
}
