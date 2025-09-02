-- DDL: Crear tabla
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario SERIAL PRIMARY KEY,
  nombre     VARCHAR(100) NOT NULL,
  correo     VARCHAR(150) UNIQUE NOT NULL,
  password   VARCHAR(100) NOT NULL,
  fecha_reg  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DML: Datos demo (ignora duplicados por correo si ya existen)
INSERT INTO usuarios (nombre, correo, password) VALUES
('Carlos Obregón', 'carlos@correo.com', 'pass123')
ON CONFLICT (correo) DO NOTHING;

INSERT INTO usuarios (nombre, correo, password) VALUES
('Ana López', 'ana.lopez@correo.com', 'segura456')
ON CONFLICT (correo) DO NOTHING;

INSERT INTO usuarios (nombre, correo, password) VALUES
('Juan Pérez', 'juanp@correo.com', 'clave789')
ON CONFLICT (correo) DO NOTHING;
