SELECT o.order_id, o.customer_id, o.status, o.order_date, o.total_amount, o.address,
       (SELECT COUNT(DISTINCT oi.product_id) 
        FROM OrderItems oi 
        WHERE oi.order_id = o.order_id) AS product_type_count
FROM Orders o
WHERE o.customer_id = 89