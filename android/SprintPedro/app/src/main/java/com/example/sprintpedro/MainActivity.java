
package com.example.sprintpedro;
// ------------------------------------------------------------------
// ------------------------------------------------------------------

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanFilter;
import android.bluetooth.le.ScanResult;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.ParcelUuid;
import android.util.Log;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.util.List;
import java.util.UUID;

import android.os.Build;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

// ------------------------------------------------------------------
// ------------------------------------------------------------------

public class MainActivity extends AppCompatActivity {

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    private static final String ETIQUETA_LOG = ">>>>";

    private static final int CODIGO_PETICION_PERMISOS = 11223344;

    private static final String URL_SERVIDOR =
            "http://192.168.18.189:8080";

    private final DecodificadorOzono decodificadorOzono =
            new DecodificadorOzono();

    private LogicaFakeAndroid logicaFakeAndroid;

    private Integer ultimoContadorProcesado = null;

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    private BluetoothLeScanner elEscanner;

    private ScanCallback callbackDelEscaneo = null;

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    private void buscarTodosLosDispositivosBTLE() {
        Log.d(ETIQUETA_LOG, " buscarTodosLosDispositivosBTL(): empieza ");

        Log.d(ETIQUETA_LOG, " buscarTodosLosDispositivosBTL(): instalamos scan callback ");

        this.callbackDelEscaneo = new ScanCallback() {
            @Override
            public void onScanResult( int callbackType, ScanResult resultado ) {
                super.onScanResult(callbackType, resultado);
                Log.d(ETIQUETA_LOG, " buscarTodosLosDispositivosBTL(): onScanResult() ");

                mostrarInformacionDispositivoBTLE( resultado );
            }

            @Override
            public void onBatchScanResults(List<ScanResult> results) {
                super.onBatchScanResults(results);
                Log.d(ETIQUETA_LOG, " buscarTodosLosDispositivosBTL(): onBatchScanResults() ");

            }

            @Override
            public void onScanFailed(int errorCode) {
                super.onScanFailed(errorCode);
                Log.d(ETIQUETA_LOG, " buscarTodosLosDispositivosBTL(): onScanFailed() ");

            }
        };

        Log.d(ETIQUETA_LOG, " buscarTodosLosDispositivosBTL(): empezamos a escanear ");

        if (this.elEscanner == null) {
            return;
        }

        if (
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.S
                        &&
                        ActivityCompat.checkSelfPermission(
                                this,
                                Manifest.permission.BLUETOOTH_SCAN
                        ) != PackageManager.PERMISSION_GRANTED
        ) {
            return;
        }

        this.elEscanner.startScan( this.callbackDelEscaneo);

    } // ()

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    private void mostrarInformacionDispositivoBTLE( ScanResult resultado ) {

        BluetoothDevice bluetoothDevice = resultado.getDevice();
        byte[] bytes = resultado.getScanRecord().getBytes();
        if (bytes == null || bytes.length < 30) {
            return;
        }
        int rssi = resultado.getRssi();

        Log.d(ETIQUETA_LOG, " ****************************************************");
        Log.d(ETIQUETA_LOG, " ****** DISPOSITIVO DETECTADO BTLE ****************** ");
        Log.d(ETIQUETA_LOG, " ****************************************************");
        if (
                Build.VERSION.SDK_INT < Build.VERSION_CODES.S
                        ||
                        ActivityCompat.checkSelfPermission(
                                this,
                                Manifest.permission.BLUETOOTH_CONNECT
                        ) == PackageManager.PERMISSION_GRANTED
        ) {

            Log.d(
                    ETIQUETA_LOG,
                    " nombre = " + bluetoothDevice.getName()
            );

            Log.d(
                    ETIQUETA_LOG,
                    " dirección = " + bluetoothDevice.getAddress()
            );
        }

        Log.d(
                ETIQUETA_LOG,
                " toString = " + bluetoothDevice
        );

        /*
        ParcelUuid[] puuids = bluetoothDevice.getUuids();
        if ( puuids.length >= 1 ) {
            //Log.d(ETIQUETA_LOG, " uuid = " + puuids[0].getUuid());
           // Log.d(ETIQUETA_LOG, " uuid = " + puuids[0].toString());
        }*/
        Log.d(ETIQUETA_LOG, " rssi = " + rssi );

        Log.d(ETIQUETA_LOG, " bytes = " + new String(bytes));
        Log.d(ETIQUETA_LOG, " bytes (" + bytes.length + ") = " + Utilidades.bytesToHexString(bytes));

        TramaIBeacon tib = new TramaIBeacon(bytes);

        Log.d(ETIQUETA_LOG, " ----------------------------------------------------");
        Log.d(ETIQUETA_LOG, " prefijo  = " + Utilidades.bytesToHexString(tib.getPrefijo()));
        Log.d(ETIQUETA_LOG, "          advFlags = " + Utilidades.bytesToHexString(tib.getAdvFlags()));
        Log.d(ETIQUETA_LOG, "          advHeader = " + Utilidades.bytesToHexString(tib.getAdvHeader()));
        Log.d(ETIQUETA_LOG, "          companyID = " + Utilidades.bytesToHexString(tib.getCompanyID()));
        Log.d(ETIQUETA_LOG, "          iBeacon type = " + Integer.toHexString(tib.getiBeaconType()));
        Log.d(ETIQUETA_LOG, "          iBeacon length 0x = " + Integer.toHexString(tib.getiBeaconLength()) + " ( "
                + tib.getiBeaconLength() + " ) ");
        Log.d(ETIQUETA_LOG, " uuid  = " + Utilidades.bytesToHexString(tib.getUUID()));
        Log.d(ETIQUETA_LOG, " uuid  = " + Utilidades.bytesToString(tib.getUUID()));
        Log.d(ETIQUETA_LOG, " major  = " + Utilidades.bytesToHexString(tib.getMajor()) + "( "
                + Utilidades.bytesToInt(tib.getMajor()) + " ) ");
        Log.d(ETIQUETA_LOG, " minor  = " + Utilidades.bytesToHexString(tib.getMinor()) + "( "
                + Utilidades.bytesToInt(tib.getMinor()) + " ) ");
        Log.d(ETIQUETA_LOG, " txPower  = " + Integer.toHexString(tib.getTxPower()) + " ( " + tib.getTxPower() + " )");
        Log.d(ETIQUETA_LOG, " ****************************************************");

        procesarTramaOzono(tib);

    } // ()

