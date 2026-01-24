-- Version: V{version_number}__add_tracking_url_and_remove_menuitem_reference.sql
-- Description: Add tracking URL to orders and remove menu item foreign key from order items

-- Add tracking URL column to orders table
ALTER TABLE orders
    ADD COLUMN o_tracking_url VARCHAR(255);

-- Drop the foreign key constraint from order_items to menu_items
ALTER TABLE order_items
DROP CONSTRAINT IF EXISTS fk_order_items_menu_item;

-- Drop the menu item ID column from order_items
ALTER TABLE order_items
DROP COLUMN IF EXISTS mi_id;
