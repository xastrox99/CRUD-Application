-- Insert sample users (passwords are BCrypt encoded "password123")
INSERT INTO users (username, password, email, created_at, updated_at) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'admin@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('john_doe', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'john@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('jane_smith', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'jane@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample products
INSERT INTO products (name, price, description, category, stock_quantity, created_at, updated_at) VALUES
('iPhone 15 Pro', 999.99, 'Latest iPhone with advanced camera system and A17 Pro chip', 'Electronics', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('MacBook Air M2', 1199.99, 'Lightweight laptop with M2 chip and all-day battery life', 'Electronics', 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Samsung Galaxy S24', 899.99, 'Android flagship with AI features and excellent camera', 'Electronics', 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Nike Air Max 270', 150.00, 'Comfortable running shoes with Air Max technology', 'Sports', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Adidas Ultraboost 22', 180.00, 'Premium running shoes with responsive cushioning', 'Sports', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Great Gatsby', 12.99, 'Classic American novel by F. Scott Fitzgerald', 'Books', 200, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('To Kill a Mockingbird', 14.99, 'Harper Lee''s masterpiece about justice and racism', 'Books', 150, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('1984', 11.99, 'George Orwell''s dystopian novel', 'Books', 120, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Coffee Maker', 89.99, 'Programmable coffee maker with thermal carafe', 'Home & Kitchen', 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bluetooth Speaker', 79.99, 'Portable wireless speaker with 20-hour battery life', 'Electronics', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); 