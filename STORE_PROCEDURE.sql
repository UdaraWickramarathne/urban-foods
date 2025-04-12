---------------------------------------------------------------------------------
-- Create a stored procedure to get the details of a specific supplier
---------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE get_supplier_details (
    p_supplier_id IN NUMBER
)
IS
    -- Declare variables to store the results
    v_supplier_name VARCHAR2(50);
    v_supplier_address VARCHAR2(255);
    v_product_count NUMBER;
    v_total_sales NUMBER(10,2);
    v_success_order_count NUMBER;

BEGIN
    -- Get the supplier details
    SELECT business_name, address
    INTO v_supplier_name, v_supplier_address
    FROM suppliers
    WHERE supplier_id = p_supplier_id;
    
    -- Get the product count for the supplier
    SELECT COUNT(*)
    INTO v_product_count
    FROM products
    WHERE supplier_id = p_supplier_id;

    -- Get the total sales for the supplier
    SELECT SUM(oi.quantity * oi.unit_price)
    INTO v_total_sales
    FROM orderitems oi
    JOIN orders o ON oi.order_id = o.order_id
    WHERE oi.product_id IN (SELECT product_id FROM products WHERE supplier_id = p_supplier_id)
    AND o.status = 'COMPLETED';

    -- Get the count of successful orders for the supplier
    SELECT COUNT(*)
    INTO v_success_order_count
    FROM orders
    WHERE customer_id IN (SELECT customer_id FROM customers) -- To get orders by all customers
    AND status = 'COMPLETED'
    AND order_id IN (SELECT order_id FROM orderitems WHERE product_id IN (SELECT product_id FROM products WHERE supplier_id = p_supplier_id));

    -- Output the results
    DBMS_OUTPUT.PUT_LINE('Supplier Name: ' || v_supplier_name);
    DBMS_OUTPUT.PUT_LINE('Supplier Address: ' || v_supplier_address);
    DBMS_OUTPUT.PUT_LINE('Product Count: ' || v_product_count);
    DBMS_OUTPUT.PUT_LINE('Total Sales: ' || v_total_sales);
    DBMS_OUTPUT.PUT_LINE('Successful Order Count: ' || v_success_order_count);

END get_supplier_details;



---------------------------------------------------------------------------------
-- Create a stored procedure to get the details of all suppliers
---------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE get_suppliers_details
IS
    -- Declare a cursor to select all supplier ids
    CURSOR supplier_cursor IS
        SELECT supplier_id, business_name, address, email, image_url
        FROM suppliers;
    
    -- Variables to hold supplier data for each record
    v_supplier_id NUMBER;
    v_supplier_name VARCHAR2(50);
    v_supplier_address VARCHAR2(255);
    v_supplier_email VARCHAR2(50);
    v_image_url VARCHAR2(255);
    v_product_count NUMBER;
    v_total_sales NUMBER(10,2);
    v_success_order_count NUMBER;

BEGIN
    -- Open the cursor
    OPEN supplier_cursor;
    
    -- Loop through each supplier in the cursor
    LOOP
        FETCH supplier_cursor INTO v_supplier_id, v_supplier_name, v_supplier_address, v_supplier_email, v_image_url;
        
        EXIT WHEN supplier_cursor%NOTFOUND;

        -- Get the product count for the supplier
        SELECT COUNT(*)
        INTO v_product_count
        FROM products
        WHERE supplier_id = v_supplier_id;

        -- Get the total sales for the supplier
        SELECT SUM(oi.quantity * oi.unit_price)
        INTO v_total_sales
        FROM orderitems oi
        JOIN orders o ON oi.order_id = o.order_id
        WHERE oi.product_id IN (SELECT product_id FROM products WHERE supplier_id = v_supplier_id)
        AND o.status = 'COMPLETED';

        -- Get the count of successful orders for the supplier
        SELECT COUNT(*)
        INTO v_success_order_count
        FROM orders
        WHERE customer_id IN (SELECT customer_id FROM customers) -- To get orders by all customers
        AND status = 'COMPLETED'
        AND order_id IN (SELECT order_id FROM orderitems WHERE product_id IN (SELECT product_id FROM products WHERE supplier_id = v_supplier_id));

        -- Output the results for the current supplier
        DBMS_OUTPUT.PUT_LINE('Supplier ID: ' || v_supplier_id);
        DBMS_OUTPUT.PUT_LINE('Supplier Name: ' || v_supplier_name);
        DBMS_OUTPUT.PUT_LINE('Supplier Email: ' || v_supplier_email);
        DBMS_OUTPUT.PUT_LINE('Supplier Address: ' || v_supplier_address);
        DBMS_OUTPUT.PUT_LINE('Supplier Image: ' || v_image_url);
        DBMS_OUTPUT.PUT_LINE('Product Count: ' || v_product_count);
        DBMS_OUTPUT.PUT_LINE('Total Sales: ' || v_total_sales);
        DBMS_OUTPUT.PUT_LINE('Successful Order Count: ' || v_success_order_count);
        DBMS_OUTPUT.PUT_LINE('----------------------------------------');
    END LOOP;

    -- Close the cursor
    CLOSE supplier_cursor;

