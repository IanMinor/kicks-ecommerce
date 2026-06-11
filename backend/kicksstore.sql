-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-05-2025 a las 06:03:48
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `kicksstore1`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_AgregarProductoAlCarrito` (IN `p_id_usuario` INT, IN `p_id_producto` INT, IN `p_cantidad` INT)   BEGIN
  DECLARE v_id_carrito INT;
  DECLARE v_existente INT;

  -- Obtener carrito activo del usuario
  SELECT id_carrito INTO v_id_carrito
  FROM Carritos
  WHERE id_usuario = p_id_usuario AND estado_carrito = 1;

  -- Si no existe, crear uno
  IF v_id_carrito IS NULL THEN
    INSERT INTO Carritos (id_usuario, estado_carrito)
    VALUES (p_id_usuario, 1);
    SET v_id_carrito = LAST_INSERT_ID();
  END IF;

  -- Verificar si el producto ya está en el carrito
  SELECT COUNT(*) INTO v_existente
  FROM Carritos_Productos
  WHERE id_carrito = v_id_carrito AND id_producto = p_id_producto;

  -- Si ya existe, actualizar cantidad
  IF v_existente > 0 THEN
    UPDATE Carritos_Productos
    SET cantidad = cantidad + p_cantidad
    WHERE id_carrito = v_id_carrito AND id_producto = p_id_producto;
  ELSE
    -- Si no existe, insertar nuevo
    INSERT INTO Carritos_Productos (id_carrito, id_producto, cantidad)
    VALUES (v_id_carrito, p_id_producto, p_cantidad);
  END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_CrearPedido` (IN `p_id_usuario` INT, IN `p_entrega_estimada` DATE)   BEGIN
  DECLARE v_id_carrito INT;
  DECLARE v_subtotal DECIMAL(10,2);
  DECLARE v_total DECIMAL(10,2);
  DECLARE v_id_pedido INT;

  -- Obtener carrito activo del usuario
  SELECT id_carrito INTO v_id_carrito
  FROM Carritos
  WHERE id_usuario = p_id_usuario AND estado_carrito = 1;

  -- Calcular subtotal
  SELECT SUM(P.precio * CP.cantidad) INTO v_subtotal
  FROM Carritos_Productos CP
  JOIN Productos P ON P.id_producto = CP.id_producto
  WHERE CP.id_carrito = v_id_carrito;

  -- Calcular total con impuesto (20%)
  SET v_total = v_subtotal * 1.2;

  -- Insertar pedido
  INSERT INTO Pedidos (id_usuario, id_carrito, fecha_pedido, entrega_estimada, subtotal, total)
  VALUES (p_id_usuario, v_id_carrito, CURDATE(), p_entrega_estimada, v_subtotal, v_total);

  SET v_id_pedido = LAST_INSERT_ID();

  -- Insertar detalle de pedido
  INSERT INTO Detalles_Pedido (id_pedido, estado_pedido)
  VALUES (v_id_pedido, 'En proceso');

  -- Cerrar carrito activo
  UPDATE Carritos SET estado_carrito = 0 WHERE id_carrito = v_id_carrito;

  -- ✅ Devolver el ID del pedido
  SELECT v_id_pedido AS id_pedido;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_RegistrarUsuario` (IN `p_nombre` VARCHAR(255), IN `p_apellido` VARCHAR(255), IN `p_numero_telefono` VARCHAR(255), IN `p_email` VARCHAR(255), IN `p_contraseña` VARCHAR(255))   BEGIN
  INSERT INTO Usuarios (nombre, apellido, numero_telefono, email, contraseña)
  VALUES (p_nombre, p_apellido, p_numero_telefono, p_email, p_contraseña);
  SELECT LAST_INSERT_ID() AS id_nuevo_usuario;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carritos`
--

