# Prompt 04 — Generar la lógica fake de Android

## Diseño de referencia

Implementa el proxy definido en `disenos/06-logica-fake-android.md` y reutiliza el código Android existente del proyecto.

Tipo compartido:

```text
Medicion = (
    id: N,
    tipo: Text,
    fecha: Text,
    valor: R
)
```

La lógica fake debe ofrecer el mismo contrato lógico que la lógica real:

```text
tipo: Text, fecha: Text, valor: R --> registrarMedicion() --> medicion: Medicion
tipo: Text --> obtenerUltimaMedicion() --> medicion: Medicion
```

En Sprint 0, Android utilizará principalmente `registrarMedicion()`.

## Protocolo BLE/iBeacon existente

La medición de ozono se identifica con:

- identificador lógico: `14`;
- contador: byte inferior de `major`;
- valor en ppm: `minor / 1000.0`.

La recepción BLE y la decodificación de la trama deben mantenerse separadas de la lógica fake REST.

## Directrices de implementación

1. Reutiliza la estructura Android existente; no reescribas innecesariamente el escáner BLE.
2. Cuando se reciba una medición de ozono válida, obtén el valor en ppm.
3. Añade la fecha y hora correspondiente en un formato compatible con el backend.
4. Invoca `registrarMedicion("ozono", fecha, valor)`.
5. La implementación de `registrarMedicion()` debe realizar `POST /mediciones`.
6. La implementación de `obtenerUltimaMedicion()` debe realizar `GET /mediciones/ultima?tipo=...`.
7. No accedas directamente a la base de datos.
8. No dupliques las reglas de la lógica real.
9. No inventes ni corrijas silenciosamente los valores recibidos.
10. Evita realizar múltiples POST innecesarios por copias del mismo anuncio BLE dentro de una misma recepción. Documenta la limitación de que el contador es de 8 bits y no constituye un identificador global.

## Comentarios obligatorios

Cada función debe comenzar con una cabecera que incluya su firma lógica en la notación de la asignatura y una breve descripción.

Añade comentarios internos cortos para la decodificación iBeacon y el tratamiento de errores de red cuando sean necesarios.

## Tests automáticos

Los tests no deben requerir una placa física. Incluye pruebas para:

- identificación de una trama de ozono;
- conversión de `minor` a ppm;
- creación correcta del objeto/JSON de medición;
- llamada POST correcta;
- respuesta correcta del servidor;
- error HTTP;
- fallo de red;
- anuncio BLE no perteneciente a ozono;
- tratamiento de anuncios repetidos.

## Criterio de aceptación

Dada una trama iBeacon simulada que represente una medida conocida de ozono, el código debe decodificar exactamente ese valor, construir una medición con tipo `ozono` y enviar un único `POST /mediciones` con el valor esperado. Los tests automáticos deben pasar sin hardware real.

## Entrega

Entrega únicamente la integración necesaria de la lógica fake Android, sus tests y las instrucciones de ejecución. No modifiques la lógica real ni la base de datos.
