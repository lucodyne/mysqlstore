DROP DATABASE IF EXISTS shopkeep_DB;

CREATE DATABASE shopkeep_DB;

USE shopkeep_DB;

CREATE TABLE items (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  type VARCHAR(30) NOT NULL,
  price INT NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO items (name, type, price, quantity)
VALUES ("potion", "medicine", 10, 20),
("ether", "medicine", 10, 20),  
("antidote", "medicine", 5, 10), 
("long sword", "weapon", 300, 2),
("dagger", "weapon", 200, 5), 
("cane", "weapon", 250, 3 ), 
("leather armor", "clothing", 150, 2), 
("wizard hat", "clothing", 100, 3), 
("copper ore", "material", 20, 10), 
("rock salt", "material", 3, 30);