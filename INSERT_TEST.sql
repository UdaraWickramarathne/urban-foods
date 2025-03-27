INSERT INTO users (username, password, role) VALUES 
('customer1', 'pass123', 'customer'),
('customer2', 'pass123', 'customer'),
('customer3', 'pass123', 'customer'),
('customer4', 'pass123', 'customer'),
('supplier1', 'pass123', 'supplier'),
('supplier2', 'pass123', 'supplier'),
('supplier3', 'pass123', 'supplier'),
('supplier4', 'pass123', 'supplier');


INSERT INTO Customers (customer_id, first_name, last_name, email, address, image_url) VALUES 
(3, 'John', 'Doe', 'john.doe@example.com', '123 Street, City', 'john_doe.jpg'),
(4, 'Jane', 'Smith', 'jane.smith@example.com', '456 Avenue, City', 'jane_smith.jpg'),
(5, 'Michael', 'Brown', 'michael.brown@example.com', '789 Boulevard, City', 'michael_brown.jpg'),
(6, 'Emily', 'Clark', 'emily.clark@example.com', '321 Lane, City', 'emily_clark.jpg');

INSERT INTO suppliers (supplier_id, business_name, address, email, image_url) VALUES 
(7, 'ABC Supplies', '100 Market Street, City', 'abc@example.com', 'abc_supplies.jpg'),
(8, 'XYZ Traders', '200 Industrial Road, City', 'xyz@example.com', 'xyz_traders.jpg'),
(9, 'FastFood Co.', '300 Food Lane, City', 'fastfood@example.com', 'fastfood.jpg'),
(10, 'Tech Solutions', '400 Tech Park, City', 'tech@example.com', 'tech_solutions.jpg');

INSERT INTO Categories (name, description, product_count) VALUES 
('Electronics', 'Electronic gadgets and devices', 20),
('Clothing', 'Apparel and fashion', 15),
('Groceries', 'Daily grocery items', 30),
('Furniture', 'Home and office furniture', 10),
('Toys', 'Kids toys and games', 25),
('Books', 'Various types of books', 12),
('Beauty', 'Beauty and personal care products', 18),
('Sports', 'Sports equipment and gear', 22),
('Automotive', 'Car and bike accessories', 14),
('Health', 'Health and medical supplies', 19);

INSERT INTO Products (supplier_id, category_id, name, price, stock, image_url) VALUES 
(7, 1, 'Smartphone', 699.99, 50, 'smartphone.jpg'),
(7, 1, 'Laptop', 999.99, 30, 'laptop.jpg'),
(8, 2, 'T-Shirt', 19.99, 100, 'tshirt.jpg'),
(8, 2, 'Jeans', 39.99, 80, 'jeans.jpg'),
(9, 3, 'Rice', 10.99, 200, 'rice.jpg'),
(9, 3, 'Milk', 5.49, 150, 'milk.jpg'),
(10, 4, 'Office Chair', 89.99, 40, 'chair.jpg'),
(10, 4, 'Table', 149.99, 25, 'table.jpg'),
(7, 5, 'Toy Car', 14.99, 60, 'toycar.jpg'),
(8, 6, 'Novel', 12.99, 45, 'novel.jpg');

INSERT INTO cart (user_id, product_id, quantity) VALUES 
(3, 1, 2),
(3, 3, 1),
(4, 2, 1),
(4, 4, 2),
(5, 5, 5),
(5, 6, 2),
(6, 7, 1),
(6, 8, 1),
(3, 9, 3),
(4, 10, 2);

INSERT INTO Orders (customer_id, status, total_amount) VALUES 
(3, 'PENDING', 719.98),
(3, 'COMPLETED', 999.99),
(4, 'PENDING', 59.98),
(4, 'CANCELED', 79.98),
(5, 'PENDING', 54.95),
(5, 'COMPLETED', 10.99),
(6, 'PENDING', 89.99),
(6, 'COMPLETED', 149.99),
(3, 'COMPLETED', 14.99),
(4, 'CANCELED', 12.99);

INSERT INTO OrderItems (order_id, product_id, quantity, unit_price) VALUES 
(1, 1, 2, 699.99),
(2, 2, 1, 999.99),
(3, 3, 1, 19.99),
(3, 4, 2, 39.99),
(4, 5, 5, 10.99),
(5, 6, 2, 5.49),
(6, 7, 1, 89.99),
(7, 8, 1, 149.99),
(8, 9, 3, 14.99),
(9, 10, 2, 12.99);

INSERT INTO PAYMENTS (order_id, payment_method, status, amount) VALUES 
(1, 'Credit Card', 'PAID', 719.98),
(2, 'PayPal', 'PAID', 999.99),
(3, 'Debit Card', 'PENDING', 59.98),
(4, 'PayPal', 'FAILED', 79.98),
(5, 'Credit Card', 'PAID', 54.95),
(6, 'PayPal', 'PAID', 10.99),
(7, 'Debit Card', 'PENDING', 89.99),
(8, 'Bank Transfer', 'PAID', 149.99),
(9, 'PayPal', 'PAID', 14.99),
(10, 'Credit Card', 'FAILED', 12.99);

INSERT INTO Deliveries (order_id, status, estimated_date, tracking_number) VALUES 
(1, 'PENDING', TO_DATE('2025-04-01', 'YYYY-MM-DD'), 'TRACK12345'),
(2, 'IN TRANSIT', TO_DATE('2025-04-02', 'YYYY-MM-DD'), 'TRACK67890'),
(3, 'DELIVERED', TO_DATE('2025-03-25', 'YYYY-MM-DD'), 'TRACK11223'),
(4, 'PENDING', TO_DATE('2025-04-04', 'YYYY-MM-DD'), 'TRACK44556'),
(5, 'DELIVERED', TO_DATE('2025-03-27', 'YYYY-MM-DD'), 'TRACK77889'),
(6, 'IN TRANSIT', TO_DATE('2025-04-05', 'YYYY-MM-DD'), 'TRACK99001'),
(7, 'PENDING', TO_DATE('2025-04-06', 'YYYY-MM-DD'), 'TRACK22334'),
(8, 'DELIVERED', TO_DATE('2025-03-30', 'YYYY-MM-DD'), 'TRACK55667'),
(9, 'IN TRANSIT', TO_DATE('2025-04-07', 'YYYY-MM-DD'), 'TRACK88900'),
(10, 'PENDING', TO_DATE('2025-04-08', 'YYYY-MM-DD'), 'TRACK10111');









SELECT SEQUENCE_NAME FROM USER_SEQUENCES;


