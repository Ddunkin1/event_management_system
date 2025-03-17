-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert predefined categories
INSERT INTO categories (name) VALUES
    ('Sports Events'),
    ('Birthday Parties'),
    ('Team-building Event'),
    ('Weddings')
ON CONFLICT (name) DO NOTHING;

-- Add category_id to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(category_id);
