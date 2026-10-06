# Diseño de base de datos — Sprint 0

## Objetivo

Persistir las mediciones recibidas desde el teléfono Android con la estructura mínima necesaria para la demostración del Sprint 0.

## Tabla

```text
---------------- MEDICION ----------------
| id: N        PK
| tipo: Text
| fecha: Text
| valor: R
------------------------------------------
```

## Significado de los campos

- `id`: identificador único de la medición. Lo genera la base de datos.
- `tipo`: magnitud medida. En Sprint 0 se utiliza `ozono`.
- `fecha`: fecha y hora asociadas a la medición.
- `valor`: valor numérico de la medición. Para ozono se expresa en ppm.

## Restricciones

- `id` es clave primaria y autogenerada.
- `tipo`, `fecha` y `valor` son obligatorios.
- No se añaden más tablas en Sprint 0.
- No se almacenan usuarios, dispositivos, ubicaciones, alarmas ni configuraciones.

## Operaciones necesarias

La persistencia debe permitir:

```text
tipo: Text, fecha: Text, valor: R
    --> insertarMedicion()
medicion: Medicion <--
```

y:

```text
tipo: Text
    --> obtenerUltimaMedicion()
medicion: Medicion <--
```

Para obtener la última medición se ordenará por `fecha` descendente y, en caso de empate, por `id` descendente.

## Relación con la arquitectura

La base de datos no es accedida directamente por Android ni por la página web. El acceso se realiza exclusivamente desde la lógica real del negocio.
