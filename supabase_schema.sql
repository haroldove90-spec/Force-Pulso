-- =====================================================================
-- FORCÉ PULSO - SUPABASE DATABASE SCHEMAS & DATA SEEDING
-- Copy and run this script in your Supabase SQL Editor (https://supabase.com)
-- =====================================================================

-- 1. STORES TABLE
CREATE TABLE IF NOT EXISTS public.stores (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    distance TEXT NOT NULL,
    distance_num NUMERIC NOT NULL,
    rating NUMERIC NOT NULL DEFAULT 4.5,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT NOT NULL,
    is_near_sold_out BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. STORE_PRICES (STOCK, PRICE & UPDATE TIMES)
CREATE TABLE IF NOT EXISTS public.store_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    store_id TEXT REFERENCES public.stores(id) ON DELETE CASCADE,
    price NUMERIC NOT NULL,
    stock_status TEXT NOT NULL CHECK (stock_status IN ('DISPONIBLE', 'POCAS UNIDADES', 'AGOTADO')),
    stock_count INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, store_id)
);

-- 4. CROWDSOURCED LOGS / REPORTS
CREATE TABLE IF NOT EXISTS public.crowd_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name TEXT NOT NULL,
    product_name TEXT NOT NULL,
    store_name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS TRACKING
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- ORD-XXXX
    items JSONB NOT NULL, -- list of items: [{product: {}, store: {}, quantity: n}]
    subtotal NUMERIC NOT NULL,
    delivery_fee NUMERIC NOT NULL,
    total_usd NUMERIC NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('CREADO', 'ACEPTADO', 'RECOGIENDO', 'RUTA', 'ENTREGADO')),
    delivery_type TEXT NOT NULL,
    step INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for security, but allow anon/public reads and writes so it works seamlessly out-of-the-box
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crowd_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anonymous select/insert/update/delete for prototype purposes
CREATE POLICY "Allow public read stores" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Allow public write stores" ON public.stores FOR ALL USING (true);

CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public write products" ON public.products FOR ALL USING (true);

CREATE POLICY "Allow public read store_prices" ON public.store_prices FOR SELECT USING (true);
CREATE POLICY "Allow public write store_prices" ON public.store_prices FOR ALL USING (true);

CREATE POLICY "Allow public read crowd_reports" ON public.crowd_reports FOR SELECT USING (true);
CREATE POLICY "Allow public write crowd_reports" ON public.crowd_reports FOR ALL USING (true);

CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public write orders" ON public.orders FOR ALL USING (true);

-- =====================================================================
-- SEED INITIAL DATA
-- =====================================================================

-- Clean slate optional (uncomment if you want to replace everything)
-- TRUNCATE public.store_prices, public.products, public.stores, public.crowd_reports CASCADE;

-- Insert Stores
INSERT INTO public.stores (id, name, distance, distance_num, rating, lat, lng, address) VALUES
('mercado-el-valle', 'Mercado El Valle', '1.2km', 1.2, 4.9, 30, 25, 'Av. Libertador, Sector El Valle'),
('abasto-central', 'Abasto Central', '0.8km', 0.8, 4.7, 45, 60, 'Calle 12 esquina San Felipe'),
('bodega-los-mangos', 'Bodega Los Mangos', '0.3km', 0.3, 4.2, 75, 40, 'Detrás de la Plaza Los Mangos'),
('bazar-don-luis', 'Bazar Don Luis', '1.9km', 1.9, 4.4, 20, 80, 'Av. Yaracuy c/c Calle 5'),
('farmacia-san-felipe', 'Farmacia San Felipe', '0.5km', 0.5, 4.8, 60, 20, 'Av. Caracas entre Calles 9 y 10'),
('hiper-lider', 'Híper Líder Yaracuy', '2.5km', 2.5, 4.6, 85, 85, 'Autopista Centroccidental Cimarrón Andresote')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    distance = EXCLUDED.distance,
    distance_num = EXCLUDED.distance_num,
    rating = EXCLUDED.rating,
    lat = EXCLUDED.lat,
    lng = EXCLUDED.lng,
    address = EXCLUDED.address;

