-- =========================================================
-- 1. ZAMÓWIENIE WEEIA PŁ -> Manufaktura
-- =========================================================
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0011111-1111-1111-1111-111111111111', 'Wólczańska 215', '90-924', 'Łódź', 'POL', 51.747123, 19.453987, false) ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0022222-2222-2222-2222-222222222222', 'Drewnowska 58', '91-002', 'Łódź', 'POL', 51.778145, 19.448560, false) ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('11111111-1111-1111-1111-111111111111','BD-TEST-0001', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 15.5, 3, 'a0011111-1111-1111-1111-111111111111', 'a0022222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, false, 'Jan', 'Kowalski', 'jan.kowalski@example.com', '123456789') ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- 2. ZAMÓWIENIE Piotrkowska -> Dworzec Fabryczny
-- =========================================================
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0033333-3333-3333-3333-333333333333', 'Piotrkowska 104', '90-926', 'Łódź', 'POL', 51.763044, 19.457853, false) ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0044444-4444-4444-4444-444444444444', 'Plac Sałacińskiego 1', '90-128', 'Łódź', 'POL', 51.768652, 19.467812, false) ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('22222222-2222-2222-2222-222222222222','BD-TEST-0002', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 5.0, 2, 'a0033333-3333-3333-3333-333333333333', 'a0044444-4444-4444-4444-444444444444', CURRENT_TIMESTAMP, false, 'Anna', 'Nowak', 'anna.nowak@example.com', '987654321') ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- 3. ZAMÓWIENIE Atlas Arena -> Port Łódź
-- =========================================================
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0055555-5555-5555-5555-555555555555', 'Aleja Bandurskiego 7', '94-020', 'Łódź', 'POL', 51.757876, 19.426767, false) ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0066666-6666-6666-6666-666666666666', 'Pabianicka 245', '93-457', 'Łódź', 'POL', 51.706173, 19.420803, false) ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('33333333-3333-3333-3333-333333333333','BD-TEST-0003', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 2.5, 1, 'a0055555-5555-5555-5555-555555555555', 'a0066666-6666-6666-6666-666666666666', CURRENT_TIMESTAMP, false, 'Piotr', 'Zieliński', 'piotr.zielinski@example.com', '501502503') ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- 4. ZAMÓWIENIE Księży Młyn -> Teofilów (Dodatkowe)
-- =========================================================
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0077777-7777-7777-7777-777777777777', 'Księży Młyn 14', '90-345', 'Łódź', 'POL', 51.752538, 19.481545, false) ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0088888-8888-8888-8888-888888888888', 'Aleja Włókniarzy 227', '91-001', 'Łódź', 'POL', 51.785233, 19.423146, false) ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('44444444-4444-4444-4444-444444444444','BD-TEST-0004', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 8.2, 4, 'a0077777-7777-7777-7777-777777777777', 'a0088888-8888-8888-8888-888888888888', CURRENT_TIMESTAMP, false, 'Kasia', 'Szymańska', 'kasia.szymanska@example.com', '600700800') ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- 5. ZAMÓWIENIE Widzew Wschód -> Retkinia (Dodatkowe)
-- =========================================================
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0099999-9999-9999-9999-999999999999', 'Rokicińska 144', '92-412', 'Łódź', 'POL', 51.745672, 19.539832, false) ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0101010-1010-1010-1010-101010101010', 'Armii Krajowej 32', '94-046', 'Łódź', 'POL', 51.744158, 19.400517, false) ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('55555555-5555-5555-5555-555555555555','BD-TEST-0005', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 1.0, 1, 'a0099999-9999-9999-9999-999999999999', 'a0101010-1010-1010-1010-101010101010', CURRENT_TIMESTAMP, false, 'Michał', 'Wójcik', 'michal.wojcik@example.com', '700800900') ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- KOLEJNE ZAMÓWIENIA DLA TIMEFOLDA (OD 6 DO 20)
-- =========================================================

-- 6. ODBIÓR: CH Tulipan -> DOSTAWA: Rondo Solidarności
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0111111-1111-1111-1111-111111111111', 'Piłsudskiego 94', '92-202', 'Łódź', 'POL', 51.761822, 19.506190, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0121212-1212-1212-1212-121212121212', 'Pomorska 77', '90-224', 'Łódź', 'POL', 51.776512, 19.479532, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('66666666-6666-6666-6666-666666666666','BD-TEST-0006', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 2.0, 1, 'a0111111-1111-1111-1111-111111111111', 'a0121212-1212-1212-1212-121212121212', CURRENT_TIMESTAMP, false, 'Ewa', 'Kozłowska', 'ewa.kozlowska@example.com', '666555444') ON CONFLICT (id) DO NOTHING;

-- 7. ODBIÓR: Dworzec Kaliski -> DOSTAWA: Julianów
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0131313-1313-1313-1313-131313131313', 'Karolewska 55', '90-560', 'Łódź', 'POL', 51.758362, 19.431355, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0141414-1414-1414-1414-141414141414', 'Zgierska 212', '91-362', 'Łódź', 'POL', 51.815234, 19.439871, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('77777777-7777-7777-7777-777777777777','BD-TEST-0007', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 12.5, 3, 'a0131313-1313-1313-1313-131313131313', 'a0141414-1414-1414-1414-141414141414', CURRENT_TIMESTAMP, false, 'Marcin', 'Kamiński', 'michal.kaminski@example.com', '888777666') ON CONFLICT (id) DO NOTHING;

-- 8. ODBIÓR: Rzgowska (Olechów) -> DOSTAWA: Politechnika (Lumumby)
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0151515-1515-1515-1515-151515151515', 'Rzgowska 250', '93-311', 'Łódź', 'POL', 51.705121, 19.493215, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0161616-1616-1616-1616-161616161616', 'Lumumby 14', '91-404', 'Łódź', 'POL', 51.776100, 19.488300, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('88888888-8888-8888-8888-888888888888','BD-TEST-0008', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 4.0, 2, 'a0151515-1515-1515-1515-151515151515', 'a0161616-1616-1616-1616-161616161616', CURRENT_TIMESTAMP, false, 'Agnieszka', 'Lewandowska', 'agnieszka.lewandowska@example.com', '111222333') ON CONFLICT (id) DO NOTHING;

-- 9. ODBIÓR: Sukcesja -> DOSTAWA: Zdrowie
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0171717-1717-1717-1717-171717171717', 'Al. Politechniki 1', '93-590', 'Łódź', 'POL', 51.748239, 19.452668, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0181818-1818-1818-1818-181818181818', 'Krakowska 20', '94-303', 'Łódź', 'POL', 51.761023, 19.405321, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('99999999-9999-9999-9999-999999999999','BD-TEST-0009', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 1.5, 1, 'a0171717-1717-1717-1717-171717171717', 'a0181818-1818-1818-1818-181818181818', CURRENT_TIMESTAMP, false, 'Kamil', 'Wiśniewski', 'kamil.wisniewski@example.com', '555666777') ON CONFLICT (id) DO NOTHING;

-- 10. ODBIÓR: Bałucki Rynek -> DOSTAWA: Fuzja
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0191919-1919-1919-1919-191919191919', 'Zgierska 50', '91-463', 'Łódź', 'POL', 51.791550, 19.452332, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0202020-2020-2020-2020-202020202020', 'Tymienieckiego 5/7', '90-365', 'Łódź', 'POL', 51.750100, 19.470500, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('10101010-1010-1010-1010-101010101010','BD-TEST-0010', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 7.5, 2, 'a0191919-1919-1919-1919-191919191919', 'a0202020-2020-2020-2020-202020202020', CURRENT_TIMESTAMP, false, 'Tomasz', 'Dąbrowski', 'tomasz.dabrowski@example.com', '222333444') ON CONFLICT (id) DO NOTHING;

-- 11. ODBIÓR: Dąbrowa -> DOSTAWA: Centrum (Off Piotrkowska)
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0212121-2121-2121-2121-212121212121', 'Dąbrowskiego 91', '93-208', 'Łódź', 'POL', 51.728900, 19.497500, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0222222-2222-2222-2222-222222222222', 'Piotrkowska 138', '90-062', 'Łódź', 'POL', 51.758300, 19.459000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('11011011-0110-1101-1011-011011011011','BD-TEST-0011', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 3.2, 1, 'a0212121-2121-2121-2121-212121212121', 'a0222222-2222-2222-2222-222222222222', CURRENT_TIMESTAMP, false, 'Zofia', 'Kaczmarek', 'zofia.kaczmarek@example.com', '999888777') ON CONFLICT (id) DO NOTHING;

