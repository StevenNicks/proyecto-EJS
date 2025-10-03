-- Tabla: roles
CREATE TABLE
   roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(50) NOT NULL UNIQUE,
      descripcion VARCHAR(255) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
   ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- Tabla: usuarios
CREATE TABLE
   usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      rol_id INT NOT NULL DEFAULT 2,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (rol_id) REFERENCES roles (id) ON DELETE CASCADE ON UPDATE CASCADE
   ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- Tabla intermedia: relaciona usuarios y empleados
CREATE TABLE
   usuario_empleado (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL,
      empleado_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (empleado_id) REFERENCES empleados (id) ON DELETE CASCADE ON UPDATE CASCADE,
      UNIQUE KEY usuario_empleado_unique (usuario_id, empleado_id)
   ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
   usuario_empleado (usuario_id, empleado_id)
VALUES
   -- Usuario 1 (Empleado 1) con rol Admin
   (1, 1);