    /*
     * trama: TramaIBeacon --> procesarTramaOzono()
     * Decodifica una medición de ozono válida y la envía una sola vez al servidor.
     */
    private void procesarTramaOzono(TramaIBeacon trama) {

        if (!decodificadorOzono.esTramaOzono(trama)) {
            return;
        }

        int contador =
                decodificadorOzono.obtenerContador(trama);

        synchronized (this) {

            if (
                    ultimoContadorProcesado != null
                            && ultimoContadorProcesado == contador
            ) {
                return;
            }

            ultimoContadorProcesado = contador;
        }

        double valor =
                decodificadorOzono.obtenerValorPpm(trama);

        String fecha =
                obtenerFechaUtc();

        Log.d(
                ETIQUETA_LOG,
                "Ozono recibido: "
                        + valor
                        + " ppm, contador="
                        + contador
        );

        new Thread(() -> {

            try {

                Medicion medicion =
                        logicaFakeAndroid.registrarMedicion(
                                "ozono",
                                fecha,
                                valor
                        );

                Log.d(
                        ETIQUETA_LOG,
                        "Medición enviada al servidor. id="
                                + medicion.getId()
                                + " valor="
                                + medicion.getValor()
                );

            } catch (IOException error) {

                synchronized (MainActivity.this) {

                    if (
                            ultimoContadorProcesado != null
                                    && ultimoContadorProcesado == contador
                    ) {
                        ultimoContadorProcesado = null;
                    }
                }

                Log.e(
                        ETIQUETA_LOG,
                        "Error enviando medición al servidor",
                        error
                );
            }

        }).start();
    }