-- Insert Products
INSERT INTO public.products (id, name, category, icon, is_near_sold_out) VALUES
('harina-pan', 'Harina PAN 1kg', 'alimentos', '🌽', false),
('aceite-maveite', 'Aceite Maveite 1L', 'alimentos', '🧴', true),
('arroz-cristal', 'Arroz Cristal 1kg', 'alimentos', '🍚', false),
('azucar-morena', 'Azúcar Morena 1kg', 'alimentos', '🧂', false),
('pasta-primor', 'Pasta Primor 500g', 'alimentos', '🍝', false),
('ibuprofeno-400', 'Ibuprofeno 400mg', 'farmacia', '💊', false),
('leche-campestre', 'Leche Completa 1L', 'lácteos', '🥛', false),
('queso-blanco', 'Queso Blanco Duro 1kg', 'lácteos', '🧀', false),
('pollo-entero', 'Pollo Entero kg', 'carnes', '🍗', false),
('carne-molida', 'Carne Molida Premium 1kg', 'carnes', '🥩', true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    icon = EXCLUDED.icon,
    is_near_sold_out = EXCLUDED.is_near_sold_out;

-- Insert Initial Store Prices
INSERT INTO public.store_prices (product_id, store_id, price, stock_status, stock_count) VALUES
('harina-pan', 'mercado-el-valle', 1.90, 'DISPONIBLE', NULL),
('harina-pan', 'abasto-central', 2.20, 'DISPONIBLE', NULL),
('harina-pan', 'bodega-los-mangos', 2.50, 'POCAS UNIDADES', 9),
('harina-pan', 'bazar-don-luis', 2.10, 'DISPONIBLE', NULL),

('aceite-maveite', 'mercado-el-valle', 3.10, 'POCAS UNIDADES', 3),
('aceite-maveite', 'abasto-central', 2.80, 'DISPONIBLE', NULL),
('aceite-maveite', 'bodega-los-mangos', 3.30, 'AGOTADO', 0),

('arroz-cristal', 'mercado-el-valle', 1.20, 'DISPONIBLE', NULL),
('arroz-cristal', 'abasto-central', 1.35, 'DISPONIBLE', NULL),
('arroz-cristal', 'bodega-los-mangos', 1.50, 'DISPONIBLE', NULL),
('arroz-cristal', 'bazar-don-luis', 1.30, 'DISPONIBLE', NULL),

('azucar-morena', 'mercado-el-valle', 1.60, 'DISPONIBLE', NULL),
('azucar-morena', 'abasto-central', 1.70, 'DISPONIBLE', NULL),
('azucar-morena', 'bodega-los-mangos', 1.50, 'DISPONIBLE', NULL),
('azucar-morena', 'bazar-don-luis', 1.75, 'POCAS UNIDADES', 5),

('pasta-primor', 'mercado-el-valle', 0.85, 'DISPONIBLE', NULL),
('pasta-primor', 'abasto-central', 0.95, 'DISPONIBLE', NULL),
('pasta-primor', 'bazar-don-luis', 1.00, 'DISPONIBLE', NULL),

('ibuprofeno-400', 'farmacia-san-felipe', 2.20, 'DISPONIBLE', NULL),
('ibuprofeno-400', 'hiper-lider', 2.60, 'DISPONIBLE', NULL),

('leche-campestre', 'mercado-el-valle', 1.80, 'DISPONIBLE', NULL),
('leche-campestre', 'abasto-central', 1.75, 'DISPONIBLE', NULL),
('leche-campestre', 'hiper-lider', 1.90, 'DISPONIBLE', NULL),

('queso-blanco', 'mercado-el-valle', 4.40, 'DISPONIBLE', NULL),
('queso-blanco', 'bodega-los-mangos', 4.20, 'DISPONIBLE', NULL),
('queso-blanco', 'abasto-central', 4.60, 'DISPONIBLE', NULL),

('pollo-entero', 'mercado-el-valle', 3.40, 'DISPONIBLE', NULL),
('pollo-entero', 'hiper-lider', 3.80, 'DISPONIBLE', NULL),

('carne-molida', 'mercado-el-valle', 5.80, 'DISPONIBLE', NULL),
('carne-molida', 'abasto-central', 5.50, 'POCAS UNIDADES', 4),
('carne-molida', 'hiper-lider', 6.00, 'DISPONIBLE', NULL)
ON CONFLICT (product_id, store_id) DO UPDATE SET
    price = EXCLUDED.price,
    stock_status = EXCLUDED.stock_status,
    stock_count = EXCLUDED.stock_count;

-- Insert a few initial sample crowd reports
INSERT INTO public.crowd_reports (user_name, product_name, store_name, price) VALUES
('Carlos M.', 'Harina PAN 1kg', 'Mercado El Valle', 1.90),
('María G.', 'Ibuprofeno 400mg', 'Farmacia San Felipe', 2.20),
('Juan P.', 'Arroz Cristal 1kg', 'Bodega Los Mangos', 1.50),
('Elena R.', 'Aceite Maveite 1L', 'Abasto Central', 2.80);
