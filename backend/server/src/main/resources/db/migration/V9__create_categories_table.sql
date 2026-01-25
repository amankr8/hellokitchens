-- V9__create_categories_table.sql

CREATE TABLE categories (
    c_id BIGSERIAL PRIMARY KEY,
    k_id BIGINT NOT NULL,
    c_name VARCHAR(255) NOT NULL,
    CONSTRAINT fk_categories_kitchen FOREIGN KEY (k_id) REFERENCES kitchens(k_id),
    CONSTRAINT uq_categories_kitchen_name UNIQUE (k_id, c_name)
);

CREATE INDEX idx_categories_kitchen ON categories(k_id);