    /*
     * --> obtenerFechaUtc() --> fecha: Text
     * Obtiene la fecha y hora actual en UTC con formato ISO compatible con el backend.
     */
    private String obtenerFechaUtc() {

        SimpleDateFormat formato =
                new SimpleDateFormat(
                        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
                        Locale.US
                );

        formato.setTimeZone(
                TimeZone.getTimeZone("UTC")
        );

        return formato.format(
                new Date()
        );
    }

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    private void buscarEsteDispositivoBTLE(final String dispositivoBuscado ) {
        Log.d(ETIQUETA_LOG, " buscarEsteDispositivoBTLE(): empieza ");

        Log.d(ETIQUETA_LOG, "  buscarEsteDispositivoBTLE(): instalamos scan callback ");


        // super.onScanResult(ScanSettings.SCAN_MODE_LOW_LATENCY, result); para ahorro de energía

        this.callbackDelEscaneo = new ScanCallback() {
            @Override
            public void onScanResult( int callbackType, ScanResult resultado ) {
                super.onScanResult(callbackType, resultado);
                Log.d(ETIQUETA_LOG, "  buscarEsteDispositivoBTLE(): onScanResult() ");

                mostrarInformacionDispositivoBTLE( resultado );
            }

            @Override
            public void onBatchScanResults(List<ScanResult> results) {
                super.onBatchScanResults(results);
                Log.d(ETIQUETA_LOG, "  buscarEsteDispositivoBTLE(): onBatchScanResults() ");

            }

            @Override
            public void onScanFailed(int errorCode) {
                super.onScanFailed(errorCode);
                Log.d(ETIQUETA_LOG, "  buscarEsteDispositivoBTLE(): onScanFailed() ");

            }
        };

        ScanFilter sf = new ScanFilter.Builder().setDeviceName( dispositivoBuscado ).build();

        Log.d(ETIQUETA_LOG, "  buscarEsteDispositivoBTLE(): empezamos a escanear buscando: " + dispositivoBuscado );
        //Log.d(ETIQUETA_LOG, "  buscarEsteDispositivoBTLE(): empezamos a escanear buscando: " + dispositivoBuscado
          //      + " -> " + Utilidades.stringToUUID( dispositivoBuscado ) );

        if (this.elEscanner == null) {
            return;
        }

        if (
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.S
                        &&
                        ActivityCompat.checkSelfPermission(
                                this,
                                Manifest.permission.BLUETOOTH_SCAN
                        ) != PackageManager.PERMISSION_GRANTED
        ) {
            return;
        }

        this.elEscanner.startScan( this.callbackDelEscaneo );
    } // ()

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    private void detenerBusquedaDispositivosBTLE() {

        if ( this.callbackDelEscaneo == null ) {
            return;
        }

        if (
                Build.VERSION.SDK_INT < Build.VERSION_CODES.S
                        ||
                        ActivityCompat.checkSelfPermission(
                                this,
                                Manifest.permission.BLUETOOTH_SCAN
                        ) == PackageManager.PERMISSION_GRANTED
        ) {
            this.elEscanner.stopScan(
                    this.callbackDelEscaneo
            );
        }
        this.callbackDelEscaneo = null;

    } // ()

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    public void botonBuscarDispositivosBTLEPulsado( View v ) {
        Log.d(ETIQUETA_LOG, " boton buscar dispositivos BTLE Pulsado" );
        this.buscarTodosLosDispositivosBTLE();
    } // ()

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    public void botonBuscarNuestroDispositivoBTLEPulsado( View v ) {
        Log.d(ETIQUETA_LOG, " boton nuestro dispositivo BTLE Pulsado" );
        //this.buscarEsteDispositivoBTLE( Utilidades.stringToUUID( "EPSG-GTI-PROY-3A" ) );

        //this.buscarEsteDispositivoBTLE( "EPSG-GTI-PROY-3A" );
        this.buscarEsteDispositivoBTLE( "fistro" );

    } // ()

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    public void botonDetenerBusquedaDispositivosBTLEPulsado( View v ) {
        Log.d(ETIQUETA_LOG, " boton detener busqueda dispositivos BTLE Pulsado" );
        this.detenerBusquedaDispositivosBTLE();
    } // ()

