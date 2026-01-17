-- V<version>__add_item_name_to_order_items.sql
-- Description: Add oi_item_name column to order_items table

ALTER TABLE order_items
    ADD COLUMN oi_item_name VARCHAR(255) NOT NULL;