-- 12. ODBIÓR: M1 Łódź -> DOSTAWA: Teatr Wielki
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0232323-2323-2323-2323-232323232323', 'Brzezińska 27', '92-103', 'Łódź', 'POL', 51.772500, 19.516400, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0242424-2424-2424-2424-242424242424', 'Plac Dąbrowskiego', '90-249', 'Łódź', 'POL', 51.773300, 19.468800, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('12012012-0120-1201-2012-012012012012','BD-TEST-0012', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 22.0, 5, 'a0232323-2323-2323-2323-232323232323', 'a0242424-2424-2424-2424-242424242424', CURRENT_TIMESTAMP, false, 'Jakub', 'Zając', 'jakub.zajac@example.com', '444333222') ON CONFLICT (id) DO NOTHING;

-- 13. ODBIÓR: Bionanopark -> DOSTAWA: Aquapark Fala
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0252525-2525-2525-2525-252525252525', 'Dubois 114', '93-465', 'Łódź', 'POL', 51.704200, 19.444300, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0262626-2626-2626-2626-262626262626', 'Al. Unii Lubelskiej 4', '94-208', 'Łódź', 'POL', 51.764500, 19.423900, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('13013013-0130-1301-3013-013013013013','BD-TEST-0013', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 0.5, 1, 'a0252525-2525-2525-2525-252525252525', 'a0262626-2626-2626-2626-262626262626', CURRENT_TIMESTAMP, false, 'Magdalena', 'Król', 'magdalena.krol@example.com', '888000111') ON CONFLICT (id) DO NOTHING;

-- 14. ODBIÓR: Cmentarz Doły -> DOSTAWA: WAM (Szpital)
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0272727-2727-2727-2727-272727272727', 'Smutna 1', '91-729', 'Łódź', 'POL', 51.785600, 19.488000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0282828-2828-2828-2828-282828282828', 'Żeromskiego 113', '90-549', 'Łódź', 'POL', 51.758000, 19.445000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('14014014-0140-1401-4014-014014014014','BD-TEST-0014', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 6.4, 2, 'a0272727-2727-2727-2727-272727272727', 'a0282828-2828-2828-2828-282828282828', CURRENT_TIMESTAMP, false, 'Patryk', 'Wieczorek', 'patryk.wieczorek@example.com', '555222333') ON CONFLICT (id) DO NOTHING;

-- 15. ODBIÓR: Nowosolna -> DOSTAWA: Lotnisko Reymonta
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0292929-2929-2929-2929-292929292929', 'Brzezińska 300', '92-703', 'Łódź', 'POL', 51.802000, 19.578000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0303030-3030-3030-3030-303030303030', 'Maczka 35', '94-328', 'Łódź', 'POL', 51.722500, 19.398300, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('15015015-0150-1501-5015-015015015015','BD-TEST-0015', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 11.1, 4, 'a0292929-2929-2929-2929-292929292929', 'a0303030-3030-3030-3030-303030303030', CURRENT_TIMESTAMP, false, 'Monika', 'Jaworska', 'monika.jaworska@example.com', '123123123') ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- JESZCZE WIĘCEJ DANYCH TESTOWYCH (ZAMÓWIENIA 16 - 25)
-- =========================================================

-- 16. ODBIÓR: Ruda Pabianicka -> DOSTAWA: Złotno
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0313131-3131-3131-3131-313131313131', 'Rudzka 50', '93-423', 'Łódź', 'POL', 51.700000, 19.430000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0323232-3232-3232-3232-323232323232', 'Złotno 140', '94-401', 'Łódź', 'POL', 51.780000, 19.380000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('16016016-0160-1601-6016-016016016016','BD-TEST-0016', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 18.0, 4, 'a0313131-3131-3131-3131-313131313131', 'a0323232-3232-3232-3232-323232323232', CURRENT_TIMESTAMP, false, 'Paweł', 'Wróbel', 'pawel.wrobel@example.com', '456456456') ON CONFLICT (id) DO NOTHING;

-- 17. ODBIÓR: Chojny -> DOSTAWA: Stoki
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0333333-3333-3333-3333-333333333333', 'Rzgowska 150', '93-311', 'Łódź', 'POL', 51.715000, 19.480000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0343434-3434-3434-3434-343434343434', 'Telefoniczna 64', '92-016', 'Łódź', 'POL', 51.785000, 19.520000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('17017017-0170-1701-7017-017017017017','BD-TEST-0017', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 3.5, 1, 'a0333333-3333-3333-3333-333333333333', 'a0343434-3434-3434-3434-343434343434', CURRENT_TIMESTAMP, false, 'Natalia', 'Górska', 'natalia.gorska@example.com', '789789789') ON CONFLICT (id) DO NOTHING;

-- 18. ODBIÓR: Radogoszcz Wschód -> DOSTAWA: Dąbrowa
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0353535-3535-3535-3535-353535353535', 'Świtezianki 12', '91-496', 'Łódź', 'POL', 51.810000, 19.440000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0363636-3636-3636-3636-363636363636', 'Tatrzańska 109', '93-208', 'Łódź', 'POL', 51.730000, 19.490000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('18018018-0180-1801-8018-018018018018','BD-TEST-0018', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 9.0, 2, 'a0353535-3535-3535-3535-353535353535', 'a0363636-3636-3636-3636-363636363636', CURRENT_TIMESTAMP, false, 'Artur', 'Mazur', 'artur.mazur@example.com', '112233445') ON CONFLICT (id) DO NOTHING;

-- 19. ODBIÓR: Retkinia -> DOSTAWA: Widzew
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0373737-3737-3737-3737-373737373737', 'Kusocińskiego 100', '94-054', 'Łódź', 'POL', 51.740000, 19.400000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0383838-3838-3838-3838-383838383838', 'Puszkina 80', '92-516', 'Łódź', 'POL', 51.750000, 19.520000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('19019019-0190-1901-9019-019019019019','BD-TEST-0019', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 11.2, 3, 'a0373737-3737-3737-3737-373737373737', 'a0383838-3838-3838-3838-383838383838', CURRENT_TIMESTAMP, false, 'Marta', 'Krawczyk', 'marta.krawczyk@example.com', '998877665') ON CONFLICT (id) DO NOTHING;

-- 20. ODBIÓR: Śródmieście -> DOSTAWA: Łagiewniki
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0393939-3939-3939-3939-393939393939', 'Nawrot 34', '90-055', 'Łódź', 'POL', 51.760000, 19.465000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0404040-4040-4040-4040-404040404040', 'Wycieczkowa 86', '91-518', 'Łódź', 'POL', 51.830000, 19.470000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('20020020-0200-2002-0020-020020020020','BD-TEST-0020', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 2.1, 1, 'a0393939-3939-3939-3939-393939393939', 'a0404040-4040-4040-4040-404040404040', CURRENT_TIMESTAMP, false, 'Krzysztof', 'Piotrowski', 'krzysztof.piotrowski@example.com', '554433221') ON CONFLICT (id) DO NOTHING;

-- 21. ODBIÓR: Polesie -> DOSTAWA: Zarzew
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0414141-4141-4141-4141-414141414141', 'Srebrzyńska 2', '91-074', 'Łódź', 'POL', 51.770000, 19.430000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0424242-4242-4242-4242-424242424242', 'Milionowa 55', '93-193', 'Łódź', 'POL', 51.740000, 19.500000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('21021021-0210-2102-1021-021021021021','BD-TEST-0021', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 6.0, 2, 'a0414141-4141-4141-4141-414141414141', 'a0424242-4242-4242-424242424242', CURRENT_TIMESTAMP, false, 'Aleksandra', 'Grabowska', 'aleksandra.grabowska@example.com', '102030405') ON CONFLICT (id) DO NOTHING;

-- 22. ODBIÓR: Żabieniec -> DOSTAWA: Olechów
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0434343-4343-4343-4343-434343434343', 'Limanowskiego 200', '91-027', 'Łódź', 'POL', 51.790000, 19.410000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0444444-4444-4444-4444-444444444444', 'Zakładowa 145', '92-402', 'Łódź', 'POL', 51.720000, 19.540000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('22022022-0220-2202-2022-022022022022','BD-TEST-0022', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 15.0, 4, 'a0434343-4343-4343-4343-434343434343', 'a0444444-4444-4444-4444-444444444444', CURRENT_TIMESTAMP, false, 'Damian', 'Pawłowski', 'damian.pawlowski@example.com', '504403302') ON CONFLICT (id) DO NOTHING;

