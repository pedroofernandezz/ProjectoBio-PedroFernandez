# Diseño de la lógica fake de Android — Sprint 0

## Objetivo

Definir el proxy que utiliza la aplicación Android para invocar remotamente las operaciones de la lógica real del negocio mediante el API REST.

La lógica fake **no implementa las reglas de negocio** y **no accede directamente a la base de datos**. Su responsabilidad es transformar llamadas lógicas en peticiones HTTP/JSON y devolver al cliente el resultado recibido.

## Tipo compartido

```text
Medicion = (
    id: N,
    tipo: Text,
    fecha: Text,
    valor: R
)
```

## Clase lógica

```text
------------- LogicaFakeAndroid -------------
|
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
----------------------------------------------
```

La lógica fake mantiene el mismo contrato lógico que la lógica real. En el Sprint 0, Android utilizará principalmente `registrarMedicion()`.

## Correspondencia con REST

### registrarMedicion()

```text
tipo: Text, fecha: Text, valor: R
    --> registrarMedicion()
medicion: Medicion <--
```

Se implementa mediante:

```text
POST /mediciones
```

Cuerpo JSON:

```json
{
  "tipo": "ozono",
  "fecha": "2026-10-06T10:30:00Z",
  "valor": 7.5
}
```

### obtenerUltimaMedicion()

```text
tipo: Text
    --> obtenerUltimaMedicion()
medicion: Medicion <--
```

Se implementa mediante:

```text
GET /mediciones/ultima?tipo=ozono
```

## Integración con Bluetooth

La recepción y decodificación BLE/iBeacon es responsabilidad del código Android de adquisición, no de la lógica real del negocio.

Para ozono, el protocolo del Sprint 0 utiliza:

- identificador lógico de medición: `14`;
- contador: byte inferior de `major`;
- valor de ozono: `minor / 1000.0`, expresado en ppm.

Cuando Android recibe una medición válida, añade la fecha y hora correspondiente y llama a `registrarMedicion()`.

## Segregación de responsabilidades

- BLE/iBeacon: adquisición de la medición.
- Lógica fake Android: comunicación con el backend.
- Servidor REST: adaptación HTTP.
- Lógica real: reglas de negocio.
- Base de datos: persistencia.

La lógica fake Android no contiene SQL, no valida reglas propias del negocio y no contiene elementos de interfaz gráfica.
