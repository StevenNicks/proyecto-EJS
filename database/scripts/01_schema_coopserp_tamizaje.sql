-- Tabla: roles
CREATE TABLE
   roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(50) NOT NULL UNIQUE,
      descripcion VARCHAR(255) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

-- Tabla: empleados
CREATE TABLE
   empleados (
      id INT AUTO_INCREMENT PRIMARY KEY,
      cedula VARCHAR(20) NOT NULL UNIQUE,
      primer_nombre VARCHAR(50) NOT NULL,
      segundo_nombre VARCHAR(50) NULL,
      primer_apellido VARCHAR(50) NOT NULL,
      segundo_apellido VARCHAR(50) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

-- Tabla: usuarios
CREATE TABLE
   usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

-- Tabla intermedia: relaciona usuarios, empleados y roles
CREATE TABLE
   usuario_empleado_rol (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL,
      empleado_id INT NOT NULL,
      rol_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      -- Claves foráneas
      FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (empleado_id) REFERENCES empleados (id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (rol_id) REFERENCES roles (id) ON DELETE CASCADE ON UPDATE CASCADE,
      -- Evita duplicados (ej: un usuario no puede tener el mismo rol dos veces para el mismo empleado)
      UNIQUE KEY (usuario_id, empleado_id, rol_id)
   );

-- Insertar roles básicos
INSERT INTO
   roles (nombre, descripcion)
VALUES
   ('admin', 'Administrador del sistema'),
   ('empleado', 'Empleado de la organización'),
   ('supervisor', 'Rol de supervisión');

-- Insertar empleados
INSERT INTO
   empleados (
      cedula,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido
   )
VALUES
   ('1143994968', 'Steven', NULL, 'ALVARADO', 'PAEZ');

-- Insertar usuarios
INSERT INTO
   usuarios (nombre, email, password)
VALUES
   (
      'steven alvarado paez',
      'stevenalvaradopaez@gmail.com',
      '$2a$12$0oxFNNOLCx1w7IK3SPMTfea7fnYq25/Yg7NU4RfZqQmxX2pydztMy'
   );

-- Insertar relacion usuario + empleado + rol
INSERT INTO
   usuario_empleado_rol (usuario_id, empleado_id, rol_id)
VALUES
   -- Usuario 1 (Empleado 1) con rol Admin
   (1, 1, 1);