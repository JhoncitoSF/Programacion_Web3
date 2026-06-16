CREATE DATABASE IF NOT EXISTS practica02db;
USE practica02db;

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    createdAt DATETIME NOT NULL DEFAULT current_timestamp(),
    updatedAt DATETIME NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    categoriaId INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT current_timestamp(),
    updatedAt DATETIME NOT NULL DEFAULT current_timestamp(),
    FOREIGN KEY (categoriaId) REFERENCES categorias(id) ON DELETE CASCADE
);

INSERT INTO categorias (nombre, descripcion) VALUES
    ('Electrónica', 'Dispositivos electrónicos y gadgets'),
    ('Oficina', 'Material y accesorios de oficina');

INSERT INTO productos (nombre, precio, categoriaId) VALUES
    ('Laptop', 4500.00, 1),
    ('Audífonos', 350.00, 1),
    ('Bolígrafo', 5.00, 2),
    ('Cuaderno', 25.00, 2);
