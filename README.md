# ProjectoBio-PedroFernandez

Sprint 0 del proyecto PBIO 2026.

## Objetivo

Construir y documentar la cadena completa:

**Arduino / SparkFun → Android → API REST → lógica del negocio → base de datos → página web**

La demostración del Sprint 0 debe permitir introducir una medida ficticia en Arduino y visualizar esa misma medida como última medición en la página web.

## Estructura inicial

- `arduino/`: código de la placa y emisión BLE/iBeacon.
- `android/`: cliente Android que recibe la medición y la envía al backend.
- `backend/`: lógica real del negocio, persistencia y servidor REST.
- `web/`: lógica fake/proxy del navegador y UX.
- `disenos/`: diseños en la notación de la asignatura.
- `prompts/`: especificaciones/prompts utilizados con IA.
- `tests/`: pruebas automáticas e integración cuando proceda.

## Ramas

- `master`: versión estable.
- `develop`: rama principal de trabajo.

## Estado

Repositorio inicializado. El desarrollo se realizará progresivamente a partir de los diseños y especificaciones del Sprint 0.

## Despliegue

Pendiente de completar cuando estén implementadas las distintas partes del sistema.

## Tests

Pendiente de completar. Se añadirán tests automáticos conforme se implemente cada entregable.

## Autor

Pedro Fernández
