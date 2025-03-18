CREATE USER urbanfood_user IDENTIFIED BY hello@123;

GRANT ALL PRIVILEGES TO urbanfood_user;


-- Insert 5 records
INSERT INTO suppliers (student_id, student_name) VALUES (1, 'John Doe');
INSERT INTO suppliers (student_id, student_name) VALUES (2, 'Jane Smith');
INSERT INTO suppliers (student_id, student_name) VALUES (3, 'Michael Johnson');
INSERT INTO suppliers (student_id, student_name) VALUES (4, 'Emily Brown');
INSERT INTO suppliers (student_id, student_name) VALUES (5, 'David Wilson');
INSERT INTO suppliers (student_id, student_name) VALUES (6, 'David Wilson');


select * from suppliers