package com.example.sprintpedro;

/*
 * Nombre: DecodificadorOzono.java
 * Descripción: Decodifica las mediciones de ozono recibidas mediante iBeacon.
 * Copyright: (c) 2026 Pedro Fernández
 * Fecha: 11/10/2026
 * Autor: Pedro Fernández
 * Aportación: Identificación de la trama de ProyectoBio y extracción del contador
 *             y del valor de ozono expresado en ppm.
 */

public class DecodificadorOzono {

    private static final int ID_OZONO = 14;
    private static final String UUID_PROYECTO = "EPSG-GTI-PROY-3A";

    /*
     * trama: TramaIBeacon --> esTramaOzono() --> es_ozono: B
     * Comprueba que la trama pertenece al proyecto y contiene una medición de ozono.
     */
    public boolean esTramaOzono(TramaIBeacon trama) {

        if (trama == null) {
            return false;
        }

        String uuid = Utilidades.bytesToString(trama.getUUID());

        if (!UUID_PROYECTO.equals(uuid)) {
            return false;
        }

        int major = bytesAEnteroSinSigno(trama.getMajor());
        int idMedicion = (major >> 8) & 0xFF;

        return idMedicion == ID_OZONO;
    }

    /*
     * trama: TramaIBeacon --> obtenerContador() --> contador: N
     * Obtiene del byte inferior de major el contador de la medición.
     */
    public int obtenerContador(TramaIBeacon trama) {

        comprobarTramaOzono(trama);

        int major = bytesAEnteroSinSigno(trama.getMajor());

        return major & 0xFF;
    }

    /*
     * trama: TramaIBeacon --> obtenerValorPpm() --> valor: R
     * Obtiene el valor de ozono almacenado en minor y lo convierte a ppm.
     */
    public double obtenerValorPpm(TramaIBeacon trama) {

        comprobarTramaOzono(trama);

        int minor = bytesAEnteroSinSigno(trama.getMinor());

        return minor / 1000.0;
    }

    /*
     * trama: TramaIBeacon --> comprobarTramaOzono()
     * Impide decodificar como ozono una trama que no pertenece a esa magnitud.
     */
    private void comprobarTramaOzono(TramaIBeacon trama) {

        if (!esTramaOzono(trama)) {
            throw new IllegalArgumentException(
                    "La trama no contiene una medición de ozono válida."
            );
        }
    }

    /*
     * bytes: [N]_2 --> bytesAEnteroSinSigno() --> valor: N
     * Convierte dos bytes en un entero de 16 bits sin signo.
     */
    private int bytesAEnteroSinSigno(byte[] bytes) {

        if (bytes == null || bytes.length != 2) {
            throw new IllegalArgumentException(
                    "Se esperaban exactamente dos bytes."
            );
        }

        return ((bytes[0] & 0xFF) << 8)
                | (bytes[1] & 0xFF);
    }
}