    /*
     * --> tienePermisosBluetooth() --> concedidos: B
     * Comprueba los permisos Bluetooth necesarios según la versión de Android.
     */
    private boolean tienePermisosBluetooth() {

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {

            return ActivityCompat.checkSelfPermission(
                    this,
                    Manifest.permission.BLUETOOTH_SCAN
            ) == PackageManager.PERMISSION_GRANTED
                    &&
                    ActivityCompat.checkSelfPermission(
                            this,
                            Manifest.permission.BLUETOOTH_CONNECT
                    ) == PackageManager.PERMISSION_GRANTED;
        }

        return ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED;
    }

    /*
     * --> pedirPermisosBluetooth()
     * Solicita los permisos Bluetooth necesarios según la versión de Android.
     */
    private void pedirPermisosBluetooth() {

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {

            ActivityCompat.requestPermissions(
                    this,
                    new String[]{
                            Manifest.permission.BLUETOOTH_SCAN,
                            Manifest.permission.BLUETOOTH_CONNECT
                    },
                    CODIGO_PETICION_PERMISOS
            );

        } else {

            ActivityCompat.requestPermissions(
                    this,
                    new String[]{
                            Manifest.permission.ACCESS_FINE_LOCATION
                    },
                    CODIGO_PETICION_PERMISOS
            );
        }
    }

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    /*
     * --> inicializarBlueTooth()
     * Comprueba los permisos y obtiene el escáner BLE del dispositivo.
     */
    private void inicializarBlueTooth() {

        Log.d(
                ETIQUETA_LOG,
                "inicializarBlueTooth(): empieza"
        );

        if (!tienePermisosBluetooth()) {

            pedirPermisosBluetooth();
            return;
        }

        BluetoothAdapter bta =
                BluetoothAdapter.getDefaultAdapter();

        if (bta == null) {

            Log.e(
                    ETIQUETA_LOG,
                    "El dispositivo no dispone de Bluetooth"
            );

            return;
        }

        if (
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.S
                        &&
                        ActivityCompat.checkSelfPermission(
                                this,
                                Manifest.permission.BLUETOOTH_CONNECT
                        ) != PackageManager.PERMISSION_GRANTED
        ) {
            return;
        }

        if (!bta.isEnabled()) {

            Log.e(
                    ETIQUETA_LOG,
                    "Bluetooth está desactivado"
            );

            return;
        }

        this.elEscanner =
                bta.getBluetoothLeScanner();

        if (this.elEscanner == null) {

            Log.e(
                    ETIQUETA_LOG,
                    "No se ha podido obtener el escáner BLE"
            );
        }
    } //()


    // --------------------------------------------------------------
    // --------------------------------------------------------------
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        logicaFakeAndroid =
                new LogicaFakeAndroid(URL_SERVIDOR);

        Log.d(ETIQUETA_LOG, " onCreate(): empieza ");

        inicializarBlueTooth();

        Log.d(ETIQUETA_LOG, " onCreate(): termina ");

    } // onCreate()

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    /*
     * request_code: N, permisos: [Text], resultados: [Z]
     *     --> onRequestPermissionsResult()
     * Continúa la inicialización Bluetooth después de resolver la petición de permisos.
     */
    @Override
    public void onRequestPermissionsResult(
            int requestCode,
            String[] permissions,
            int[] grantResults
    ) {

        super.onRequestPermissionsResult(
                requestCode,
                permissions,
                grantResults
        );

        if (requestCode != CODIGO_PETICION_PERMISOS) {
            return;
        }

        if (tienePermisosBluetooth()) {

            Log.d(
                    ETIQUETA_LOG,
                    "Permisos Bluetooth concedidos"
            );

            inicializarBlueTooth();

        } else {

            Log.e(
                    ETIQUETA_LOG,
                    "Permisos Bluetooth no concedidos"
            );
        }
    }

} // class
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------


