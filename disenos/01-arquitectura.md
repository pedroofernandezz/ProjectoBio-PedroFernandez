# Diseño de arquitectura — Sprint 0

## Objetivo

Representar la arquitectura completa necesaria para que una medición ficticia introducida en Arduino llegue hasta una página web.

## Diagrama

```text
┌─────────────────────────────┐
│ Arduino / SparkFun          │
│ Genera la medición          │
│ y la emite como iBeacon     │
└──────────────┬──────────────┘
               │ BLE / iBeacon
               ▼
┌─────────────────────────────┐
│ Android                     │
│ Recibe y decodifica beacon  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Lógica fake Android         │
│ Proxy de la lógica remota   │
└──────────────┬──────────────┘
               │ POST /mediciones
               ▼
┌─────────────────────────────┐
│ Servidor REST               │
│ Traduce HTTP ↔ lógica       │
└──────────────┬──────────────┘
               │ registrarMedicion()
               ▼
┌─────────────────────────────┐
│ Lógica del negocio real     │
│ Valida y coordina           │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Base de datos               │
│ Tabla MEDICION              │
└──────────────┬──────────────┘
               │
               │ obtenerUltimaMedicion()
               ▼
┌─────────────────────────────┐
│ Servidor REST               │
└──────────────┬──────────────┘
               │ GET /mediciones/ultima
               ▼
┌─────────────────────────────┐
│ Lógica fake navegador       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ UX web                      │
│ Valor + fecha/hora + botón  │
│ "Actualizar medición"       │
└─────────────────────────────┘
```

## Responsabilidades

- **Arduino / SparkFun:** producir una medida y emitirla por BLE/iBeacon.
- **Android:** detectar el beacon, extraer el valor y preparar la medición.
- **Lógica fake Android:** invocar remotamente `registrarMedicion()` mediante REST.
- **Servidor REST:** exponer las operaciones del negocio mediante HTTP/JSON. No contiene lógica de negocio.
- **Lógica del negocio real:** validar y registrar mediciones y consultar la última.
- **Base de datos:** persistir las mediciones.
- **Lógica fake navegador:** invocar remotamente `obtenerUltimaMedicion()`.
- **UX web:** mostrar únicamente la última medición, su fecha/hora y un botón para actualizar.

## Segregación de responsabilidades

La comunicación BLE pertenece al cliente Android. La comunicación HTTP pertenece a las capas REST/fake. La lógica de negocio no conoce BLE, HTTP ni la interfaz gráfica. La base de datos no contiene lógica de presentación.

## Alcance del Sprint 0

No se incluyen usuarios, autenticación, dispositivos, histórico navegable, gráficas, alertas ni otras funciones fuera de la demostración mínima.
