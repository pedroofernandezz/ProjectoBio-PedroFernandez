# Prompt 05 — Generar la lógica fake del navegador

## Diseño de referencia

Implementa el proxy definido en `disenos/07-logica-fake-web.md`.

Tipo compartido:

```text
Medicion = (
    id: N,
    tipo: Text,
    fecha: Text,
    valor: R
)
```

La lógica fake ofrece:

```text
tipo: Text, fecha: Text, valor: R --> registrarMedicion() --> medicion: Medicion
tipo: Text --> obtenerUltimaMedicion() --> medicion: Medicion
```

La UX del Sprint 0 utilizará `obtenerUltimaMedicion("ozono")`.

## Directrices de implementación

1. `registrarMedicion()` se implementa mediante `POST /mediciones`.
2. `obtenerUltimaMedicion()` se implementa mediante `GET /mediciones/ultima?tipo=...`.
3. Utiliza una interfaz asíncrona apropiada para el navegador.
4. Convierte la respuesta JSON en el tipo lógico `Medicion`.
5. Distingue entre:
   - respuesta correcta;
   - `404 SIN_MEDICIONES`;
   - error del servidor;
   - fallo de conexión;
   - JSON inválido.
6. No accedas a la base de datos.
7. No reproduzcas reglas del negocio.
8. No manipules directamente el DOM ni implementes componentes visuales en este módulo.
9. No utilices datos ficticios en producción.

## Comentarios obligatorios

Cada función tendrá una cabecera con su firma lógica en la notación de la asignatura y una breve explicación.

Utiliza otros comentarios solo donde aclaren el tratamiento de una respuesta o error.

## Tests automáticos

Simula las respuestas REST para comprobar:

- respuesta válida de última medición;
- URL y parámetro `tipo` correctos;
- `404 SIN_MEDICIONES`;
- error HTTP;
- fallo de red;
- JSON mal formado;
- operación de registro mediante POST.

Los tests no deben depender de un servidor real.

## Criterio de aceptación

Dada una respuesta REST simulada con una medición concreta, `obtenerUltimaMedicion("ozono")` debe devolver exactamente esa medición. Los casos de ausencia y error deben poder distinguirse y todos los tests deben pasar.

## Entrega

Entrega el módulo de lógica fake web, los tests automáticos y las instrucciones para utilizarlo desde la UX.
