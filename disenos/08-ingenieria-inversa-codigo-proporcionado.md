# Ingeniería inversa del código proporcionado — Sprint 0

## Objetivo

Documentar, en la notación lógica de la asignatura, la arquitectura del código base proporcionado que se reutiliza en el Sprint 0.

Este documento no añade funcionalidad nueva. Describe las responsabilidades existentes para mantener separados adquisición, codificación BLE, comunicación remota y lógica del negocio.

---

# 1. Código Arduino / SparkFun

## 1.1 Programa principal — `HolaMundoIBeacon.ino`

Responsabilidad: inicializar los componentes y ejecutar el ciclo de adquisición y publicación de una medición.

Flujo lógico utilizado en el Sprint 0:

```text
setup()
  |
  +--> PuertoSerie.esperarDisponible()
  +--> Publicador.encenderEmisora()
  +--> Medidor.iniciarMedidor()

loop()
  |
  +--> Medidor.leerVgasVoltios()
  +--> Medidor.leerVrefVoltios()
  +--> Medidor.medirOzono()
  +--> Publicador.publicarOzono()
```

La medición de ozono se codifica en un anuncio iBeacon.

**Adaptación de la versión de evaluación:** el código proporcionado conserva `Medidor.medirOzono()`, pero el test obligatorio del Sprint 0 introduce directamente `12.34f` en `loop()` como medida ficticia y publica ese valor. Las lecturas `Vgas` y `Vref` se mantienen únicamente como trazas del código de adquisición.

---

## 1.2 Clase `Medidor`

Responsabilidad: adquirir las señales analógicas del sensor y calcular la concentración de ozono.

```text
---------------- Medidor ----------------
|
| pin_vgas: N
| pin_vref: N
| pin_vtemp: N
| adc_max: R
| voltaje_adc: R
| sensibilidad: R
|
|
Medidor() -->
|
|
iniciarMedidor() -->
|
|
R <-- leerVgasVoltios() <--
|
|
R <-- leerVrefVoltios() <--
|
|
vgas: R, vref: R --> medirOzono() <--
ozono: R <--
|
|
Z <-- medirTemperatura() <--
|
-----------------------------------------
```

Para Sprint 0, la operación relevante es:

```text
vgas: R, vref: R --> medirOzono() --> ozono: R
```

---

## 1.3 Clase `Publicador`

Responsabilidad: convertir una medición lógica en los campos `major` y `minor` del iBeacon y ordenar su emisión.

Identificadores presentes en el código proporcionado:

```text
MedicionesID = {
    CO2,
    TEMPERATURA,
    RUIDO,
    OZONO
}
```

En la implementación actual:

```text
OZONO = 14
```

Diseño de las operaciones relevantes:

```text
--------------- Publicador ---------------
|
| beacon_uuid: [N]_16
| emisora: EmisoraBLE
| rssi: Z
|
|
Publicador() -->
|
|
encenderEmisora() -->
|
|
valor: R, contador: N, espera: N --> publicarOzono() -->
B <--
|
------------------------------------------
```

Codificación de ozono:

```text
major = (14 << 8) + contador
minor = redondear(valor_ppm * 1000)
```

Por tanto:

- byte alto de `major`: identificador de magnitud;
- byte bajo de `major`: contador;
- `minor`: valor de ozono en milésimas de ppm.

---

## 1.4 Clase `EmisoraBLE`

Responsabilidad: encapsular la biblioteca Bluefruit y emitir anuncios BLE/iBeacon.

```text
--------------- EmisoraBLE ----------------
|
| nombre_emisora: Text
| fabricante_id: N
| tx_power: Z
|
|
nombre: Text, fabricante: N, potencia: Z --> EmisoraBLE() -->
|
|
encenderEmisora() -->
|
|
detenerAnuncio() -->
|
|
B <-- estaAnunciando() <--
|
|
uuid: [N]_16, major: N, minor: Z, rssi: Z --> emitirAnuncioIBeacon() -->
|
--------------------------------------------
```

Para Sprint 0 solamente se necesita la emisión iBeacon. Las funciones de servicios BLE presentes en el fichero quedan fuera del flujo de la demostración, aunque forman parte del código proporcionado.

---

## 1.5 Clase `LED`

Responsabilidad: controlar el LED de la placa.

```text
---------------- LED ----------------
|
| numero_led: N
| encendido: B
|
|
numero: N --> LED() -->
|
|
encender() -->
|
|
apagar() -->
|
|
alternar() -->
|
|
tiempo: N --> brillar() -->
|
-------------------------------------
```

No participa en la cadena de datos de la medición del Sprint 0.

---

## 1.6 Clase `PuertoSerie`

Responsabilidad: encapsular la salida serie utilizada para diagnóstico.

```text
------------- PuertoSerie -------------
|
|
baudios: N --> PuertoSerie() -->
|
|
esperarDisponible() -->
|
|
mensaje: Text --> escribir() -->
|
---------------------------------------
```

No participa en el transporte de la medición hacia el backend.

---

## 1.7 `ServicioEnEmisora`

El código proporcionado incluye soporte para servicios y características BLE conectables.

