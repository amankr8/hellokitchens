-- Create auth_users table
CREATE TABLE auth_users (
    au_id BIGSERIAL PRIMARY KEY,
    au_username VARCHAR(255) UNIQUE NOT NULL,
    au_password VARCHAR(255),
    au_authority VARCHAR(50) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Create users table
CREATE TABLE users (
    u_id BIGSERIAL PRIMARY KEY,
    au_id BIGINT NOT NULL UNIQUE,
    u_name VARCHAR(255),
    u_phone VARCHAR(50),
    u_default_profile_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_users_auth_user FOREIGN KEY (au_id) REFERENCES auth_users(au_id)
);

-- Create kitchens table
CREATE TABLE kitchens (
    k_id BIGSERIAL PRIMARY KEY,
    k_name VARCHAR(255) NOT NULL,
    k_tagline VARCHAR(500),
    k_address TEXT,
    k_subdomain VARCHAR(255) UNIQUE NOT NULL,
    k_whatsapp VARCHAR(50) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Create kitchen_owners table
CREATE TABLE kitchen_owners (
    ko_id BIGSERIAL PRIMARY KEY,
    au_id BIGINT NOT NULL,
    k_id BIGINT NOT NULL,
    ko_role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_kitchen_owners_auth_user FOREIGN KEY (au_id) REFERENCES auth_users(au_id),
    CONSTRAINT fk_kitchen_owners_kitchen FOREIGN KEY (k_id) REFERENCES kitchens(k_id)
);

-- Create menu_items table
CREATE TABLE menu_items (
    mi_id BIGSERIAL PRIMARY KEY,
    k_id BIGINT NOT NULL,
    mi_name VARCHAR(255) NOT NULL,
    mi_desc TEXT,
    mi_category VARCHAR(100),
    mi_in_stock BOOLEAN NOT NULL,
    mi_is_veg BOOLEAN NOT NULL,
    mi_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_menu_items_kitchen FOREIGN KEY (k_id) REFERENCES kitchens(k_id)
);

-- Create dish_images table
CREATE TABLE dish_images (
     di_id BIGSERIAL PRIMARY KEY,
     mi_id BIGINT NOT NULL,
     cn_public_id VARCHAR(255),
     cn_secure_url TEXT,
     CONSTRAINT fk_dish_images_menu_item FOREIGN KEY (mi_id) REFERENCES menu_items(mi_id)
);

-- Create orders table
CREATE TABLE orders (
    o_id BIGSERIAL PRIMARY KEY,
    k_id BIGINT NOT NULL,
    u_id BIGINT,
    o_status VARCHAR(50) NOT NULL,
    o_total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_orders_kitchen FOREIGN KEY (k_id) REFERENCES kitchens(k_id),
    CONSTRAINT fk_orders_user FOREIGN KEY (u_id) REFERENCES users(u_id)
);

-- Create order_items table
CREATE TABLE order_items (
     oi_id BIGSERIAL PRIMARY KEY,
     o_id BIGINT NOT NULL,
     mi_id BIGINT NOT NULL,
     oi_quantity INTEGER NOT NULL,
     oi_price DECIMAL(10, 2) NOT NULL,
     CONSTRAINT fk_order_items_order FOREIGN KEY (o_id) REFERENCES orders(o_id),
     CONSTRAINT fk_order_items_menu_item FOREIGN KEY (mi_id) REFERENCES menu_items(mi_id)
);

-- Create customer_profiles table
CREATE TABLE customer_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    cp_name VARCHAR(255) NOT NULL,
    cp_phone VARCHAR(50) NOT NULL,
    cp_address TEXT NOT NULL,
    CONSTRAINT fk_customer_profiles_user FOREIGN KEY (user_id) REFERENCES users(u_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_users_au_id ON users(au_id);
CREATE INDEX idx_kitchen_owners_au_id ON kitchen_owners(au_id);
CREATE INDEX idx_kitchen_owners_k_id ON kitchen_owners(k_id);
CREATE INDEX idx_menu_items_k_id ON menu_items(k_id);
CREATE INDEX idx_dish_images_mi_id ON dish_images(mi_id);
CREATE INDEX idx_orders_k_id ON orders(k_id);
CREATE INDEX idx_orders_u_id ON orders(u_id);
CREATE INDEX idx_order_items_o_id ON order_items(o_id);
CREATE INDEX idx_order_items_mi_id ON order_items(mi_id);
CREATE INDEX idx_customer_profiles_user_id ON customer_profiles(user_id);
CREATE INDEX idx_auth_users_username ON auth_users(au_username);
CREATE INDEX idx_kitchens_subdomain ON kitchens(k_subdomain);