-- 23. ODBIÓR: Śródmieście -> DOSTAWA: Górna
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0454545-4545-4545-4545-454545454545', 'Sienkiewicza 82', '90-318', 'Łódź', 'POL', 51.765000, 19.460000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0464646-4646-4646-4646-464646464646', 'Paderewskiego 47', '93-509', 'Łódź', 'POL', 51.725000, 19.450000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('23023023-0230-2302-3023-023023023023','BD-TEST-0023', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 1.0, 1, 'a0454545-4545-4545-4545-454545454545', 'a0464646-4646-4646-4646-464646464646', CURRENT_TIMESTAMP, false, 'Joanna', 'Michalska', 'joanna.michalska@example.com', '708809900') ON CONFLICT (id) DO NOTHING;

-- 24. ODBIÓR: Nowe Sady -> DOSTAWA: Marysin
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0474747-4747-4747-4747-474747474747', 'Nowe Sady 2', '94-102', 'Łódź', 'POL', 51.730000, 19.420000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0484848-4848-4848-4848-484848484848', 'Strykowska 33', '91-526', 'Łódź', 'POL', 51.800000, 19.490000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('24024024-0240-2402-4024-024024024024','BD-TEST-0024', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 5.5, 2, 'a0474747-4747-4747-4747-474747474747', 'a0484848-4848-4848-4848-484848484848', CURRENT_TIMESTAMP, false, 'Marek', 'Nowakowski', 'marek.nowakowski@example.com', '601202303') ON CONFLICT (id) DO NOTHING;

-- 25. ODBIÓR: Zdrowie -> DOSTAWA: Stare Bałuty
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0494949-4949-4949-4949-494949494949', 'Krzemieniecka 2', '94-030', 'Łódź', 'POL', 51.760000, 19.410000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0505050-5050-5050-5050-505050505050', 'Łagiewnicka 54', '91-456', 'Łódź', 'POL', 51.780000, 19.450000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('25025025-0250-2502-5025-025025025025','BD-TEST-0025', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 8.8, 3, 'a0494949-4949-4949-4949-494949494949', 'a0505050-5050-5050-5050-505050505050', CURRENT_TIMESTAMP, false, 'Agnieszka', 'Dudek', 'agnieszka.dudek@example.com', '777666555') ON CONFLICT (id) DO NOTHING;

-- 26. [IN_SORTING_CENTER] ODBIÓR: Teofilów -> DOSTAWA: Radogoszcz
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0515151-5151-5151-5151-515151515151', 'Rojna 41', '91-134', 'Łódź', 'POL', 51.790500, 19.385000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0525252-5252-5252-5252-525252525252', 'Zgierska 240', '91-362', 'Łódź', 'POL', 51.820100, 19.442000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('26026026-0260-2602-6026-026026026026','BD-TEST-0026', 'c1111111-1111-1111-1111-111111111111', 'IN_SORTING_CENTER', 12.5, 2, 'a0515151-5151-5151-5151-515151515151', 'a0525252-5252-5252-5252-525252525252', CURRENT_TIMESTAMP, false, 'Dominik', 'Adamczyk', 'dominik.adamczyk@example.com', '888555222') ON CONFLICT (id) DO NOTHING;

-- 27. [IN_SORTING_CENTER] ODBIÓR: Śródmieście -> DOSTAWA: Widzew
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0535353-5353-5353-5353-535353535353', 'Jaracza 40', '90-252', 'Łódź', 'POL', 51.770200, 19.465000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0545454-5454-5454-5454-545454545454', 'Przyyszłości 12', '92-332', 'Łódź', 'POL', 51.765000, 19.520000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('27027027-0270-2702-7027-027027027027','BD-TEST-0027', 'c2222222-2222-2222-2222-222222222222', 'IN_SORTING_CENTER', 4.0, 1, 'a0535353-5353-5353-5353-535353535353', 'a0545454-5454-5454-5454-545454545454', CURRENT_TIMESTAMP, false, 'Magda', 'Sikora', 'magda.sikora@example.com', '333666999') ON CONFLICT (id) DO NOTHING;

-- 28. [IN_SORTING_CENTER] ODBIÓR: Polesie -> DOSTAWA: Górna
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0555555-5555-5555-5555-555555555555', 'Więckowskiego 33', '90-734', 'Łódź', 'POL', 51.772000, 19.445000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0565656-5656-5656-5656-565656565656', 'Rzgowska 200', '93-311', 'Łódź', 'POL', 51.720000, 19.485000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('28028028-0280-2802-8028-028028028028','BD-TEST-0028', 'c3333333-3333-3333-3333-333333333333', 'IN_SORTING_CENTER', 18.2, 4, 'a0555555-5555-5555-5555-555555555555', 'a0565656-5656-5656-5656-565656565656', CURRENT_TIMESTAMP, false, 'Tomasz', 'Krupa', 'tomasz.krupa@example.com', '121314151') ON CONFLICT (id) DO NOTHING;

-- 29. [DELIVERY_COMPLETED] ODBIÓR: Bałuty -> DOSTAWA: Centrum
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0575757-5757-5757-5757-575757575757', 'Lutomierska 50', '91-048', 'Łódź', 'POL', 51.785000, 19.435000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0585858-5858-5858-5858-585858585858', 'Tuwima 22', '90-002', 'Łódź', 'POL', 51.765000, 19.462000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('29029029-0290-2902-9029-029029029029','BD-TEST-0029', 'c4444444-4444-4444-4444-444444444444', 'DELIVERY_COMPLETED', 1.5, 1, 'a0575757-5757-5757-5757-575757575757', 'a0585858-5858-5858-5858-585858585858', CURRENT_TIMESTAMP, false, 'Janina', 'Maciejewska', 'janina.maciejewska@example.com', '987123654') ON CONFLICT (id) DO NOTHING;

-- 30. [DELIVERY_COMPLETED] ODBIÓR: Chojny -> DOSTAWA: Retkinia
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0595959-5959-5959-5959-595959595959', 'Kosynierów Gdyńskich 10', '93-357', 'Łódź', 'POL', 51.715000, 19.495000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0606060-6060-6060-6060-606060606060', 'Popiełuszki 15', '94-052', 'Łódź', 'POL', 51.745000, 19.390000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('30030030-0300-3003-0030-030030030030','BD-TEST-0030', 'c5555555-5555-5555-5555-555555555555', 'DELIVERY_COMPLETED', 7.0, 2, 'a0595959-5959-5959-5959-595959595959', 'a0606060-6060-6060-6060-606060606060', CURRENT_TIMESTAMP, false, 'Grzegorz', 'Stepień', 'grzegorz.stepien@example.com', '654321987') ON CONFLICT (id) DO NOTHING;

-- 31. [ORDER_CREATED] ODBIÓR: Dąbrowa -> DOSTAWA: Zarzew
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0616161-6161-6161-6161-616161616161', 'Gojawiczyńskiej 2', '93-239', 'Łódź', 'POL', 51.735000, 19.505000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0626262-6262-6262-6262-626262626262', 'Lodowa 101', '93-232', 'Łódź', 'POL', 51.745000, 19.495000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('31031031-0310-3103-1031-031031031031','BD-TEST-0031', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 2.0, 1, 'a0616161-6161-6161-6161-616161616161', 'a0626262-6262-6262-6262-626262626262', CURRENT_TIMESTAMP, false, 'Weronika', 'Czarnecka', 'weronika.czarnecka@example.com', '123987456') ON CONFLICT (id) DO NOTHING;

-- 32. [ORDER_CREATED] ODBIÓR: Manufaktura -> DOSTAWA: Ruda Pabianicka
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0636363-6363-6363-6363-636363636363', 'Karskiego 5', '91-071', 'Łódź', 'POL', 51.780000, 19.448000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0646464-6464-6464-6464-646464646464', 'Pabianicka 150', '93-438', 'Łódź', 'POL', 51.710000, 19.435000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('32032032-0320-3203-2032-032032032032','BD-TEST-0032', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 25.0, 5, 'a0636363-6363-6363-6363-636363636363', 'a0646464-6464-6464-6464-646464646464', CURRENT_TIMESTAMP, false, 'Piotr', 'Kowalczyk', 'piotr.kowalczyk@example.com', '321654987') ON CONFLICT (id) DO NOTHING;

