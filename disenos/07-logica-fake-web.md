# Diseño de la lógica fake del navegador — Sprint 0

## Objetivo

Definir el proxy utilizado por la aplicación web para invocar remotamente las operaciones de la lógica real mediante el API REST.

La UX no realiza peticiones HTTP directamente. Todas las peticiones pasan por esta lógica fake.

## Tipo compartido

```text
Medicion = (
    id: N,
    tipo: Text,
    fecha: Text,
    valor: R
)
```

## Clase lógica

```text
--------------- LogicaFakeWeb ----------------
|
| url_servidor: Text
|
|
tipo: Text, fecha: Text, valor: R --> registrarMedicion() -->
medicion: Medicion <--
|
|
tipo: Text --> obtenerUltimaMedicion() <--
medicion: Medicion <--
|
-----------------------------------------------
```

La lógica fake mantiene el mismo contrato lógico que la lógica real. En el Sprint 0, la UX web utilizará únicamente `obtenerUltimaMedicion()`.

## Correspondencia con REST

### registrarMedicion()

```text
tipo: Text, fecha: Text, valor: R
    --> registrarMedicion()
medicion: Medicion <--
```

Se implementa mediante:

```text
POST /mediciones
```

### obtenerUltimaMedicion()

```text
tipo: Text
    --> obtenerUltimaMedicion()
medicion: Medicion <--
```

Se implementa mediante:

```text
GET /mediciones/ultima?tipo=ozono
```

## Uso en la UX del Sprint 0

Al cargar la página y al pulsar `Actualizar medición`, la UX llama a:

```text
"ozono" --> obtenerUltimaMedicion() --> medicion: Medicion
```

La lógica fake interpreta la respuesta JSON y devuelve la medición a la UX.

## Segregación de responsabilidades

La lógica fake web:

- conoce las rutas REST;
- realiza las peticiones HTTP;
- transforma JSON en datos lógicos;
- comunica errores de red o del servidor.

La lógica fake web no contiene SQL, no implementa reglas de negocio y no modifica directamente el DOM ni la presentación visual.