CREATE TABLE `carritos` (
  `id_carrito` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `estado_carrito` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carritos`
--

INSERT INTO `carritos` (`id_carrito`, `id_usuario`, `estado_carrito`) VALUES
(4000, 1000, b'0'),
(4001, 1000, b'0'),
(4002, 1001, b'0'),
(4003, 1002, b'0'),
(4004, 1003, b'0'),
(4005, 1004, b'0'),
(4006, 1008, b'1'),
(4007, 1006, b'0'),
(4008, 1007, b'1'),
(4009, 1006, b'0'),
(4010, 1006, b'0'),
(4011, 1006, b'0'),
(4012, 1006, b'0'),
(4013, 1006, b'0'),
(4014, 1006, b'0'),
(4015, 1006, b'1'),
(4016, 1009, b'0'),
(4017, 1009, b'1'),
(4018, 1010, b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carritos_productos`
--

CREATE TABLE `carritos_productos` (
  `id_carrito` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carritos_productos`
--

INSERT INTO `carritos_productos` (`id_carrito`, `id_producto`, `cantidad`) VALUES
(4017, 2007, 2),
(4017, 2009, 1),
(4017, 2008, 1),
(4017, 2005, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL,
  `nombre_categoria` varchar(255) DEFAULT NULL,
  `descripcion_categoria` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre_categoria`, `descripcion_categoria`) VALUES
(3000, 'Running', 'Calzado para correr'),
(3001, 'Urbanas', 'Calzado casual para uso diario'),
(3002, 'Baloncesto', 'Calzado para jugar baloncesto'),
(3003, 'Senderismo', 'Calzado para caminatas y trekking'),
(3004, 'Casual', 'Calzado casual para uso diario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_pedido`
--

CREATE TABLE `detalles_pedido` (
  `id_detalle` int(11) NOT NULL,
  `id_pedido` int(11) DEFAULT NULL,
  `estado_pedido` varchar(255) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `detalles_pedido`
--

INSERT INTO `detalles_pedido` (`id_detalle`, `id_pedido`, `estado_pedido`) VALUES
(6000, 5000, 'En proceso'),
(6001, 5001, 'En proceso'),
(6002, 5002, 'Enviado'),
(6003, 5003, 'Cancelado'),
(6004, 5004, 'Completado'),
(6005, 5005, 'En proceso'),
(6006, 5006, 'En proceso'),
(6007, 5007, 'En proceso'),
(6008, 5008, 'En proceso'),
(6009, 5009, 'En proceso'),
(6010, 5010, 'En proceso'),
(6011, 5011, 'En proceso'),
(6012, 5012, 'En proceso'),
(6013, 5013, 'En proceso');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direcciones`
--

CREATE TABLE `direcciones` (
  `id_direccion` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `pais` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `codigo_postal` varchar(255) DEFAULT NULL,
  `ciudad` varchar(255) DEFAULT NULL,
  `domicilio` varchar(255) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `direcciones`
--

INSERT INTO `direcciones` (`id_direccion`, `id_usuario`, `pais`, `estado`, `codigo_postal`, `ciudad`, `domicilio`) VALUES
(1100, 1000, 'México', 'Ciudad de México', '12345', 'Alcaldía Cuauhtémoc', 'Calle Reforma 123, Depto 4B'),
(1101, 1001, 'España', 'Madrid', '28001', 'Madrid', 'Calle Gran Vía 45, 3ºD'),
(1102, 1002, 'Estados Unidos', 'California', '90210', 'Los Angeles', '123 Hollywood Blvd, Apt 5'),
(1103, 1003, 'Argentina', 'Buenos Aires', 'C1425', 'Buenos Aires', 'Av. Corrientes 1234, Piso 2'),
(1104, 1004, 'Colombia', 'Bogotá', '110111', 'Bogotá D.C.', 'Carrera 7 #72-41, Apt 301');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodos_pago`
--

CREATE TABLE `metodos_pago` (
  `id_método_pago` int(11) NOT NULL,
  `tipo_pago` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `metodos_pago`
--

INSERT INTO `metodos_pago` (`id_método_pago`, `tipo_pago`, `descripcion`) VALUES
(8000, 'Tarjeta de crédito', 'Visa/Mastercard/Amex'),
(8001, 'PayPal', 'Pago electrónico seguro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL,
  `id_pedido` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_método_pago` int(11) DEFAULT NULL,
  `fecha_pago` date DEFAULT NULL,
  `estado_pago` enum('Pendiente','Aprobado','Rechazado') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`id_pago`, `id_pedido`, `id_usuario`, `id_método_pago`, `fecha_pago`, `estado_pago`) VALUES
(7000, 5000, 1000, 8000, '2025-05-17', 'Aprobado'),
(7001, 5001, 1001, 8001, '2025-05-17', 'Pendiente'),
(7002, 5002, 1002, 8000, '2025-05-17', 'Aprobado'),
(7003, 5003, 1003, 8001, '2025-05-17', 'Rechazado'),
(7004, 5004, 1004, 8000, '2025-05-17', 'Aprobado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_carrito` int(11) DEFAULT NULL,
  `fecha_pedido` date DEFAULT NULL,
  `entrega_estimada` date DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `id_usuario`, `id_carrito`, `fecha_pedido`, `entrega_estimada`, `subtotal`, `total`) VALUES
(5000, 1000, 4000, '2025-05-17', '2025-05-24', 2499.99, 2999.99),
(5001, 1000, 4001, '2025-05-17', '2025-05-24', 2499.99, 2999.99),
(5002, 1001, 4002, '2025-05-17', '2025-05-22', 3599.00, 4318.80),
(5003, 1002, 4003, '2025-05-17', '2025-05-27', 2999.00, 3598.80),
(5004, 1003, 4004, '2025-05-17', '2025-05-31', 4699.74, 5639.69),
(5005, 1004, 4005, '2025-05-17', '2025-05-20', 3398.50, 4078.20),
(5006, 1006, 4007, '2025-05-19', '2025-05-24', 6499.24, 7799.09),
(5007, 1006, 4009, '2025-05-19', '2025-05-24', 2499.99, 2999.99),
(5008, 1006, 4010, '2025-05-19', '2025-05-24', 4999.98, 5999.98),
(5009, 1006, 4011, '2025-05-19', '2025-05-24', 5998.00, 7197.60),
(5010, 1006, 4012, '2025-05-19', '2025-05-24', 2499.99, 2999.99),
(5011, 1006, 4013, '2025-05-19', '2025-05-24', 2999.00, 3598.80),
(5012, 1006, 4014, '2025-05-19', '2025-05-24', 2199.75, 2639.70),
(5013, 1009, 4016, '2025-05-21', '2025-05-26', 4699.74, 5639.69);

--
-- Disparadores `pedidos`
--
DELIMITER $$
CREATE TRIGGER `tr_actualizar_stock_despues_pedido` AFTER INSERT ON `pedidos` FOR EACH ROW BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE pid INT;
  DECLARE cant INT;
  DECLARE cur CURSOR FOR
    SELECT id_producto, cantidad
    FROM Carritos_Productos
    WHERE id_carrito = NEW.id_carrito;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  OPEN cur;
  read_loop: LOOP
    FETCH cur INTO pid, cant;
    IF done THEN
      LEAVE read_loop;
    END IF;
    UPDATE Productos
    SET stock = stock - cant
    WHERE id_producto = pid;
  END LOOP;
  CLOSE cur;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `nombre_producto` varchar(255) DEFAULT NULL,
  `marca` varchar(255) DEFAULT NULL,
  `talla` int(11) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `imagen` varchar(500) DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `genero` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre_producto`, `marca`, `talla`, `color`, `precio`, `stock`, `descripcion`, `imagen`, `categoria`, `genero`) VALUES
(2005, 'Kobe 8 Protro What The Kobe 2025', 'Nike', 42, 'Blue', 1899.99, 20, 'Tenis versátiles ideales para entrenamiento diario.', 'https://res.cloudinary.com/dv4dyxqn7/image/upload/v1748191273/ppqaq8keouxl19ezfr43.jpg', 'Basketball', 'Men'),
(2006, 'Wmns Jordan 1 Retro High OG', 'Nike', 45, 'Blue', 1899.99, 30, 'Tenis streetwear versátiles.', 'https://res.cloudinary.com/dv4dyxqn7/image/upload/v1748191272/rr2mhyk507ih0fuwsaja.jpg', 'Sneakers', 'Women'),
(2007, 'Nike SB x Jordan 4 Retro SP Navy', 'Nike', 32, 'White', 1899.99, 25, 'Tenis streetwear versátiles.', 'https://res.cloudinary.com/dv4dyxqn7/image/upload/v1748191273/fhriyustejnsoc8srrao.jpg', 'Sneakers', 'Women'),
(2008, 'Travis Scott x Jordan 1 Low OG TD Velvet Brown', 'Nike', 42, 'Brown', 2899.99, 15, 'Tenis versátiles ideales para uso diario.', 'https://res.cloudinary.com/dv4dyxqn7/image/upload/v1748191272/iea0wgldz2bbhnmjlqpf.jpg', 'Casual', 'Men'),
(2009, 'Zoom Kobe 7 System Lower Merion Aces', 'Nike', 42, 'Red', 1599.99, 20, 'Tenis versátiles ideales para entrenamiento diario.', 'https://res.cloudinary.com/dv4dyxqn7/image/upload/v1748191272/islmsadbmctqiznjwkyj.jpg', 'Basketball', 'Men'),
(2010, 'Air Zoom Spiridon SP Silver Red 2024', 'Nike', 40, 'White', 1499.99, 25, 'Tenis versátiles ideales para entrenamiento diario.', 'https://res.cloudinary.com/dv4dyxqn7/image/upload/v1748191272/j0zkcnlf2zhxjjpb91hj.jpg', 'Casual', 'Men'),
(2011, 'Air Zoom Spiridon SP Silver Red 2024', 'Nike', 38, 'Red', 1499.99, 40, 'Tenis versátiles ideales para el deporte.', 'https://res.cloudinary.com/dv4dyxqn7/image/upload/v1748191273/ua40ui2t6hayc8yfinek.jpg', 'Sneakers', 'Men'),
(2012, 'Airmax 90 Volcano', 'Nike', 36, 'Black', 3299.99, 40, 'Tenis versátiles ideales para el deporte.', 'https://res.cloudinary.com/dv4dyxqn7/image/upload/v1748191275/k6bx2jicjqamnq3gwe3c.jpg', 'Casual', 'Men'),
(2013, 'Zoom Vomero 5 Yellow Ochre', 'Nike', 38, 'Yellow', 4299.99, 15, 'Tenis casuales vérsatiles', 'https://res.cloudinary.com/dv4dyxqn7/image/upload/v1748191274/eptztvhju3dtdajn9pyt.jpg', 'Casual', 'Women'),
(2014, 'Air Zoom Vomero 5 Doernbecher 2023', 'Nike', 34, 'Orange', 1999.99, 45, 'Tenis versátiles ideales para el deporte.', 'https://res.cloudinary.com/dv4dyxqn7/image/upload/v1748191274/e7ftd4p3otu31uayzcm8.jpg', 'Running', 'Women'),
(2015, 'Air VaporMax Plus White Platinum', 'Nike', 32, 'White', 2599.99, 10, 'Tenis versátiles ideales para el deporte.', 'https://res.cloudinary.com/dv4dyxqn7/image/upload/v1748191274/yim8lmkvf0kfxaxuvegl.jpg', 'Running', 'Women'),
(2016, 'Wmns Air Zoom Vomero 5 Elemental Pink', 'Nike', 36, 'Pink', 1799.99, 20, 'Tenis versátiles ideales para el deporte.', 'https://res.cloudinary.com/dv4dyxqn7/image/upload/v1748191274/ceyl52imlqc1bc83x4l7.jpg', 'Running', 'Women'),
(2017, 'Pegasus Premium White Metallic Silver', 'Nike', 38, 'White', 1999.99, 19, 'Tenis versátiles ideales para el deporte.', 'https://res.cloudinary.com/dv4dyxqn7/image/upload/v1748191274/yqjgnz1g4dpcl9aogbdg.jpg', 'Casual', 'Women'),
(2018, 'Air Zoom Vomero 5 Triple Black', 'Nike', 38, 'Black', 2699.99, 40, 'Tenis casuales vérsatiles', 'https://res.cloudinary.com/dv4dyxqn7/image/upload/v1748191274/n2lguufkf35w8bo7ng1u.jpg', 'Sneakers', 'Men'),
(2019, 'Jordan 4 Retro OG White Cement 2025', 'Nike', 38, 'White', 3499.99, 25, 'Tenis versátiles ideales para el deporte.', 'https://res.cloudinary.com/dv4dyxqn7/image/upload/v1748191273/tsyvr6twmnrxbc88xg4e.jpg', 'Basketball', 'Men'),
(2020, 'Air Max 95 OG Neon 2025.jpg', 'Nike', 34, 'Black', 1799.99, 40, 'Tenis versátiles ideales para el deporte.', 'https://res.cloudinary.com/dv4dyxqn7/image/upload/v1748191274/jjzxa6oejqjhxaexdblf.jpg', 'Casual', 'Men'),
(2021, 'Air Diamond Turf Proto 92 Atlanta Falcons', 'Nike', 38, 'White', 2299.99, 40, 'Tenis versátiles ideales para el deporte.', 'https://res.cloudinary.com/dv4dyxqn7/image/upload/v1748191274/zhta6sjshqxmpqk9u74m.jpg', 'Sneakers', 'Men');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos_categorias`
--

CREATE TABLE `productos_categorias` (
  `id_producto` int(11) DEFAULT NULL,
  `id_categoria` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reseñas`
--

CREATE TABLE `reseñas` (
  `id_reseña` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `calificacion` int(11) DEFAULT NULL,
  `comentario` text DEFAULT NULL,
  `fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `numero_telefono` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `contraseña` varchar(255) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `numero_telefono`, `email`, `contraseña`) VALUES
(1000, 'Juan', 'Pérez', '5512345678', 'juan.perez@email.com', 'SecurePass123'),
(1001, 'María', 'González', '5511223344', 'maria.gonzalez@email.com', 'MariaSecure456'),
(1002, 'Carlos', 'López', '5599887766', 'carlos.lopez@email.com', 'CarlosPass789'),
(1003, 'Ana', 'Martínez', '5533445566', 'ana.martinez@email.com', 'AnaSecure2023'),
(1004, 'Pedro', 'Sánchez', '5577665544', 'pedro.sanchez@email.com', 'PedroPass987'),
(1005, 'Juan', 'Pérez', '123456789', 'juan@example.com', '1234'),
(1006, 'Lionel', 'Messi', '1020304050', 'messi@gmail.com', 'messi22'),
(1007, 'Cristiano', 'Ronaldo', '7171717171', 'cristiano@gmail.com', 'cris22'),
(1008, 'kenel', 'raa', '1818181818', 'kenel@gmail.com', 'kenel22'),
(1009, 'Santiago', 'Nava', '2121212121', 'santiago@gmail.com', 'santiago22'),
(1010, 'Cris', 'Martel', '9191919191', 'cris@gmail.com', 'cris22'),
(1011, 'Checo', 'Perez', '1234544556', 'checo@gmail.com', 'checo22'),
(1012, 'Martin', 'Lopez', '4546474849', 'martin@gmail.com', 'martin22');

--
-- Disparadores `usuarios`
--
DELIMITER $$
CREATE TRIGGER `tr_evitar_borrado_usuario_con_pedidos` BEFORE DELETE ON `usuarios` FOR EACH ROW BEGIN
    IF EXISTS (
        SELECT 1 FROM Pedidos
        WHERE id_usuario = OLD.id_usuario AND estado != 'Cancelado'
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se puede eliminar el usuario: tiene pedidos activos o pendientes';
    END IF;
END
$$
DELIMITER ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carritos`
--
ALTER TABLE `carritos`
  ADD PRIMARY KEY (`id_carrito`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `carritos_productos`
--
ALTER TABLE `carritos_productos`
  ADD KEY `id_carrito` (`id_carrito`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_pedido` (`id_pedido`);

--
-- Indices de la tabla `direcciones`
--
ALTER TABLE `direcciones`
  ADD PRIMARY KEY (`id_direccion`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  ADD PRIMARY KEY (`id_método_pago`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `id_pedido` (`id_pedido`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_método_pago` (`id_método_pago`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_carrito` (`id_carrito`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indices de la tabla `productos_categorias`
--
ALTER TABLE `productos_categorias`
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indices de la tabla `reseñas`
--
ALTER TABLE `reseñas`
  ADD PRIMARY KEY (`id_reseña`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carritos`
--
ALTER TABLE `carritos`
  MODIFY `id_carrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4019;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3005;

--
-- AUTO_INCREMENT de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `direcciones`
--
ALTER TABLE `direcciones`
  MODIFY `id_direccion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  MODIFY `id_método_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8002;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7005;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5014;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2022;

--
-- AUTO_INCREMENT de la tabla `reseñas`
--
ALTER TABLE `reseñas`
  MODIFY `id_reseña` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9003;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carritos`
--
ALTER TABLE `carritos`
  ADD CONSTRAINT `carritos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `carritos_productos`
--
ALTER TABLE `carritos_productos`
  ADD CONSTRAINT `carritos_productos_ibfk_1` FOREIGN KEY (`id_carrito`) REFERENCES `carritos` (`id_carrito`) ON DELETE CASCADE,
  ADD CONSTRAINT `carritos_productos_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  ADD CONSTRAINT `detalles_pedido_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE;

--
-- Filtros para la tabla `direcciones`
--
ALTER TABLE `direcciones`
  ADD CONSTRAINT `direcciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE,
  ADD CONSTRAINT `pagos_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `pagos_ibfk_3` FOREIGN KEY (`id_método_pago`) REFERENCES `metodos_pago` (`id_método_pago`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`id_carrito`) REFERENCES `carritos` (`id_carrito`) ON DELETE CASCADE;

--
-- Filtros para la tabla `productos_categorias`
--
ALTER TABLE `productos_categorias`
  ADD CONSTRAINT `productos_categorias_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE,
  ADD CONSTRAINT `productos_categorias_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reseñas`
--
ALTER TABLE `reseñas`
  ADD CONSTRAINT `reseñas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `reseñas_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
