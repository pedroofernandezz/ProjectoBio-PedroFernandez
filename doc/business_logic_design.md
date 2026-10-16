# Diseño de la lógica real del negocio — Sprint 0

## Diseño del Componente

Componente: `business_logic` — implementación `src/business_logic/LogicaMediciones.js`.

Tipo de dominio:

```text
Medicion = (id: N, tipo: Text, fecha: Text, valor: R)

---------------- LogicaMediciones ----------------
| base_datos: BaseDatos
|
|
tipo: Text, fecha: Text, valor: R --> registrarMedicion() -->
medicion: Medicion <--
|
|
tipo: Text --> obtenerUltimaMedicion() <--
medicion: Medicion <--
|
--------------------------------------------------
```

Operaciones auxiliares:

```text
tipo: Text --> validarTipo() --> tipo_normalizado: Text
fecha: Text --> validarFecha() --> fecha_utc: Text
valor: R --> validarValor() --> valor: R
codigo: Text, mensaje: Text --> crearError() --> error: ErrorNegocio
```

`registrarMedicion()` valida y normaliza el tipo (`ozono`), valida fecha ISO 8601 y valor real finito no negativo, y solicita a `BaseDatos` insertar la medición. `obtenerUltimaMedicion()` valida el tipo, consulta la última fila y comunica `SIN_MEDICIONES` cuando no existe.

### Relación explícita con la base de datos

Según `doc/database_design.md`, la tabla `MEDICION` contiene `id`, `tipo`, `fecha` y `valor`. La lógica invoca `insertarMedicion(tipo, fecha, valor)` y `obtenerUltimaMedicion(tipo)` de la capa de persistencia. El identificador `id` lo genera la base de datos. La consulta de última medición ordena por `fecha` descendente y después `id` descendente.

## Aclaraciones del Diseño

- **Independencia del 100 % respecto al transporte:** esta clase no importa ni utiliza Express, peticiones/respuestas HTTP, cabeceras, rutas, sockets o Bluetooth.
- Los errores de negocio se expresan como errores de dominio identificados por `codigo`; la capa de comunicación decide su representación HTTP.
- La clase recibe la dependencia `BaseDatos` por el constructor y no contiene SQL ni código de interfaz.
- La lógica real y las lógicas fake comparten los contratos lógicos de `registrarMedicion()` y `obtenerUltimaMedicion()`.

## Reglas Generales

- **Lenguaje de programación:** JavaScript (Node.js, CommonJS).
- **Encabezados:** cada función o método tendrá su firma lógica en un comentario delimitado por líneas discontinuas (`--------------------`).
- **Legibilidad:** usar nombres claros y evitar comentarios redundantes.
- **Pruebas automatizadas:** cubrir las operaciones clave mediante pruebas unitarias o de integración; conservar las pruebas existentes.
- **Separación:** implementar únicamente las responsabilidades indicadas en este diseño, sin incorporar las de otras capas.

