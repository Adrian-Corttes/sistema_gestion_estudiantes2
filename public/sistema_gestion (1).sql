
CREATE TABLE `estudiante` (
  `ID` int(11) NOT NULL,
  `Nombres` varchar(100) NOT NULL,
  `Grado` varchar(50) DEFAULT NULL,
  `Salon` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiante`
--

INSERT INTO `estudiante` (`ID`, `Nombres`, `Grado`, `Salon`) VALUES
(1, 'sabela Moreno Castro', '6', '1'),
(2, 'Valentina García López', '7', '1'),
(3, 'Leonardo Pérez Martínez', '8', '2'),
(4, 'milia Torres Sánchez', '9', '3'),
(5, 'Mateo Jiménez Ruiz', '10°', '2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta`
--

CREATE TABLE `pregunta` (
  `ID` int(11) NOT NULL,
  `Respuesta` varchar(255) DEFAULT NULL,
  `Orden` int(11) DEFAULT NULL,
  `IDPrueba` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pregunta`
--

INSERT INTO `pregunta` (`ID`, `Respuesta`, `Orden`, `IDPrueba`) VALUES
(1, 'A', 1, 1),
(2, 'B', 2, 1),
(3, 'C', 3, 1),
(4, 'D', 4, 1),
(5, 'A', 5, 1),
(6, 'A', 1, 2),
(7, 'B', 2, 2),
(8, 'C', 3, 2),
(9, 'D', 4, 2),
(10, 'A', 1, 3),
(11, 'B', 2, 3),
(12, 'C', 3, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prueba`
--

CREATE TABLE `prueba` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Anio` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `prueba`
--

INSERT INTO `prueba` (`ID`, `Nombre`, `Anio`) VALUES
(1, 'Martes de prueba', 2024),
(2, 'Prueba Pensar', 2019),
(3, 'Simulacros', 2021);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultado`
--

CREATE TABLE `resultado` (
  `ID` int(11) NOT NULL,
  `IDEstudiante` int(11) DEFAULT NULL,
  `IDPrueba` int(11) DEFAULT NULL,
  `IDPregunta` int(11) DEFAULT NULL,
  `Respuesta` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `IDPrueba` (`IDPrueba`);

--
-- Indices de la tabla `prueba`
--
ALTER TABLE `prueba`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `resultado`
--
ALTER TABLE `resultado`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `IDEstudiante` (`IDEstudiante`),
  ADD KEY `IDPrueba` (`IDPrueba`),
  ADD KEY `IDPregunta` (`IDPregunta`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `prueba`
--
ALTER TABLE `prueba`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `resultado`
--
ALTER TABLE `resultado`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD CONSTRAINT `pregunta_ibfk_1` FOREIGN KEY (`IDPrueba`) REFERENCES `prueba` (`ID`) ON DELETE CASCADE;

--
-- Filtros para la tabla `resultado`
--
ALTER TABLE `resultado`
  ADD CONSTRAINT `resultado_ibfk_1` FOREIGN KEY (`IDEstudiante`) REFERENCES `estudiante` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `resultado_ibfk_2` FOREIGN KEY (`IDPrueba`) REFERENCES `prueba` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `resultado_ibfk_3` FOREIGN KEY (`IDPregunta`) REFERENCES `pregunta` (`ID`) ON DELETE CASCADE;
COMMIT;

