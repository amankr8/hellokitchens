-- V3__refactor_customer_profiles_to_addresses.sql

-- Drop the customer_profiles table
DROP TABLE IF EXISTS customer_profiles;

-- Create the new addresses table
CREATE TABLE addresses (
   a_id BIGSERIAL PRIMARY KEY,
   u_id BIGINT NOT NULL,
   a_address VARCHAR(255) NOT NULL,
   CONSTRAINT fk_addresses_user FOREIGN KEY (u_id) REFERENCES users(u_id)
);

-- Create index for query performance
CREATE INDEX idx_addresses_user_id ON addresses(u_id);

-- Update users table to change column name
ALTER TABLE users RENAME COLUMN u_default_profile_id TO u_default_address_id;
