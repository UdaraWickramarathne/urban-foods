
--User_log Trigger

CREATE OR REPLACE TRIGGER trg_users_log
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO users_log (user_id, username, password, role, operation, changed_at, changed_by)
        VALUES (:NEW.user_id, :NEW.username, :NEW.password, :NEW.role, 'INSERT', SYSTIMESTAMP, USER);
    ELSIF UPDATING THEN
        INSERT INTO users_log (user_id, username, password, role, operation, changed_at, changed_by)
        VALUES (:NEW.user_id, :NEW.username, :NEW.password, :NEW.role, 'UPDATE', SYSTIMESTAMP, USER);
    ELSIF DELETING THEN
        INSERT INTO users_log (user_id, username, password, role, operation, changed_at, changed_by)
        VALUES (:OLD.user_id, :OLD.username, :OLD.password, :OLD.role, 'DELETE', SYSTIMESTAMP, USER);
    END IF;
END;
/
SELECT * FROM users;

SELECT * FROM users_log;

--Customers_log Trigger

CREATE OR REPLACE TRIGGER trg_customers_log
AFTER INSERT OR UPDATE OR DELETE ON customers
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO customers_log (customer_id ,first_name,last_name,email,address,image_url, operation, changed_at, changed_by)
        VALUES (:NEW.customer_id, :NEW.first_name, :NEW.last_name, :NEW.email,:NEW.address,:NEW.image_url, 'INSERT', SYSTIMESTAMP, USER);
    ELSIF UPDATING THEN
        INSERT INTO customers_log (customer_id ,first_name,last_name,email,address,image_url, operation, changed_at, changed_by)
        VALUES (:NEW.customer_id, :NEW.first_name, :NEW.last_name, :NEW.email,:NEW.address,:NEW.image_url, 'UPDATE', SYSTIMESTAMP, USER);
    ELSIF DELETING THEN
        INSERT INTO customers_log (customer_id ,first_name,last_name,email,address,image_url, operation, changed_at, changed_by)
        VALUES (:OLD.customer_id, :OLD.first_name, :OLD.last_name, :OLD.email,:OLD.address,:OLD.image_url, 'DELETE', SYSTIMESTAMP, USER);
    END IF;
END;
/
SELECT * FROM customers;

SELECT * FROM customers_log;

--Suppliers_log Trigger

CREATE OR REPLACE TRIGGER trg_suppliers_log
AFTER INSERT OR UPDATE OR DELETE ON suppliers
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO suppliers_log (supplier_id ,business_name,address,email,image_url, operation, changed_at, changed_by)
        VALUES (:NEW.supplier_id, :NEW.business_name,:NEW.address, :NEW.email,:NEW.image_url, 'INSERT', SYSTIMESTAMP, USER);
    ELSIF UPDATING THEN
         INSERT INTO suppliers_log (supplier_id ,business_name,address,email,image_url, operation, changed_at, changed_by)
        VALUES (:NEW.supplier_id, :NEW.business_name,:NEW.address, :NEW.email,:NEW.image_url, 'UPDATE', SYSTIMESTAMP, USER);
    ELSIF DELETING THEN
         INSERT INTO suppliers_log (supplier_id ,business_name,address,email,image_url, operation, changed_at, changed_by)
        VALUES (:OLD.supplier_id, :OLD.business_name,:OLD.address, :OLD.email,:OLD.image_url, 'DELETE', SYSTIMESTAMP, USER);
    END IF;
END;
/
SELECT * FROM suppliers;

SELECT * FROM suppliers_log;

--Category_log Trigger

CREATE OR REPLACE TRIGGER trg_categories_log
AFTER INSERT OR UPDATE OR DELETE ON categories
FOR EACH ROW
DECLARE
    product_count NUMBER;
