export interface Product {
  id: string;
  name: string;
  category: 'all' | 'alimentos' | 'farmacia' | 'carnes' | 'lácteos';
  icon: string;
  storesCount: number;
  isNearSoldOut?: boolean;
}

export interface Store {
  storeId: string;
  name: string;
  distance: string; // e.g., '1.2km'
  distanceNum: number; // numeric value in km for logical calculations
  rating: number;
  updateTime: string;
  price: number;
  stockStatus: 'DISPONIBLE' | 'POCAS UNIDADES' | 'AGOTADO';
  stockCount?: number;
  hasBestPrice?: boolean;
}

export interface CartItem {
  product: Product;
  store: Store;
  quantity: number;
}

export interface ExchangeRate {
  rate: number;
  change: number;
  lastUpdated: string;
}

export interface MapPoint {
  id: string;
  name: string;
  isStore: boolean;
  type?: 'store' | 'user' | 'report';
  lat: number; // percentage of horizontal axis (0-100) for drawing
  lng: number; // percentage of vertical axis (0-100) for drawing
  rating?: number;
  priceForSelected?: number;
}
