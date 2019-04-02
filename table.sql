CREATE database bamazonAME;

USE bamazonAME;

CREATE TABLE products (
  id INT(10) AUTO_INCREMENT NOT NULL,
  product VARCHAR(50) NOT NULL,
  department VARCHAR(50) NOT NULL,
  price DECIMAL(5,2) NOT NULL,
  stock INT (100) NOT NULL,
  PRIMARY KEY (id)
);

Select * from products;

INSERT INTO products (product, department, price, stock)
VALUES ("tv", "Electronics", 500.00, 10),
("Radio", "Music", 295.00, 10),
("Spatula", "Kitchen", 12.00, 30),
("Uno", "Games", 5.00, 120),
("headphones" , "Music", 5.00, 45),
("Tent", "Outdoors", 50.00, 20),
("Basketball", "Outdoors", 25.00, 40),
("Necklace", "Jewelry", 500.00, 20),
("Fry Pan", "Kitchen", 20.00, 15),
("Watch", "Jewelry", 100.00, 10),
("Monopoly", "Games", 15.00, 25);