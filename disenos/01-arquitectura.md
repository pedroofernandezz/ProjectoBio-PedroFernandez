# Diseño de arquitectura — Sprint 0

## Objetivo

Representar la arquitectura completa necesaria para que una medición ficticia introducida en Arduino llegue hasta una página web.

## Diagrama

```text
ESCRITURA DE LA MEDICIÓN

Arduino / SparkFun
        │ BLE / iBeacon
        ▼
Android
        │
        ▼
Lógica fake Android
        │ POST /mediciones
        ▼
Servidor REST
        │ registrarMedicion()
        ▼
Lógica del negocio real
        │
        ▼
Base de datos / MEDICION


LECTURA DE LA ÚLTIMA MEDICIÓN

UX web
        │
        ▼
Lógica fake navegador
        │ GET /mediciones/ultima
        ▼
Servidor REST
        │ obtenerUltimaMedicion()
        ▼
Lógica del negocio real
        │
        ▼
Base de datos / MEDICION

La respuesta recorre el camino inverso hasta la UX web.
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
