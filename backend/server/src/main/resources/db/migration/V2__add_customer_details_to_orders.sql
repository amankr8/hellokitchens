-- V2__add_customer_details_to_orders.sql

ALTER TABLE orders
    ADD COLUMN o_customer_name VARCHAR(255) NOT NULL,
    ADD COLUMN o_customer_phone VARCHAR(255) NOT NULL,
    ADD COLUMN o_customer_address VARCHAR(255) NOT NULL;