-- 33. [ORDER_CANCELED] ODBIÓR: Łagiewniki -> DOSTAWA: Teofilów
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0656565-6565-6565-6565-656565656565', 'Okólna 100', '91-520', 'Łódź', 'POL', 51.840000, 19.480000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0666666-6666-6666-6666-666666666666', 'Kaczeńcowa 12', '91-214', 'Łódź', 'POL', 51.800000, 19.380000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('33033033-0330-3303-3033-033033033033','BD-TEST-0033', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CANCELED', 8.5, 2, 'a0656565-6565-6565-6565-656565656565', 'a0666666-6666-6666-6666-666666666666', CURRENT_TIMESTAMP, false, 'Maciej', 'Szymczak', 'maciej.szymczak@example.com', '741852963') ON CONFLICT (id) DO NOTHING;

-- 34. [ORDER_CANCELED] ODBIÓR: Lumumby -> DOSTAWA: Centrum
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0676767-6767-6767-6767-676767676767', 'Styrska 20', '91-404', 'Łódź', 'POL', 51.780000, 19.490000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0686868-6868-6868-6868-686868686868', 'Zielona 33', '90-608', 'Łódź', 'POL', 51.770000, 19.455000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('34034034-0340-3403-4034-034034034034','BD-TEST-0034', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CANCELED', 1.0, 1, 'a0676767-6767-6767-6767-676767676767', 'a0686868-6868-6868-6868-686868686868', CURRENT_TIMESTAMP, false, 'Oliwia', 'Baranowska', 'oliwia.baranowska@example.com', '963852741') ON CONFLICT (id) DO NOTHING;

-- 35. [IN_TRANSIT_TO_CUSTOMER] ODBIÓR: Złotno -> DOSTAWA: Bałuty
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0696969-6969-6969-6969-696969696969', 'Cyganka 10', '94-221', 'Łódź', 'POL', 51.780000, 19.350000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0707070-7070-7070-7070-707070707070', 'Limanowskiego 120', '91-027', 'Łódź', 'POL', 51.790000, 19.430000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('35035035-0350-3503-5035-035035035035','BD-TEST-0035', 'c5555555-5555-5555-5555-555555555555', 'IN_TRANSIT_TO_CUSTOMER', 14.0, 3, 'a0696969-6969-6969-6969-696969696969', 'a0707070-7070-7070-7070-707070707070', CURRENT_TIMESTAMP, false, 'Paulina', 'Rutkowska', 'paulina.rutkowska@example.com', '159753456') ON CONFLICT (id) DO NOTHING;

-- 36. [IN_TRANSIT_TO_CUSTOMER] ODBIÓR: Widzew Wschód -> DOSTAWA: Śródmieście
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0717171-7171-7171-7171-717171717171', 'Sacharowa 20', '92-525', 'Łódź', 'POL', 51.750000, 19.530000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0727272-7272-7272-7272-727272727272', 'Sienkiewicza 50', '90-009', 'Łódź', 'POL', 51.765000, 19.460000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('36036036-0360-3603-6036-036036036036','BD-TEST-0036', 'c1111111-1111-1111-1111-111111111111', 'IN_TRANSIT_TO_CUSTOMER', 2.2, 1, 'a0717171-7171-7171-7171-717171717171', 'a0727272-7272-7272-7272-727272727272', CURRENT_TIMESTAMP, false, 'Bartosz', 'Michalak', 'bartosz.michalak@example.com', '357159258') ON CONFLICT (id) DO NOTHING;

-- 37. [IN_TRANSIT_TO_CUSTOMER] ODBIÓR: Polesie -> DOSTAWA: Dąbrowa
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0737373-7373-7373-7373-737373737373', 'Żeromskiego 50', '90-625', 'Łódź', 'POL', 51.765000, 19.445000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0747474-7474-7474-7474-747474747474', 'Felińskiego 10', '93-255', 'Łódź', 'POL', 51.730000, 19.510000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('37037037-0370-3703-7037-037037037037','BD-TEST-0037', 'c2222222-2222-2222-2222-222222222222', 'IN_TRANSIT_TO_CUSTOMER', 9.5, 3, 'a0737373-7373-7373-7373-737373737373', 'a0747474-7474-7474-7474-747474747474', CURRENT_TIMESTAMP, false, 'Szymon', 'Szczepański', 'szymon.szczepanski@example.com', '258369147') ON CONFLICT (id) DO NOTHING;

-- 38. [ORDER_CREATED] ODBIÓR: Janów -> DOSTAWA: Radogoszcz Zachód
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0757575-7575-7575-7575-757575757575', 'Hetmańska 2', '92-411', 'Łódź', 'POL', 51.740000, 19.550000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0767676-7676-7676-7676-767676767676', '11 Listopada 50', '91-370', 'Łódź', 'POL', 51.815000, 19.430000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('38038038-0380-3803-8038-038038038038','BD-TEST-0038', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 3.0, 1, 'a0757575-7575-7575-7575-757575757575', 'a0767676-7676-7676-7676-767676767676', CURRENT_TIMESTAMP, false, 'Maja', 'Sikorska', 'maja.sikorska@example.com', '147258369') ON CONFLICT (id) DO NOTHING;

-- 39. [ORDER_CREATED] ODBIÓR: Śródmieście -> DOSTAWA: Stoki
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0777777-7777-7777-7777-777777777777', 'Roosevelta 15', '90-056', 'Łódź', 'POL', 51.760000, 19.460000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0787878-7878-7878-7878-787878787878', 'Giewont 20', '92-116', 'Łódź', 'POL', 51.785000, 19.530000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('39039039-0390-3903-9039-039039039039','BD-TEST-0039', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 1.0, 1, 'a0777777-7777-7777-7777-777777777777', 'a0787878-7878-7878-7878-787878787878', CURRENT_TIMESTAMP, false, 'Igor', 'Lis', 'igor.lis@example.com', '987654123') ON CONFLICT (id) DO NOTHING;

-- 40. [IN_SORTING_CENTER] ODBIÓR: Ruda Pabianicka -> DOSTAWA: Bałuty
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0797979-7979-7979-7979-797979797979', 'Odrzańska 11', '93-423', 'Łódź', 'POL', 51.700000, 19.440000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0808080-8080-8080-8080-808080808080', 'Marysińska 90', '91-850', 'Łódź', 'POL', 51.800000, 19.470000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('40040040-0400-4004-0040-040040040040','BD-TEST-0040', 'c5555555-5555-5555-5555-555555555555', 'IN_SORTING_CENTER', 7.2, 2, 'a0797979-7979-7979-7979-797979797979', 'a0808080-8080-8080-8080-808080808080', CURRENT_TIMESTAMP, false, 'Julia', 'Zalewska', 'julia.zalewska@example.com', '123789456') ON CONFLICT (id) DO NOTHING;

-- 41. [IN_SORTING_CENTER] ODBIÓR: Retkinia -> DOSTAWA: Zdrowie
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0818181-8181-8181-8181-818181818181', 'Armii Krajowej 40', '94-046', 'Łódź', 'POL', 51.745000, 19.400000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0828282-8282-8282-8282-828282828282', 'Konstantynowska 1', '94-303', 'Łódź', 'POL', 51.765000, 19.410000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('41041041-0410-4104-1041-041041041041','BD-TEST-0041', 'c1111111-1111-1111-1111-111111111111', 'IN_SORTING_CENTER', 5.5, 2, 'a0818181-8181-8181-8181-818181818181', 'a0828282-8282-8282-8282-828282828282', CURRENT_TIMESTAMP, false, 'Patrycja', 'Włodarczyk', 'patrycja.wlodarczyk@example.com', '456123789') ON CONFLICT (id) DO NOTHING;

-- 42. [DELIVERY_COMPLETED] ODBIÓR: Widzew -> DOSTAWA: Centrum
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0838383-8383-8383-8383-838383838383', 'Niciarniana 50', '92-320', 'Łódź', 'POL', 51.765000, 19.510000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0848484-8484-8484-8484-848484848484', 'Narutowicza 40', '90-135', 'Łódź', 'POL', 51.770000, 19.465000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('42042042-0420-4204-2042-042042042042','BD-TEST-0042', 'c2222222-2222-2222-2222-222222222222', 'DELIVERY_COMPLETED', 1.0, 1, 'a0838383-8383-8383-8383-838383838383', 'a0848484-8484-8484-8484-848484848484', CURRENT_TIMESTAMP, false, 'Tymon', 'Górecki', 'tymon.gorecki@example.com', '789456123') ON CONFLICT (id) DO NOTHING;

-- 43. [DELIVERY_COMPLETED] ODBIÓR: Dąbrowa -> DOSTAWA: Zarzew
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0858585-8585-8585-8585-858585858585', 'Kossaka 1', '93-239', 'Łódź', 'POL', 51.730000, 19.510000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0868686-8686-8686-8686-868686868686', 'Morcinka 5', '93-210', 'Łódź', 'POL', 51.735000, 19.500000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('43043043-0430-4304-3043-043043043043','BD-TEST-0043', 'c3333333-3333-3333-3333-333333333333', 'DELIVERY_COMPLETED', 19.5, 4, 'a0858585-8585-8585-8585-858585858585', 'a0868686-8686-8686-8686-868686868686', CURRENT_TIMESTAMP, false, 'Nikola', 'Bąk', 'nikola.bak@example.com', '123123456') ON CONFLICT (id) DO NOTHING;

-- 44. [ORDER_CREATED] ODBIÓR: Złotno -> DOSTAWA: Centrum
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0878787-8787-8787-8787-878787878787', 'Podchorążych 20', '94-234', 'Łódź', 'POL', 51.785000, 19.380000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0888888-8888-8888-8888-888888888888', 'Gdańska 80', '90-508', 'Łódź', 'POL', 51.765000, 19.450000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('44044044-0440-4404-4044-044044044044','BD-TEST-0044', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 2.0, 1, 'a0878787-8787-8787-8787-878787878787', 'a0888888-8888-8888-8888-888888888888', CURRENT_TIMESTAMP, false, 'Filip', 'Makowski', 'filip.makowski@example.com', '456456789') ON CONFLICT (id) DO NOTHING;

-- 45. [ORDER_CANCELED] ODBIÓR: Teofilów -> DOSTAWA: Radogoszcz
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0898989-8989-8989-8989-898989898989', 'Lniania 15', '91-158', 'Łódź', 'POL', 51.795000, 19.380000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0909090-9090-9090-9090-909090909090', 'Biedronkowa 5', '91-498', 'Łódź', 'POL', 51.820000, 19.445000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('45045045-0450-4504-5045-045045045045','BD-TEST-0045', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CANCELED', 8.0, 2, 'a0898989-8989-8989-8989-898989898989', 'a0909090-9090-9090-9090-909090909090', CURRENT_TIMESTAMP, false, 'Alicja', 'Mazurek', 'alicja.mazurek@example.com', '789789123') ON CONFLICT (id) DO NOTHING;

-- 46. [IN_SORTING_CENTER] ODBIÓR: Śródmieście -> DOSTAWA: Widzew
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0919191-9191-9191-9191-919191919191', 'Wschodnia 60', '90-001', 'Łódź', 'POL', 51.770000, 19.460000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0929292-9292-9292-9292-929292929292', 'Wujaka 10', '92-536', 'Łódź', 'POL', 51.750000, 19.530000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('46046046-0460-4604-6046-046046046046','BD-TEST-0046', 'c1111111-1111-1111-1111-111111111111', 'IN_SORTING_CENTER', 2.5, 1, 'a0919191-9191-9191-9191-919191919191', 'a0929292-9292-9292-9292-929292929292', CURRENT_TIMESTAMP, false, 'Oskar', 'Ziółkowski', 'oskar.ziolkowski@example.com', '111222999') ON CONFLICT (id) DO NOTHING;

-- 47. [IN_SORTING_CENTER] ODBIÓR: Ruda Pabianicka -> DOSTAWA: Polesie
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0939393-9393-9393-9393-939393939393', 'Demokratyczna 100', '93-430', 'Łódź', 'POL', 51.710000, 19.440000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0949494-9494-9494-9494-949494949494', 'Włókniarzy 200', '90-555', 'Łódź', 'POL', 51.770000, 19.430000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('47047047-0470-4704-7047-047047047047','BD-TEST-0047', 'c2222222-2222-2222-2222-222222222222', 'IN_SORTING_CENTER', 10.0, 3, 'a0939393-9393-9393-9393-939393939393', 'a0949494-9494-9494-9494-949494949494', CURRENT_TIMESTAMP, false, 'Kornelia', 'Szewczyk', 'kornelia.szewczyk@example.com', '888999111') ON CONFLICT (id) DO NOTHING;

-- 48. [IN_SORTING_CENTER] ODBIÓR: Bałuty -> DOSTAWA: Dąbrowa
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0959595-9595-9595-9595-959595959595', 'Zgierska 150', '91-473', 'Łódź', 'POL', 51.800000, 19.450000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0969696-9696-9696-9696-969696969696', 'Rydza-Śmigłego 20', '93-281', 'Łódź', 'POL', 51.740000, 19.490000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('48048048-0480-4804-8048-048048048048','BD-TEST-0048', 'c3333333-3333-3333-3333-333333333333', 'IN_SORTING_CENTER', 6.0, 2, 'a0959595-9595-9595-9595-959595959595', 'a0969696-9696-9696-9696-969696969696', CURRENT_TIMESTAMP, false, 'Dawid', 'Kołodziej', 'dawid.kolodziej@example.com', '777111222') ON CONFLICT (id) DO NOTHING;

-- 49. [ORDER_CREATED] ODBIÓR: Lumumby -> DOSTAWA: Olechów
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0979797-9797-9797-9797-979797979797', 'Straussa 5', '91-404', 'Łódź', 'POL', 51.775000, 19.490000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0989898-9898-9898-9898-989898989898', 'Olechowska 50', '92-426', 'Łódź', 'POL', 51.730000, 19.550000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('49049049-0490-4904-9049-049049049049','BD-TEST-0049', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 2.0, 1, 'a0979797-9797-9797-9797-979797979797', 'a0989898-9898-9898-9898-989898989898', CURRENT_TIMESTAMP, false, 'Wiktoria', 'Sikora', 'wiktoria.sikora@example.com', '666222333') ON CONFLICT (id) DO NOTHING;

-- 50. [ORDER_CREATED] ODBIÓR: Widzew -> DOSTAWA: Bałuty
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a0999999-9999-9999-9999-999999999999', 'Piłsudskiego 135', '92-318', 'Łódź', 'POL', 51.765000, 19.520000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted)
VALUES ('a1001001-0010-0100-1001-010010010010', 'Zgierska 200', '91-362', 'Łódź', 'POL', 51.810000, 19.440000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('50050050-0500-5005-0050-050050050050','BD-TEST-0050', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 11.0, 3, 'a0999999-9999-9999-9999-999999999999', 'a1001001-0010-0100-1001-010010010010', CURRENT_TIMESTAMP, false, 'Igor', 'Lisowski', 'igor.lisowski@example.com', '555333444') ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- MASOWE DANE TESTOWE DO ALGORYTMÓW (51 - 100) - ORDER_CREATED
-- =========================================================

-- 51.
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000051', 'Kilińskiego 10', '90-001', 'Łódź', 'POL', 51.770000, 19.460000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000051', 'Włókniarzy 50', '91-001', 'Łódź', 'POL', 51.790000, 19.420000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000051','BD-TEST-0051', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 1.5, 1, 'b0000000-0000-0000-0000-000000000051', 'c0000000-0000-0000-0000-000000000051', CURRENT_TIMESTAMP, false, 'Marek', 'Nowak', 'marek@example.com', '500100200') ON CONFLICT (id) DO NOTHING;

-- 52.
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000052', 'Zachodnia 80', '90-002', 'Łódź', 'POL', 51.765000, 19.450000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000052', 'Pabianicka 100', '93-001', 'Łódź', 'POL', 51.720000, 19.440000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000052','BD-TEST-0052', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 5.0, 2, 'b0000000-0000-0000-0000-000000000052', 'c0000000-0000-0000-0000-000000000052', CURRENT_TIMESTAMP, false, 'Anna', 'Wójcik', 'anna@example.com', '500100201') ON CONFLICT (id) DO NOTHING;

-- 53.
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000053', 'Kościuszki 20', '90-003', 'Łódź', 'POL', 51.760000, 19.455000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000053', 'Rzgowska 50', '93-002', 'Łódź', 'POL', 51.730000, 19.470000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000053','BD-TEST-0053', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 12.5, 3, 'b0000000-0000-0000-0000-000000000053', 'c0000000-0000-0000-0000-000000000053', CURRENT_TIMESTAMP, false, 'Piotr', 'Kowalczyk', 'piotr@example.com', '500100202') ON CONFLICT (id) DO NOTHING;

-- 54.
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000054', 'Piłsudskiego 10', '90-004', 'Łódź', 'POL', 51.758000, 19.460000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000054', 'Dąbrowskiego 20', '93-003', 'Łódź', 'POL', 51.735000, 19.480000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000054','BD-TEST-0054', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 2.0, 1, 'b0000000-0000-0000-0000-000000000054', 'c0000000-0000-0000-0000-000000000054', CURRENT_TIMESTAMP, false, 'Kasia', 'Kamińska', 'kasia@example.com', '500100203') ON CONFLICT (id) DO NOTHING;

-- 55.
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000055', 'Mickiewicza 5', '90-005', 'Łódź', 'POL', 51.758000, 19.450000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000055', 'Śmigłego-Rydza 15', '93-004', 'Łódź', 'POL', 51.750000, 19.490000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000055','BD-TEST-0055', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 18.0, 4, 'b0000000-0000-0000-0000-000000000055', 'c0000000-0000-0000-0000-000000000055', CURRENT_TIMESTAMP, false, 'Tomasz', 'Lewandowski', 'tomasz@example.com', '500100204') ON CONFLICT (id) DO NOTHING;

-- 56.
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000056', 'Kopcińskiego 30', '90-006', 'Łódź', 'POL', 51.770000, 19.485000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000056', 'Jana Pawła II 40', '93-005', 'Łódź', 'POL', 51.740000, 19.440000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000056','BD-TEST-0056', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 7.2, 2, 'b0000000-0000-0000-0000-000000000056', 'c0000000-0000-0000-0000-000000000056', CURRENT_TIMESTAMP, false, 'Zofia', 'Zielińska', 'zofia@example.com', '500100205') ON CONFLICT (id) DO NOTHING;

-- 57.
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000057', 'Palki 12', '90-007', 'Łódź', 'POL', 51.785000, 19.485000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000057', 'Obywatelska 60', '93-006', 'Łódź', 'POL', 51.730000, 19.430000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000057','BD-TEST-0057', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 1.1, 1, 'b0000000-0000-0000-0000-000000000057', 'c0000000-0000-0000-0000-000000000057', CURRENT_TIMESTAMP, false, 'Jakub', 'Szymański', 'jakub@example.com', '500100206') ON CONFLICT (id) DO NOTHING;

-- 58.
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000058', 'Strykowska 25', '90-008', 'Łódź', 'POL', 51.800000, 19.495000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000058', 'Maratońska 10', '93-007', 'Łódź', 'POL', 51.745000, 19.415000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000058','BD-TEST-0058', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 22.5, 5, 'b0000000-0000-0000-0000-000000000058', 'c0000000-0000-0000-0000-000000000058', CURRENT_TIMESTAMP, false, 'Magda', 'Woźniak', 'magda@example.com', '500100207') ON CONFLICT (id) DO NOTHING;

-- 59.
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000059', 'Zgierska 110', '90-009', 'Łódź', 'POL', 51.795000, 19.445000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000059', 'Retkińska 80', '93-008', 'Łódź', 'POL', 51.750000, 19.400000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000059','BD-TEST-0059', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 4.0, 1, 'b0000000-0000-0000-0000-000000000059', 'c0000000-0000-0000-0000-000000000059', CURRENT_TIMESTAMP, false, 'Patryk', 'Dąbrowski', 'patryk@example.com', '500100208') ON CONFLICT (id) DO NOTHING;

-- 60.
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000060', 'Kusocińskiego 50', '90-010', 'Łódź', 'POL', 51.740000, 19.390000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000060', 'Bratysławska 10', '93-009', 'Łódź', 'POL', 51.745000, 19.430000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000060','BD-TEST-0060', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 9.5, 2, 'b0000000-0000-0000-0000-000000000060', 'c0000000-0000-0000-0000-000000000060', CURRENT_TIMESTAMP, false, 'Monika', 'Kozłowska', 'monika@example.com', '500100209') ON CONFLICT (id) DO NOTHING;

-- 61-70
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000061', 'Wyszyńskiego 100', '94-001', 'Łódź', 'POL', 51.745000, 19.390000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000061', 'Julianowska 10', '91-002', 'Łódź', 'POL', 51.800000, 19.460000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000061','BD-TEST-0061', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 3.3, 1, 'b0000000-0000-0000-0000-000000000061', 'c0000000-0000-0000-0000-000000000061', CURRENT_TIMESTAMP, false, 'Paweł', 'Kowal', 'pawel@example.com', '500100210') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000062', 'Bandurskiego 50', '94-002', 'Łódź', 'POL', 51.755000, 19.430000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000062', 'Inflancka 20', '91-003', 'Łódź', 'POL', 51.810000, 19.480000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000062','BD-TEST-0062', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 8.0, 2, 'b0000000-0000-0000-0000-000000000062', 'c0000000-0000-0000-0000-000000000062', CURRENT_TIMESTAMP, false, 'Natalia', 'Mazur', 'natalia@example.com', '500100211') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000063', 'Krzemieniecka 30', '94-003', 'Łódź', 'POL', 51.765000, 19.410000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000063', 'Brzezińska 40', '91-004', 'Łódź', 'POL', 51.790000, 19.510000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000063','BD-TEST-0063', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 15.0, 3, 'b0000000-0000-0000-0000-000000000063', 'c0000000-0000-0000-0000-000000000063', CURRENT_TIMESTAMP, false, 'Artur', 'Krawczyk', 'artur@example.com', '500100212') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000064', 'Złotno 80', '94-005', 'Łódź', 'POL', 51.780000, 19.380000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000064', 'Pomorska 100', '91-005', 'Łódź', 'POL', 51.775000, 19.490000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000064','BD-TEST-0064', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 1.0, 1, 'b0000000-0000-0000-0000-000000000064', 'c0000000-0000-0000-0000-000000000064', CURRENT_TIMESTAMP, false, 'Marta', 'Piotrowska', 'marta@example.com', '500100213') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000065', 'Rąbieńska 20', '94-006', 'Łódź', 'POL', 51.790000, 19.370000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000065', 'Narutowicza 50', '91-006', 'Łódź', 'POL', 51.770000, 19.470000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000065','BD-TEST-0065', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 11.0, 3, 'b0000000-0000-0000-0000-000000000065', 'c0000000-0000-0000-0000-000000000065', CURRENT_TIMESTAMP, false, 'Krzysztof', 'Grabowski', 'krzysztof@example.com', '500100214') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000066', 'Traktorowa 60', '94-007', 'Łódź', 'POL', 51.800000, 19.400000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000066', 'Zielona 15', '91-007', 'Łódź', 'POL', 51.770000, 19.450000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000066','BD-TEST-0066', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 4.5, 1, 'b0000000-0000-0000-0000-000000000066', 'c0000000-0000-0000-0000-000000000066', CURRENT_TIMESTAMP, false, 'Aleksandra', 'Pawłowska', 'aleksandra@example.com', '500100215') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000067', 'Aleksandrowska 120', '94-008', 'Łódź', 'POL', 51.810000, 19.380000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000067', 'Legionów 80', '91-008', 'Łódź', 'POL', 51.770000, 19.440000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000067','BD-TEST-0067', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 24.0, 5, 'b0000000-0000-0000-0000-000000000067', 'c0000000-0000-0000-0000-000000000067', CURRENT_TIMESTAMP, false, 'Damian', 'Michalski', 'damian@example.com', '500100216') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000068', 'Limanowskiego 150', '94-009', 'Łódź', 'POL', 51.790000, 19.430000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000068', 'Próchnika 20', '91-009', 'Łódź', 'POL', 51.775000, 19.450000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000068','BD-TEST-0068', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 7.5, 2, 'b0000000-0000-0000-0000-000000000068', 'c0000000-0000-0000-0000-000000000068', CURRENT_TIMESTAMP, false, 'Joanna', 'Nowakowska', 'joanna@example.com', '500100217') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000069', 'Pojezierska 90', '94-010', 'Łódź', 'POL', 51.800000, 19.420000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000069', 'Rewolucji 30', '91-010', 'Łódź', 'POL', 51.775000, 19.470000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000069','BD-TEST-0069', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 13.0, 3, 'b0000000-0000-0000-0000-000000000069', 'c0000000-0000-0000-0000-000000000069', CURRENT_TIMESTAMP, false, 'Maciej', 'Dudek', 'maciej@example.com', '500100218') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000070', 'Jaracza 60', '94-011', 'Łódź', 'POL', 51.770000, 19.480000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000070', 'Tymienieckiego 20', '91-011', 'Łódź', 'POL', 51.750000, 19.475000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000070','BD-TEST-0070', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 1.5, 1, 'b0000000-0000-0000-0000-000000000070', 'c0000000-0000-0000-0000-000000000070', CURRENT_TIMESTAMP, false, 'Weronika', 'Adamczyk', 'weronika@example.com', '500100219') ON CONFLICT (id) DO NOTHING;

