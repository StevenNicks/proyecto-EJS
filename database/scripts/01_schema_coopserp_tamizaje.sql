-- Tabla: roles
CREATE TABLE
   roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(50) NOT NULL UNIQUE,
      descripcion VARCHAR(255) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

-- Tabla: empleados (1 empleado puede tener muchos usuarios)
-- Crear tabla empleados con nombres/apellidos separados
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

-- Tabla: usuarios (cada usuario pertenece a un solo empleado)
CREATE TABLE
   usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      empleado_id INT NOT NULL,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (empleado_id) REFERENCES empleados (id) ON DELETE CASCADE ON UPDATE CASCADE
   );

-- Tabla pivote: usuario_rol (para la relación N:M entre usuarios y roles)
CREATE TABLE
   usuario_rol (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL,
      rol_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (rol_id) REFERENCES roles (id) ON DELETE CASCADE ON UPDATE CASCADE,
      UNIQUE KEY (usuario_id, rol_id) -- evita duplicar roles en un usuario
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
   ('123456789', 'Carlos', 'Andrés', 'Gómez', 'López'),
   ('987654321', 'Laura', NULL, 'Martínez', 'Pérez'),
   ('456789123', 'Juan', 'David', 'Rodríguez', NULL);

-- Insertar usuarios (relacionados con los empleados anteriores)
INSERT INTO
   usuarios (empleado_id, nombre, email, password)
VALUES
   -- Usuarios para Carlos (empleado_id = 1)
   (
      1,
      'carlos_admin',
      'carlos.admin@empresa.com',
      'hashed_password_1'
   ),
   (
      1,
      'carlos.operativo',
      'carlos.operativo@empresa.com',
      'hashed_password_2'
   ),
   -- Usuario para Laura (empleado_id = 2)
   (
      2,
      'laura_user',
      'laura.user@empresa.com',
      'hashed_password_3'
   ),
   -- Usuario para Juan (empleado_id = 3)
   (
      3,
      'juan_david',
      'juan.david@empresa.com',
      'hashed_password_4'
   );

-- Relacionar usuarios con roles
INSERT INTO
   usuario_rol (usuario_id, rol_id)
VALUES
   -- Carlos Admin -> admin y supervisor
   (1, 1),
   (1, 3),
   -- Carlos Operativo -> empleado
   (2, 2),
   -- Laura -> admin
   (3, 1),
   -- Juan -> empleado
   (4, 2);