import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  MapPin, 
  TrendingUp, 
  Coins, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Minus, 
  X, 
  ChevronLeft, 
  Filter, 
  ArrowUp, 
  DollarSign, 
  Info, 
  Bell, 
  Compass, 
  Map as MapIcon, 
  List, 
  Store as StoreIcon, 
  Flame, 
  Navigation, 
  HelpCircle,
  ThumbsUp,
  Award,
  DollarSign as UsdIcon
} from 'lucide-react';

import { Product, Store, CartItem, ExchangeRate, MapPoint } from './types';
import { INITIAL_PRODUCTS, STORES, INITIAL_STORE_PRICES, StoreDefinition } from './data';

export default function App() {
  // Application state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [storePrices, setStorePrices] = useState<Record<string, (Omit<Store, 'name' | 'distance' | 'distanceNum' | 'rating'> & { storeId: string })[]>>(INITIAL_STORE_PRICES);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'alimentos' | 'farmacia' | 'carnes' | 'lácteos'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'lista' | 'mapa'>('lista');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Custom Role Simulation Settings
  const [activeRole, setActiveRole] = useState<'cliente' | 'colaborador' | 'aliado' | 'motorizado'>('cliente');
  const [selectedAliadoStoreId, setSelectedAliadoStoreId] = useState<string>('mercado-el-valle');
  const [activeOrder, setActiveOrder] = useState<{
    id: string;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    totalUsd: number;
    paymentMethod: string;
    status: 'CREADO' | 'ACEPTADO' | 'RECOGIENDO' | 'RUTA' | 'ENTREGADO';
    deliveryType: 'delivery' | 'recoger';
    step: number;
  } | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'recoger'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'usd' | 'bs' | 'pago_movil' | 'zelle' | 'wallet'>('usd');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderStep, setOrderStep] = useState(0); // For motorizado trajectory simulation

  // Wallet and collaborative reward stats
  const [userWallet, setUserWallet] = useState<number>(3.50); // Initial balance
  const [reportsCount, setReportsCount] = useState<number>(182); // Simulated reports in the zone
  const [showRewardNotification, setShowRewardNotification] = useState<string | null>(null);

  // Exchange rate simulation (Dólar paralelo/promedio "S CALLE")
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({
    rate: 38.45,
    change: 0.73,
    lastUpdated: 'hace 8 min'
  });

  // Recent crowdsourced price updates stream
  const [crowdReports, setCrowdReports] = useState([
    { id: '1', user: 'Carlos M.', product: 'Harina PAN 1kg', store: 'Mercado El Valle', price: 1.90, time: 'hace 2 min' },
    { id: '2', user: 'María G.', product: 'Ibuprofeno 400mg', store: 'Farmacia San Felipe', price: 2.20, time: 'hace 9 min' },
    { id: '3', user: 'Juan P.', product: 'Arroz Cristal 1kg', store: 'Bodega Los Mangos', price: 1.50, time: 'hace 14 min' },
    { id: '4', user: 'Elena R.', product: 'Aceite Maveite 1L', store: 'Abasto Central', price: 2.80, time: 'hace 22 min' }
  ]);

  // Pricing Warning Form modal
  const [reportingProduct, setReportingProduct] = useState<Product | null>(null);
  const [reportingStoreId, setReportingStoreId] = useState<string>('mercado-el-valle');
  const [reportingPrice, setReportingPrice] = useState<string>('');
  const [reportingStockStatus, setReportingStockStatus] = useState<'DISPONIBLE' | 'POCAS UNIDADES' | 'AGOTADO'>('DISPONIBLE');
  const [reportingStockCount, setReportingStockCount] = useState<string>('');

  // Auto rate ticker update simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setExchangeRate(prev => {
        const nextChange = Number((prev.change + (Math.random() - 0.45) * 0.05).toFixed(2));
        const nextRate = Number((prev.rate + (Math.random() - 0.45) * 0.03).toFixed(2));
        return {
          rate: nextRate,
          change: nextChange,
          lastUpdated: 'Justo ahora'
        };
      });
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  // Motorizado tracking step progress simulation when order is submitted
  useEffect(() => {
    if (orderConfirmed && orderStep < 5) {
      const stepTimer = setTimeout(() => {
        setOrderStep(p => {
          const next = p + 1;
          setActiveOrder(curr => {
            if (!curr) return null;
            let nextStatus: 'CREADO' | 'ACEPTADO' | 'RECOGIENDO' | 'RUTA' | 'ENTREGADO' = curr.status;
            if (next === 1) nextStatus = 'CREADO';
            else if (next === 2) nextStatus = 'ACEPTADO';
            else if (next === 3) nextStatus = 'RECOGIENDO';
            else if (next === 4) nextStatus = 'RUTA';
            else if (next === 5) nextStatus = 'ENTREGADO';
            return {
              ...curr,
              status: nextStatus,
              step: next
            };
          });
          return next;
        });
      }, 7000);
      return () => clearTimeout(stepTimer);
    }
  }, [orderConfirmed, orderStep]);

  // Compute products list with calculated minimum pricing derived from storePrices
  const productsWithPrices = useMemo(() => {
    return products.map(prod => {
      const prices = storePrices[prod.id] || [];
      const availablePrices = prices.filter(p => p.stockStatus !== 'AGOTADO').map(p => p.price);
      const minPrice = availablePrices.length > 0 ? Math.min(...availablePrices) : 0;
      return {
        ...prod,
        minPrice,
        storesCount: prices.length
      };
    });
  }, [products, storePrices]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return productsWithPrices.filter(prod => {
      const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
      const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [productsWithPrices, selectedCategory, searchQuery]);

  // Selected product's store list structured with full store details
  const storesForSelectedProduct = useMemo(() => {
    if (!selectedProduct) return [];
    const pricesForProd = storePrices[selectedProduct.id] || [];
    
    return pricesForProd.map(info => {
      const storeDef = STORES[info.storeId];
      return {
        ...info,
        name: storeDef?.name || 'Tienda Desconocida',
        distance: storeDef?.distance || 'N/A',
        distanceNum: storeDef?.distanceNum || 99,
        rating: storeDef?.rating || 4.2,
      } as Store;
    }).sort((a, b) => {
      // Sort by status availability, then price
      if (a.stockStatus === 'AGOTADO' && b.stockStatus !== 'AGOTADO') return 1;
      if (a.stockStatus !== 'AGOTADO' && b.stockStatus === 'AGOTADO') return -1;
      return a.price - b.price; // Lowest price first
    });
  }, [selectedProduct, storePrices]);

  // Cart helper quantities
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.store.price * item.quantity), 0);
  }, [cart]);

  const deliveryFee = deliveryType === 'delivery' ? 1.00 : 0.00;
  // Dynamic community cashback rewards
  const cashbackEarned = useMemo(() => {
    return cart.length > 0 ? 0.30 : 0;
  }, [cart]);

  const cartTotalUsd = cartSubtotal + deliveryFee;
  const cartTotalBf = cartTotalUsd * exchangeRate.rate;

  // Add to cart action
  const handleAddToCart = (product: Product, store: Store) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.store.storeId === store.storeId);
      if (existing) {
        return prev.map(item => 
          (item.product.id === product.id && item.store.storeId === store.storeId) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, store, quantity: 1 }];
    });
    
    // Popup validation/animation
    triggerNotification(`¡${product.name} agregado al carrito!`);
  };

  // Trigger floating alert
  const triggerNotification = (msg: string) => {
    setShowRewardNotification(msg);
    setTimeout(() => {
      setShowRewardNotification(null);
    }, 4000);
  };

  // Modify cart item quantity
  const handleUpdateQuantity = (productId: string, storeId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId && item.store.storeId === storeId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  // Confirm order handle
  const handleConfirmOrder = () => {
    if (cart.length === 0) return;
    
    // If paid via wallet, subtract balance
    if (paymentMethod === 'wallet') {
      if (userWallet < cartTotalUsd) {
        triggerNotification('❌ Balance de wallet insuficiente. Elige otro método.');
        return;
      }
      setUserWallet(prev => prev - cartTotalUsd);
    }

    const orderId = "ORD-" + Math.floor(Math.random() * 9000 + 1000);
    const orderDetails = {
      id: orderId,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee: deliveryFee,
      totalUsd: cartTotalUsd,
      paymentMethod: paymentMethod,
      status: 'CREADO' as const,
      deliveryType: deliveryType,
      step: 1
    };

    setActiveOrder(orderDetails);
    setOrderConfirmed(true);
    setOrderStep(1);
    
    // Reward user with cashback to wallet
    setUserWallet(prev => prev + cashbackEarned);
    triggerNotification(`🎉 ¡Ganaste $${cashbackEarned.toFixed(2)} de cashback!`);
  };

  // Reset checkout after completion
  const handleResetCheckout = () => {
    setCart([]);
    setIsCheckingOut(false);
    setOrderConfirmed(false);
    setOrderStep(0);
    setActiveOrder(null);
    setSelectedProduct(null);
    setSearchQuery('');
  };

  // Crowdsourcing Price Update Handler
  const handlePostReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingProduct || !reportingPrice) return;
    
    const inputPrice = parseFloat(reportingPrice);
    if (isNaN(inputPrice) || inputPrice <= 0) {
      alert('Por favor introduce un precio válido');
      return;
    }

    const currentProdId = reportingProduct.id;
    const storeIdStr = reportingStoreId;

    // Update storePrices record state
    setStorePrices(prev => {
      const currentList = prev[currentProdId] || [];
      const index = currentList.findIndex(p => p.storeId === storeIdStr);
      
      const updatedItem = {
        storeId: storeIdStr,
        price: inputPrice,
        stockStatus: reportingStockStatus,
        updateTime: 'hace 1 min',
        stockCount: reportingStockCount ? parseInt(reportingStockCount) : undefined,
        hasBestPrice: false // calculated dynamically on computation
      };

      let newList = [...currentList];
      if (index >= 0) {
        newList[index] = updatedItem;
      } else {
        newList.push(updatedItem);
      }

      // Recalculate hasBestPrice
      const minAvailablePrice = Math.min(...newList.filter(n => n.stockStatus !== 'AGOTADO').map(n => n.price));
      newList = newList.map(item => ({
        ...item,
        hasBestPrice: item.stockStatus !== 'AGOTADO' && item.price === minAvailablePrice
      }));

      return {
        ...prev,
        [currentProdId]: newList
      };
    });

    // Award $0.10 to user for community reporting!
    setUserWallet(prev => prev + 0.10);
    setReportsCount(prev => prev + 1);

    // Stream reported record into local live updates
    setCrowdReports(prev => [
      {
        id: Date.now().toString(),
        user: 'Tú (Colaborador)',
        product: reportingProduct.name,
        store: STORES[storeIdStr]?.name || 'Tienda',
        price: inputPrice,
        time: 'hace 1 min'
      },
      ...prev
    ]);

    triggerNotification(`💪 ¡Reporte aprobado! Ganaste +$0.10 en tu wallet.`);
    setReportingProduct(null); // Close form
    setReportingPrice('');
    setReportingStockCount('');
  };

  // Render Category Icon helper
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'alimentos': return '🌽';
      case 'farmacia': return '💊';
      case 'carnes': return '🥩';
      case 'lácteos': return '🥛';
      default: return '🛍️';
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] font-sans flex flex-col antialiased">
      
      {/* Floating Status / Toast notification for crowdsourcing actions */}
      {showRewardNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 border border-emerald-500/50 px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_25px_rgba(16,185,129,0.45)] animate-pulse text-sm max-w-sm text-center">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold text-white text-xs">{showRewardNotification}</span>
        </div>
      )}

      {/* Demo Multi-Role Simulator Toolbar */}
      <div className="bg-[#0b0b0b] border-b border-[#222] py-3.5 px-4 sticky top-0 z-40 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#777]">Demo Console:</span>
            <span className="text-xs text-[#ccc] font-medium leading-none">Intercambia roles para probar Forcé Pulso desde cada perspectiva:</span>
          </div>
          
          <div className="grid grid-cols-4 gap-1.5 w-full md:w-auto max-w-lg">
            <button 
              onClick={() => {
                setActiveRole('cliente');
                triggerNotification("🛒 Sesión: Rol Cliente habilitado");
              }}
              className={`py-2 px-3 text-[10px] tracking-wider uppercase font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'cliente' 
                  ? 'bg-emerald-600 text-black shadow-md shadow-emerald-500/25 font-black' 
                  : 'bg-[#121212] text-[#888] hover:text-[#bbb] hover:bg-[#161616] border border-[#222]'
              }`}
            >
              <span>🛒</span>
              <span>Cliente</span>
            </button>

            <button 
              onClick={() => {
                setActiveRole('colaborador');
                triggerNotification("📝 Sesión: Rol Colaborador (Vecino/Reportero) habilitado");
              }}
              className={`py-2 px-3 text-[10px] tracking-wider uppercase font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'colaborador' 
                  ? 'bg-emerald-600 text-black shadow-md shadow-emerald-500/25 font-black' 
                  : 'bg-[#121212] text-[#888] hover:text-[#bbb] hover:bg-[#161616] border border-[#222]'
              }`}
            >
              <span>📝</span>
              <span>Vecino</span>
            </button>

            <button 
              onClick={() => {
                setActiveRole('aliado');
                triggerNotification("🏪 Sesión: Rol Aliado Comercial (Bodega) habilitado");
              }}
              className={`py-2 px-3 text-[10px] tracking-wider uppercase font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'aliado' 
                  ? 'bg-emerald-600 text-black shadow-md shadow-emerald-500/25 font-black' 
                  : 'bg-[#121212] text-[#888] hover:text-[#bbb] hover:bg-[#161616] border border-[#222]'
              }`}
            >
              <span>🏪</span>
              <span>Tienda</span>
            </button>

            <button 
              onClick={() => {
                setActiveRole('motorizado');
                triggerNotification("🛵 Sesión: Rol Motorizado (Rider) habilitado");
              }}
              className={`py-2 px-3 text-[10px] tracking-wider uppercase font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'motorizado' 
                  ? 'bg-emerald-600 text-black shadow-md shadow-emerald-500/25 font-black' 
                  : 'bg-[#121212] text-[#888] hover:text-[#bbb] hover:bg-[#161616] border border-[#222]'
              }`}
            >
              <span>🛵</span>
              <span>Rider</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Desktop Dashboard Frame */}
      <div className="w-full max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start flex-1">
        
        {/* Left column: Feed, info panel & collaborative network stats */}
        <aside className="md:col-span-4 lg:col-span-3 space-y-6 hidden md:block self-stretch">
          
          {/* Logo & Platform Info */}
          <div className="bg-[#0b0b0b] border border-[#222] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-md shadow-md shadow-emerald-900/40">
                F
              </div>
              <div>
                <span className="font-extrabold tracking-tight text-white block">FORCÉ PULSO</span>
                <span className="text-[10px] uppercase text-[#777] font-semibold tracking-wider">San Felipe, Venezuela</span>
              </div>
            </div>
            <p className="text-xs text-[#999] leading-relaxed">
              Monitoreo colaborativo en tiempo real. Compara precios en bodegas, abastos y supermercados locales de Yaracuy para ahorrar en cada compra.
            </p>
            <div className="mt-4 pt-4 border-t border-[#1c1c1c] flex items-center justify-between">
              <span className="text-xs text-[#555] font-semibold">Tasa Activa</span>
              <span className="text-xs text-[#999] bg-[#141414] px-2 py-1 rounded border border-[#222]">
                1 USD = <strong className="text-white">Bs. {exchangeRate.rate}</strong>
              </span>
            </div>
          </div>

          {/* Collaborative Wallet Stat Box */}
          <div className="bg-[#0b0b0b] border border-[#222] rounded-2xl p-5">
            <label className="text-[10px] uppercase tracking-widest text-[#555] font-bold block mb-2">Mi Cartera Colaboradora</label>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-emerald-400">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-mono font-bold text-white">
                  ${userWallet.toFixed(2)}
                </div>
                <div className="text-[11px] text-[#777]">
                  ≈ Bs. {(userWallet * exchangeRate.rate).toFixed(2)}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#666] mt-3 italic leading-snug">
              Saldo acumulado al avisar precios nuevos o ganar cashback. Úsalo como método de pago (Forcé Wallet).
            </p>
          </div>

          {/* Crowd Activity Ticker */}
          <div className="bg-[#0b0b0b] border border-[#222] rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-widest text-[#555] font-bold">Actividad en la Zona</label>
              <div className="flex items-center gap-1.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full uppercase">
                <Flame className="w-2.5 h-2.5 animate-pulse" />
                <span>{reportsCount} Reportes</span>
              </div>
            </div>
            
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {crowdReports.map((report) => (
                <div key={report.id} className="p-2.5 bg-[#121212] rounded-lg border border-[#222]/60 hover:border-emerald-500/20 transition-all text-xs">
                  <div className="flex justify-between text-[#888] text-[10px] mb-1">
                    <span className="font-medium text-[#bbb]">{report.user}</span>
                    <span>{report.time}</span>
                  </div>
                  <div className="text-white font-medium mb-0.5">
                    {report.product}
                  </div>
                  <div className="flex justify-between items-center text-[#999]">
                    <span>{report.store}</span>
                    <strong className="text-emerald-400 font-mono">${report.price.toFixed(2)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick How-it-Works Help */}
          <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Award className="w-4 h-4" />
              <span>Gana por Ayudar</span>
            </div>
            <p className="text-[#888] leading-relaxed">
              ¿Viste un precio diferente en la calle? Toca <strong>"Avisar Precio"</strong>, actualiza la información y gana <strong>+$0.10</strong> inmediatamente.
            </p>
          </div>

        </aside>

        {/* Center column: Interactive App Container */}
        <main className="col-span-1 md:col-span-8 lg:col-span-6 w-full max-w-md md:max-w-none bg-[#090909] border border-[#222] rounded-3xl shadow-2xl relative overflow-hidden flex flex-col h-[750px] md:h-[820px] lg:h-[880px]">
          
          {/* Header Bar */}
          <header className="px-5 py-4 border-b border-[#111] bg-[#0c0c0c] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-[#555] uppercase tracking-widest font-bold">Yaracuy</span>
              <div className="flex items-center gap-1 text-white font-bold tracking-tight text-lg">
                <StoreIcon className="w-4 h-4 text-emerald-500" />
                <span>Forcé Pulso</span>
              </div>
            </div>

            {/* Price section of S CALLE (Dólar paralelo Yaracuy) */}
            <div className="bg-[#121212] border border-[#222] rounded-xl px-3 py-1.5 flex flex-col items-end text-right">
              <span className="text-[9px] uppercase tracking-wider text-[#666] font-bold">💵 S CALLE</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold font-mono text-white">Bs.{exchangeRate.rate.toFixed(2)}</span>
                <span className="text-[10px] font-mono text-emerald-500 flex items-center">
                  <ArrowUp className="w-2.5 h-2.5" />
                  +{exchangeRate.change}
                </span>
              </div>
              <span className="text-[8px] text-[#444] font-medium mt-0.5">actualizado {exchangeRate.lastUpdated}</span>
            </div>
          </header>

          {/* Subheader context or title instruction */}
          <div className="bg-emerald-950/35 border-b border-emerald-900/40 px-5 py-2 text-center text-[11px] font-semibold text-emerald-400 tracking-wide">
            {activeRole === 'aliado' ? (
              <span>🏪 PANEL DE REGISTRO COMERCIAL EN TIEMPO REAL</span>
            ) : activeRole === 'motorizado' ? (
              <span>🛵 SIMULADOR DE DESPACHO PARA MOTORIZADO ACTIVE</span>
            ) : (
              <span>TOCA UN PRODUCTO PARA VER DÓNDE ENCONTRARLO</span>
            )}
          </div>

          {/* MAIN LIST VIEW OR DETAIL COMPARE VIEWER */}
          <div className="flex-1 overflow-y-auto flex flex-col">
            
            {activeRole === 'aliado' ? (
              <div className="p-5 space-y-5">
                <div className="flex items-center justify-between border-b border-[#222] pb-3.5">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                       <StoreIcon className="w-4 h-4 text-emerald-400" />
                       <span>Panel de Aliado Comercial</span>
                    </h3>
                    <p className="text-[10px] text-[#777] mt-0.5 font-medium">Control directo de tu tienda en Forcé Pulso</p>
                  </div>
                  
                  <div>
                    <select 
                      value={selectedAliadoStoreId}
                      onChange={(e) => setSelectedAliadoStoreId(e.target.value)}
                      className="bg-[#121212] border border-[#222] rounded-xl px-3 py-1.5 text-xs text-white uppercase font-bold outline-none cursor-pointer"
                    >
                      {Object.entries(STORES).map(([id, store]) => (
                        <option key={id} value={id}>{store.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Stats Block */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[#0b0b0b] border border-[#222] p-2.5 rounded-xl">
                    <span className="text-[9px] uppercase font-bold text-[#555] block mb-0.5">Ventas Hoy</span>
                    <span className="text-xs font-mono font-bold text-white">4 Pedidos</span>
                  </div>
                  <div className="bg-[#0b0b0b] border border-[#222] p-2.5 rounded-xl">
                    <span className="text-[9px] uppercase font-bold text-[#555] block mb-0.5">Ingresos Est.</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">$34.50</span>
                  </div>
                  <div className="bg-[#0b0b0b] border border-[#222] p-2.5 rounded-xl">
                    <span className="text-[9px] uppercase font-bold text-[#555] block mb-0.5">Factor "CALLE"</span>
                    <span className="text-xs font-mono font-bold text-indigo-400">Bs.{exchangeRate.rate}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#555]">Inventario y Precios de la Tienda</span>
                    <span className="text-[9px] text-[#888] italic">Actualiza precios en tiempo real</span>
                  </div>

                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {products.map((prod) => {
                      const pricesList = storePrices[prod.id] || [];
                      const myStoreRef = pricesList.find(p => p.storeId === selectedAliadoStoreId);
                      
                      const currentPrice = myStoreRef ? myStoreRef.price : 1.99;
                      const currentStockStatus = myStoreRef ? myStoreRef.stockStatus : 'DISPONIBLE';

                      const updateStorePriceAndStock = (newPrice: number, newStatus: string) => {
                        setStorePrices(prev => {
                          const list = prev[prod.id] || [];
                          const idx = list.findIndex(p => p.storeId === selectedAliadoStoreId);
                          const newItem = {
                            storeId: selectedAliadoStoreId,
                            price: Number(newPrice.toFixed(2)),
                            stockStatus: newStatus as any,
                            updateTime: 'Justo ahora',
                            hasBestPrice: false
                          };
                          
                          let newList = [...list];
                          if (idx >= 0) {
                            newList[idx] = newItem;
                          } else {
                            newList.push(newItem);
                          }

                          // Recalculate best price
                          const minAvailablePrice = Math.min(...newList.filter(n => n.stockStatus !== 'AGOTADO').map(n => n.price));
                          newList = newList.map(item => ({
                            ...item,
                            hasBestPrice: item.stockStatus !== 'AGOTADO' && item.price === minAvailablePrice
                          }));

                          return {
                            ...prev,
                            [prod.id]: newList
                          };
                        });

                        triggerNotification(`🏪 ¡Actualizado! ${prod.name} -> $${newPrice.toFixed(2)}`);
                      };

                      return (
                        <div key={prod.id} className="p-3 bg-[#0c0c0c] border border-[#222] rounded-xl flex items-center justify-between gap-3 hover:border-[#333] transition-colors">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl p-1 bg-[#141414] rounded-lg border border-[#222]">{prod.icon}</span>
                            <div>
                              <h4 className="text-xs font-bold text-white">{prod.name}</h4>
                              <div className="flex gap-2 items-center mt-1">
                                <select 
                                  value={currentStockStatus}
                                  onChange={(e) => updateStorePriceAndStock(currentPrice, e.target.value)}
                                  className="bg-[#121212] border border-[#222] text-[9px] font-bold py-0.5 px-1.5 rounded outline-none text-emerald-400 cursor-pointer"
                                >
                                  <option value="DISPONIBLE">HAY STOCK</option>
                                  <option value="POCAS UNIDADES">POCO STOCK</option>
                                  <option value="AGOTADO">AGOTADO</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Price Adjusters */}
                          <div className="flex items-center gap-2 bg-[#121212] border border-[#222] p-1.5 rounded-xl">
                            <button 
                              type="button"
                              onClick={() => updateStorePriceAndStock(Math.max(0.1, currentPrice - 0.1), currentStockStatus)}
                              className="w-6 h-6 rounded bg-[#222] flex items-center justify-center font-bold text-xs text-white hover:bg-red-850/20 hover:text-red-400 cursor-pointer"
                            >
                              -
                            </button>
                            <div className="text-center min-w-[55px]">
                              <span className="text-xs font-mono font-extrabold text-white block">${currentPrice.toFixed(2)}</span>
                              <span className="text-[8px] font-mono text-[#555] block">Bs.{(currentPrice * exchangeRate.rate).toFixed(1)}</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => updateStorePriceAndStock(currentPrice + 0.1, currentStockStatus)}
                              className="w-6 h-6 rounded bg-[#222] flex items-center justify-center font-bold text-xs text-white hover:bg-emerald-950/20 hover:text-emerald-400 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : activeRole === 'motorizado' ? (
              <div className="p-5 space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#222] pb-3.5">
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <span>🛵</span>
                        <span>Consola del Motorizado (Rider)</span>
                      </h3>
                      <p className="text-[10px] text-[#777] mt-0.5 font-medium">Acepta pedidos y gestiona el despacho Yaracuy</p>
                    </div>

                    <span className="px-2 py-0.5 bg-indigo-950 text-indigo-400 text-[9px] font-black uppercase rounded border border-indigo-500/20">
                      GPS ACTIVO
                    </span>
                  </div>

                  {activeOrder ? (
                    <div className="space-y-4 text-xs">
                      {/* Active Delivery card details */}
                      <div className="bg-[#0b0b0b] border border-indigo-500/25 p-4 rounded-2xl relative overflow-hidden space-y-3">
                        <div className="absolute top-0 right-0 bg-indigo-600 text-black text-[9px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                          {activeOrder.status}
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-indigo-400 block font-mono">{activeOrder.id}</span>
                          <h4 className="text-xs font-bold text-white">Entrega en: Calle 3, Sector Plaza Yara, San Felipe</h4>
                          <span className="text-[10px] text-[#555] block">
                            Método de pago: <strong className="text-white uppercase font-mono">{activeOrder.paymentMethod}</strong> · Total: <strong className="text-emerald-400 font-mono">${activeOrder.totalUsd.toFixed(2)}</strong>
                          </span>
                        </div>

                        <div className="border-t border-[#1c1c1c] pt-2 max-h-[140px] overflow-y-auto space-y-1 text-[#888]">
                          {activeOrder.items.map((item, id) => (
                            <div key={id} className="flex justify-between">
                              <span>{item.quantity}x {item.product.name}</span>
                              <span className="text-white text-[10px] font-mono">({item.store.name})</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Stepper control buttons */}
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-[#555]">PROGRESO DEL DELIVEY</label>
                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <button 
                            type="button"
                            disabled={activeOrder.status !== 'CREADO'}
                            onClick={() => {
                              setActiveOrder(curr => curr ? { ...curr, status: 'ACEPTADO', step: 2 } : null);
                              setOrderStep(2);
                              triggerNotification("🛵 ¡Órden aceptada! Rumbo a la tienda.");
                            }}
                            className="py-3 px-2 rounded-xl bg-[#0c0c0c] border border-[#222]/50 hover:bg-indigo-950/20 hover:border-indigo-500/50 text-white disabled:opacity-40 disabled:pointer-events-none transition-all font-bold cursor-pointer"
                          >
                            🤝 Aceptar Órden
                          </button>
                          
                          <button 
                            type="button"
                            disabled={activeOrder.status !== 'ACEPTADO'}
                            onClick={() => {
                              setActiveOrder(curr => curr ? { ...curr, status: 'RECOGIENDO', step: 3 } : null);
                              setOrderStep(3);
                              triggerNotification("🛍️ Pedido retirado de la tienda. En tránsito.");
                            }}
                            className="py-3 px-2 rounded-xl bg-[#0c0c0c] border border-[#222]/50 hover:bg-indigo-950/20 hover:border-indigo-500/50 text-white disabled:opacity-40 disabled:pointer-events-none transition-all font-bold cursor-pointer"
                          >
                            🛍️ Retirar de tienda
                          </button>

                          <button 
                            type="button"
                            disabled={activeOrder.status !== 'RECOGIENDO'}
                            onClick={() => {
                              setActiveOrder(curr => curr ? { ...curr, status: 'RUTA', step: 4 } : null);
                              setOrderStep(4);
                              triggerNotification("📍 En ruta al destino del cliente.");
                            }}
                            className="py-3 px-2 rounded-xl bg-[#0c0c0c] border border-[#222]/50 hover:bg-indigo-950/20 hover:border-indigo-500/50 text-white disabled:opacity-40 disabled:pointer-events-none transition-all font-bold cursor-pointer"
                          >
                            🛣️ En ruta al cliente
                          </button>

                          <button 
                            type="button"
                            disabled={activeOrder.status !== 'RUTA'}
                            onClick={() => {
                              setActiveOrder(curr => curr ? { ...curr, status: 'ENTREGADO', step: 5 } : null);
                              setOrderStep(5);
                              triggerNotification("🎉 ¡Pedido entregado! Ecosistema completado.");
                            }}
                            className="py-3 px-2 rounded-xl bg-[#0c0c0c] border border-[#222]/50 hover:bg-emerald-950/20 hover:border-emerald-500/50 text-emerald-400 disabled:opacity-40 disabled:pointer-events-none transition-all font-bold col-span-2 cursor-pointer"
                          >
                            🏁 Entregar Pedido
                          </button>
                        </div>
                      </div>

                      <p className="text-[10px] text-[#555] leading-relaxed italic text-center">
                        Pulsar los pasos anteriores actualizará inmediatamente la pantalla de tracking de entrega que recibe tu cliente en tiempo real.
                      </p>
                    </div>
                  ) : (
                    <div className="py-12 px-4 text-center rounded-2xl bg-[#0b0b0b] border border-[#222] space-y-4 flex-1 flex flex-col justify-center items-center">
                      <div className="text-3xl">📭</div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white">Sin Pedidos Asignados</h4>
                        <p className="text-[11px] text-[#666] leading-relaxed max-w-sm mx-auto text-xs">
                          No hay solicitudes de delivery activas de clientes en San Felipe en este momento.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const testItems = [{ 
                            product: products[0], 
                            store: { 
                              storeId: 'mercado-el-valle', 
                              price: 1.95, 
                              name: 'Mercado El Valle', 
                              distance: '1.2 km', 
                              distanceNum: 1.2, 
                              rating: 4.5, 
                              updateTime: 'hace 5 min', 
                              stockStatus: 'DISPONIBLE' as const, 
                              hasBestPrice: true 
                            }, 
                            quantity: 1 
                          }];
                          const testOrder = {
                            id: "ORD-" + Math.floor(Math.random() * 9000 + 1000),
                            items: testItems,
                            subtotal: 1.95,
                            deliveryFee: 1.00,
                            totalUsd: 2.95,
                            paymentMethod: 'usd',
                            status: 'CREADO' as const,
                            deliveryType: 'delivery' as const,
                            step: 1
                          };
                          setActiveOrder(testOrder);
                          setOrderConfirmed(true);
                          setOrderStep(1);
                          triggerNotification("🔔 ¡Nueva órden simulada recibida!");
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-white font-extrabold text-[10px] tracking-wider uppercase rounded-lg transition-all cursor-pointer"
                      >
                        Crear pedido de prueba instantneo
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-[#0b0b0b] border border-white/5 p-3 rounded-lg text-[10px] text-[#666] leading-relaxed">
                  <strong>💡 Cómo Probar el Ciclo Completo:</strong>
                  <ul className="list-disc pl-4 mt-1 space-y-1">
                    <li>Paso 1: Ve a <strong>"Cliente"</strong>, agrega algo al carrito y haz el checkout.</li>
                    <li>Paso 2: Ve a <strong>"Motorizado"</strong> para aceptar, retirar y entregar el pedido.</li>
                    <li>Paso 3: Vuelves a <strong>"Cliente"</strong> y verás el tracking actualizado en vivo.</li>
                  </ul>
                </div>
              </div>
            ) : (
              <>

            {/* If the user is viewing cart checkout directly */}
            {isCheckingOut ? (
              <div className="p-5 space-y-6">
                
                {/* Back button from cart */}
                {!orderConfirmed && (
                  <button 
                    onClick={() => setIsCheckingOut(false)}
                    className="flex items-center gap-2 text-xs font-semibold text-[#888] hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Volver a la Lista</span>
                  </button>
                )}

                {!orderConfirmed ? (
                  <>
                    <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 border-b border-[#222] pb-3">
                      <ShoppingBag className="w-5 h-5 text-emerald-500" />
                      <span>Tu Carrito</span>
                    </h2>

                    {cart.length === 0 ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-[#111] flex items-center justify-center text-2xl">
                          🛒
                        </div>
                        <p className="text-sm text-[#777]">Tu carrito está vacío</p>
                        <button 
                          onClick={() => setIsCheckingOut(false)}
                          className="px-5 py-2 bg-[#1c1c1c] text-sm text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
                        >
                          Explorar Alimentos
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        
                        {/* Selected goods */}
                        <div className="space-y-3 bg-[#0d0d0d] p-3 rounded-xl border border-[#222]">
                          {cart.map((item, idx) => (
                            <div key={`${item.product.id}-${item.store.storeId}-${idx}`} className="flex items-center justify-between py-2 border-b border-[#1c1c1c] last:border-b-0">
                              <div className="flex items-start gap-2.5">
                                <span className="text-xl p-1.5 bg-[#141414] rounded-lg border border-[#222]">
                                  {item.product.icon}
                                </span>
                                <div>
                                  <h4 className="text-xs font-bold text-white">{item.product.name}</h4>
                                  <span className="text-[10px] text-[#777] block">
                                    Adquirido en: <strong className="text-emerald-400">{item.store.name}</strong>
                                  </span>
                                  <span className="text-[10px] font-semibold text-[#555]">
                                    ${item.store.price.toFixed(2)} c/u
                                  </span>
                                </div>
                              </div>

                              {/* Quantity selectors */}
                              <div className="flex items-center gap-2 bg-[#121212] border border-[#222] p-1.5 rounded-xl shrink-0">
                                <button 
                                  onClick={() => handleUpdateQuantity(item.product.id, item.store.storeId, -1)}
                                  className="w-5 h-5 rounded-md bg-[#181818] flex items-center justify-center text-[#bbb] active:bg-red-950/20 active:text-red-400"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-mono font-bold px-1 text-white">{item.quantity}</span>
                                <button 
                                  onClick={() => handleUpdateQuantity(item.product.id, item.store.storeId, 1)}
                                  className="w-5 h-5 rounded-md bg-[#181818] flex items-center justify-center text-[#bbb] active:bg-green-950/20 active:text-emerald-400"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Delivery Type Option */}
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-[#555] font-bold block">TIPO DE ENTREGA</label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setDeliveryType('delivery')}
                              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-center ${
                                deliveryType === 'delivery' 
                                  ? 'bg-emerald-950/25 border-emerald-500/50 text-emerald-400 font-bold shadow-lg shadow-emerald-900/10'
                                  : 'bg-[#0d0d0d] border-[#222] text-[#888]'
                              }`}
                            >
                              <span className="text-xs">🛵 Delivery</span>
                              <span className="text-[10px] text-[#666] font-mono">+$1.00</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeliveryType('recoger')}
                              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-center ${
                                deliveryType === 'recoger' 
                                  ? 'bg-emerald-950/25 border-emerald-500/50 text-emerald-400 font-bold shadow-lg shadow-emerald-900/10'
                                  : 'bg-[#0d0d0d] border-[#222] text-[#888]'
                              }`}
                            >
                              <span className="text-xs">🏪 Recoger en Persona</span>
                              <span className="text-[10px] text-emerald-555 font-mono text-emerald-500">Gratis</span>
                            </button>
                          </div>
                        </div>

                        {/* Payment Method Selector */}
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-[#555] font-bold block">MÉTODO DE PAGO</label>
                          <div className="grid grid-cols-5 gap-1.5">
                            {(['usd', 'bs', 'pago_movil', 'zelle', 'wallet'] as const).map((method) => {
                              const labels = {
                                usd: '$',
                                bs: 'Bs',
                                pago_movil: 'Pago Móvil',
                                zelle: 'Zelle',
                                wallet: 'Wallet'
                              };
                              const isActive = paymentMethod === method;
                              return (
                                <button
                                  key={method}
                                  type="button"
                                  onClick={() => setPaymentMethod(method)}
                                  className={`py-2 px-1 text-[10px] font-bold rounded-lg border text-center flex flex-col items-center justify-center transition-all ${
                                    isActive 
                                      ? 'bg-emerald-500/10 border-emerald-500 text-white' 
                                      : 'bg-[#0b0b0b] border-[#1c1c1c] text-[#777] hover:text-[#aaa]'
                                  }`}
                                >
                                  {method === 'wallet' && (
                                    <span className="block text-[8px] text-emerald-400 font-mono">${userWallet.toFixed(1)}</span>
                                  )}
                                  <span>{labels[method]}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Pricing Bill Summary break */}
                        <div className="bg-[#0b0b0b] p-4 rounded-xl border border-[#222] space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-[#646464]">Subtotal</span>
                            <span className="text-white font-mono">${cartSubtotal.toFixed(2)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-[#646464]">Delivery Forcé</span>
                            <span className="text-white font-mono">
                              {deliveryFee > 0 ? `+$${deliveryFee.toFixed(2)}` : 'Gratis'}
                            </span>
                          </div>

                          <div className="flex justify-between text-emerald-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Cashback</span>
                            </span>
                            <span className="font-mono">+${cashbackEarned.toFixed(2)}</span>
                          </div>

                          <div className="border-t border-[#1c1c1c] pt-2 mt-2 flex justify-between items-end">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">TOTAL</span>
                            <div className="text-right">
                              <span className="text-xl font-extrabold font-mono text-emerald-400 block">
                                ${cartTotalUsd.toFixed(2)}
                              </span>
                              <span className="text-[10px] font-mono text-[#666]">
                                Bs. {cartTotalBf.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Checkout Submit CTA button */}
                        <button
                          type="button"
                          onClick={handleConfirmOrder}
                          disabled={cart.length === 0}
                          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:bg-[#1a1a1a] disabled:text-[#444] text-black font-extrabold text-xs tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 text-black" />
                          <span>Confirmar Pedido - ${cartTotalUsd.toFixed(2)}</span>
                        </button>

                      </div>
                    )}
                  </>
                ) : (
                  // Success State screen
                  <div className="py-6 text-center space-y-6 animate-fadeIn">
                    <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                      <CheckCircle2 className="w-8 h-8 lg:w-10 lg:h-10" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-white tracking-widest uppercase">¡Pedido Enviado!</h2>
                      <p className="text-xs text-emerald-400 font-semibold italic">Tu motorizado Forcé está en camino ...</p>
                      <p className="text-xs text-[#777]">Tiempo de entrega estimado: <strong className="text-white font-mono">15 - 25 min</strong></p>
                    </div>

                    {/* Receipt recap badge */}
                    <div className="bg-[#0c0c0c] border border-[#222] p-4 rounded-2xl max-w-xs mx-auto text-xs space-y-1">
                      <div className="text-[#666] tracking-wider uppercase text-[10px] font-bold">TOTAL PAGADO</div>
                      <div className="text-2xl font-bold text-emerald-400 font-mono">${cartTotalUsd.toFixed(2)}</div>
                      <div className="text-[10px] text-[#555]">pagado vía <strong className="text-white uppercase">{paymentMethod}</strong></div>
                    </div>

                    <div className="bg-[#121212] border border-[#222]/50 p-3 rounded-xl max-w-xs mx-auto flex items-center justify-center gap-2 text-xs">
                      <Award className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-[#999]">Ganaste <strong>$0.30</strong> directos a tu Forcé Wallet</span>
                    </div>

                    {/* Micro simulated map animation of delivery rider */}
                    <div className="border border-[#222] bg-[#0c0c0c] rounded-xl overflow-hidden p-3 relative h-40">
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_#333_1px,_transparent_1px)] bg-[size:12px_12px]"></div>

                      {/* Path lines */}
                      <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path 
                          d="M 20 20 L 50 20 L 50 80 L 80 80" 
                          fill="none" 
                          stroke="#333" 
                          strokeWidth="2.5" 
                          strokeDasharray="4 4"
                        />
                        <path 
                          d="M 20 20 L 50 20 L 50 80 L 80 80" 
                          fill="none" 
                          stroke="#10b981" 
                          strokeWidth="1.5" 
                          strokeDasharray="100"
                          strokeDashoffset={100 - (orderStep * 20)}
                          className="transition-all duration-1000"
                        />
                      </svg>

                      {/* Store point marker */}
                      <div className="absolute top-[16%] left-[16%] flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 border border-black flex items-center justify-center">
                          <div className="w-1 h-1 rounded-full bg-white"></div>
                        </div>
                        <span className="text-[8px] mt-0.5 text-[#555] font-mono font-bold">Tienda</span>
                      </div>

                      {/* Customer point marker */}
                      <div className="absolute bottom-[16%] right-[16%] flex flex-col items-center">
                        <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 ring-4 ring-indigo-950 border border-black flex items-center justify-center">
                          <div className="w-1 h-1 rounded-full bg-white"></div>
                        </div>
                        <span className="text-[8px] mt-0.5 text-indigo-400 font-mono font-bold">Tú</span>
                      </div>

                      {/* Motorized rider progressing icon */}
                      {orderStep > 0 && (
                        <div 
                          className="absolute text-lg transition-all duration-1000 z-10"
                          style={{
                            top: orderStep === 1 ? '16%' : orderStep === 2 ? '16%' : orderStep === 3 ? '48%' : '73%',
                            left: orderStep === 1 ? '30%' : orderStep === 2 ? '44%' : orderStep === 3 ? '44%' : (orderStep >= 4 ? '70%' : '20%'),
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          🛵
                        </div>
                      )}

                      {/* Live feedback string */}
                      <div className="absolute bottom-2 left-3 text-[10px] text-[#555] font-mono">
                        {orderStep === 5 ? '¡Motorizado entregó el pedido!' : `Ruta del Motorizado — Fase ${orderStep}/4`}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetCheckout}
                      className="w-full max-w-xs py-3 bg-[#161616] hover:bg-[#202020] text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer"
                    >
                      Seguir Comprando
                    </button>
                  </div>
                )}

              </div>
            ) : selectedProduct ? (
              // STEP: Detailed Stores Pricing analysis for product
              <div className="p-4 space-y-4">
                
                {/* Header detail row with back action */}
                <div className="flex items-center justify-between pb-3 border-b border-[#222]">
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="flex items-center gap-1.5 text-xs text-[#888] hover:text-white transition-all font-semibold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Volver</span>
                  </button>

                  <span className="px-2.5 py-1 rounded bg-[#1c1c1c] text-[10px] text-emerald-400 font-mono font-bold border border-[#222]">
                    Comparando {storesForSelectedProduct.length} sitios
                  </span>
                </div>

                {/* Main Product Card Recap */}
                <div className="p-4 rounded-2xl bg-[#0b0b0b] border border-[#222] flex gap-3 relative overflow-hidden">
                  <span className="text-4xl p-2 bg-[#121212] rounded-xl border border-[#222] self-center shrink-0">
                    {selectedProduct.icon}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-white leading-tight">
                      {selectedProduct.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#666]">Mejor precio: </span>
                      <strong className="text-xs text-emerald-400 font-mono">
                        ${(productsWithPrices.find(p => p.id === selectedProduct.id)?.minPrice || 0).toFixed(2)}
                      </strong>
                    </div>
                    {selectedProduct.isNearSoldOut && (
                      <span className="inline-block text-[9px] font-black uppercase tracking-wider text-orange-500 bg-orange-950/20 px-2 py-0.5 rounded border border-orange-500/20">
                        ⚠️ CASI AGOTADO EN ZONA
                      </span>
                    )}
                  </div>

                  {/* Dynamic report trigger action */}
                  <button 
                    onClick={() => setReportingProduct(selectedProduct)}
                    className="absolute bottom-3 right-3 text-[10px] text-emerald-400 font-extrabold hover:underline"
                  >
                    + Avisar precio diferente
                  </button>
                </div>

                {/* Subtitle list ordering details */}
                <div className="flex justify-between items-center text-[10px] text-[#555] uppercase font-bold tracking-widest">
                  <span>Tiendas locales</span>
                  <span>Ordenadas por precio + distancia</span>
                </div>

                {/* Compare pricing list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3.5">
                  {storesForSelectedProduct.map((info, idx) => {
                    const isAvailable = info.stockStatus !== 'AGOTADO';
                    const isPocas = info.stockStatus === 'POCAS UNIDADES';
                    const toBsf = info.price * exchangeRate.rate;

                    return (
                      <div 
                        key={`${info.storeId}-${idx}`} 
                        className={`p-3.5 bg-[#0b0b0b] border rounded-xl flex flex-col gap-3 transition-all relative overflow-hidden ${
                          info.hasBestPrice && isAvailable
                            ? 'border-emerald-500/40 shadow-md shadow-emerald-900/5' 
                            : 'border-[#1c1c1c]'
                        }`}
                      >
                        {/* Best price badge */}
                        {info.hasBestPrice && isAvailable && (
                          <div className="absolute top-0 right-0 bg-emerald-600 text-[8px] font-extrabold px-2.5 py-0.5 rounded-bl-lg text-black uppercase tracking-widest">
                            MEJOR PRECIO
                          </div>
                        )}

                        {/* Top row - Store identity */}
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-white text-xs lg:text-sm">
                              <span>#{idx + 1}</span>
                              <h4>{info.name}</h4>
                            </div>
                            
                            <div className="flex items-center gap-2 text-[10px] text-[#888] mt-1 shrink-0">
                              <span className="flex items-center gap-0.5">
                                <Navigation className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
                                <span>{info.distance}</span>
                              </span>
                              <span>·</span>
                              <span className="text-[#bbb]">⭐ {info.rating}</span>
                              <span>·</span>
                              <span className="flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5 text-[#555]" />
                                <span>{info.updateTime}</span>
                              </span>
                            </div>
                          </div>

                          {/* Price tags in massive font */}
                          <div className="text-right shrink-0">
                            <span className={`text-lg font-mono font-black ${isAvailable ? 'text-emerald-400' : 'text-[#555]'}`}>
                              ${info.price.toFixed(2)}
                            </span>
                            <span className="block text-[10px] font-mono text-[#555] -mt-1">
                              Bs.{toBsf.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Middle row - Stock availability status details */}
                        <div className="flex items-center justify-between border-t border-[#1a1a1a] pt-2.5 mt-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              info.stockStatus === 'AGOTADO' 
                                ? 'bg-red-500' 
                                : isPocas 
                                  ? 'bg-orange-500' 
                                  : 'bg-emerald-500'
                            }`} />
                            <span className={`text-[10px] font-bold ${
                              info.stockStatus === 'AGOTADO' 
                                ? 'text-red-500' 
                                : isPocas 
                                  ? 'text-orange-400' 
                                  : 'text-emerald-400'
                            }`}>
                              {info.stockStatus}
                            </span>

                            {info.stockCount !== undefined && info.stockCount > 0 && (
                              <span className="text-[9px] bg-orange-950/40 text-orange-400 border border-orange-500/20 px-1.5 py-0.1 rounded-full font-bold">
                                {info.stockCount} unidades
                              </span>
                            )}
                          </div>

                          {/* Savings indicator */}
                          {info.hasBestPrice && (
                            <div className="text-[10px] text-emerald-300 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/10">
                              ahorras <strong className="font-mono">$0.60</strong>
                            </div>
                          )}
                        </div>

                        {/* Interactive shopping action trigger */}
                        {isAvailable ? (
                          <button
                            type="button"
                            onClick={() => handleAddToCart(selectedProduct, info)}
                            className="w-full mt-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-all active:scale-[0.99] cursor-pointer"
                          >
                            Agregar al Carrito - ${info.price.toFixed(2)}
                          </button>
                        ) : (
                          <div className="text-center py-2 bg-[#141414] text-[10px] text-[#555] font-bold uppercase tracking-wider rounded-lg border border-[#1a1a1a]">
                            Producto Agotado en esta Tienda
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>

                {/* Quick actions row helper */}
                <div className="pt-3 flex justify-center">
                  <button 
                    onClick={() => setReportingProduct(selectedProduct)}
                    className="px-4 py-2 bg-[#121212] border border-[#222] hover:bg-[#1a1a1a] transition-all rounded-xl text-xs text-[#aaa] font-semibold flex items-center gap-2 shadow-sm"
                  >
                    <Coins className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Avisar precio más bajo y ganar $0.10</span>
                  </button>
                </div>

              </div>
            ) : (
              // STEP: Main product stream viewer
              <>
                {/* View selectors: LISTA vs MAPA */}
                <div className="px-5 py-4 border-b border-[#111] bg-[#0b0b0b] flex items-center justify-between gap-3">
                  
                  {/* Toggle buttons styled precisely as the reference video */}
                  <div className="flex-1 grid grid-cols-2 gap-2 bg-[#121212] border border-[#222] p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setActiveView('lista')}
                      className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        activeView === 'lista'
                          ? 'bg-emerald-600 text-black border-b-2 border-emerald-700 shadow-md'
                          : 'text-[#888] hover:text-white'
                      }`}
                    >
                      <List className="w-4 h-4" />
                      <span>LISTA</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView('mapa')}
                      className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        activeView === 'mapa'
                          ? 'bg-emerald-600 text-black border-b-2 border-emerald-700 shadow-md'
                          : 'text-[#888] hover:text-white'
                      }`}
                    >
                      <MapIcon className="w-4 h-4" />
                      <span>MAPA</span>
                    </button>
                  </div>

                  {/* Micro Cart Indicator button */}
                  <button
                    onClick={() => {
                      if (cart.length > 0) setIsCheckingOut(true);
                    }}
                    className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
                      cart.length > 0 
                        ? 'bg-emerald-950/20 border-emerald-500/50 text-white animate-pulse' 
                        : 'bg-[#121212] border-[#222] text-[#555] opacity-50'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    {cart.length > 0 && (
                      <span className="w-5 h-5 bg-emerald-500 text-black font-mono font-bold text-xs rounded-full flex items-center justify-center shrink-0">
                        {cart.reduce((s, i) => s + i.quantity, 0)}
                      </span>
                    )}
                  </button>
                </div>

                {/* Filter and search zone */}
                <div className="px-4 py-3 bg-[#0a0a0a] border-b border-[#111] space-y-3">
                  
                  {/* Dynamic interactive search input */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="¿Qué producto buscas?"
                      className="w-full bg-[#111] hover:bg-[#141414] focus:bg-[#161616] border border-[#222] focus:border-emerald-500/50 rounded-xl py-2.5 pl-10 pr-9 text-xs text-white placeholder-[#555] outline-none transition-all"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full bg-[#222] text-[#888] hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Horizontal Scroll categories pills list */}
                  <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none scroll-smooth">
                    {(['all', 'alimentos', 'farmacia', 'carnes', 'lácteos'] as const).map((cat) => {
                      const isActive = selectedCategory === cat;
                      const label = cat === 'all' ? 'Todo' : cat.charAt(0).toUpperCase() + cat.slice(1);
                      const icon = getCategoryIcon(cat);

                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`py-1.5 px-3 rounded-lg border text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 capitalize cursor-pointer ${
                            isActive
                              ? 'bg-[#1a1a1a] border-emerald-500 text-emerald-400 shadow-md'
                              : 'bg-[#0f0f0f] border-[#222] text-[#888] hover:text-white'
                          }`}
                        >
                          <span>{icon}</span>
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>

                </div>

                {/* STREAM AREA: LIST COMPONENT VIEW */}
                {activeView === 'lista' ? (
                  <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                    
                    {filteredProducts.length === 0 ? (
                      <div className="py-12 text-center text-[#555] text-xs">
                        <Info className="w-8 h-8 text-[#333] mx-auto mb-2" />
                        <p>No se encontraron productos que coincidan</p>
                      </div>
                    ) : (
                      filteredProducts.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => setSelectedProduct(prod)}
                          className="bg-[#0b0b0b] hover:bg-[#121212] border border-[#222] hover:border-emerald-500/20 rounded-2xl p-4 flex justify-between items-center transition-all cursor-pointer group shadow-sm"
                        >
                          <div className="flex items-center gap-3.5">
                            {/* Icon block */}
                            <span className="text-3xl p-2 bg-[#141414] group-hover:bg-[#181818] rounded-xl border border-[#222] transition-colors shrink-0">
                              {prod.icon}
                            </span>
                            
                            <div className="space-y-0.5">
                              <h3 className="font-extrabold text-white text-sm lg:text-base leading-snug group-hover:text-emerald-400 transition-colors">
                                {prod.name}
                              </h3>
                              <div className="flex items-center gap-1.5 text-[10px] text-[#666] font-medium">
                                <span className="bg-[#121212] px-2 py-0.5 rounded border border-[#222] text-[#888]">
                                  {prod.storesCount} tiendas
                                </span>
                                {prod.isNearSoldOut && (
                                  <span className="text-orange-500 text-[9px] font-bold">● Casi agotado</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Price range indicators */}
                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-[#555] font-bold block">desde</span>
                            <strong className="text-emerald-400 font-mono text-base font-extrabold">
                              ${prod.minPrice.toFixed(2)}
                            </strong>
                            <span className="block text-[9px] font-mono text-[#444]">
                              Bs.{(prod.minPrice * exchangeRate.rate).toFixed(1)}
                            </span>
                          </div>

                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  // STREAM AREA: INTERACTIVE VECTOR MAP COMPONENT VIEW
                  <div className="relative flex-1 bg-[#101010] p-4 flex flex-col justify-between">
                    
                    {/* Map Information label bar overlay */}
                    <div className="absolute top-2 left-2 z-15 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5 text-[9px] text-[#888] max-w-[220px]">
                      🗺️ <strong>S. Felipe, Yaracuy</strong>. Selecciona un producto para visualizar precios en comercios.
                    </div>

                    {/* Vector simulation of geographical map grid of San Felipe */}
                    <div className="flex-1 border border-[#222] rounded-xl overflow-hidden bg-[#0c0c0c] flex items-center justify-center my-3 relative h-80 md:h-[420px] lg:h-[480px]">
                      
                      {/* Grid background pattern dot */}
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#2b2b2b_1.5px,_transparent_1.5px)] bg-[size:16px_16px]"></div>

                      {/* Custom stylized local streets overlay SVGs */}
                      <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* Streets */}
                        <line x1="10" y1="10" x2="90" y2="90" stroke="#222" strokeWidth="2" />
                        <line x1="90" y1="10" x2="10" y2="90" stroke="#222" strokeWidth="2" />
                        <line x1="50" y1="0" x2="50" y2="100" stroke="#333" strokeWidth="3" />
                        <line x1="0" y1="40" x2="100" y2="40" stroke="#222" strokeWidth="1.5" />
                        <line x1="0" y1="70" x2="100" y2="70" stroke="#333" strokeWidth="2.5" />

                        {/* Local plaza Yaracuy circle */}
                        <circle cx="50" cy="40" r="14" fill="none" stroke="#2b2b2b" strokeWidth="2" strokeDasharray="3 3"/>
                      </svg>

                      {/* Render Interactive Pin Markers */}
                      {Object.values(STORES).map((store) => {
                        // Fetch price information if product filter is currently active
                        let priceTag = null;
                        if (selectedProduct) {
                          const pricesList = storePrices[selectedProduct.id] || [];
                          const itemPrice = pricesList.find(p => p.storeId === store.id);
                          if (itemPrice && itemPrice.stockStatus !== 'AGOTADO') {
                            priceTag = itemPrice.price;
                          }
                        }

                        return (
                          <div 
                            key={store.id} 
                            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
                            style={{ left: `${store.lat}%`, top: `${store.lng}%` }}
                            onClick={() => {
                              // If there is an active product matching, click goes to product stores review
                              if (selectedProduct) {
                                setSelectedProduct(selectedProduct);
                              } else {
                                // Default details alert
                                triggerNotification(`📍 ${store.name} - ${store.address}`);
                              }
                            }}
                          >
                            {/* Hover tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex bg-black border border-[#222] text-[10px] text-white py-1 px-2.5 rounded-lg shrink-0 w-max z-35 font-semibold text-center pointer-events-none">
                              {store.name} · {store.distance}
                            </div>

                            {/* Store Marker Button elements */}
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shadow-md ${
                              priceTag !== null 
                                ? 'bg-[#003c20] border-emerald-500 scale-110' 
                                : 'bg-[#1a1a1a] border-[#333] hover:scale-105'
                            }`}>
                              {priceTag !== null ? (
                                <span className="text-[10px] font-mono font-black text-emerald-400">
                                  ${priceTag.toFixed(1)}
                                </span>
                              ) : (
                                <StoreIcon className="w-3.5 h-3.5 text-[#888]" />
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Mocked user location pin overlay marker */}
                      <div className="absolute left-[50%] top-[40%] text-center">
                        <div className="w-4 h-4 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center shadow-lg relative animate-pulse">
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        </div>
                        <span className="text-[8px] tracking-tight bg-black/60 px-1 py-0.5 rounded text-indigo-300 font-bold block mt-1">Mi Ubicación</span>
                      </div>

                    </div>

                    {/* Bottom Map instruction helper info block */}
                    <div className="bg-[#0b0b0b] border border-[#222] p-3 rounded-lg text-xs space-y-1">
                      <h5 className="font-bold text-white text-[11px] flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Leyenda del Mapa Colaborativo</span>
                      </h5>
                      <p className="text-[10px] text-[#777] leading-relaxed">
                        Los marcadores verdes representan los comercios con precios actualizados para {selectedProduct ? <strong className="text-white">"{selectedProduct.name}"</strong> : 'el producto seleccionado'}. Toca cualquier tienda para comprar o avisar un nuevo precio de la calle.
                      </p>
                    </div>

                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

          {/* Quick sticky wallet footer overlay for mobile feel */}
          <footer className="px-5 py-3 border-t border-[#121212] bg-[#0c0c0c] flex justify-between items-center text-xs shrink-0">
            {activeRole === 'aliado' ? (
              <div className="flex justify-between items-center w-full">
                <span className="text-[#666] font-semibold text-[10px] uppercase font-mono">MODO ALIADO COMERCIAL</span>
                <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold">Cambios en vivo</span>
              </div>
            ) : activeRole === 'motorizado' ? (
              <div className="flex justify-between items-center w-full">
                <span className="text-[#666] font-semibold text-[10px] uppercase font-mono">Simulador de Entrega</span>
                <span className="text-indigo-400 font-mono text-[10px] uppercase font-bold text-xs">Rider Compartido</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[#666] font-semibold text-[10px] uppercase tracking-wider">Forcé Wallet:</span>
                  <strong className="text-white font-mono">${userWallet.toFixed(2)}</strong>
                </div>

                <button 
                  onClick={() => {
                    if (cart.length > 0) {
                      setIsCheckingOut(true);
                    } else {
                      triggerNotification('🛒 Agrega productos primero para ver el carrito');
                    }
                  }}
                  className="text-[10px] tracking-wider uppercase font-black text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Ver Carrito ({cart.reduce((s, i) => s + i.quantity, 0)}) →
                </button>
              </>
            )}
          </footer>

        </main>

        {/* Right column: Instructions, Community reports & collaborative widget */}
        <aside className="col-span-1 md:col-span-12 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-6 self-stretch">
          
          {/* Siete Calles Average Pricing info panel */}
          <div className="bg-[#0b0b0b] border border-[#222] rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-white text-xs lg:text-sm tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Análisis de Precios Paralelos</span>
            </h3>
            <p className="text-xs text-[#999] leading-relaxed">
              La moneda se devalúa constantemente, por lo que actualizamos el factor <strong>S CALLE</strong> de Yaracuy 24/7.
            </p>
            <div className="space-y-2 border-t border-[#1c1c1c] pt-3 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-[#666]">Promedio Semana</span>
                <span className="text-white">Bs. 38.30</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#666]">Máximo Registrado</span>
                <span className="text-white text-orange-400">Bs. 38.65</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#666]">Desviación Estándar</span>
                <span className="text-emerald-500">± 0.2%</span>
              </div>
            </div>
          </div>

          {/* Crowdsourced reporting form inside sidebar box */}
          {reportingProduct ? (
            <div className="bg-emerald-950/20 border border-emerald-500/35 rounded-2xl p-5 space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-[#fff] text-xs lg:text-sm tracking-tight flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-400" />
                  <span>Avisar Precio</span>
                </h3>
                <button 
                  onClick={() => setReportingProduct(null)}
                  className="p-1 rounded bg-[#222]/30 text-[#888] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <form onSubmit={handlePostReport} className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] text-[#999] font-medium block mb-1">Carga de Producto:</label>
                  <div className="bg-black/40 px-3 py-2 rounded-lg border border-[#222] text-white font-semibold">
                    {reportingProduct.icon} {reportingProduct.name}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-[#999] font-medium block mb-1">📍 Selecciona Comercio:</label>
                  <select 
                    value={reportingStoreId}
                    onChange={(e) => setReportingStoreId(e.target.value)}
                    className="w-full bg-black/40 border border-[#222] rounded-lg p-2 text-white outline-none focus:border-emerald-500/50"
                  >
                    {Object.values(STORES).map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name} ({store.distance})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#999] font-medium block mb-1">Precio en USD ($):</label>
                    <input 
                      type="number"
                      step="0.01"
                      placeholder="1.95"
                      required
                      value={reportingPrice}
                      onChange={(e) => setReportingPrice(e.target.value)}
                      className="w-full bg-black/40 border border-[#222] focus:border-emerald-500/50 rounded-lg p-2 text-white font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#999] font-medium block mb-1">Disponibilidad:</label>
                    <select 
                      value={reportingStockStatus}
                      onChange={(e) => setReportingStockStatus(e.target.value as any)}
                      className="w-full bg-black/40 border border-[#222] rounded-lg p-2 text-white outline-none"
                    >
                      <option value="DISPONIBLE">Hay bastante</option>
                      <option value="POCAS UNIDADES">Pocas unidades</option>
                      <option value="AGOTADO">Agotado total</option>
                    </select>
                  </div>
                </div>

                {reportingStockStatus === 'POCAS UNIDADES' && (
                  <div>
                    <label className="text-[10px] text-[#999] font-medium block mb-1">Unidades estimadas:</label>
                    <input 
                      type="number"
                      placeholder="9"
                      value={reportingStockCount}
                      onChange={(e) => setReportingStockCount(e.target.value)}
                      className="w-full bg-black/40 border border-[#222] focus:border-emerald-500/50 rounded-lg p-2 text-white font-mono outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-550 text-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                >
                  Enviar Reporte & Ganar $0.10
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-[#0b0b0b] border border-[#222] rounded-2xl p-5 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#121212] flex items-center justify-center text-xl shadow-inner border border-[#222]">
                💬
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-xs lg:text-sm">¿Dudas de un precio?</h4>
                <p className="text-xs text-[#666] leading-relaxed max-w-xs mx-auto">
                  Selecciona cualquier producto y avisa si el precio ha variado. El resto de la comunidad de San Felipe te lo agradecerá.
                </p>
              </div>
            </div>
          )}

          {/* Quick legal stats footnote */}
          <div className="text-[10px] text-[#444] text-center italic hover:text-[#555] transition-colors leading-normal pt-4 col-span-1 md:col-span-2 lg:col-span-1">
            Forcé Yaracuy Applet v3.3.877373 © 2026. Todos los derechos reservados. No afiliado directa ni indirectamente con organismos estatales venezolanos.
          </div>

        </aside>

      </div>

    </div>
  );
}
