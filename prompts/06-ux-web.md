# Prompt 06 — Generar la UX web

## Diseño gráfico de referencia

Implementa exactamente el diseño de `disenos/05-ux-web.md`.

La aplicación consta de una única pantalla:

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

El valor del boceto es únicamente ilustrativo.

## Aclaraciones

La pantalla debe mostrar exclusivamente:

- valor de la última medición;
- unidad `ppm`;
- fecha y hora;
- botón `Actualizar medición`.

No añadas gráficas, historial, filtros, menú, selección de dispositivos, usuarios, autenticación ni otras pantallas.

## Comportamiento

1. Al cargar la página, llama a `obtenerUltimaMedicion("ozono")` a través de la lógica fake web.
2. Muestra el `valor` y la `fecha` recibidos.
3. Al pulsar `Actualizar medición`, vuelve a realizar la misma operación y sustituye los datos mostrados.
4. No existe actualización automática en Sprint 0.
5. Durante una consulta, muestra un estado de carga y evita varias actualizaciones simultáneas.
6. Si no existen mediciones, muestra `Todavía no hay mediciones`.
7. Si ocurre un error, muestra un mensaje comprensible y no inventes un valor.
8. Presenta fecha y hora de forma legible.
9. La UX se comunica exclusivamente con la lógica fake; no realiza peticiones REST directamente.

## Diseño visual

Mantén una interfaz sencilla, clara y adaptable a escritorio y móvil. El valor de ozono debe ser el elemento visual principal, seguido de su unidad y de la fecha/hora.

No introduzcas elementos decorativos que dificulten la lectura.

## Comentarios obligatorios

Cada función debe comenzar con una cabecera que incluya su firma lógica en la notación de la asignatura y una descripción breve.

Añade comentarios internos solo cuando aporten información útil.

## Tests automáticos

Incluye pruebas para:

- carga inicial;
- representación correcta del valor;
- representación de `ppm`;
- representación de fecha y hora;
- pulsación de `Actualizar medición`;
- sustitución del valor anterior por el nuevo;
- estado de carga;
- ausencia de mediciones;
- error de servidor/conexión;
- prevención de actualizaciones simultáneas.

## Criterio de aceptación

Si la lógica fake devuelve una medición conocida, la página debe mostrar exactamente su valor en ppm y su fecha/hora. Si la lógica fake devuelve otra medición después de pulsar `Actualizar medición`, la pantalla debe reemplazar los datos anteriores por los nuevos. Los tests automáticos deben pasar.

## Entrega

Entrega los archivos de la UX, sus tests y las instrucciones para ejecutarla. No modifiques el backend ni implementes llamadas REST directas desde la interfaz.
