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
        SELECT supplier_id, business_name, address
        FROM suppliers;
    
    -- Variables to hold supplier data for each record
    v_supplier_id NUMBER;
    v_supplier_name VARCHAR2(50);
    v_supplier_address VARCHAR2(255);
    v_product_count NUMBER;
    v_total_sales NUMBER(10,2);
    v_success_order_count NUMBER;

BEGIN
    -- Open the cursor
    OPEN supplier_cursor;
    
    -- Loop through each supplier in the cursor
    LOOP
        FETCH supplier_cursor INTO v_supplier_id, v_supplier_name, v_supplier_address;
        
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
        DBMS_OUTPUT.PUT_LINE('Supplier Address: ' || v_supplier_address);
        DBMS_OUTPUT.PUT_LINE('Product Count: ' || v_product_count);
        DBMS_OUTPUT.PUT_LINE('Total Sales: ' || v_total_sales);
        DBMS_OUTPUT.PUT_LINE('Successful Order Count: ' || v_success_order_count);
        DBMS_OUTPUT.PUT_LINE('----------------------------------------');
    END LOOP;

    -- Close the cursor
    CLOSE supplier_cursor;

END get_suppliers_details;



EXEC get_supplier_details(7);  -- Replace '1' with the supplier_id you want to query

SET SERVEROUTPUT ON;
EXEC get_supplier_details(7);

SET SERVEROUTPUT ON;
EXEC get_suppliers_details;