BEGIN
SELECT COUNT(*) INTO product_count FROM categories WHERE category_id = NVL(:OLD.category_id, :NEW.category_id);
    IF INSERTING THEN
        INSERT INTO categories_log (category_id ,name,description,product_count, operation, changed_at, changed_by)
        VALUES (:NEW.category_id, :NEW.name,:NEW.description,:NEW.product_count, 'INSERT', SYSTIMESTAMP, USER);
    ELSIF UPDATING THEN
         INSERT INTO categories_log (category_id ,name,description,product_count, operation, changed_at, changed_by)
         VALUES (:NEW.category_id, :NEW.name,:NEW.description,:NEW.product_count, 'UPDATE', SYSTIMESTAMP, USER);
    ELSIF DELETING THEN
         INSERT INTO categories_log (category_id ,name,description,product_count, operation, changed_at, changed_by)
        VALUES (:OLD.category_id, :OLD.name,:OLD.description,:OLD.product_count, 'DELETE', SYSTIMESTAMP, USER);
    END IF;
END;
/

--Products_log Trigger

CREATE OR REPLACE TRIGGER trg_products_log
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO products_log (product_id,supplier_id,category_id,name,price,stock,image_url , operation, changed_at, changed_by)
        VALUES (:NEW.product_id, :NEW.supplier_id,:NEW.category_id, :NEW.name,:NEW.price, :NEW.stock, :NEW.image_url, 'INSERT', SYSTIMESTAMP, USER);
    ELSIF UPDATING THEN
         INSERT INTO products_log (product_id,supplier_id,category_id,name,price,stock,image_url , operation, changed_at, changed_by)
        VALUES (:NEW.product_id, :NEW.supplier_id,:NEW.category_id, :NEW.name,:NEW.price, :NEW.stock, :NEW.image_url, 'UPDATE', SYSTIMESTAMP, USER);
    ELSIF DELETING THEN
         INSERT INTO products_log (product_id,supplier_id,category_id,name,price,stock,image_url , operation, changed_at, changed_by)
        VALUES (:OLD.product_id, :OLD.supplier_id,:OLD.category_id, :OLD.name,:OLD.price, :OLD.stock, :OLD.image_url, 'DELETE', SYSTIMESTAMP, USER);
    END IF;
END;
/
SELECT * FROM products;

SELECT * FROM products_log;

--Cart_log Trigger

CREATE OR REPLACE TRIGGER trg_cart_log
AFTER INSERT OR UPDATE OR DELETE ON cart
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO cart_log (cart_id,user_id,product_id,quantity,added_at , operation, changed_at, changed_by)
        VALUES (:NEW.cart_id, :NEW.user_id,:NEW.product_id, :NEW.quantity,:NEW.added_at, 'INSERT', SYSTIMESTAMP, USER);
    ELSIF UPDATING THEN
         INSERT INTO cart_log (cart_id,user_id,product_id,quantity,added_at , operation, changed_at, changed_by)
        VALUES (:NEW.cart_id, :NEW.user_id,:NEW.product_id, :NEW.quantity,:NEW.added_at, 'UPDATE', SYSTIMESTAMP, USER);
    ELSIF DELETING THEN
         INSERT INTO cart_log (cart_id,user_id,product_id,quantity,added_at , operation, changed_at, changed_by)
        VALUES (:OLD.cart_id, :OLD.user_id,:OLD.product_id, :OLD.quantity,:OLD.added_at, 'DELETE', SYSTIMESTAMP, USER);
    END IF;
END;
/
SELECT * FROM cart;

SELECT * FROM cart_log;

--Orders_log Trigger

CREATE OR REPLACE TRIGGER trg_orders_log
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO orders_log (order_id,customer_id,status,order_date,total_amount, operation, changed_at, changed_by)
        VALUES (:NEW.order_id,:NEW.customer_id,:NEW.status, :NEW.order_date,:NEW.total_amount, 'INSERT', SYSTIMESTAMP, USER);
    ELSIF UPDATING THEN
         INSERT INTO orders_log (order_id,customer_id,status,order_date,total_amount, operation, changed_at, changed_by)
        VALUES (:NEW.order_id,:NEW.customer_id,:NEW.status, :NEW.order_date,:NEW.total_amount, 'UPDATE', SYSTIMESTAMP, USER);
    ELSIF DELETING THEN
         INSERT INTO orders_log (order_id,customer_id,status,order_date,total_amount, operation, changed_at, changed_by)
        VALUES (:OLD.order_id,:OLD.customer_id,:OLD.status, :OLD.order_date,:OLD.total_amount, 'DELETE', SYSTIMESTAMP, USER);
    END IF;
