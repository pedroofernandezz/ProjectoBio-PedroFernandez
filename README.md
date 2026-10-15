# ProjectoBio-PedroFernandez

Sprint 0 del proyecto PBIO 2026.

## Objetivo

Construir y documentar la cadena completa:

**Arduino / SparkFun → Android → API REST → lógica del negocio → base de datos → página web**

La demostración del Sprint 0 introduce una medida ficticia en el código Arduino, la envía por BLE al teléfono Android, la registra mediante la API REST y la lógica de negocio en SQLite y, finalmente, muestra esa misma medida como última medición en la página web.

La medida ficticia utilizada en la versión de evaluación es **12.34 ppm**.

## Estructura del repositorio

- `arduino/`: código para la placa SparkFun Pro nRF52840 Mini, medición y emisión BLE/iBeacon.
- `android/`: aplicación Android en Java que recibe y decodifica la trama BLE y utiliza la lógica fake para comunicarse con el servidor.
- `backend/`: base de datos SQLite, lógica real de negocio, API REST y servidor Node.js/Express.
- `web/`: página web, lógica fake del navegador y pruebas de la interfaz.
- `disenos/`: diseños de arquitectura, base de datos, lógica de negocio, REST, UX, lógicas fake e ingeniería inversa.
- `prompts/`: prompts y especificaciones utilizados durante el desarrollo con IA.

## Ramas

- `develop`: rama principal de desarrollo.
- `master`: versión estable para evaluación.

## Arquitectura funcional

```text
Arduino / SparkFun
        ↓ BLE / iBeacon
Android Java
        ↓ lógica fake Android
API REST
        ↓
lógica real de negocio
        ↓
SQLite
        ↑
API REST
        ↑ lógica fake web
página web
```

La lógica real de negocio es independiente del mecanismo remoto. Android y web acceden al servidor mediante sus respectivas lógicas fake/proxy.

## API REST

La versión del Sprint 0 utiliza únicamente las operaciones necesarias para la demostración:

- `POST /mediciones`: registra una medición.
- `GET /mediciones/ultima?tipo=ozono`: obtiene la última medición de ozono.

Una medición contiene:

```text
id
tipo
fecha
valor
```

## Base de datos

La persistencia utiliza SQLite. La base de datos se inicializa desde el backend y almacena las mediciones recibidas por la lógica de negocio.

## Despliegue y ejecución

### 1. Backend

Desde PowerShell:

```powershell
cd backend
npm ci
npm run servidor
```

El servidor REST queda escuchando en el puerto `8080`.

### 2. Arduino

Abrir el sketch de `arduino/HolaMundoIBeacon/` en Arduino IDE, seleccionar la placa SparkFun Pro nRF52840 Mini y cargar el programa.

La versión de evaluación utiliza:

```cpp
float valorOzono = 12.34f;
```

El valor se codifica en la trama iBeacon y se emite por BLE.

### 3. Android

Abrir el proyecto:

```text
android/SprintPedro
```

El teléfono Android y el ordenador que ejecuta el backend deben estar en una red en la que puedan comunicarse entre sí. La versión comprobada para la demo utiliza:

```text
http://172.20.10.2:8080
```

en `URL_SERVIDOR` de `MainActivity.java`.

Al iniciar la aplicación se deben conceder los permisos Bluetooth y de ubicación solicitados. Pulsar **Buscar Dispositivos BTLE** para comenzar el escaneo.

Cuando se recibe la trama del proyecto, la aplicación decodifica el valor de ozono y lo registra en el servidor mediante `LogicaFakeAndroid`.

### 4. Página web

Con el proyecto situado en:

```text
C:\xampp\htdocs\ProjectoBio-PedroFernandez
```

iniciar Apache desde XAMPP y abrir:

```text
http://localhost/ProjectoBio-PedroFernandez/web/
```

La página solicita al backend la última medición de ozono mediante `LogicaFakeWeb`. Al pulsar **ACTUALIZAR** se muestra el último valor almacenado.

## Prueba funcional del Sprint 0

La cadena completa comprobada es:

```text
12.34 ppm en Arduino
        ↓ BLE
Android recibe 12.34 ppm
        ↓ REST
lógica de negocio
        ↓
SQLite almacena 12.34 ppm
        ↓
web solicita la última medición
        ↓
12.34 ppm
```

## Tests automáticos

### Backend

```powershell
cd backend
npm test
```

Incluye pruebas de base de datos, lógica de negocio, REST e integración.

### Web

```powershell
cd web
npm test
```

Incluye pruebas de la lógica fake y de los estados y actualización de la interfaz.

### Android

Desde `android/SprintPedro`:

```powershell
.\gradlew.bat testDebugUnitTest
```

Incluye pruebas del decodificador de ozono y de la lógica fake Android.

## Diseños y uso de IA

Los diseños del Sprint 0 están en `disenos/` y los prompts utilizados durante el desarrollo con IA están documentados en `prompts/`.

## Autor

Pedro Fernández
