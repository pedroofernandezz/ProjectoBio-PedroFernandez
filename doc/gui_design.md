# Diseño de la interfaz gráfica web — Sprint 0

## Diseño del Componente

Componente: `gui` — implementación `src/gui/app.js`; estructura HTML en `web/index.html` y estilos en `web/styles.css`.

Pantalla única: título «MEDICIÓN OZONO», valor numérico en ppm, fecha/hora y botón «ACTUALIZAR».

```text
fecha: Text --> formatearFecha() --> fecha_legible: Text
elementos: ElementosGUI --> mostrarCargando()
medicion: Medicion, elementos: ElementosGUI --> mostrarMedicion()
elementos: ElementosGUI --> mostrarSinMediciones()
elementos: ElementosGUI --> mostrarError()
logica: LogicaFakeWeb, elementos: ElementosGUI, estado: EstadoGUI --> actualizarMedicion()
inicializarAplicacion()
```

Al cargar la página o pulsar ACTUALIZAR, la GUI invoca `logica.obtenerUltimaMedicion("ozono")`, muestra el resultado o un estado de error y habilita de nuevo el botón. No construye URLs de REST ni realiza `fetch()`.

## Aclaraciones del Diseño

- La comunicación HTTP está encapsulada exclusivamente en `src/frontend_business_logic/LogicaFakeWeb.js`.
- La GUI no accede directamente a SQLite ni contiene reglas de validación de negocio.
- `web/app.js` conserva la ruta de entrada original usada por la página y los tests.
- La revisión visual detallada de la GUI queda fuera del alcance del agente.

## Reglas Generales

- **Lenguaje de programación:** JavaScript (módulos ES), HTML y CSS.
- **Encabezados:** cada función o método tendrá su firma lógica en un comentario delimitado por líneas discontinuas (`--------------------`).
- **Legibilidad:** usar nombres claros y evitar comentarios redundantes.
- **Pruebas automatizadas:** cubrir las operaciones clave mediante pruebas unitarias o de integración; conservar las pruebas existentes.
- **Separación:** implementar únicamente las responsabilidades indicadas en este diseño, sin incorporar las de otras capas.