-- 71-80
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000071', 'Tuwima 50', '90-012', 'Łódź', 'POL', 51.765000, 19.470000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000071', 'Milionowa 10', '93-012', 'Łódź', 'POL', 51.745000, 19.475000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000071','BD-TEST-0071', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 5.5, 2, 'b0000000-0000-0000-0000-000000000071', 'c0000000-0000-0000-0000-000000000071', CURRENT_TIMESTAMP, false, 'Igor', 'Sikora', 'igor@example.com', '500100220') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000072', 'Nawrot 80', '90-013', 'Łódź', 'POL', 51.760000, 19.475000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000072', 'Przybyszewskiego 120', '93-013', 'Łódź', 'POL', 51.735000, 19.490000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000072','BD-TEST-0072', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 18.5, 4, 'b0000000-0000-0000-0000-000000000072', 'c0000000-0000-0000-0000-000000000072', CURRENT_TIMESTAMP, false, 'Michał', 'Krupa', 'michal@example.com', '500100221') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000073', 'Roosevelta 10', '90-014', 'Łódź', 'POL', 51.760000, 19.460000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000073', 'Tatrzańska 50', '93-014', 'Łódź', 'POL', 51.735000, 19.500000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000073','BD-TEST-0073', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 2.0, 1, 'b0000000-0000-0000-0000-000000000073', 'c0000000-0000-0000-0000-000000000073', CURRENT_TIMESTAMP, false, 'Julia', 'Maciejewska', 'julia@example.com', '500100222') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000074', 'Targowa 40', '90-015', 'Łódź', 'POL', 51.765000, 19.475000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000074', 'Felińskiego 15', '93-015', 'Łódź', 'POL', 51.725000, 19.510000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000074','BD-TEST-0074', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 9.0, 2, 'b0000000-0000-0000-0000-000000000074', 'c0000000-0000-0000-0000-000000000074', CURRENT_TIMESTAMP, false, 'Dawid', 'Stepień', 'dawid@example.com', '500100223') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000075', 'Wodna 25', '90-016', 'Łódź', 'POL', 51.760000, 19.480000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000075', 'Gojawiczyńskiej 10', '93-016', 'Łódź', 'POL', 51.730000, 19.515000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000075','BD-TEST-0075', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 21.0, 5, 'b0000000-0000-0000-0000-000000000075', 'c0000000-0000-0000-0000-000000000075', CURRENT_TIMESTAMP, false, 'Wiktoria', 'Czarnecka', 'wiktoria@example.com', '500100224') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000076', 'Przędzalniana 50', '90-017', 'Łódź', 'POL', 51.755000, 19.485000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000076', 'Puszkina 100', '93-017', 'Łódź', 'POL', 51.745000, 19.530000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000076','BD-TEST-0076', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 1.0, 1, 'b0000000-0000-0000-0000-000000000076', 'c0000000-0000-0000-0000-000000000076', CURRENT_TIMESTAMP, false, 'Marek', 'Lis', 'marek.lis@example.com', '500100225') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000077', 'Rokicińska 50', '90-018', 'Łódź', 'POL', 51.760000, 19.510000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000077', 'Zakładowa 20', '93-018', 'Łódź', 'POL', 51.735000, 19.540000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000077','BD-TEST-0077', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 6.5, 2, 'b0000000-0000-0000-0000-000000000077', 'c0000000-0000-0000-0000-000000000077', CURRENT_TIMESTAMP, false, 'Anna', 'Zalewska', 'anna.zalewska@example.com', '500100226') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000078', 'Hetmańska 15', '90-019', 'Łódź', 'POL', 51.740000, 19.545000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000078', 'Augustów 30', '93-019', 'Łódź', 'POL', 51.745000, 19.560000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000078','BD-TEST-0078', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 11.0, 3, 'b0000000-0000-0000-0000-000000000078', 'c0000000-0000-0000-0000-000000000078', CURRENT_TIMESTAMP, false, 'Piotr', 'Włodarczyk', 'piotr.wlodarczyk@example.com', '500100227') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000079', 'Tomaszowska 100', '90-020', 'Łódź', 'POL', 51.710000, 19.530000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000079', 'Kolumny 200', '93-020', 'Łódź', 'POL', 51.700000, 19.510000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000079','BD-TEST-0079', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 2.2, 1, 'b0000000-0000-0000-0000-000000000079', 'c0000000-0000-0000-0000-000000000079', CURRENT_TIMESTAMP, false, 'Kasia', 'Górecki', 'kasia.gorecki@example.com', '500100228') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000080', 'Kosynierów 50', '90-021', 'Łódź', 'POL', 51.715000, 19.490000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000080', 'Paradna 10', '93-021', 'Łódź', 'POL', 51.705000, 19.470000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000080','BD-TEST-0080', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 15.5, 4, 'b0000000-0000-0000-0000-000000000080', 'c0000000-0000-0000-0000-000000000080', CURRENT_TIMESTAMP, false, 'Tomasz', 'Bąk', 'tomasz.bak@example.com', '500100229') ON CONFLICT (id) DO NOTHING;

