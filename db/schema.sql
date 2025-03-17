-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_date TIMESTAMP NOT NULL,
    event_location VARCHAR(255) NOT NULL,
    event_description TEXT,
    booked_by VARCHAR(255) REFERENCES users(email),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data for users
INSERT INTO users (name, email, status) VALUES
    ('John Doe', 'john@gmail.com', 'active'),
    ('Jane Smith', 'jane@gmail.com', 'active'),
    ('Bob Wilson', 'bob@gmail.com', 'inactive'),
    ('Alice Brown', 'alice@gmail.com', 'active')
ON CONFLICT (email) DO NOTHING;

-- Sample data for events
INSERT INTO events (event_name, event_date, event_location, event_description, booked_by, status) VALUES
    ('Tech Conference', '2025-04-15 09:00:00', 'Convention Center', 'Annual technology conference', 'john@gmail.com', 'confirmed'),
    ('Music Festival', '2025-05-01 18:00:00', 'City Park', 'Summer music festival', 'jane@gmail.com', 'pending'),
    ('Art Exhibition', '2025-03-20 10:00:00', 'Art Gallery', 'Modern art showcase', 'alice@gmail.com', 'confirmed'),
    ('Workshop', '2025-04-01 14:00:00', 'Community Center', 'Skills development workshop', 'bob@gmail.com', 'cancelled')
ON CONFLICT DO NOTHING;
