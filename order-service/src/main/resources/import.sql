-- 1. WEEIA PŁ
INSERT INTO orders (id, customer_id, status, weight)
VALUES ('11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'NEW', 15.5) ON CONFLICT (id) DO NOTHING;

INSERT INTO delivery_locations (id, order_id, address_line, latitude, longitude)
VALUES ('aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Wólczańska 215, 90-924 Łódź', 51.747123, 19.453987) ON CONFLICT (id) DO NOTHING;


-- 2. Manufaktura (Północ)
INSERT INTO orders (id, customer_id, status, weight)
VALUES ('22222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'NEW', 5.0) ON CONFLICT (id) DO NOTHING;

INSERT INTO delivery_locations (id, order_id, address_line, latitude, longitude)
VALUES ('aaaa2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Drewnowska 58, 91-002 Łódź', 51.778145, 19.448560) ON CONFLICT (id) DO NOTHING;


-- 3. Piotrkowska / Urząd Miasta (Centrum)
INSERT INTO orders (id, customer_id, status, weight)
VALUES ('33333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333', 'NEW', 2.5) ON CONFLICT (id) DO NOTHING;

INSERT INTO delivery_locations (id, order_id, address_line, latitude, longitude)
VALUES ('aaaa3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Piotrkowska 104, 90-926 Łódź', 51.763044, 19.457853) ON CONFLICT (id) DO NOTHING;


-- 4. Dworzec Łódź Fabryczna (Wschód-Centrum)
INSERT INTO orders (id, customer_id, status, weight)
VALUES ('44444444-4444-4444-4444-444444444444', 'c4444444-4444-4444-4444-444444444444', 'NEW', 12.0) ON CONFLICT (id) DO NOTHING;

INSERT INTO delivery_locations (id, order_id, address_line, latitude, longitude)
VALUES ('aaaa4444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Plac Sałacińskiego 1, 90-128 Łódź', 51.768652, 19.467812) ON CONFLICT (id) DO NOTHING;


-- 5. Atlas Arena (Zachód)
INSERT INTO orders (id, customer_id, status, weight)
VALUES ('55555555-5555-5555-5555-555555555555', 'c5555555-5555-5555-5555-555555555555', 'NEW', 8.2) ON CONFLICT (id) DO NOTHING;

INSERT INTO delivery_locations (id, order_id, address_line, latitude, longitude)
VALUES ('aaaa5555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'Aleja Bandurskiego 7, 94-020 Łódź', 51.757876, 19.426767) ON CONFLICT (id) DO NOTHING;


-- 6. Księży Młyn (Południowy wschód)
INSERT INTO orders (id, customer_id, status, weight)
VALUES ('66666666-6666-6666-6666-666666666666', 'c6666666-6666-6666-6666-666666666666', 'NEW', 20.0) ON CONFLICT (id) DO NOTHING;

INSERT INTO delivery_locations (id, order_id, address_line, latitude, longitude)
VALUES ('aaaa6666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'Księży Młyn 1, 90-345 Łódź', 51.752353, 19.482703) ON CONFLICT (id) DO NOTHING;


-- 7. Aquapark Fala (Zachód - obok Atlas Areny)
INSERT INTO orders (id, customer_id, status, weight)
VALUES ('77777777-7777-7777-7777-777777777777', 'c7777777-7777-7777-7777-777777777777', 'NEW', 3.1) ON CONFLICT (id) DO NOTHING;

INSERT INTO delivery_locations (id, order_id, address_line, latitude, longitude)
VALUES ('aaaa7777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 'Aleja Unii Lubelskiej 4, 94-208 Łódź', 51.764491, 19.430032) ON CONFLICT (id) DO NOTHING;


-- 8. Port Łódź (Dalekie południe)
INSERT INTO orders (id, customer_id, status, weight)
VALUES ('88888888-8888-8888-8888-888888888888', 'c8888888-8888-8888-8888-888888888888', 'NEW', 45.0) ON CONFLICT (id) DO NOTHING;

INSERT INTO delivery_locations (id, order_id, address_line, latitude, longitude)
VALUES ('aaaa8888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', 'Pabianicka 245, 93-457 Łódź', 51.706173, 19.420803) ON CONFLICT (id) DO NOTHING;
