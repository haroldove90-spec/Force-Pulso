import { Product, Store } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'harina-pan',
    name: 'Harina PAN 1kg',
    category: 'alimentos',
    icon: '🌽',
    storesCount: 4,
    isNearSoldOut: false
  },
  {
    id: 'aceite-maveite',
    name: 'Aceite Maveite 1L',
    category: 'alimentos',
    icon: '🧴',
    storesCount: 3,
    isNearSoldOut: true // CASI AGOTADO EN ZONA
  },
  {
    id: 'arroz-cristal',
    name: 'Arroz Cristal 1kg',
    category: 'alimentos',
    icon: '🍚',
    storesCount: 4,
    isNearSoldOut: false
  },
  {
    id: 'azucar-morena',
    name: 'Azúcar Morena 1kg',
    category: 'alimentos',
    icon: '🧂',
    storesCount: 4,
    isNearSoldOut: false
  },
  {
    id: 'pasta-primor',
    name: 'Pasta Primor 500g',
    category: 'alimentos',
    icon: '🍝',
    storesCount: 3,
    isNearSoldOut: false
  },
  {
    id: 'ibuprofeno-400',
    name: 'Ibuprofeno 400mg',
    category: 'farmacia',
    icon: '💊',
    storesCount: 2,
    isNearSoldOut: false
  },
  {
    id: 'leche-campestre',
    name: 'Leche Completa 1L',
    category: 'lácteos',
    icon: '🥛',
    storesCount: 3,
    isNearSoldOut: false
  },
  {
    id: 'queso-blanco',
    name: 'Queso Blanco Duro 1kg',
    category: 'lácteos',
    icon: '🧀',
    storesCount: 3,
    isNearSoldOut: false
  },
  {
    id: 'pollo-entero',
    name: 'Pollo Entero kg',
    category: 'carnes',
    icon: '🍗',
    storesCount: 2,
    isNearSoldOut: false
  },
  {
    id: 'carne-molida',
    name: 'Carne Molida Premium 1kg',
    category: 'carnes',
    icon: '🥩',
    storesCount: 3,
    isNearSoldOut: true
  }
];

export interface StoreDefinition {
  id: string;
  name: string;
  distance: string;
  distanceNum: number;
  rating: number;
  lat: number; // Percent position X on interactive map grid
  lng: number; // Percent position Y on interactive map grid
  address: string;
}

export const STORES: Record<string, StoreDefinition> = {
  'mercado-el-valle': {
    id: 'mercado-el-valle',
    name: 'Mercado El Valle',
    distance: '1.2km',
    distanceNum: 1.2,
    rating: 4.9,
    lat: 30,
    lng: 25,
    address: 'Av. Libertador, Sector El Valle'
  },
  'abasto-central': {
    id: 'abasto-central',
    name: 'Abasto Central',
    distance: '0.8km',
    distanceNum: 0.8,
    rating: 4.7,
    lat: 45,
    lng: 60,
    address: 'Calle 12 esquina San Felipe'
  },
  'bodega-los-mangos': {
    id: 'bodega-los-mangos',
    name: 'Bodega Los Mangos',
    distance: '0.3km',
    distanceNum: 0.3,
    rating: 4.2,
    lat: 75,
    lng: 40,
    address: 'Detrás de la Plaza Los Mangos'
  },
  'bazar-don-luis': {
    id: 'bazar-don-luis',
    name: 'Bazar Don Luis',
    distance: '1.9km',
    distanceNum: 1.9,
    rating: 4.4,
    lat: 20,
    lng: 80,
    address: 'Av. Yaracuy c/c Calle 5'
  },
  'farmacia-san-felipe': {
    id: 'farmacia-san-felipe',
    name: 'Farmacia San Felipe',
    distance: '0.5km',
    distanceNum: 0.5,
    rating: 4.8,
    lat: 60,
    lng: 20,
    address: 'Av. Caracas entre Calles 9 y 10'
  },
  'hiper-lider': {
    id: 'hiper-lider',
    name: 'Híper Líder Yaracuy',
    distance: '2.5km',
    distanceNum: 2.5,
    rating: 4.6,
    lat: 85,
    lng: 85,
    address: 'Autopista Centroccidental Cimarrón Andresote'
  }
};

