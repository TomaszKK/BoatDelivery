-- =========================================================
-- 1. ZAMÓWIENIE WEEIA PŁ -> Manufaktura
-- =========================================================
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0011111-1111-1111-1111-111111111111', 'Wólczańska 215', '90-924', 'Łódź', 'POL', 51.747123, 19.453987) ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0022222-2222-2222-2222-222222222222', 'Drewnowska 58', '91-002', 'Łódź', 'POL', 51.778145, 19.448560) ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('11111111-1111-1111-1111-111111111111','BD-TEST-0001', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 15.5, 3, 'a0011111-1111-1111-1111-111111111111', 'a0022222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- 2. ZAMÓWIENIE Piotrkowska -> Dworzec Fabryczny
-- =========================================================
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0033333-3333-3333-3333-333333333333', 'Piotrkowska 104', '90-926', 'Łódź', 'POL', 51.763044, 19.457853) ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0044444-4444-4444-4444-444444444444', 'Plac Sałacińskiego 1', '90-128', 'Łódź', 'POL', 51.768652, 19.467812) ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('22222222-2222-2222-2222-222222222222','BD-TEST-0002', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 5.0, 2, 'a0033333-3333-3333-3333-333333333333', 'a0044444-4444-4444-4444-444444444444', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- 3. ZAMÓWIENIE Atlas Arena -> Port Łódź
-- =========================================================
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0055555-5555-5555-5555-555555555555', 'Aleja Bandurskiego 7', '94-020', 'Łódź', 'POL', 51.757876, 19.426767) ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0066666-6666-6666-6666-666666666666', 'Pabianicka 245', '93-457', 'Łódź', 'POL', 51.706173, 19.420803) ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('33333333-3333-3333-3333-333333333333','BD-TEST-0003', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 2.5, 1, 'a0055555-5555-5555-5555-555555555555', 'a0066666-6666-6666-6666-666666666666', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- 4. ZAMÓWIENIE Księży Młyn -> Teofilów (Dodatkowe)
-- =========================================================
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0077777-7777-7777-7777-777777777777', 'Księży Młyn 14', '90-345', 'Łódź', 'POL', 51.752538, 19.481545) ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0088888-8888-8888-8888-888888888888', 'Aleja Włókniarzy 227', '91-001', 'Łódź', 'POL', 51.785233, 19.423146) ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('44444444-4444-4444-4444-444444444444','BD-TEST-0004', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 8.2, 4, 'a0077777-7777-7777-7777-777777777777', 'a0088888-8888-8888-8888-888888888888', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- 5. ZAMÓWIENIE Widzew Wschód -> Retkinia (Dodatkowe)
-- =========================================================
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0099999-9999-9999-9999-999999999999', 'Rokicińska 144', '92-412', 'Łódź', 'POL', 51.745672, 19.539832) ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0101010-1010-1010-1010-101010101010', 'Armii Krajowej 32', '94-046', 'Łódź', 'POL', 51.744158, 19.400517) ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('55555555-5555-5555-5555-555555555555','BD-TEST-0005', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 1.0, 1, 'a0099999-9999-9999-9999-999999999999', 'a0101010-1010-1010-1010-101010101010', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- KOLEJNE ZAMÓWIENIA DLA TIMEFOLDA (OD 6 DO 20)
-- =========================================================

-- 6. ODBIÓR: CH Tulipan -> DOSTAWA: Rondo Solidarności
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0111111-1111-1111-1111-111111111111', 'Piłsudskiego 94', '92-202', 'Łódź', 'POL', 51.761822, 19.506190) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0121212-1212-1212-1212-121212121212', 'Pomorska 77', '90-224', 'Łódź', 'POL', 51.776512, 19.479532) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('66666666-6666-6666-6666-666666666666','BD-TEST-0006', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 2.0, 1, 'a0111111-1111-1111-1111-111111111111', 'a0121212-1212-1212-1212-121212121212', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- 7. ODBIÓR: Dworzec Kaliski -> DOSTAWA: Julianów
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0131313-1313-1313-1313-131313131313', 'Karolewska 55', '90-560', 'Łódź', 'POL', 51.758362, 19.431355) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0141414-1414-1414-1414-141414141414', 'Zgierska 212', '91-362', 'Łódź', 'POL', 51.815234, 19.439871) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('77777777-7777-7777-7777-777777777777','BD-TEST-0007', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 12.5, 3, 'a0131313-1313-1313-1313-131313131313', 'a0141414-1414-1414-1414-141414141414', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- 8. ODBIÓR: Rzgowska (Olechów) -> DOSTAWA: Politechnika (Lumumby)
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0151515-1515-1515-1515-151515151515', 'Rzgowska 250', '93-311', 'Łódź', 'POL', 51.705121, 19.493215) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0161616-1616-1616-1616-161616161616', 'Lumumby 14', '91-404', 'Łódź', 'POL', 51.776100, 19.488300) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('88888888-8888-8888-8888-888888888888','BD-TEST-0008', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 4.0, 2, 'a0151515-1515-1515-1515-151515151515', 'a0161616-1616-1616-1616-161616161616', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- 9. ODBIÓR: Sukcesja -> DOSTAWA: Zdrowie
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0171717-1717-1717-1717-171717171717', 'Al. Politechniki 1', '93-590', 'Łódź', 'POL', 51.748239, 19.452668) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0181818-1818-1818-1818-181818181818', 'Krakowska 20', '94-303', 'Łódź', 'POL', 51.761023, 19.405321) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('99999999-9999-9999-9999-999999999999','BD-TEST-0009', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 1.5, 1, 'a0171717-1717-1717-1717-171717171717', 'a0181818-1818-1818-1818-181818181818', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- 10. ODBIÓR: Bałucki Rynek -> DOSTAWA: Fuzja
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0191919-1919-1919-1919-191919191919', 'Zgierska 50', '91-463', 'Łódź', 'POL', 51.791550, 19.452332) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0202020-2020-2020-2020-202020202020', 'Tymienieckiego 5/7', '90-365', 'Łódź', 'POL', 51.750100, 19.470500) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('10101010-1010-1010-1010-101010101010','BD-TEST-0010', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 7.5, 2, 'a0191919-1919-1919-1919-191919191919', 'a0202020-2020-2020-2020-202020202020', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- 11. ODBIÓR: Dąbrowa -> DOSTAWA: Centrum (Off Piotrkowska)
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0212121-2121-2121-2121-212121212121', 'Dąbrowskiego 91', '93-208', 'Łódź', 'POL', 51.728900, 19.497500) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0222222-2222-2222-2222-222222222222', 'Piotrkowska 138', '90-062', 'Łódź', 'POL', 51.758300, 19.459000) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('11011011-0110-1101-1011-011011011011','BD-TEST-0011', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 3.2, 1, 'a0212121-2121-2121-2121-212121212121', 'a0222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- 12. ODBIÓR: M1 Łódź -> DOSTAWA: Teatr Wielki
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0232323-2323-2323-2323-232323232323', 'Brzezińska 27', '92-103', 'Łódź', 'POL', 51.772500, 19.516400) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0242424-2424-2424-2424-242424242424', 'Plac Dąbrowskiego', '90-249', 'Łódź', 'POL', 51.773300, 19.468800) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('12012012-0120-1201-2012-012012012012','BD-TEST-0012', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 22.0, 5, 'a0232323-2323-2323-2323-232323232323', 'a0242424-2424-2424-2424-242424242424', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- 13. ODBIÓR: Bionanopark -> DOSTAWA: Aquapark Fala
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0252525-2525-2525-2525-252525252525', 'Dubois 114', '93-465', 'Łódź', 'POL', 51.704200, 19.444300) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0262626-2626-2626-2626-262626262626', 'Al. Unii Lubelskiej 4', '94-208', 'Łódź', 'POL', 51.764500, 19.423900) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('13013013-0130-1301-3013-013013013013','BD-TEST-0013', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 0.5, 1, 'a0252525-2525-2525-2525-252525252525', 'a0262626-2626-2626-2626-262626262626', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- 14. ODBIÓR: Cmentarz Doły -> DOSTAWA: WAM (Szpital)
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0272727-2727-2727-2727-272727272727', 'Smutna 1', '91-729', 'Łódź', 'POL', 51.785600, 19.488000) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0282828-2828-2828-2828-282828282828', 'Żeromskiego 113', '90-549', 'Łódź', 'POL', 51.758000, 19.445000) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('14014014-0140-1401-4014-014014014014','BD-TEST-0014', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 6.4, 2, 'a0272727-2727-2727-2727-272727272727', 'a0282828-2828-2828-2828-282828282828', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- 15. ODBIÓR: Nowosolna -> DOSTAWA: Lotnisko Reymonta
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0292929-2929-2929-2929-292929292929', 'Brzezińska 300', '92-703', 'Łódź', 'POL', 51.802000, 19.578000) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0303030-3030-3030-3030-303030303030', 'Maczka 35', '94-328', 'Łódź', 'POL', 51.722500, 19.398300) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('15015015-0150-1501-5015-015015015015','BD-TEST-0015', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 11.1, 4, 'a0292929-2929-2929-2929-292929292929', 'a0303030-3030-3030-3030-303030303030', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- JESZCZE WIĘCEJ DANYCH TESTOWYCH (ZAMÓWIENIA 16 - 25)
-- =========================================================

-- 16. ODBIÓR: Ruda Pabianicka -> DOSTAWA: Złotno
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0313131-3131-3131-3131-313131313131', 'Rudzka 50', '93-423', 'Łódź', 'POL', 51.700000, 19.430000) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0323232-3232-3232-3232-323232323232', 'Złotno 140', '94-401', 'Łódź', 'POL', 51.780000, 19.380000) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('16016016-0160-1601-6016-016016016016','BD-TEST-0016', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 18.0, 4, 'a0313131-3131-3131-3131-313131313131', 'a0323232-3232-3232-3232-323232323232', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- 17. ODBIÓR: Chojny -> DOSTAWA: Stoki
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0333333-3333-3333-3333-333333333333', 'Rzgowska 150', '93-311', 'Łódź', 'POL', 51.715000, 19.480000) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0343434-3434-3434-3434-343434343434', 'Telefoniczna 64', '92-016', 'Łódź', 'POL', 51.785000, 19.520000) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('17017017-0170-1701-7017-017017017017','BD-TEST-0017', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 3.5, 1, 'a0333333-3333-3333-3333-333333333333', 'a0343434-3434-3434-3434-343434343434', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- 18. ODBIÓR: Radogoszcz Wschód -> DOSTAWA: Dąbrowa
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0353535-3535-3535-3535-353535353535', 'Świtezianki 12', '91-496', 'Łódź', 'POL', 51.810000, 19.440000) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0363636-3636-3636-3636-363636363636', 'Tatrzańska 109', '93-208', 'Łódź', 'POL', 51.730000, 19.490000) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('18018018-0180-1801-8018-018018018018','BD-TEST-0018', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 9.0, 2, 'a0353535-3535-3535-3535-353535353535', 'a0363636-3636-3636-3636-363636363636', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- 19. ODBIÓR: Retkinia -> DOSTAWA: Widzew
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0373737-3737-3737-3737-373737373737', 'Kusocińskiego 100', '94-054', 'Łódź', 'POL', 51.740000, 19.400000) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0383838-3838-3838-3838-383838383838', 'Puszkina 80', '92-516', 'Łódź', 'POL', 51.750000, 19.520000) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('19019019-0190-1901-9019-019019019019','BD-TEST-0019', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 11.2, 3, 'a0373737-3737-3737-3737-373737373737', 'a0383838-3838-3838-3838-383838383838', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- 20. ODBIÓR: Śródmieście -> DOSTAWA: Łagiewniki
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0393939-3939-3939-3939-393939393939', 'Nawrot 34', '90-055', 'Łódź', 'POL', 51.760000, 19.465000) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0404040-4040-4040-4040-404040404040', 'Wycieczkowa 86', '91-518', 'Łódź', 'POL', 51.830000, 19.470000) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('20020020-0200-2002-0020-020020020020','BD-TEST-0020', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 2.1, 1, 'a0393939-3939-3939-3939-393939393939', 'a0404040-4040-4040-4040-404040404040', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- 21. ODBIÓR: Polesie -> DOSTAWA: Zarzew
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0414141-4141-4141-4141-414141414141', 'Srebrzyńska 2', '91-074', 'Łódź', 'POL', 51.770000, 19.430000) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0424242-4242-4242-4242-424242424242', 'Milionowa 55', '93-193', 'Łódź', 'POL', 51.740000, 19.500000) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('21021021-0210-2102-1021-021021021021','BD-TEST-0021', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 6.0, 2, 'a0414141-4141-4141-4141-414141414141', 'a0424242-4242-4242-4242-424242424242', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- 22. ODBIÓR: Żabieniec -> DOSTAWA: Olechów
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0434343-4343-4343-4343-434343434343', 'Limanowskiego 200', '91-027', 'Łódź', 'POL', 51.790000, 19.410000) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0444444-4444-4444-4444-444444444444', 'Zakładowa 145', '92-402', 'Łódź', 'POL', 51.720000, 19.540000) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('22022022-0220-2202-2022-022022022022','BD-TEST-0022', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 15.0, 4, 'a0434343-4343-4343-4343-434343434343', 'a0444444-4444-4444-4444-444444444444', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- 23. ODBIÓR: Śródmieście -> DOSTAWA: Górna
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0454545-4545-4545-4545-454545454545', 'Sienkiewicza 82', '90-318', 'Łódź', 'POL', 51.765000, 19.460000) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0464646-4646-4646-4646-464646464646', 'Paderewskiego 47', '93-509', 'Łódź', 'POL', 51.725000, 19.450000) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('23023023-0230-2302-3023-023023023023','BD-TEST-0023', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 1.0, 1, 'a0454545-4545-4545-4545-454545454545', 'a0464646-4646-4646-4646-464646464646', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- 24. ODBIÓR: Nowe Sady -> DOSTAWA: Marysin
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0474747-4747-4747-4747-474747474747', 'Nowe Sady 2', '94-102', 'Łódź', 'POL', 51.730000, 19.420000) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0484848-4848-4848-4848-484848484848', 'Strykowska 33', '91-526', 'Łódź', 'POL', 51.800000, 19.490000) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('24024024-0240-2402-4024-024024024024','BD-TEST-0024', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 5.5, 2, 'a0474747-4747-4747-4747-474747474747', 'a0484848-4848-4848-4848-484848484848', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;

-- 25. ODBIÓR: Zdrowie -> DOSTAWA: Stare Bałuty
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0494949-4949-4949-4949-494949494949', 'Krzemieniecka 2', '94-030', 'Łódź', 'POL', 51.760000, 19.410000) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude)
VALUES ('a0505050-5050-5050-5050-505050505050', 'Łagiewnicka 54', '91-456', 'Łódź', 'POL', 51.780000, 19.450000) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted)
VALUES ('25025025-0250-2502-5025-025025025025','BD-TEST-0025', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 8.8, 3, 'a0494949-4949-4949-4949-494949494949', 'a0505050-5050-5050-5050-505050505050', CURRENT_TIMESTAMP, false) ON CONFLICT (id) DO NOTHING;


INSERT INTO system_settings (id, setting_key, setting_value, created_at, deleted)
VALUES ('d0011111-1111-1111-1111-111111111111', 'ACTIVE_ROUTING_ALGORITHM', 'TIMEFOLD_ADVANCED', CURRENT_TIMESTAMP, false) ON CONFLICT (setting_key) DO NOTHING;