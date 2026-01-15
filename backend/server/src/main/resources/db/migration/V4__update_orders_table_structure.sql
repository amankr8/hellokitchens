-- Migration: Update orders table structure for detailed delivery and pricing information
-- Author: Generated from Order.java entity changes
-- Description: Adds delivery address breakdown and itemized pricing fields

-- Drop old columns
ALTER TABLE orders DROP COLUMN o_customer_address;
ALTER TABLE orders DROP COLUMN o_total_price;

-- Add new delivery address columns
ALTER TABLE orders ADD COLUMN o_delivery_street VARCHAR(255) NOT NULL;
ALTER TABLE orders ADD COLUMN o_delivery_address VARCHAR(255) NOT NULL;
ALTER TABLE orders ADD COLUMN o_delivery_pluscode VARCHAR(255) NOT NULL;

-- Add new pricing breakdown columns
ALTER TABLE orders ADD COLUMN o_subtotal DECIMAL(19, 2) NOT NULL;
ALTER TABLE orders ADD COLUMN o_packing_charges DECIMAL(19, 2) NOT NULL;
ALTER TABLE orders ADD COLUMN o_delivery_fees DECIMAL(19, 2) NOT NULL;
ALTER TABLE orders ADD COLUMN o_taxes DECIMAL(19, 2) NOT NULL;
ALTER TABLE orders ADD COLUMN o_total_amount DECIMAL(19, 2) NOT NULL;