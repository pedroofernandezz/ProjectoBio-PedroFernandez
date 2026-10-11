# Prompt 01 — Generar la base de datos

## Diseño de referencia

Implementa exclusivamente el diseño definido en `disenos/03-base-datos.md`.

La aplicación utiliza una única tabla:

```text
MEDICION
- id: N        PK, autogenerado
- tipo: Text   obligatorio
- fecha: Text  obligatorio
- valor: R     obligatorio
```

En Sprint 0 el tipo utilizado es `ozono` y su valor se expresa en ppm.

## Aclaraciones

La base de datos únicamente persiste mediciones. No deben existir tablas de usuarios, dispositivos, ubicaciones, alarmas, configuraciones ni históricos separados.

La lógica de negocio accederá a esta persistencia. Android y la web nunca accederán directamente a la base de datos.

## Directrices de implementación

1. Utiliza el motor de base de datos establecido por el proyecto. Si el proyecto todavía no fija uno, señala esa decisión antes de generar código dependiente de un motor concreto.
2. Crea exactamente la tabla `MEDICION` con los cuatro campos indicados.
3. `id` debe ser clave primaria autogenerada.
4. `tipo`, `fecha` y `valor` son obligatorios.
5. Debe poder insertarse una medición y consultarse la última medición de un tipo.
6. La última medición se obtiene ordenando por `fecha` descendente y, en caso de empate, por `id` descendente.
7. No añadas columnas ni tablas sin autorización.
8. No implementes REST, Bluetooth, UX ni reglas de negocio en esta parte.

## Comentarios y documentación

Añade comentarios breves únicamente cuando expliquen una decisión relevante de persistencia.

Si se generan funciones de acceso a datos, cada una debe comenzar con una cabecera que incluya su firma lógica en la notación de la asignatura, por ejemplo:

```text
tipo: Text --> obtenerUltimaMedicion() --> medicion: Medicion
```

acompañada de una descripción breve de su responsabilidad.

## Tests automáticos

Genera tests automáticos que comprueben:

- creación correcta de la tabla;
- inserción de una medición válida;
- generación automática del `id`;
- rechazo de campos obligatorios ausentes;
- conservación del valor decimal;
- obtención correcta de la medición más reciente;
- desempate correcto mediante `id` cuando dos fechas son iguales.

## Criterio de aceptación

Con una base de datos vacía, al insertar varias mediciones de tipo `ozono`, la consulta de última medición debe devolver exactamente la fila más reciente según `fecha` y `id`. Todos los tests automáticos deben finalizar correctamente.

## Entrega

Entrega los scripts o módulos de persistencia, los tests automáticos y las instrucciones para ejecutarlos. No implementes otras partes del sistema.