END get_suppliers_details;

CREATE OR REPLACE PROCEDURE customer_details 
IS
    CURSOR customer_cursor IS
        SELECT c.customer_id, c.first_name, c.last_name, c.email, c.address, c.image_url, 
               NVL(SUM(o.total_amount), 0) AS total_spends
        FROM Customers c
        LEFT JOIN Orders o ON c.customer_id = o.customer_id
        GROUP BY c.customer_id, c.first_name, c.last_name, c.email, c.address, c.image_url;
    
    customer_rec customer_cursor%ROWTYPE;
BEGIN
    OPEN customer_cursor;
    LOOP
        FETCH customer_cursor INTO customer_rec;
        EXIT WHEN customer_cursor%NOTFOUND;
        
        DBMS_OUTPUT.PUT_LINE('Customer ID: ' || customer_rec.customer_id ||
                             ', First Name: ' || customer_rec.first_name ||
                             ', Last Name: ' || customer_rec.last_name || 
                             ', Email: ' || customer_rec.email || 
                             ', Address: ' || customer_rec.address ||
                             ', Image Url: ' || customer_rec.image_url || 
                             ', Total Spends: ' || customer_rec.total_spends);
    END LOOP;
    
    CLOSE customer_cursor;
END;
/



---------------------------------------------------------------------------------
-- Create a stored procedure to generate order status report for a specific date range
---------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE order_status_report(
    p_start_date IN DATE,
    p_end_date IN DATE
)
IS
    v_pending_count NUMBER;
    v_completed_count NUMBER;
    v_canceled_count NUMBER;
    v_total_orders NUMBER;
    v_total_revenue NUMBER(12,2);
    v_avg_order_amount NUMBER(10,2);
BEGIN
    -- Get count of orders by status
    SELECT COUNT(CASE WHEN status = 'PENDING' THEN 1 END),
           COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END),
           COUNT(CASE WHEN status = 'CANCELED' THEN 1 END),
           COUNT(*),
           NVL(SUM(total_amount), 0),
           NVL(AVG(total_amount), 0)
    INTO v_pending_count, v_completed_count, v_canceled_count, 
         v_total_orders, v_total_revenue, v_avg_order_amount
    FROM orders
    WHERE order_date BETWEEN p_start_date AND p_end_date;
    
    -- Output the results
    DBMS_OUTPUT.PUT_LINE('Order Status Report from ' || TO_CHAR(p_start_date, 'DD-MON-YYYY') || 
                         ' to ' || TO_CHAR(p_end_date, 'DD-MON-YYYY'));
    DBMS_OUTPUT.PUT_LINE('----------------------------------------');
    DBMS_OUTPUT.PUT_LINE('Total Orders: ' || v_total_orders);
    DBMS_OUTPUT.PUT_LINE('Pending Orders: ' || v_pending_count);
    DBMS_OUTPUT.PUT_LINE('Completed Orders: ' || v_completed_count);
    DBMS_OUTPUT.PUT_LINE('Canceled Orders: ' || v_canceled_count);
    DBMS_OUTPUT.PUT_LINE('Total Revenue: $' || v_total_revenue);
    DBMS_OUTPUT.PUT_LINE('Average Order Amount: $' || v_avg_order_amount);
END order_status_report;
/

