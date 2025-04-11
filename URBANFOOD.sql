CREATE USER urbanfood_user IDENTIFIED BY hello123;

GRANT ALL PRIVILEGES TO urbanfood_user;

CREATE TABLE users (
    user_id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    username VARCHAR2(50) UNIQUE NOT NULL,
    password VARCHAR2(255) NOT NULL,
    role VARCHAR2(20) CHECK (role IN ('admin', 'customer', 'supplier')) NOT NULL
);

SELECT constraint_name, search_condition
FROM user_constraints
WHERE table_name = 'USERS'
AND constraint_type = 'C';

ALTER TABLE users DROP CONSTRAINT SYS_C008911;

ALTER TABLE users
ADD CONSTRAINT CHK_USERS_ROLE
CHECK (role IN ('admin', 'customer', 'supplier', 'delivery_agent'));


CREATE TABLE delivery_agents (
    delivery_agent_id NUMBER PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    FOREIGN KEY (delivery_agent_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

CREATE TABLE Customers (
    customer_id NUMBER PRIMARY KEY,
    first_name VARCHAR2(50) NOT NULL,
    last_name VARCHAR2(50) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    address VARCHAR2(255),
    FOREIGN KEY (customer_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

ALTER TABLE Customers
ADD image_url VARCHAR2(255);

CREATE TABLE suppliers (
    supplier_id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    business_name VARCHAR2(50) UNIQUE NOT NULL,
    address VARCHAR2(255) NOT NULL,
    email VARCHAR2(50) NOT NULL,
    FOREIGN KEY (supplier_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

ALTER TABLE suppliers
ADD image_url VARCHAR2(255);

CREATE TABLE Categories (
    category_id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR2(50) UNIQUE NOT NULL,
    description VARCHAR2(255)
);

ALTER TABLE Categories
ADD product_count NUMBER DEFAULT 0;


CREATE TABLE Products (
    product_id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    supplier_id NUMBER NOT NULL,
    category_id NUMBER NOT NULL,
    name VARCHAR2(100) NOT NULL,
    price NUMBER(10,2) NOT NULL,
    stock NUMBER NOT NULL,
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE CASCADE
);

ALTER TABLE Products
ADD image_url VARCHAR2(255);


CREATE TABLE cart (
    cart_id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id NUMBER NOT NULL,
    product_id NUMBER NOT NULL,
    quantity NUMBER NOT NULL CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

CREATE TABLE Orders (
    order_id     NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    customer_id  NUMBER NOT NULL,
    status       VARCHAR2(20) CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELED')),
    order_date   DATE DEFAULT SYSDATE,
    total_amount NUMBER(10,2),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE
);
ALTER TABLE Orders 
ADD address VARCHAR2(255)

CREATE TABLE OrderItems (
    order_item_id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    order_id NUMBER NOT NULL,
    product_id NUMBER NOT NULL,
    quantity NUMBER NOT NULL,
    unit_price NUMBER(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

CREATE TABLE PAYMENTS (
    payment_id    NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    order_id      NUMBER UNIQUE NOT NULL,
    payment_method VARCHAR2(50) NOT NULL,
    status        VARCHAR2(20) CHECK (status IN ('PAID', 'PENDING', 'FAILED')),
    amount        NUMBER(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES ORDERS(order_id) ON DELETE CASCADE
);

CREATE TABLE Deliveries (
    delivery_id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    order_id NUMBER UNIQUE NOT NULL,
    status VARCHAR2(20) CHECK (status IN ('PENDING', 'IN TRANSIT', 'DELIVERED')) NOT NULL,
    estimated_date DATE,
    tracking_number VARCHAR2(50) UNIQUE NOT NULL,
    assign_agent_id NUMBER DEFAULT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (assign_agent_id) REFERENCES delivery_agents(delivery_agent_id) ON DELETE CASCADE
);

ALTER TABLE Deliveries ADD delivered_date DATE

SELECT * FROM DBA_TAB_PRIVS WHERE GRANTEE = 'NIMAL';

SELECT * FROM DBA_SYS_PRIVS WHERE GRANTEE = 'SAMAN';

DROP USER ASIN CASCADE;

SELECT GRANTEE, PRIVILEGE FROM DBA_SYS_PRIVS
WHERE GRANTEE = 'ASIN'
SELECT * FROM DBA_TAB_PRIVS WHERE GRANTOR = 'URBANFOOD_USER';

GRANT DBA TO URBANFOOD_USER;

GRANT SELECT ON DBA_TAB_PRIVS TO URBANFOOD_USER;

SELECT 
    du.username, 
    du.created, 
    du.account_status, 
    dsp.privilege AS system_privilege, 
    dtp.table_name, 
    dtp.privilege AS object_privilege
FROM dba_users du
LEFT JOIN dba_sys_privs dsp ON du.username = dsp.grantee
LEFT JOIN dba_tab_privs dtp ON du.username = dtp.grantee
WHERE du.username IN (SELECT UPPER(username) FROM users WHERE role = 'admin')
ORDER BY du.created ASC;



GRANT CONNECT, RESOURCE TO URBANFOOD_USER;

SELECT * FROM dba_users 
WHERE username IN (SELECT UPPER(username) FROM users WHERE role = 'admin');


BEGIN
  EXECUTE IMMEDIATE 'GRANT SELECT ON DBA_TAB_PRIVS TO URBANFOOD_USER';
EXCEPTION
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;


SELECT TRIGGER_NAME, TABLE_NAME, TRIGGER_TYPE, TRIGGERING_EVENT, STATUS, TRIGGER_BODY, description
FROM DBA_TRIGGERS WHERE OWNER = 'URBANFOOD_USER';

SELECT TRIGGER_NAME, TRIGGER_BODY 
FROM USER_TRIGGERS 
WHERE TRIGGER_NAME = 'TRG_UPDATE_PRODUCT_COUNT';


DROP TRIGGER trg_update_product_count

DELETE FROM users WHERE user_id = 21

SELECT o.order_id, o.customer_id, o.status, o.order_date, o.total_amount, o.address,
       (SELECT COUNT(DISTINCT oi.product_id) 
        FROM OrderItems oi 
        WHERE oi.order_id = o.order_id) AS product_type_count
FROM Orders o
WHERE o.customer_id = 89 ORDER BY o.order_date

SELECT o.order_id, c.first_name || ' ' || c.last_name as customer_name, o.status, o.order_date, o.total_amount, o.address 
FROM Orders o INNER JOIN Customers c ON o.customer_id = c.customer_id ORDER BY o.order_date DESC



GRANT READ, WRITE ON DIRECTORY data_pump_dir TO urbanfood_user

SELECT TEXT
FROM DBA_SOURCE
WHERE OWNER = 'URBANFOOD_USER'
  AND NAME = 'GET_TOTAL_SALES'
  AND TYPE = 'FUNCTION'
ORDER BY LINE;


SELECT OBJECT_NAME, OBJECT_TYPE FROM USER_OBJECTS WHERE OBJECT_TYPE IN ('PROCEDURE')

SELECT TEXT
FROM DBA_SOURCE
WHERE OWNER = 'URBANFOOD_USER'
  AND NAME = 'GET_SUPPLIERS_DETAILS'
  AND TYPE = 'PROCEDURE'
ORDER BY LINE;


SELECT TABLE_NAME, PRIVILEGE 
       FROM DBA_TAB_PRIVS 
       WHERE GRANTEE = 'ASIN'

TRUNCATE TABLE users_log;
TRUNCATE TABLE customers_log;
TRUNCATE TABLE suppliers_log;
TRUNCATE TABLE categories_log;
TRUNCATE TABLE products_log;
TRUNCATE TABLE cart_log;
TRUNCATE TABLE orders_log;
TRUNCATE TABLE orderitems_log;
TRUNCATE TABLE payments_log;

TRUNCATE TABLE orderitems;
TRUNCATE TABLE payments;
TRUNCATE TABLE deliveries;
TRUNCATE TABLE orders;
TRUNCATE TABLE cart;
TRUNCATE TABLE products;
TRUNCATE TABLE delivery_agents;
TRUNCATE TABLE customers;
TRUNCATE TABLE suppliers;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
