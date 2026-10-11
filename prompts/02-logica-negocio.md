# Prompt 02 — Generar la lógica real del negocio

## Diseño de referencia

Implementa exactamente el diseño de `disenos/02-logica-negocio.md`.

Tipo lógico:

```text
Medicion = (
    id: N,
    tipo: Text,
    fecha: Text,
    valor: R
)
```

Operaciones públicas:

```text
tipo: Text, fecha: Text, valor: R
    --> registrarMedicion()
medicion: Medicion <--
```

```text
tipo: Text
    --> obtenerUltimaMedicion()
medicion: Medicion <--
```

## Aclaraciones

La lógica real es la única capa que contiene las reglas del negocio. Debe ser independiente de HTTP, BLE/iBeacon, Android y la interfaz web.

En Sprint 0 el único tipo necesario es `ozono`, cuyo valor se expresa en ppm.

## Directrices de implementación

1. `registrarMedicion()` valida los datos recibidos, guarda la medición mediante la capa de persistencia y devuelve la medición completa con el `id` generado.
2. `obtenerUltimaMedicion()` devuelve la medición más reciente del tipo solicitado.
3. Si no existe ninguna medición, debe existir un resultado/error de ausencia distinguible por la capa REST.
4. No permitas valores no numéricos, NaN, infinitos ni negativos.
5. No conviertas silenciosamente datos inválidos en `0`.
6. La lógica no debe contener consultas HTTP, código de interfaz, código Bluetooth ni SQL embebido si existe una capa de persistencia separada.
7. Mantén las responsabilidades separadas.

## Comentarios obligatorios

Cada función debe comenzar con una cabecera que contenga:

1. su firma lógica en la notación de la asignatura;
2. una descripción breve de su responsabilidad.

Ejemplo:

```text
tipo: Text, fecha: Text, valor: R --> registrarMedicion() --> medicion: Medicion
Registra una medición válida y devuelve el registro persistido.
```

Añade otros comentarios internos únicamente cuando aclaren una decisión no evidente.

## Tests automáticos

Genera tests para:

- registro válido;
- devolución del `id` generado;
- obtención de la última medición;
- ausencia de mediciones;
- tipo no admitido;
- valor negativo;
- valor no numérico;
- NaN o infinito;
- fecha inválida;
- dos mediciones con la misma fecha.

Los tests de la lógica deben poder ejecutarse sin Android ni navegador.

## Criterio de aceptación

Partiendo de una persistencia vacía, tras registrar una medición válida de ozono, `obtenerUltimaMedicion("ozono")` debe devolver esa misma medición. Tras registrar una segunda medición posterior, debe devolver la segunda. Todos los tests automáticos deben superar sus aserciones.

## Entrega

Entrega el código de la lógica real, los tests y las instrucciones de ejecución. No implementes el servidor REST ni las interfaces cliente.
