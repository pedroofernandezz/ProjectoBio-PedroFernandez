# Diseño de interfaz gráfica web — Sprint 0

## Objetivo

Mostrar en una única pantalla la última medición de ozono almacenada y permitir al usuario volver a consultarla manualmente.

## Boceto

```text
┌──────────────────────────────────────┐
│          MEDICIÓN DE OZONO           │
├──────────────────────────────────────┤
│                                      │
│          Última medición             │
│                                      │
│              7.500                   │
│               ppm                    │
│                                      │
│        06/10/2026 · 12:30            │
│                                      │
│      [ Actualizar medición ]         │
│                                      │
└──────────────────────────────────────┘
```

El valor mostrado en el boceto es únicamente ilustrativo.

## Elementos de la pantalla

La interfaz contiene exclusivamente:

- valor de la última medición;
- unidad `ppm`;
- fecha y hora de la medición;
- botón `Actualizar medición`.

No se incluyen gráficas, historial, filtros, selección de dispositivos, usuarios ni otras pantallas.

## Comportamiento

### Carga inicial

Al abrir la página:

```text
"ozono"
    --> obtenerUltimaMedicion()
medicion: Medicion <--
```

La UX recibe el resultado a través de la lógica fake del navegador y muestra `valor` y `fecha`.

### Botón Actualizar medición

Al pulsar el botón se vuelve a ejecutar:

```text
"ozono"
    --> obtenerUltimaMedicion()
medicion: Medicion <--
```

y se sustituyen en pantalla el valor y la fecha anteriores por los datos recibidos.

No existe actualización automática en Sprint 0.

## Estados de interfaz

- **Cargando:** se informa de que se está consultando la medición y se evita lanzar varias actualizaciones simultáneas.
- **Sin mediciones:** se muestra `Todavía no hay mediciones`.
- **Error:** se muestra un mensaje de error comprensible sin inventar datos.

## Segregación de responsabilidades

La UX no realiza peticiones HTTP directamente y no conoce la base de datos. Utiliza exclusivamente la lógica fake del navegador para solicitar la última medición.
