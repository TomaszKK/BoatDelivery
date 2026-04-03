-- =========================================================
-- 1. ZAMÓWIENIE WEEIA PŁ -> Manufaktura
-- =========================================================
-- Punkt A: Odbiór (WEEIA)
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0011111-1111-1111-1111-111111111111', 'Wólczańska 215', '90-924', 'Łódź', 'POL', 51.747123, 19.453987) ON CONFLICT (id) DO NOTHING;

-- Punkt B: Dostawa (Manufaktura)
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0022222-2222-2222-2222-222222222222', 'Drewnowska 58', '91-002', 'Łódź', 'POL', 51.778145, 19.448560) ON CONFLICT (id) DO NOTHING;

-- Zamówienie #1
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('11111111-1111-1111-1111-111111111111','BD-TEST-0001', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 15.5,3, 'a0011111-1111-1111-1111-111111111111', 'a0022222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;


-- =========================================================
-- 2. ZAMÓWIENIE Piotrkowska -> Dworzec Fabryczny
-- =========================================================
-- Punkt A: Odbiór (Piotrkowska)
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0033333-3333-3333-3333-333333333333', 'Piotrkowska 104', '90-926', 'Łódź', 'POL', 51.763044, 19.457853) ON CONFLICT (id) DO NOTHING;

-- Punkt B: Dostawa (Dworzec)
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0044444-4444-4444-4444-444444444444', 'Plac Sałacińskiego 1', '90-128', 'Łódź', 'POL', 51.768652, 19.467812) ON CONFLICT (id) DO NOTHING;

-- Zamówienie #2
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('22222222-2222-2222-2222-222222222222','BD-TEST-0002', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 5.0,2, 'a0033333-3333-3333-3333-333333333333', 'a0044444-4444-4444-4444-444444444444', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;


-- =========================================================
-- 3. ZAMÓWIENIE Atlas Arena -> Port Łódź
-- =========================================================
-- Punkt A: Odbiór (Atlas Arena)
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0055555-5555-5555-5555-555555555555', 'Aleja Bandurskiego 7', '94-020', 'Łódź', 'POL', 51.757876, 19.426767) ON CONFLICT (id) DO NOTHING;

-- Punkt B: Dostawa (Port Łódź)
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0066666-6666-6666-6666-666666666666', 'Pabianicka 245', '93-457', 'Łódź', 'POL', 51.706173, 19.420803) ON CONFLICT (id) DO NOTHING;

-- Zamówienie #3
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('33333333-3333-3333-3333-333333333333','BD-TEST-0003', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 2.5,1, 'a0055555-5555-5555-5555-555555555555', 'a0066666-6666-6666-6666-666666666666', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;