# Diseño del API REST — Sprint 0

## Objetivo

Exponer remotamente las dos operaciones necesarias de la lógica del negocio sin mezclar comunicación HTTP con las reglas del negocio.

## Ruta 1 — Registrar una medición

```text
POST /mediciones
```

### Entrada

Cuerpo JSON:

```json
{
  "tipo": "ozono",
  "fecha": "2026-10-06T10:30:00Z",
  "valor": 7.5
}
```

### Operación invocada

```text
tipo: Text, fecha: Text, valor: R
    --> registrarMedicion()
medicion: Medicion <--
```

### Respuesta correcta

Código HTTP:

```text
201 Created
```

Cuerpo JSON:

```json
{
  "id": 1,
  "tipo": "ozono",
  "fecha": "2026-10-06T10:30:00Z",
  "valor": 7.5
}
```

El cliente no envía el `id`; lo genera la persistencia.

---

## Ruta 2 — Obtener la última medición

```text
GET /mediciones/ultima?tipo=ozono
```

### Entrada

Parámetro de consulta:

```text
tipo: Text
```

### Operación invocada

```text
tipo: Text
    --> obtenerUltimaMedicion()
medicion: Medicion <--
```

### Respuesta correcta

Código HTTP:

```text
200 OK
```

Cuerpo JSON:

```json
{
  "id": 1,
  "tipo": "ozono",
  "fecha": "2026-10-06T10:30:00Z",
  "valor": 7.5
}
```

### Ausencia de mediciones

Si todavía no existe ninguna medición del tipo solicitado:

```text
404 Not Found
```

```json
{
  "error": "SIN_MEDICIONES"
}
```

## Responsabilidades

El servidor REST:

- recibe peticiones HTTP;
- extrae y transforma los datos de entrada;
- invoca la operación correspondiente de la lógica real;
- transforma el resultado en una respuesta HTTP/JSON.

El servidor REST no contiene SQL, lógica Bluetooth ni reglas de presentación de la interfaz.
