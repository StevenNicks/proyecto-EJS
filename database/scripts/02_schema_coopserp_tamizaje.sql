-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: coopserp_tamizaje
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `empleados`
--

DROP TABLE IF EXISTS `empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cedula` varchar(20) NOT NULL,
  `primer_nombre` varchar(50) NOT NULL,
  `segundo_nombre` varchar(50) DEFAULT NULL,
  `primer_apellido` varchar(50) NOT NULL,
  `segundo_apellido` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cedula` (`cedula`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleados`
--

LOCK TABLES `empleados` WRITE;
/*!40000 ALTER TABLE `empleados` DISABLE KEYS */;
INSERT INTO `empleados` VALUES (1,'1062334764','JERSON','DAVID','OTERO','CRUZ','2025-10-11 17:07:38','2025-10-11 17:11:52'),(2,'1143994968','STEVEN',NULL,'ALVARADO','PAEZ','2025-10-19 02:12:46','2025-10-20 02:01:35'),(3,'100000001','Juan','Carlos','Pérez','Gómez','2025-10-20 03:18:46','2025-10-20 03:18:46'),(4,'100000002','María','Isabel','Rodríguez','López','2025-10-20 03:18:46','2025-10-20 03:18:46'),(5,'100000003','Luis','Fernando','García','Martínez','2025-10-20 03:18:46','2025-10-20 03:18:46'),(6,'100000004','Ana','Lucía','Hernández','Ramírez','2025-10-20 03:18:46','2025-10-20 03:18:46'),(7,'100000005','Carlos','Andrés','Sánchez','Torres','2025-10-20 03:18:46','2025-10-20 03:18:46'),(8,'100000006','Laura','Paola','Díaz','Cruz','2025-10-20 03:18:46','2025-10-20 03:18:46'),(9,'100000007','Miguel','Ángel','Flores','Vargas','2025-10-20 03:18:46','2025-10-20 03:18:46'),(10,'100000008','Sofía','Valentina','Morales','Rojas','2025-10-20 03:18:46','2025-10-20 03:18:46'),(11,'100000009','Andrés','Sebastián','Castillo','Ortega','2025-10-20 03:18:46','2025-10-20 03:18:46'),(12,'100000010','Camila','Alejandra','Gutiérrez','Silva','2025-10-20 03:18:46','2025-10-20 03:18:46'),(23,'200000001','Juan',NULL,'Pérez',NULL,'2025-10-20 04:01:29','2025-10-20 04:01:29'),(24,'200000002','María',NULL,'Gómez',NULL,'2025-10-20 04:01:29','2025-10-20 04:01:29'),(25,'200000003','Carlos',NULL,'Rodríguez',NULL,'2025-10-20 04:01:29','2025-10-20 04:01:29'),(26,'200000004','Ana',NULL,'Martínez',NULL,'2025-10-20 04:01:29','2025-10-20 04:01:29'),(27,'200000005','Luis',NULL,'Sánchez',NULL,'2025-10-20 04:01:29','2025-10-20 04:01:29');
/*!40000 ALTER TABLE `empleados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_tamizaje`
--

DROP TABLE IF EXISTS `estado_tamizaje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_tamizaje` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_tamizaje`
--

LOCK TABLES `estado_tamizaje` WRITE;
/*!40000 ALTER TABLE `estado_tamizaje` DISABLE KEYS */;
INSERT INTO `estado_tamizaje` VALUES (1,'En proceso','2025-10-20 00:05:41','2025-10-20 00:05:41'),(2,'Completado','2025-10-20 00:05:41','2025-10-20 00:05:41'),(3,'Cancelado','2025-10-20 00:05:41','2025-10-20 00:05:41');
/*!40000 ALTER TABLE `estado_tamizaje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resultados`
--

DROP TABLE IF EXISTS `resultados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resultados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tamizaje_id` int NOT NULL,
  `empleado_cedula` varchar(20) NOT NULL,
  `altura` decimal(5,2) NOT NULL,
  `peso` decimal(5,2) NOT NULL,
  `IMC` decimal(5,2) NOT NULL,
  `sistole` int NOT NULL,
  `diastole` int NOT NULL,
  `pulso` int NOT NULL,
  `oxigenacion` decimal(5,2) NOT NULL,
  `glucosa` decimal(5,2) NOT NULL,
  `temperatura` decimal(4,2) NOT NULL,
  `observacion` text,
  `estado` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 = activo, 0 = inactivo',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tamizaje_id` (`tamizaje_id`),
  KEY `empleado_cedula` (`empleado_cedula`),
  CONSTRAINT `resultados_ibfk_1` FOREIGN KEY (`tamizaje_id`) REFERENCES `tamizajes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `resultados_ibfk_2` FOREIGN KEY (`empleado_cedula`) REFERENCES `empleados` (`cedula`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resultados`
--

LOCK TABLES `resultados` WRITE;
/*!40000 ALTER TABLE `resultados` DISABLE KEYS */;
INSERT INTO `resultados` VALUES (24,1,'100000001',1.75,54.90,25.41,117,82,66,95.63,85.01,37.22,'IMC Sobrepeso, presión arterial ligeramente alta (sistólica) y normal (diastólica), pulso normal, oxigenación normal, glucosa normal, temperatura normal. Consultar médico por sobrepeso.',1,'2025-10-20 03:58:24','2025-10-20 04:06:13'),(25,1,'100000002',1.56,67.00,25.40,94,60,90,97.68,97.84,36.72,'IMC Sobrepeso, presión arterial normal, pulso normal, oxigenación normal, glucosa normal, temperatura normal. Consultar médico por sobrepeso.',1,'2025-10-20 03:58:24','2025-10-20 04:06:13'),(26,1,'100000003',1.79,61.26,27.24,139,62,77,99.16,84.49,37.05,'IMC Sobrepeso, presión arterial ligeramente alta (sistólica) y baja (diastólica), pulso normal, oxigenación normal, glucosa normal, temperatura normal. Consultar médico por presión diastólica baja y sobrepeso.',1,'2025-10-20 03:58:24','2025-10-20 04:06:13'),(27,1,'100000004',1.75,52.93,21.09,133,86,93,95.41,79.23,36.45,'IMC Normal, presión arterial ligeramente alta (sistólica y diastólica), pulso normal, oxigenación normal, glucosa normal, temperatura normal. Consultar médico por presión arterial ligeramente alta.',1,'2025-10-20 03:58:24','2025-10-20 04:06:13'),(28,1,'100000005',1.88,91.45,28.30,106,75,81,91.16,70.15,37.00,'IMC Sobrepeso, presión arterial normal, pulso normal, oxigenación ligeramente baja, glucosa normal, temperatura normal. Consultar médico por oxigenación ligeramente baja y sobrepeso.',1,'2025-10-20 03:58:24','2025-10-20 04:06:13'),(29,1,'100000006',1.63,82.22,24.40,113,79,96,95.41,119.08,36.43,'IMC Normal, presión arterial normal, pulso normal, oxigenación normal, glucosa normal, temperatura normal.',1,'2025-10-20 03:58:24','2025-10-20 04:06:13'),(30,1,'100000007',1.69,77.46,19.04,111,77,82,91.32,117.11,36.47,'IMC Normal, presión arterial normal, pulso normal, oxigenación ligeramente baja, glucosa normal, temperatura normal. Consultar médico por oxigenación ligeramente baja.',1,'2025-10-20 03:58:24','2025-10-20 04:06:13'),(31,1,'100000008',1.80,90.26,31.45,138,74,81,92.62,103.18,36.80,'IMC Obeso I, presión arterial ligeramente alta (sistólica) y normal (diastólica), pulso normal, oxigenación ligeramente baja, glucosa normal, temperatura normal. Consultar médico por obesidad y oxigenación ligeramente baja.',1,'2025-10-20 03:58:24','2025-10-20 04:06:13'),(32,1,'100000009',1.76,86.02,23.09,126,86,67,93.13,70.52,36.17,'IMC Normal, presión arterial ligeramente alta (sistólica y diastólica), pulso normal, oxigenación ligeramente baja, glucosa normal, temperatura baja. Consultar médico por temperatura baja, presión arterial ligeramente alta, y oxigenación ligeramente baja.',1,'2025-10-20 03:58:24','2025-10-20 04:06:13'),(33,1,'100000010',1.71,66.51,20.51,97,88,71,96.56,89.07,37.41,'IMC Normal, presión arterial normal (sistólica) y ligeramente alta (diastólica), pulso normal, oxigenación normal, glucosa normal, temperatura normal. Consultar médico por presión diastólica ligeramente alta.',1,'2025-10-20 03:58:24','2025-10-20 04:06:13'),(44,1,'1062334764',1.69,65.38,17.65,103,65,60,95.98,116.36,37.26,'IMC Bajo, presión arterial normal, pulso normal, oxigenación normal, glucosa normal, temperatura normal. Consultar médico por IMC bajo.',1,'2025-10-20 03:58:24','2025-10-20 04:06:13'),(45,1,'1143994968',1.67,81.49,34.06,107,79,63,95.87,102.13,36.68,'IMC Obeso I, presión arterial normal, pulso normal, oxigenación normal, glucosa normal, temperatura normal. Consultar médico por obesidad.',1,'2025-10-20 03:58:24','2025-10-20 04:06:13'),(55,1,'200000001',1.70,50.00,17.30,85,55,55,96.00,65.00,35.50,'IMC Bajo, presión arterial baja, pulso bajo, oxigenación normal, glucosa baja, temperatura baja. Consultar médico por IMC bajo, presión arterial baja, pulso bajo, glucosa baja, y temperatura baja.',1,'2025-10-20 04:01:50','2025-10-20 04:06:13'),(56,1,'200000002',1.70,65.00,22.49,110,70,80,95.00,100.00,37.00,'IMC Normal, presión arterial normal, pulso normal, oxigenación normal, glucosa normal, temperatura normal.',1,'2025-10-20 04:01:50','2025-10-20 04:06:13'),(57,1,'200000003',1.70,80.00,27.68,130,85,110,92.00,150.00,38.00,'IMC Sobrepeso, presión arterial ligeramente alta (sistólica) y ligeramente alta (diastólica), pulso elevado, oxigenación ligeramente baja, glucosa ligeramente alta, temperatura fiebre ligera. Consultar médico por sobrepeso, presión arterial ligeramente alta, pulso elevado, oxigenación ligeramente baja, glucosa ligeramente alta, y fiebre ligera.',1,'2025-10-20 04:01:50','2025-10-20 04:06:13'),(58,1,'200000004',1.70,95.00,32.87,150,95,130,87.00,190.00,39.00,'IMC Obeso I, presión arterial alta (sistólica) y alta (diastólica), pulso alto, oxigenación baja, glucosa alta, temperatura fiebre alta. Consultar médico por obesidad, presión arterial alta, pulso alto, oxigenación baja, glucosa alta, y fiebre alta.',1,'2025-10-20 04:01:50','2025-10-20 04:06:13'),(59,1,'200000005',1.70,110.00,38.06,170,105,150,80.00,230.00,40.00,'IMC Obeso II+, presión arterial muy alta (sistólica) y muy alta (diastólica), pulso muy alta, oxigenación muy baja, glucosa muy alta, temperatura fiebre muy alta. Consultar médico urgentemente por obesidad severa, presión arterial muy alta, pulso muy alto, oxigenación muy baja, glucosa muy alta, y fiebre muy alta.',1,'2025-10-20 04:01:50','2025-10-20 04:06:13');
/*!40000 ALTER TABLE `resultados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin','Administrador del sistema','2025-10-11 17:07:02','2025-10-19 03:44:22'),(2,'empleado','Empleado de la organización','2025-10-11 17:07:02','2025-10-11 17:07:02'),(3,'supervisor','Rol de supervisión','2025-10-11 17:07:02','2025-10-11 17:07:02');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tamizajes`
--

DROP TABLE IF EXISTS `tamizajes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tamizajes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `estado` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `estado` (`estado`),
  CONSTRAINT `tamizajes_ibfk_1` FOREIGN KEY (`estado`) REFERENCES `estado_tamizaje` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tamizajes`
--

LOCK TABLES `tamizajes` WRITE;
/*!40000 ALTER TABLE `tamizajes` DISABLE KEYS */;
INSERT INTO `tamizajes` VALUES (1,'Tamizaje Anual 2025',1,'2025-10-20 00:09:27','2025-10-20 00:09:27'),(2,'Tamizaje Semestral 2025',2,'2025-10-20 00:09:27','2025-10-20 00:09:27'),(3,'Tamizaje Pre-empleo',3,'2025-10-20 00:09:27','2025-10-20 00:09:27');
/*!40000 ALTER TABLE `tamizajes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `empleado_cedula` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol_id` int NOT NULL DEFAULT '2',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `empleado_cedula` (`empleado_cedula`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`empleado_cedula`) REFERENCES `empleados` (`cedula`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'1062334764','1905-sis@coopserp.com','$2a$12$0oxFNNOLCx1w7IK3SPMTfea7fnYq25/Yg7NU4RfZqQmxX2pydztMy',1,'2025-10-11 17:07:47','2025-10-11 17:11:58'),(2,'1143994968','1904-sis@coopserp.com','$2b$10$7Cp44MRFHzahDxcC1c02zOOxXs/e5JeNNTF33VWjLlE1.QA/fiDGa',1,'2025-10-19 02:13:12','2025-10-19 23:57:57');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-19 23:34:16
