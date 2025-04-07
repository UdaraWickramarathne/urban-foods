SELECT o.order_id, o.customer_id, o.status, o.order_date, o.total_amount, o.address,
       (SELECT COUNT(DISTINCT oi.product_id) 
        FROM OrderItems oi 
        WHERE oi.order_id = o.order_id) AS product_type_count
FROM Orders o
WHERE o.customer_id = 89;

-- Function to get top 10 most ordered products
CREATE OR REPLACE FUNCTION get_top_10_products
RETURN SYS_REFCURSOR
AS
    top_products SYS_REFCURSOR;
BEGIN
    OPEN top_products FOR
        SELECT p.product_id, p.supplier_id, p.category_id, p.name, p.price, 
               p.stock, p.image_url, c.name as category_name,
               SUM(oi.quantity) as total_ordered
        FROM Products p
        JOIN OrderItems oi ON p.product_id = oi.product_id
        JOIN Categories c ON p.category_id = c.category_id
        GROUP BY p.product_id, p.supplier_id, p.category_id, p.name, p.price, 
                 p.stock, p.image_url, c.name
        ORDER BY total_ordered DESC
        FETCH FIRST 10 ROWS ONLY;
    
    RETURN top_products;
END;
/

-- Function to get total sales with optional date range
CREATE OR REPLACE FUNCTION get_total_sales(
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
) RETURN NUMBER
AS
    v_total_sales NUMBER;
BEGIN
    -- If dates are provided, filter by date range
    -- Otherwise, get all-time total sales
    IF p_start_date IS NOT NULL AND p_end_date IS NOT NULL THEN
        SELECT SUM(total_amount) INTO v_total_sales
        FROM Orders
        WHERE order_date BETWEEN p_start_date AND p_end_date;
    ELSE
        SELECT SUM(total_amount) INTO v_total_sales
        FROM Orders 
        WHERE Status = 'COMPLETED'; -- Ensure we only sum non-null amounts
    END IF;
    
    -- Handle NULL result (no orders found)
    RETURN NVL(v_total_sales, 0);
END;
/

DECLARE
   product_cursor SYS_REFCURSOR;
   v_product_id Products.product_id%TYPE;
   v_supplier_id Products.supplier_id%TYPE;
   v_category_id Products.category_id%TYPE;
   v_name Products.name%TYPE;
   v_price Products.price%TYPE;
   v_stock Products.stock%TYPE;
   v_image_url Products.image_url%TYPE;
   v_category_name Categories.name%TYPE;
   v_total_ordered NUMBER;
BEGIN
   product_cursor := get_top_10_products;
   LOOP
       FETCH product_cursor INTO v_product_id, v_supplier_id, v_category_id, v_name, 
                               v_price, v_stock, v_image_url, v_category_name, v_total_ordered;
       EXIT WHEN product_cursor%NOTFOUND;
       DBMS_OUTPUT.PUT_LINE('Product ID: ' || v_product_id || ', Name: ' || v_name || 
                           ', Price: ' || v_price || ', Stock: ' || v_stock ||
                           ', Category: ' || v_category_name);
   END LOOP;
   CLOSE product_cursor;
END;
/

-- Example usage:
DECLARE
    v_total NUMBER;
BEGIN
    -- Get all-time total sales
    v_total := get_total_sales();
    DBMS_OUTPUT.PUT_LINE('All-time total sales: $' || v_total);
    
    -- Get total sales for a specific date range
    v_total := get_total_sales(TO_DATE('2023-01-01', 'YYYY-MM-DD'), TO_DATE('2023-12-31', 'YYYY-MM-DD'));
    DBMS_OUTPUT.PUT_LINE('Total sales for 2023: $' || v_total);
END;
/