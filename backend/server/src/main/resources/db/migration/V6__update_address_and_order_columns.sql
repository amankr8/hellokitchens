-- V<version>__update_address_and_order_columns.sql

-- Update Address table
ALTER TABLE addresses
DROP COLUMN a_address;

ALTER TABLE addresses
    ADD COLUMN a_street_address VARCHAR(255) NOT NULL,
    ADD COLUMN a_full_address VARCHAR(255) NOT NULL,
    ADD COLUMN a_location VARCHAR(255) NOT NULL;

-- Update Order table
ALTER TABLE orders
    RENAME COLUMN o_delivery_pluscode TO o_delivery_location;