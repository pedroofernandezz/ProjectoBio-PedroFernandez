# Diseño de la lógica fake del frontend web — Sprint 0

## Diseño del Componente

Componente: `frontend_business_logic` — implementación `src/frontend_business_logic/LogicaFakeWeb.js`.

```text
Medicion = (id: N, tipo: Text, fecha: Text, valor: R)

---------------- LogicaFakeWeb ----------------
| url_servidor: Text
|
|
tipo: Text, fecha: Text, valor: R --> registrarMedicion() -->
medicion: Medicion <--
|
|
tipo: Text --> obtenerUltimaMedicion() <--
medicion: Medicion <--
|
-----------------------------------------------
```

Las firmas públicas de `registrarMedicion(tipo, fecha, valor)` y `obtenerUltimaMedicion(tipo)` son idénticas a las de `LogicaMediciones` en `doc/business_logic_design.md`. La GUI de este sprint solo utiliza `obtenerUltimaMedicion("ozono")`.

La implementación del proxy traduce las llamadas a `POST /mediciones` y `GET /mediciones/ultima?tipo=ozono`, gestiona JSON y comunica errores identificables. No implementa reglas de negocio, SQL ni manipulación de la pantalla.

## Aclaraciones del Diseño

- La GUI (`src/gui/app.js`) solo llama al método de dominio `obtenerUltimaMedicion()` del proxy.
- Todas las operaciones `fetch()` y detalles HTTP quedan dentro de `LogicaFakeWeb`.
- La interfaz del cliente puede usar un subconjunto de las operaciones del negocio real.
- `web/LogicaFakeWeb.js` mantiene la ruta de importación original sin duplicar lógica.

## Reglas Generales

- **Lenguaje de programación:** JavaScript (módulos ES del navegador).
- **Encabezados:** cada función o método tendrá su firma lógica en un comentario delimitado por líneas discontinuas (`--------------------`).
- **Legibilidad:** usar nombres claros y evitar comentarios redundantes.
- **Pruebas automatizadas:** cubrir las operaciones clave mediante pruebas unitarias o de integración; conservar las pruebas existentes.
- **Separación:** implementar únicamente las responsabilidades indicadas en este diseño, sin incorporar las de otras capas.