export const INITIAL_STORE_PRICES: Record<string, (Omit<Store, 'name' | 'distance' | 'distanceNum' | 'rating'> & { storeId: string })[]> = {
  'harina-pan': [
    { storeId: 'mercado-el-valle', price: 1.90, stockStatus: 'DISPONIBLE', updateTime: 'hace 2 min', hasBestPrice: true },
    { storeId: 'abasto-central', price: 2.20, stockStatus: 'DISPONIBLE', updateTime: 'hace 4 min' },
    { storeId: 'bodega-los-mangos', price: 2.50, stockStatus: 'POCAS UNIDADES', stockCount: 9, updateTime: 'hace 12 min' },
    { storeId: 'bazar-don-luis', price: 2.10, stockStatus: 'DISPONIBLE', updateTime: 'hace 35 min' }
  ],
  'aceite-maveite': [
    { storeId: 'mercado-el-valle', price: 3.10, stockStatus: 'POCAS UNIDADES', stockCount: 3, updateTime: 'hace 15 min' },
    { storeId: 'abasto-central', price: 2.80, stockStatus: 'DISPONIBLE', updateTime: 'hace 9 min', hasBestPrice: true },
    { storeId: 'bodega-los-mangos', price: 3.30, stockStatus: 'AGOTADO', updateTime: 'hace 1 hora' }
  ],
  'arroz-cristal': [
    { storeId: 'mercado-el-valle', price: 1.20, stockStatus: 'DISPONIBLE', updateTime: 'hace 5 min', hasBestPrice: true },
    { storeId: 'abasto-central', price: 1.35, stockStatus: 'DISPONIBLE', updateTime: 'hace 18 min' },
    { storeId: 'bodega-los-mangos', price: 1.50, stockStatus: 'DISPONIBLE', updateTime: 'hace 2 min' },
    { storeId: 'bazar-don-luis', price: 1.30, stockStatus: 'DISPONIBLE', updateTime: 'hace 45 min' }
  ],
  'azucar-morena': [
    { storeId: 'mercado-el-valle', price: 1.60, stockStatus: 'DISPONIBLE', updateTime: 'hace 8 min' },
    { storeId: 'abasto-central', price: 1.70, stockStatus: 'DISPONIBLE', updateTime: 'hace 14 min' },
    { storeId: 'bodega-los-mangos', price: 1.50, stockStatus: 'DISPONIBLE', updateTime: 'hace 30 min', hasBestPrice: true },
    { storeId: 'bazar-don-luis', price: 1.75, stockStatus: 'POCAS UNIDADES', stockCount: 5, updateTime: 'hace 12 min' }
  ],
  'pasta-primor': [
    { storeId: 'mercado-el-valle', price: 0.85, stockStatus: 'DISPONIBLE', updateTime: 'hace 10 min', hasBestPrice: true },
    { storeId: 'abasto-central', price: 0.95, stockStatus: 'DISPONIBLE', updateTime: 'hace 2 min' },
    { storeId: 'bazar-don-luis', price: 1.00, stockStatus: 'DISPONIBLE', updateTime: 'hace 20 min' }
  ],
  'ibuprofeno-400': [
    { storeId: 'farmacia-san-felipe', price: 2.20, stockStatus: 'DISPONIBLE', updateTime: 'hace 1 min', hasBestPrice: true },
    { storeId: 'hiper-lider', price: 2.60, stockStatus: 'DISPONIBLE', updateTime: 'hace 40 min' }
  ],
  'leche-campestre': [
    { storeId: 'mercado-el-valle', price: 1.80, stockStatus: 'DISPONIBLE', updateTime: 'hace 12 min' },
    { storeId: 'abasto-central', price: 1.75, stockStatus: 'DISPONIBLE', updateTime: 'hace 7 min', hasBestPrice: true },
    { storeId: 'hiper-lider', price: 1.90, stockStatus: 'DISPONIBLE', updateTime: 'hace 22 min' }
  ],
  'queso-blanco': [
    { storeId: 'mercado-el-valle', price: 4.40, stockStatus: 'DISPONIBLE', updateTime: 'hace 4 min' },
    { storeId: 'bodega-los-mangos', price: 4.20, stockStatus: 'DISPONIBLE', updateTime: 'hace 10 min', hasBestPrice: true },
    { storeId: 'abasto-central', price: 4.60, stockStatus: 'DISPONIBLE', updateTime: 'hace 3 min' }
  ],
  'pollo-entero': [
    { storeId: 'mercado-el-valle', price: 3.40, stockStatus: 'DISPONIBLE', updateTime: 'hace 3 min', hasBestPrice: true },
    { storeId: 'hiper-lider', price: 3.80, stockStatus: 'DISPONIBLE', updateTime: 'hace 15 min' }
  ],
  'carne-molida': [
    { storeId: 'mercado-el-valle', price: 5.80, stockStatus: 'DISPONIBLE', updateTime: 'hace 11 min' },
    { storeId: 'abasto-central', price: 5.50, stockStatus: 'POCAS UNIDADES', stockCount: 4, updateTime: 'hace 20 min', hasBestPrice: true },
    { storeId: 'hiper-lider', price: 6.00, stockStatus: 'DISPONIBLE', updateTime: 'hace 5 min' }
  ]
};
