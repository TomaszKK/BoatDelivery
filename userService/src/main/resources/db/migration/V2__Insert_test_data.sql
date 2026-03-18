TRUNCATE TABLE transports CASCADE;
TRUNCATE TABLE users CASCADE;

INSERT INTO users (id, first_name, last_name, email, phone_number, user_type, created_at, updated_at, created_by, updated_by) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Jan', 'Kowalski', 'jan.kowalski@example.com', '+48501234567', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
('550e8400-e29b-41d4-a716-446655440001', 'Anna', 'Nowak', 'anna.nowak@example.com', '+48601234567', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
('550e8400-e29b-41d4-a716-446655440002', 'Piotr', 'Lewandowski', 'piotr.lewandowski@example.com', '+48701234567', 'COURIER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
('550e8400-e29b-41d4-a716-446655440003', 'Marta', 'Wiśniewska', 'marta.wisniewska@example.com', '+48801234567', 'COURIER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
('550e8400-e29b-41d4-a716-446655440004', 'Admin', 'User', 'admin@example.com', '+48121234567', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

INSERT INTO transports (id, courier_id, transport_type, brand, model, fuel_type, trunk_volume, cargo_capacity, consumption, license_plate, color, created_at, updated_at, created_by, updated_by) VALUES
('650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'TRUCK', 'Volvo', 'FH16', 'diesel', 25000.0, 5000.0, 8.5, 'WX0001', 'biały', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'CAR', 'Mercedes', 'Sprinter', 'diesel', 12000.0, 2000.0, 7.5, 'WX0002', 'czarny', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'BIKE', 'Specialized', 'Turbo', 'electric', 50.0, 30.0, 0.0, 'WX0003', 'czerwony', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'VAN', 'Ford', 'Transit', 'petrol', 8000.0, 1500.0, 9.0, 'WX0004', 'biały', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