---------------------------------------------------------------------------------
-- Create a stored procedure to find top selling products for a given time period
---------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE top_selling_products(
    p_start_date IN DATE,
    p_end_date IN DATE,
    p_limit IN NUMBER DEFAULT 10
)
IS
    CURSOR product_cursor IS
        SELECT p.product_id, p.name, p.image_url, 
               SUM(oi.quantity) as total_quantity,
               SUM(oi.quantity * oi.unit_price) as total_sales,
               s.business_name as supplier_name,
               c.name as category_name
        FROM products p
        JOIN orderitems oi ON p.product_id = oi.product_id
        JOIN orders o ON oi.order_id = o.order_id
        JOIN suppliers s ON p.supplier_id = s.supplier_id
        JOIN categories c ON p.category_id = c.category_id
        WHERE o.order_date BETWEEN p_start_date AND p_end_date
        AND o.status = 'COMPLETED'
        GROUP BY p.product_id, p.name, p.image_url, s.business_name, c.name
        ORDER BY total_quantity DESC
        FETCH FIRST p_limit ROWS ONLY;
        
    v_rank NUMBER := 1;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Top ' || p_limit || ' Selling Products from ' || 
                         TO_CHAR(p_start_date, 'DD-MON-YYYY') || 
                         ' to ' || TO_CHAR(p_end_date, 'DD-MON-YYYY'));
    DBMS_OUTPUT.PUT_LINE('----------------------------------------');
    
    FOR product_rec IN product_cursor LOOP
        DBMS_OUTPUT.PUT_LINE(
            v_rank || '. ' || product_rec.name || ' (' || product_rec.category_name || ')' ||
            CHR(10) || '   Supplier: ' || product_rec.supplier_name ||
            CHR(10) || '   Quantity Sold: ' || product_rec.total_quantity ||
            CHR(10) || '   Total Sales: $' || product_rec.total_sales
        );
        DBMS_OUTPUT.PUT_LINE('----------------------------------------');
        v_rank := v_rank + 1;
    END LOOP;
    
    IF v_rank = 1 THEN
        DBMS_OUTPUT.PUT_LINE('No sales data found for the specified date range.');
    END IF;
END top_selling_products;
/

---------------------------------------------------------------------------------
-- Create a stored procedure to manage delivery assignments
---------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE assign_delivery_agent(
    p_order_id IN NUMBER,
    p_agent_id IN NUMBER
)
IS
    v_delivery_exists NUMBER;
    v_order_status VARCHAR2(20);
    v_agent_exists NUMBER;
    v_agent_name VARCHAR2(100);
BEGIN
    -- Check if order exists and has valid status
    SELECT COUNT(*), MAX(status)
    INTO v_delivery_exists, v_order_status
    FROM orders
    WHERE order_id = p_order_id;
    
    IF v_delivery_exists = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Error: Order #' || p_order_id || ' does not exist.');
        RETURN;
    END IF;
    
    IF v_order_status = 'CANCELED' THEN
        DBMS_OUTPUT.PUT_LINE('Error: Cannot assign delivery for canceled order #' || p_order_id);
        RETURN;
    END IF;
    
    -- Check if delivery agent exists
    SELECT COUNT(*), MAX(name)
    INTO v_agent_exists, v_agent_name
    FROM delivery_agents
    WHERE delivery_agent_id = p_agent_id;
    
    IF v_agent_exists = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Error: Delivery agent #' || p_agent_id || ' does not exist.');
        RETURN;
    END IF;
    
    -- Check if delivery record exists for the order
    SELECT COUNT(*)
    INTO v_delivery_exists
    FROM deliveries
    WHERE order_id = p_order_id;
    
    -- If delivery record exists, update it; otherwise, create a new record
    IF v_delivery_exists > 0 THEN
        UPDATE deliveries
        SET assign_agent_id = p_agent_id,
            status = 'IN TRANSIT',
            estimated_date = SYSDATE + 1
        WHERE order_id = p_order_id;
    ELSE
        -- Generate a unique tracking number using order_id and current timestamp
        INSERT INTO deliveries (
            order_id, 
            status, 
            estimated_date, 
            tracking_number, 
            assign_agent_id
        )
        VALUES (
            p_order_id, 
            'IN TRANSIT', 
            SYSDATE + 1, 
            'TRK-' || p_order_id || '-' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS'), 
            p_agent_id
        );
    END IF;
    
    DBMS_OUTPUT.PUT_LINE('Success: Delivery for order #' || p_order_id || ' assigned to ' || v_agent_name);
    DBMS_OUTPUT.PUT_LINE('Estimated delivery date: ' || TO_CHAR(SYSDATE + 1, 'DD-MON-YYYY'));
END assign_delivery_agent;
/

-- Examples of how to execute the new procedures:
-- SET SERVEROUTPUT ON;
-- EXEC order_status_report(TO_DATE('01-JAN-2023', 'DD-MON-YYYY'), TO_DATE('31-DEC-2023', 'DD-MON-YYYY'));
-- EXEC top_selling_products(TO_DATE('01-JAN-2023', 'DD-MON-YYYY'), TO_DATE('31-DEC-2023', 'DD-MON-YYYY'), 5);
-- EXEC assign_delivery_agent(1, 1);

EXEC get_supplier_details(7);  -- Replace '1' with the supplier_id you want to query

SET SERVEROUTPUT ON;
EXEC get_supplier_details(7);

SET SERVEROUTPUT ON;
EXEC CUSTOMER_DETAILS;

