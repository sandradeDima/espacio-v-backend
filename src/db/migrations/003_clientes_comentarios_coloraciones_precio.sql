ALTER TABLE clientes
ADD COLUMN comentarios VARCHAR(500) NULL AFTER telefono;

ALTER TABLE coloraciones
ADD COLUMN precio DECIMAL(10,2) NULL AFTER descripcion;
