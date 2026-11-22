CREATE DATABASE IF NOT EXISTS kiosco_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

USE kiosco_db;

DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE categorias(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE productos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 5,
    categoria_id INT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_productos_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON DELETE RESTRICT,

    CONSTRAINT chk_precio_valido CHECK (precio >= 0),
    CONSTRAINT chk_stock_valido CHECK (stock >= 0 AND stock_minimo >= 0)
) ENGINE=InnoDB;

/* Datos de Pruebas Cargados */

INSERT INTO categorias (nombre) VALUES
('Bebidas'),
('Snacks'),
('Dulces'),
('Lacteos'),
('Panaderia');

INSERT INTO productos (nombre, precio, stock, stock_minimo, categoria_id) VALUES
-- 1. Bebidas (15 productos)
('Coca-Cola Sabor Original 500ml', 1800.00, 24, 6, 1),
('Coca-Cola Sin Azucares 500ml', 1800.00, 12, 6, 1),
('Sprite Lima Limon 500ml', 1750.00, 4, 6, 1),
('Fanta Naranja 500ml', 1750.00, 10, 5, 1),
('Pepsi 500ml', 1650.00, 18, 6, 1),
('Paso de los Toros Pomelo 500ml', 1700.00, 3, 5, 1),
('Agua Mineral Villavicencio sin gas 500ml', 1100.00, 30, 10, 1),
('Agua Mineral Eco de los Andes con gas 500ml', 1050.00, 8, 5, 1),
('Agua Saborizada Aquarius Naranja 500ml', 1400.00, 15, 6, 1),
('Agua Saborizada Levite Pomelo 500ml', 1350.00, 5, 5, 1),
('Jugo Baggio Multifruta 200ml', 750.00, 20, 8, 1),
('Jugo Cepita Naranja 1L', 2100.00, 6, 4, 1),
('Energizante Speed Unlimited 250ml', 1900.00, 2, 6, 1),
('Energizante Monster Energy 473ml', 2800.00, 11, 4, 1),
('Bebida Isotonica Gatorade Cool Blue 500ml', 1950.00, 9, 5, 1),

-- 2. Snacks (6 productos)
('Papas Fritas Lays Clasicas 85g', 2200.00, 14, 5, 2),
('Doritos Queso 85g', 2300.00, 3, 5, 2),
('Cheetos Queso 80g', 2100.00, 9, 4, 2),
('Palitos Salados Krachitos 120g', 1300.00, 12, 4, 2),
('Mani Salado Pehuamar 100g', 1450.00, 2, 4, 2),
('Tutucas Dulces 80g', 900.00, 16, 5, 2),

-- 3. Dulces (8 productos)
('Alfajor Jorgito Chocolate', 1100.00, 25, 8, 3),
('Alfajor Guaymallen Triple Dulce de Leche', 800.00, 36, 10, 3),
('Alfajor Milka Mousse Triple', 1600.00, 4, 6, 3),
('Chocolate Block 38g', 1500.00, 12, 5, 3),
('Chicles Beldent Menta', 650.00, 3, 10, 3),
('Gomitas Mogul Acidas 50g', 950.00, 18, 6, 3),
('Turron de Mani Arcor 25g', 500.00, 40, 12, 3),
('Oblea Bon o Bon', 850.00, 0, 8, 3),

-- 4. Lacteos (4 productos)
('Leche Entera La Serenisima Sachet 1L', 1600.00, 10, 4, 4),
('Yogur Bebible Yogurisimo Frutilla 190g', 1250.00, 2, 4, 4),
('Leche Chocolatada Cindor 200ml', 1150.00, 14, 5, 4),
('Postrecito Serenito Dulce de Leche', 1300.00, 6, 3, 4),

-- 5. Panaderia (2 productos)
('Pan Lactal Bimbo Blanco 400g', 2600.00, 5, 3, 5),
('Bizcochitos Don Satur Salados 200g', 1200.00, 2, 5, 5);

