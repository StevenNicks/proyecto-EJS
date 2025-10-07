-- =====================================================
-- 🚀 CREACIÓN DE BASE DE DATOS Y TABLAS DEL SISTEMA TAMIZAJE
-- =====================================================
-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS tamizaje CHARACTER
SET
   utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- Usar la base de datos
USE tamizaje;

-- Tabla: roles
CREATE TABLE IF NOT EXISTS
   roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(50) NOT NULL UNIQUE,
      descripcion VARCHAR(255) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- Tabla: empleados
CREATE TABLE IF NOT EXISTS
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
CREATE TABLE IF NOT EXISTS
   usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      -- nombre VARCHAR(100) NOT NULL,
      empleado_cedula VARCHAR(20) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      rol_id INT NOT NULL DEFAULT 2,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (empleado_cedula) REFERENCES empleados (cedula) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (rol_id) REFERENCES roles (id) ON DELETE CASCADE ON UPDATE CASCADE
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
   usuarios (empleado_cedula, email, password)
VALUES
   (
      '1143994968',
      'stevenalvaradopaez@gmail.com',
      '$2a$12$0oxFNNOLCx1w7IK3SPMTfea7fnYq25/Yg7NU4RfZqQmxX2pydztMy'
   );

-- DROP TABLE nombre_de_la_tabla;