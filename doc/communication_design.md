# Diseño del componente de comunicación REST — Sprint 0

## Diseño del Componente

Componente: `communication` — implementación `src/communication/ReglasREST.js` y `src/communication/crearApp.js`.

Su responsabilidad es transformar peticiones HTTP/JSON en llamadas a `LogicaMediciones` y devolver respuestas HTTP. No accede directamente a SQLite, no contiene SQL y no valida reglas de dominio.

```text
logica: LogicaMediciones --> crearApp() --> app: ServidorREST

servidor: ServidorREST, logica: LogicaMediciones --> cargar()

peticion: PeticionHTTP, respuesta: RespuestaHTTP --> responderError()
```

### Contrato de transporte

| Método y ruta | Entrada | Delegación a negocio | Salida |
|---|---|---|---|
| POST /mediciones | JSON: tipo: Text, fecha: Text, valor: R | registrarMedicion(tipo, fecha, valor) | 201 y Medicion JSON |
| GET /mediciones/ultima?tipo=ozono | Query: tipo: Text | obtenerUltimaMedicion(tipo) | 200 y Medicion JSON |

Los errores de validación de negocio se traducen a HTTP 400; ausencia de mediciones a HTTP 404 (`SIN_MEDICIONES`); errores internos a HTTP 500. El middleware interpreta JSON y permite CORS para el navegador. El servidor se inicia en el puerto 8080 salvo configuración `PORT`.

### Dependencias

```text
Android (LogicaFakeAndroid) ── POST ──┐
                                      ▼
                                 Comunicación REST
                                      │
                                      ▼
                               LogicaMediciones
                                      │
                                      ▼
                                   BaseDatos
                                      ▲
                                      │
Web (LogicaFakeWeb) ───── GET ────────┘ (consulta vía REST y negocio)
```

## Aclaraciones del Diseño

- La comunicación conoce la lógica real, pero la lógica real no conoce Express, HTTP ni las rutas.
- El cuerpo JSON de registro no contiene `id`; lo asigna SQLite.
- Las peticiones REST son la interfaz remota de los clientes, no una implementación duplicada del negocio.
- Los archivos `backend/rest/` conservan entradas compatibles con el arranque y los tests existentes.

## Reglas Generales

- **Lenguaje de programación:** JavaScript (Node.js, CommonJS).
- **Encabezados:** cada función o método tendrá su firma lógica en un comentario delimitado por líneas discontinuas (`--------------------`).
- **Legibilidad:** usar nombres claros y evitar comentarios redundantes.
- **Pruebas automatizadas:** cubrir las operaciones clave mediante pruebas unitarias o de integración; conservar las pruebas existentes.
- **Separación:** implementar únicamente las responsabilidades indicadas en este diseño, sin incorporar las de otras capas.