END;
/
SELECT * FROM orders;

SELECT * FROM orders_log;

--Orderitems_log Trigger

CREATE OR REPLACE TRIGGER trg_orderitems_log
AFTER INSERT OR UPDATE OR DELETE ON orderitems
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO orderitems_log (order_item_id,order_id,product_id,quantity,unit_price , operation, changed_at, changed_by)
        VALUES (:NEW.order_item_id,:NEW.order_id,:NEW.product_id,:NEW.quantity, :NEW.unit_price, 'INSERT', SYSTIMESTAMP, USER);
    ELSIF UPDATING THEN
        INSERT INTO orderitems_log (order_item_id,order_id,product_id,quantity,unit_price , operation, changed_at, changed_by)
        VALUES (:NEW.order_item_id,:NEW.order_id,:NEW.product_id,:NEW.quantity, :NEW.unit_price, 'UPDATE', SYSTIMESTAMP, USER);
    ELSIF DELETING THEN
        INSERT INTO orderitems_log (order_item_id,order_id,product_id,quantity,unit_price , operation, changed_at, changed_by)
        VALUES (:OLD.order_item_id,:OLD.order_id,:OLD.product_id,:OLD.quantity, :OLD.unit_price, 'DELETE', SYSTIMESTAMP, USER);
    END IF;
END;
/
SELECT * FROM orderitems;

SELECT * FROM orderitems_log;

--payments_log Trigger

CREATE OR REPLACE TRIGGER trg_payments_log
AFTER INSERT OR UPDATE OR DELETE ON payments
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO payments_log (payment_id,order_id, payment_method,status,amount , operation, changed_at, changed_by)
        VALUES (:NEW.payment_id,:NEW.order_id,:NEW.payment_method,:NEW.status, :NEW.amount, 'INSERT', SYSTIMESTAMP, USER);
    ELSIF UPDATING THEN
       INSERT INTO payments_log (payment_id,order_id, payment_method,status,amount , operation, changed_at, changed_by)
        VALUES (:NEW.payment_id,:NEW.order_id,:NEW.payment_method,:NEW.status, :NEW.amount, 'UPDATE', SYSTIMESTAMP, USER);
    ELSIF DELETING THEN
        INSERT INTO payments_log (payment_id,order_id, payment_method,status,amount , operation, changed_at, changed_by)
        VALUES (:OLD.payment_id,:OLD.order_id,:OLD.payment_method,:OLD.status, :OLD.amount, 'DELETE', SYSTIMESTAMP, USER);
    END IF;
END;
/
SELECT * FROM payments;

SELECT * FROM payments_log;

--Deliveries_log Trigger

CREATE OR REPLACE TRIGGER trg_deliveries_log
AFTER INSERT OR UPDATE OR DELETE ON deliveries
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO deliveries_log (delivery_id,order_id,status,estimated_date,tracking_number, operation, changed_at, changed_by)
        VALUES (:NEW.delivery_id,:NEW.order_id,:NEW.status,:NEW.estimated_date, :NEW.tracking_number, 'INSERT', SYSTIMESTAMP, USER);
    ELSIF UPDATING THEN
       INSERT INTO deliveries_log (delivery_id,order_id,status,estimated_date,tracking_number, operation, changed_at, changed_by)
        VALUES (:NEW.delivery_id,:NEW.order_id,:NEW.status,:NEW.estimated_date, :NEW.tracking_number, 'UPDATE', SYSTIMESTAMP, USER);
    ELSIF DELETING THEN
        INSERT INTO deliveries_log (delivery_id,order_id,status,estimated_date,tracking_number, operation, changed_at, changed_by)
        VALUES (:OLD.delivery_id,:OLD.order_id,:OLD.status,:OLD.estimated_date, :OLD.tracking_number, 'DELETE', SYSTIMESTAMP, USER);
    END IF;
END;
/
SELECT * FROM deliveries;

SELECT * FROM deliveries_log;