Responsabilidad general:

```text
ServicioEnEmisora
  |
  +--> contiene Caracteristica
  +--> añade características
  +--> activa BLEService
```

El Sprint 0 utiliza anuncios iBeacon y no necesita un servicio GATT para transportar la medición.

---

# 2. Código Android proporcionado

El material base contiene:

```text
MainActivity.java
TramaIBeacon.java
Utilidades.java
AndroidManifest.xml
activity_main.xml
build.gradle-APP
```

La aplicación base ya dispone de escaneo BLE, lectura de la trama iBeacon y permisos de Bluetooth/Internet.

---

## 2.1 Clase `TramaIBeacon`

Responsabilidad: separar los campos de una trama iBeacon recibida.

Tipo lógico:

```text
IBeacon = (
    prefijo: [N]_9,
    uuid: [N]_16,
    major: [N]_2,
    minor: [N]_2,
    tx_power: Z
)
```

Diseño:

```text
--------------- TramaIBeacon ---------------
|
| prefijo: [N]_9
| uuid: [N]_16
| major: [N]_2
| minor: [N]_2
| tx_power: Z
| bytes: [N]
|
|
bytes: [N] --> TramaIBeacon() -->
|
|
[N]_9 <-- getPrefijo() <--
|
|
[N]_16 <-- getUUID() <--
|
|
[N]_2 <-- getMajor() <--
|
|
[N]_2 <-- getMinor() <--
|
|
Z <-- getTxPower() <--
|
--------------------------------------------
```

---

## 2.2 Clase `Utilidades`

Responsabilidad: conversiones auxiliares entre bytes, texto, enteros y UUID.

Operaciones relevantes para Sprint 0:

```text
bytes: [N] --> bytesToInt() --> valor: Z
bytes: [N] --> bytesToIntOK() --> valor: Z
bytes: [N] --> bytesToString() --> texto: Text
```

El código Android puede obtener así los valores enteros de `major` y `minor`.

---

## 2.3 Clase `MainActivity`

Responsabilidad del código proporcionado: solicitar permisos, obtener el escáner BLE, iniciar/detener el escaneo y entregar cada anuncio detectado al código que analiza la trama.

Para la adaptación de Sprint 0, `MainActivity` conserva esas responsabilidades y coordina el envío de una medición de ozono válida hacia la lógica fake. El contador de 8 bits se utiliza únicamente para no procesar varias veces anuncios consecutivos de una misma emisión; no se considera un identificador global.

Diseño utilizado en Sprint 0:

```text
---------------- MainActivity ----------------
|
| escaner_ble
| callback_escaneo
| decodificador_ozono: DecodificadorOzono
| logica_fake: LogicaFakeAndroid
| ultimo_contador_procesado: Z
|
|
buscarTodosLosDispositivosBTLE() -->
|
|
resultado_ble --> mostrarInformacionDispositivoBTLE() -->
|
|
trama: TramaIBeacon --> procesarTramaOzono() -->
|
|
dispositivo: Text --> buscarEsteDispositivoBTLE() -->
|
|
detenerBusquedaDispositivosBTLE() -->
|
|
inicializarBlueTooth() -->
|
------------------------------------------------
```

`procesarTramaOzono()` realiza únicamente la coordinación del cliente:

```text
TramaIBeacon
    |
    +--> comprobar UUID e id 14
    +--> obtener contador
    +--> ignorar repetición consecutiva del mismo contador
    +--> obtener valor ppm
    +--> obtener fecha/hora UTC
    +--> LogicaFakeAndroid.registrarMedicion()
```

La petición HTTP se ejecuta fuera del hilo de interfaz de Android. Esta decisión es un detalle de implementación y no modifica el contrato lógico de la lógica fake.

Flujo del código base:

```text
ScanCallback
    |
    v
ScanResult
    |
    v
bytes del anuncio
    |
    v
TramaIBeacon
    |
    +--> UUID
    +--> major
    +--> minor
```

---

# 3. Adaptación necesaria para ProyectoBio

Sobre el código base Android se añadirá únicamente la cadena exigida por el Sprint 0:

```text
TramaIBeacon
      |
      v
DecodificadorOzono
      |
      | id = byte alto de major = 14
      | contador = byte bajo de major
      | valor = minor / 1000.0
      v
Medicion
      |
      v
LogicaFakeAndroid.registrarMedicion()
      |
      v
POST /mediciones
```

La recepción BLE no se introducirá en la lógica del negocio. La lógica fake Android será el proxy encargado de la comunicación HTTP con el servidor.

---

# 4. Correspondencia con la arquitectura general

```text
Medidor
  |
  v
Publicador
  |
  v
EmisoraBLE
  |
  | iBeacon
  v
MainActivity / escáner BLE
  |
  v
TramaIBeacon
  |
  v
DecodificadorOzono
  |
  v
LogicaFakeAndroid
  |
  | HTTP
  v
Servidor REST
  |
  v
LogicaMediciones
  |
  v
BaseDatos
```

Este diseño deberá mantenerse sincronizado con la implementación. Si cambia una responsabilidad o una operación pública, primero deberá actualizarse el diseño y después el código.
