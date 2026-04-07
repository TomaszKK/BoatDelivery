CREATE TABLE users (
    id UUID PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('CUSTOMER', 'COURIER', 'ADMIN')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

CREATE TABLE transports (
    id UUID PRIMARY KEY,
    courier_id UUID,
    transport_type VARCHAR(100) NOT NULL CHECK (transport_type IN ('CAR', 'BIKE', 'VAN', 'TRUCK', 'SCOOTER')),
    brand VARCHAR(100),
    model VARCHAR(100),
    fuel_type VARCHAR(50),
    trunk_volume DOUBLE PRECISION,
    cargo_capacity DOUBLE PRECISION,
    consumption DOUBLE PRECISION,
    license_plate VARCHAR(20) UNIQUE,
    color VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    FOREIGN KEY (courier_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_transports_courier_id ON transports(courier_id);
CREATE INDEX idx_transports_license_plate ON transports(license_plate);
