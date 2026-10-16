# Diseño de base de datos — Sprint 0

## Diseño del Componente

Componente: `database` — implementación `src/database/BaseDatos.js`; esquema ejecutable `backend/bd/esquema.sql`; fichero persistente `backend/bd/mediciones.sqlite`.

```text
====================================================================================
TABLE: MEDICION
DESCRIPTION: Almacena las mediciones recibidas, con identificador, tipo, instante y valor.

COLUMNS:

+ id | INTEGER | NOT NULL | AUTOINCREMENT
+ tipo | TEXT | NOT NULL | sin valor por defecto
+ fecha | TEXT | NOT NULL | sin valor por defecto
+ valor | REAL | NOT NULL | sin valor por defecto

PRIMARY KEY: id

FOREIGN KEYS:

+ Ninguna (tabla única del Sprint 0).

CONSTRAINTS:

+ CHECK (length(trim(tipo)) > 0)
+ Índice idx_medicion_tipo_fecha sobre (tipo, fecha DESC, id DESC)
====================================================================================
```

### Operaciones de persistencia

```text
ruta: Text --> BaseDatos()
abrir()
inicializar()
tipo: Text, fecha: Text, valor: R --> insertarMedicion() --> medicion: Medicion
tipo: Text --> obtenerUltimaMedicion() --> medicion: Medicion
cerrar()
```

La inserción usa `INSERT INTO MEDICION (tipo, fecha, valor) VALUES (?, ?, ?)`, recupera el `id` autogenerado y devuelve la fila. La lectura utiliza `WHERE tipo = ? ORDER BY fecha DESC, id DESC LIMIT 1`. Las consultas son parametrizadas.

## Aclaraciones del Diseño

- SQLite guarda la información en un archivo local y no necesita un servidor de base de datos adicional.
- `esquema.sql` se ejecuta al inicializar la persistencia y utiliza `IF NOT EXISTS` para no eliminar las mediciones previas.
- La base de datos no conoce HTTP, BLE ni la GUI. Solo la lógica real debe invocar operaciones de persistencia.
- La ruta original `backend/bd/BaseDatos.js` se conserva como entrada compatible para los tests.

## Reglas Generales

- **Lenguaje de programación:** JavaScript (Node.js, CommonJS) y SQL (SQLite).
- **Encabezados:** cada función o método tendrá su firma lógica en un comentario delimitado por líneas discontinuas (`--------------------`).
- **Legibilidad:** usar nombres claros y evitar comentarios redundantes.
- **Pruebas automatizadas:** cubrir las operaciones clave mediante pruebas unitarias o de integración; conservar las pruebas existentes.
- **Separación:** implementar únicamente las responsabilidades indicadas en este diseño, sin incorporar las de otras capas.

