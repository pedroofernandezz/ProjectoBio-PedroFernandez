# Diseño de la lógica del negocio — Sprint 0

## Tipo lógico

```text
Medicion = (
    id: N,
    tipo: Text,
    fecha: Text,
    valor: R
)
```

Según la notación de la asignatura:

- `N`: número natural.
- `R`: número real.
- `Text`: texto.

## Clase lógica

```text
---------------- LogicaMediciones ----------------
|
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

## Operaciones

### registrarMedicion()

```text
tipo: Text, fecha: Text, valor: R
    --> registrarMedicion()
medicion: Medicion <--
```

Responsabilidad: validar los datos de entrada, registrar la medición en la base de datos y devolver la medición almacenada con su `id`.

Esta operación modifica el estado persistente del sistema.

### obtenerUltimaMedicion()

```text
tipo: Text
    --> obtenerUltimaMedicion()
medicion: Medicion <--
```

Responsabilidad: consultar y devolver la medición más reciente del tipo solicitado.

Esta operación es de lectura y no modifica el estado persistente.

## Reglas de negocio del Sprint 0

- El tipo utilizado inicialmente es `ozono`.
- El valor se expresa en ppm.
- La fecha incluye fecha y hora de la medición.
- El `id` lo genera la persistencia; no lo proporciona el cliente.
- Para decidir cuál es la última medición se ordena por fecha descendente y, si existe empate, por `id` descendente.
- La lógica del negocio no contiene código HTTP, Bluetooth ni código de interfaz gráfica.

## Relación con las lógicas fake

Las lógicas fake de Android y navegador presentan operaciones equivalentes hacia los clientes, pero las implementan enviando peticiones REST. No sustituyen ni duplican las reglas de la lógica real.
