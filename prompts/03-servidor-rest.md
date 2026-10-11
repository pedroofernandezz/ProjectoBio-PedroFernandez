# Prompt 03 — Generar el servidor REST

## Diseño de referencia

Implementa exactamente el contrato de `disenos/04-api-rest.md`.

Solo existen estas dos rutas en Sprint 0:

```text
POST /mediciones
GET  /mediciones/ultima?tipo=ozono
```

## POST /mediciones

Entrada JSON:

```json
{
  "tipo": "ozono",
  "fecha": "2026-10-06T10:30:00Z",
  "valor": 7.5
}
```

Debe invocar:

```text
tipo: Text, fecha: Text, valor: R --> registrarMedicion() --> medicion: Medicion
```

Respuesta correcta: `201 Created` con la medición almacenada, incluido el `id` generado.

## GET /mediciones/ultima

Ejemplo:

```text
GET /mediciones/ultima?tipo=ozono
```

Debe invocar:

```text
tipo: Text --> obtenerUltimaMedicion() --> medicion: Medicion
```

Respuesta correcta: `200 OK` con la última medición.

Si no existen mediciones:

```text
404 Not Found
```

```json
{
  "error": "SIN_MEDICIONES"
}
```

## Directrices de implementación

1. Implementa únicamente estas dos rutas.
2. Usa JSON para entradas y salidas.
3. El cliente no puede decidir el `id`.
4. El servidor REST no duplica reglas del negocio: delega en la lógica real.
5. Traduce errores de entrada, ausencia de datos y errores internos a respuestas HTTP coherentes.
6. No incluyas SQL en los controladores REST.
7. No añadas rutas de usuarios, dispositivos, historial o autenticación.
8. Mantén separadas inicialización del servidor, definición de rutas y lógica del negocio.

## Comentarios obligatorios

Cada función debe tener una cabecera con su firma lógica en la notación de la asignatura y una descripción breve.

Además, junto a cada ruta documenta verbo, recurso, datos de entrada, respuesta y operación de negocio invocada.

## Tests automáticos

Incluye tests de integración para:

- POST válido;
- POST con cuerpo incompleto;
- POST con valor inválido;
- POST con JSON mal formado;
- GET con una medición existente;
- GET con varias mediciones;
- GET sin mediciones;
- GET sin parámetro `tipo`;
- error interno controlado.

## Criterio de aceptación

Con el servidor de pruebas iniciado y una base de datos vacía, un `POST /mediciones` válido debe devolver `201` y guardar exactamente una medición. A continuación, `GET /mediciones/ultima?tipo=ozono` debe devolver `200` y exactamente esa medición. Todos los tests automáticos deben pasar.

## Entrega

Entrega el servidor REST, sus tests automáticos y las instrucciones para arrancarlo y ejecutar las pruebas.
