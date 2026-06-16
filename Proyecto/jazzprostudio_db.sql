DROP DATABASE IF EXISTS jazzprostudio_db;
CREATE DATABASE jazzprostudio_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE jazzprostudio_db;

CREATE TABLE usuarios (
  id         INT          NOT NULL AUTO_INCREMENT,
  nombre     VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  password   VARCHAR(255) NOT NULL,          
  rol        ENUM('ADMIN','CLIENTE')
             NOT NULL DEFAULT 'CLIENTE',
  activo     TINYINT(1)   NOT NULL DEFAULT 1,
  creado_en  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE productos (
  id          INT             NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(200)    NOT NULL,
  categoria   VARCHAR(100)    NOT NULL,       
  subtipo     VARCHAR(100)    NOT NULL,    
  descripcion TEXT            NOT NULL,
  precio      DECIMAL(10,2)   NOT NULL CHECK (precio >= 0),
  stock       INT             NOT NULL DEFAULT 0 CHECK (stock >= 0),
  imagen_url  VARCHAR(500)    NOT NULL DEFAULT '',
  activo      TINYINT(1)      NOT NULL DEFAULT 1,
  creado_en   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_categoria (categoria),
  INDEX idx_activo    (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE pedidos (
  id          INT             NOT NULL AUTO_INCREMENT,
  usuario_id  INT             NOT NULL,
  fecha       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total_pago  DECIMAL(10,2)   NOT NULL CHECK (total_pago >= 0),
  estado      ENUM('PENDIENTE','PAGADO','CANCELADO','ENVIADO')
              NOT NULL DEFAULT 'PENDIENTE',
  PRIMARY KEY (id),
  CONSTRAINT fk_pedido_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_pedido_usuario (usuario_id),
  INDEX idx_pedido_estado  (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE detalles_pedido (
  id               INT           NOT NULL AUTO_INCREMENT,
  pedido_id        INT           NOT NULL,
  producto_id      INT           NOT NULL,
  cantidad         INT           NOT NULL CHECK (cantidad > 0),
  precio_unitario  DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
  PRIMARY KEY (id),
  CONSTRAINT fk_detalle_pedido
    FOREIGN KEY (pedido_id)   REFERENCES pedidos(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_detalle_producto
    FOREIGN KEY (producto_id) REFERENCES productos(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_detalle_pedido   (pedido_id),
  INDEX idx_detalle_producto (producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE logs_acceso (
  id          INT          NOT NULL AUTO_INCREMENT,
  usuario_id  INT          NOT NULL,
  ip          VARCHAR(45)  NOT NULL,            -- soporta IPv6
  evento      ENUM('INGRESO','SALIDA') NOT NULL,
  browser     VARCHAR(255) NOT NULL DEFAULT '',  -- User-Agent header
  fecha_hora  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_log_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_log_usuario    (usuario_id),
  INDEX idx_log_fecha      (fecha_hora),
  INDEX idx_log_evento     (evento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO usuarios (nombre, email, password, rol) VALUES
  ('Administrador',  'admin@jazzprostudio.com',
   '$2b$10$KxJhgE5xRW1oUvFqPmNzBOe/YmQlhXs6TvmS1xMkQ3eBdC7PsA2OG', 'ADMIN'),
  ('Carlos Mendoza', 'carlos@email.com',
   '$2b$10$T9RkuWsQ2Xv5MpNzLhBdFO3G8eJYlmCxs7PvN4oQrA1eBdC7PsA2OG', 'CLIENTE'),
  ('Ana Flores',     'ana@email.com',
   '$2b$10$T9RkuWsQ2Xv5MpNzLhBdFO3G8eJYlmCxs7PvN4oQrA1eBdC7PsA2OG', 'CLIENTE');


INSERT INTO productos (nombre, categoria, subtipo, descripcion, precio, stock, imagen_url) VALUES
  -- SAXOFÓN
  ('Selmer Paris Serie III Alto',
   'Saxofón', 'Alto',
   'El saxofón alto preferido por los grandes del bebop. Bronce amarillo, laca dorada original, mecanismo de precisión artesanal.',
   4850.00, 5, '/images/sax_alto_selmer.jpg'),

  ('Yamaha YAS-62 Alto',
   'Saxofón', 'Alto',
   'Estándar profesional japonés con campana una pieza. Ideal para jazz contemporáneo y fusión.',
   2300.00, 8, '/images/sax_alto_yamaha.jpg'),

  ('Selmer Paris Tenor Reference 54',
   'Saxofón', 'Tenor',
   'Inspirado en los clásicos de los 50s. Proyección y calidez excepcionales para el jazz modal.',
   5200.00, 3, '/images/sax_tenor_selmer.jpg'),

  ('Jupiter JAS-500 Soprano',
   'Saxofón', 'Soprano',
   'Afinación precisa en Si♭. Ligero y equilibrado, perfecto para solos de jazz tradicional.',
   890.00, 10, '/images/sax_soprano_jupiter.jpg'),

  -- TROMPETA Y CORNETA
  ('Bach Stradivarius 37 Trompeta',
   'Trompeta', 'Trompeta',
   'La trompeta de referencia para swing y big band. Campana de 5 pulgadas en latón amarillo.',
   3100.00, 6, '/images/trompeta_bach.jpg'),

  ('Conn Vintage One Corneta',
   'Trompeta', 'Corneta',
   'Diseño inspirado en la era dorada del jazz de Nueva Orleans. Sonido oscuro y cálido.',
   1750.00, 4, '/images/corneta_conn.jpg'),

  -- TROMBÓN
  ('King 3B Tenor Trombón',
   'Trombón', 'Tenor',
   'Glissandos fluidos y proyección poderosa. El trombón del jazz clásico americano.',
   1400.00, 7, '/images/trombon_king.jpg'),

  ('Shires Q Series Bajo Trombón',
   'Trombón', 'Bajo',
   'Profundidad armónica sin igual para secciones de metales en big band.',
   3800.00, 2, '/images/trombon_bajo_shires.jpg'),

  -- CLARINETE Y FLAUTA
  ('Buffet Crampon R13 Clarinete',
   'Clarinete', 'Clarinete',
   'El clarinete del jazz de Nueva Orleans y Dixieland. Madera de granadilla africana seleccionada.',
   2900.00, 5, '/images/clarinete_buffet.jpg'),

  ('Yamaha YFL-577 Flauta',
   'Flauta', 'Flauta',
   'Cuerpo de plata de ley 958. Proyección brillante para jazz contemporáneo y fusión.',
   2200.00, 6, '/images/flauta_yamaha.jpg'),

  -- TUBA Y FLISCORNO
  ('Miraphone 186 Tuba',
   'Tuba', 'Tuba',
   'Graves profundos y aterciopelados para jazz orquestal y big band de alto nivel.',
   6800.00, 2, '/images/tuba_miraphone.jpg'),

  ('Adams A4 Fliscorno',
   'Fliscorno', 'Fliscorno',
   'Timbre oscuro y envolvente. El fliscorno favorito del jazz post-bop y baladas.',
   2400.00, 4, '/images/fliscorno_adams.jpg');

CREATE OR REPLACE VIEW v_ventas_por_categoria AS
SELECT
  p.categoria,
  SUM(dp.cantidad)                          AS total_unidades,
  SUM(dp.cantidad * dp.precio_unitario)     AS total_ingresos,
  COUNT(DISTINCT dp.pedido_id)              AS total_pedidos
FROM detalles_pedido dp
JOIN productos p ON dp.producto_id = p.id
JOIN pedidos   pe ON dp.pedido_id  = pe.id
WHERE pe.estado = 'PAGADO'
GROUP BY p.categoria
ORDER BY total_ingresos DESC;


CREATE OR REPLACE VIEW v_productos_mas_vendidos AS
SELECT
  p.id,
  p.nombre,
  p.categoria,
  p.subtipo,
  p.precio,
  COALESCE(SUM(dp.cantidad), 0)            AS total_vendidos,
  COALESCE(SUM(dp.cantidad * dp.precio_unitario), 0) AS ingresos_totales
FROM productos p
LEFT JOIN detalles_pedido dp ON p.id = dp.producto_id
LEFT JOIN pedidos pe ON dp.pedido_id = pe.id AND pe.estado = 'PAGADO'
WHERE p.activo = 1
GROUP BY p.id, p.nombre, p.categoria, p.subtipo, p.precio
ORDER BY total_vendidos DESC;


