-- Migration: Add special instructions column to orders table
-- Author: Generated from Order.java entity changes
-- Description: Adds optional special_instructions field for customer notes

-- Add special instructions column (nullable, max 500 characters)
ALTER TABLE orders ADD COLUMN o_special_instructions VARCHAR(500);