-- 81-90
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000081', 'Ustronna 5', '90-022', 'Łódź', 'POL', 51.710000, 19.450000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000081', 'Graniczna 15', '93-022', 'Łódź', 'POL', 51.720000, 19.460000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000081','BD-TEST-0081', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 7.0, 2, 'b0000000-0000-0000-0000-000000000081', 'c0000000-0000-0000-0000-000000000081', CURRENT_TIMESTAMP, false, 'Zofia', 'Makowska', 'zofia.makowska@example.com', '500100230') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000082', 'Przestrzenna 30', '90-023', 'Łódź', 'POL', 51.725000, 19.470000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000082', 'Ruchpliwa 10', '93-023', 'Łódź', 'POL', 51.730000, 19.450000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000082','BD-TEST-0082', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 1.5, 1, 'b0000000-0000-0000-0000-000000000082', 'c0000000-0000-0000-0000-000000000082', CURRENT_TIMESTAMP, false, 'Jakub', 'Mazurek', 'jakub.mazurek@example.com', '500100231') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000083', 'Dubois 50', '90-024', 'Łódź', 'POL', 51.710000, 19.440000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000083', 'Odrzańska 20', '93-024', 'Łódź', 'POL', 51.705000, 19.435000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000083','BD-TEST-0083', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 23.0, 5, 'b0000000-0000-0000-0000-000000000083', 'c0000000-0000-0000-0000-000000000083', CURRENT_TIMESTAMP, false, 'Magdalena', 'Ziółkowska', 'magdalena.ziolkowska@example.com', '500100232') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000084', 'Zjednoczenia 10', '90-025', 'Łódź', 'POL', 51.700000, 19.445000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000084', 'Gdańska 100', '93-025', 'Łódź', 'POL', 51.760000, 19.450000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000084','BD-TEST-0084', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 4.0, 1, 'b0000000-0000-0000-0000-000000000084', 'c0000000-0000-0000-0000-000000000084', CURRENT_TIMESTAMP, false, 'Patryk', 'Szewczyk', 'patryk.szewczyk@example.com', '500100233') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000085', 'Kilińskiego 150', '90-026', 'Łódź', 'POL', 51.750000, 19.465000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000085', 'Sienkiewicza 100', '93-026', 'Łódź', 'POL', 51.755000, 19.460000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000085','BD-TEST-0085', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 8.5, 2, 'b0000000-0000-0000-0000-000000000085', 'c0000000-0000-0000-0000-000000000085', CURRENT_TIMESTAMP, false, 'Monika', 'Kołodziej', 'monika.kolodziej@example.com', '500100234') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000086', 'Roosevelta 20', '90-027', 'Łódź', 'POL', 51.765000, 19.460000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000086', 'Targowa 60', '93-027', 'Łódź', 'POL', 51.760000, 19.475000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000086','BD-TEST-0086', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 11.2, 3, 'b0000000-0000-0000-0000-000000000086', 'c0000000-0000-0000-0000-000000000086', CURRENT_TIMESTAMP, false, 'Paweł', 'Krupa', 'pawel.krupa@example.com', '500100235') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000087', 'Przędzalniana 80', '90-028', 'Łódź', 'POL', 51.750000, 19.485000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000087', 'Wodna 40', '93-028', 'Łódź', 'POL', 51.765000, 19.480000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000087','BD-TEST-0087', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 2.1, 1, 'b0000000-0000-0000-0000-000000000087', 'c0000000-0000-0000-0000-000000000087', CURRENT_TIMESTAMP, false, 'Natalia', 'Maciejewska', 'natalia.maciejewska@example.com', '500100236') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000088', 'Tymienieckiego 40', '90-029', 'Łódź', 'POL', 51.745000, 19.475000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000088', 'Milionowa 30', '93-029', 'Łódź', 'POL', 51.740000, 19.485000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000088','BD-TEST-0088', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 6.0, 2, 'b0000000-0000-0000-0000-000000000088', 'c0000000-0000-0000-0000-000000000088', CURRENT_TIMESTAMP, false, 'Artur', 'Stepień', 'artur.stepien@example.com', '500100237') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000089', 'Przybyszewskiego 150', '90-030', 'Łódź', 'POL', 51.730000, 19.495000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000089', 'Tatrzańska 80', '93-030', 'Łódź', 'POL', 51.740000, 19.505000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000089','BD-TEST-0089', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 15.0, 4, 'b0000000-0000-0000-0000-000000000089', 'c0000000-0000-0000-0000-000000000089', CURRENT_TIMESTAMP, false, 'Marta', 'Czarnecka', 'marta.czarnecka@example.com', '500100238') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000090', 'Felińskiego 30', '90-031', 'Łódź', 'POL', 51.720000, 19.515000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000090', 'Gojawiczyńskiej 20', '93-031', 'Łódź', 'POL', 51.725000, 19.510000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000090','BD-TEST-0090', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 1.0, 1, 'b0000000-0000-0000-0000-000000000090', 'c0000000-0000-0000-0000-000000000090', CURRENT_TIMESTAMP, false, 'Krzysztof', 'Lis', 'krzysztof.lis@example.com', '500100239') ON CONFLICT (id) DO NOTHING;

-- 91-100
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000091', 'Puszkina 120', '90-032', 'Łódź', 'POL', 51.740000, 19.535000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000091', 'Rokicińska 80', '93-032', 'Łódź', 'POL', 51.755000, 19.515000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000091','BD-TEST-0091', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 5.5, 2, 'b0000000-0000-0000-0000-000000000091', 'c0000000-0000-0000-0000-000000000091', CURRENT_TIMESTAMP, false, 'Aleksandra', 'Zalewska', 'aleksandra.zalewska@example.com', '500100240') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000092', 'Zakładowa 40', '90-033', 'Łódź', 'POL', 51.730000, 19.545000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000092', 'Hetmańska 25', '93-033', 'Łódź', 'POL', 51.735000, 19.550000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000092','BD-TEST-0092', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 8.8, 3, 'b0000000-0000-0000-0000-000000000092', 'c0000000-0000-0000-0000-000000000092', CURRENT_TIMESTAMP, false, 'Damian', 'Włodarczyk', 'damian.wlodarczyk@example.com', '500100241') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000093', 'Augustów 50', '90-034', 'Łódź', 'POL', 51.750000, 19.565000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000093', 'Tomaszowska 120', '93-034', 'Łódź', 'POL', 51.705000, 19.535000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000093','BD-TEST-0093', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 2.0, 1, 'b0000000-0000-0000-0000-000000000093', 'c0000000-0000-0000-0000-000000000093', CURRENT_TIMESTAMP, false, 'Joanna', 'Górecki', 'joanna.gorecki@example.com', '500100242') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000094', 'Kolumny 220', '90-035', 'Łódź', 'POL', 51.695000, 19.515000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000094', 'Kosynierów 70', '93-035', 'Łódź', 'POL', 51.720000, 19.495000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000094','BD-TEST-0094', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 11.1, 3, 'b0000000-0000-0000-0000-000000000094', 'c0000000-0000-0000-0000-000000000094', CURRENT_TIMESTAMP, false, 'Maciej', 'Bąk', 'maciej.bak@example.com', '500100243') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000095', 'Paradna 30', '90-036', 'Łódź', 'POL', 51.700000, 19.475000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000095', 'Ustronna 15', '93-036', 'Łódź', 'POL', 51.705000, 19.455000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000095','BD-TEST-0095', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 4.5, 1, 'b0000000-0000-0000-0000-000000000095', 'c0000000-0000-0000-0000-000000000095', CURRENT_TIMESTAMP, false, 'Weronika', 'Makowska', 'weronika.makowska@example.com', '500100244') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000096', 'Graniczna 25', '90-037', 'Łódź', 'POL', 51.715000, 19.465000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000096', 'Przestrzenna 40', '93-037', 'Łódź', 'POL', 51.720000, 19.475000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000096','BD-TEST-0096', 'c1111111-1111-1111-1111-111111111111', 'ORDER_CREATED', 18.0, 4, 'b0000000-0000-0000-0000-000000000096', 'c0000000-0000-0000-0000-000000000096', CURRENT_TIMESTAMP, false, 'Marek', 'Mazurek', 'marek.mazurek@example.com', '500100245') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000097', 'Ruchpliwa 20', '90-038', 'Łódź', 'POL', 51.735000, 19.455000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000097', 'Dubois 70', '93-038', 'Łódź', 'POL', 51.715000, 19.445000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000097','BD-TEST-0097', 'c2222222-2222-2222-2222-222222222222', 'ORDER_CREATED', 7.5, 2, 'b0000000-0000-0000-0000-000000000097', 'c0000000-0000-0000-0000-000000000097', CURRENT_TIMESTAMP, false, 'Anna', 'Ziółkowska', 'anna.ziolkowska@example.com', '500100246') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000098', 'Odrzańska 40', '90-039', 'Łódź', 'POL', 51.700000, 19.430000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000098', 'Zjednoczenia 30', '93-039', 'Łódź', 'POL', 51.695000, 19.440000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000098','BD-TEST-0098', 'c3333333-3333-3333-3333-333333333333', 'ORDER_CREATED', 1.0, 1, 'b0000000-0000-0000-0000-000000000098', 'c0000000-0000-0000-0000-000000000098', CURRENT_TIMESTAMP, false, 'Piotr', 'Szewczyk', 'piotr.szewczyk@example.com', '500100247') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000099', 'Kilińskiego 200', '90-040', 'Łódź', 'POL', 51.745000, 19.460000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000099', 'Sienkiewicza 150', '93-040', 'Łódź', 'POL', 51.750000, 19.455000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000099','BD-TEST-0099', 'c4444444-4444-4444-4444-444444444444', 'ORDER_CREATED', 25.0, 5, 'b0000000-0000-0000-0000-000000000099', 'c0000000-0000-0000-0000-000000000099', CURRENT_TIMESTAMP, false, 'Kasia', 'Kołodziej', 'kasia.kolodziej@example.com', '500100248') ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('b0000000-0000-0000-0000-000000000100', 'Roosevelta 30', '90-041', 'Łódź', 'POL', 51.765000, 19.455000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO locations (id, street_address, postal_code, city, country, latitude, longitude, deleted) VALUES ('c0000000-0000-0000-0000-000000000100', 'Targowa 80', '93-041', 'Łódź', 'POL', 51.755000, 19.470000, false) ON CONFLICT (id) DO NOTHING;
INSERT INTO orders (id, tracking_number, customer_id, status, weight, volume, pickup_location_id, delivery_location_id, created_at, deleted, recipient_first_name, recipient_last_name, recipient_email, recipient_phone)
VALUES ('d0000000-0000-0000-0000-000000000100','BD-TEST-0100', 'c5555555-5555-5555-5555-555555555555', 'ORDER_CREATED', 2.0, 1, 'b0000000-0000-0000-0000-000000000100', 'c0000000-0000-0000-0000-000000000100', CURRENT_TIMESTAMP, false, 'Tomasz', 'Krupa', 'tomasz.krupa@example.com', '500100249') ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- KONFIGURACJA SYSTEMU
-- =========================================================
INSERT INTO system_settings (id, setting_key, setting_value, created_at, deleted)
VALUES ('d0011111-1111-1111-1111-111111111111', 'ACTIVE_ROUTING_ALGORITHM', 'TIMEFOLD_ADVANCED', CURRENT_TIMESTAMP, false) ON CONFLICT (setting_key) DO NOTHING;