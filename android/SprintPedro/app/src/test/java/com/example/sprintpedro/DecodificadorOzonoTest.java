package com.example.sprintpedro;

/*
 * Nombre: DecodificadorOzonoTest.java
 * Descripción: Tests automáticos del decodificador de mediciones de ozono iBeacon.
 * Copyright: (c) 2026 Pedro Fernández
 * Fecha: 11/10/2026
 * Autor: Pedro Fernández
 * Aportación: Verificación reproducible de la identificación y decodificación
 *             de las tramas de ozono del Sprint 0.
 */

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;

public class DecodificadorOzonoTest {

    /*
     * contador: N, valor_milesimas: N --> crearTramaOzono() --> trama: TramaIBeacon
     * Construye una trama iBeacon de prueba con el UUID y formato usados por ProyectoBio.
     */
    private TramaIBeacon crearTramaOzono(int contador, int valorMilesimas) {

        byte[] bytes = new byte[30];

        // Prefijo iBeacon.
        bytes[0] = 0x02;
        bytes[1] = 0x01;
        bytes[2] = 0x06;
        bytes[3] = 0x1A;
        bytes[4] = (byte) 0xFF;
        bytes[5] = 0x4C;
        bytes[6] = 0x00;
        bytes[7] = 0x02;
        bytes[8] = 0x15;

        // UUID: "EPSG-GTI-PROY-3A"
        byte[] uuid = "EPSG-GTI-PROY-3A".getBytes();

        System.arraycopy(uuid, 0, bytes, 9, uuid.length);

        // major = (14 << 8) + contador
        int major = (14 << 8) | (contador & 0xFF);

        bytes[25] = (byte) ((major >> 8) & 0xFF);
        bytes[26] = (byte) (major & 0xFF);

        // minor = valor de ozono * 1000
        bytes[27] = (byte) ((valorMilesimas >> 8) & 0xFF);
        bytes[28] = (byte) (valorMilesimas & 0xFF);

        // txPower
        bytes[29] = (byte) -53;

        return new TramaIBeacon(bytes);
    }

    /*
     * --> reconoceTramaOzono()
     * Comprueba que una trama con identificador 14 y UUID correcto se reconoce como ozono.
     */
    @Test
    public void reconoceTramaOzono() {

        DecodificadorOzono decodificador = new DecodificadorOzono();

        TramaIBeacon trama = crearTramaOzono(
                5,
                12340
        );

        assertTrue(decodificador.esTramaOzono(trama));
    }

    /*
     * --> obtieneContadorCorrectamente()
     * Comprueba que el byte inferior de major se interpreta como contador.
     */
    @Test
    public void obtieneContadorCorrectamente() {

        DecodificadorOzono decodificador = new DecodificadorOzono();

        TramaIBeacon trama = crearTramaOzono(
                27,
                12340
        );

        assertEquals(
                27,
                decodificador.obtenerContador(trama)
        );
    }

    /*
     * --> obtieneValorOzonoEnPpm()
     * Comprueba que minor se divide entre 1000 para obtener el valor en ppm.
     */
    @Test
    public void obtieneValorOzonoEnPpm() {

        DecodificadorOzono decodificador = new DecodificadorOzono();

        TramaIBeacon trama = crearTramaOzono(
                5,
                12340
        );

        assertEquals(
                12.34,
                decodificador.obtenerValorPpm(trama),
                0.0001
        );
    }

    /*
     * --> rechazaIdentificadorDistintoDeOzono()
     * Comprueba que una trama cuya magnitud no es 14 no se acepta como ozono.
     */
    @Test
    public void rechazaIdentificadorDistintoDeOzono() {

        DecodificadorOzono decodificador = new DecodificadorOzono();

        TramaIBeacon trama = crearTramaOzono(
                5,
                12340
        );

        byte[] bytes = trama.getLosBytes();

        // Cambiamos el byte alto de major:
        // 13 representa RUIDO en el protocolo existente.
        bytes[25] = 13;

        TramaIBeacon tramaRuido = new TramaIBeacon(bytes);

        assertFalse(
                decodificador.esTramaOzono(tramaRuido)
        );
    }

    /*
     * --> rechazaUUIDDistinto()
     * Comprueba que una trama de otro proyecto no se acepta como medición de ozono.
     */
    @Test
    public void rechazaUUIDDistinto() {

        DecodificadorOzono decodificador = new DecodificadorOzono();

        TramaIBeacon trama = crearTramaOzono(
                5,
                12340
        );

        byte[] bytes = trama.getLosBytes();

        // Alteramos el primer carácter del UUID.
        bytes[9] = 'X';

        TramaIBeacon tramaOtroProyecto =
                new TramaIBeacon(bytes);

        assertFalse(
                decodificador.esTramaOzono(tramaOtroProyecto)
        );
    }

    /*
     * --> impideDecodificarTramaNoOzono()
     * Comprueba que no se obtiene un valor ppm de una trama que no sea válida para ozono.
     */
    @Test
    public void impideDecodificarTramaNoOzono() {

        DecodificadorOzono decodificador =
                new DecodificadorOzono();

        assertThrows(
                IllegalArgumentException.class,
                () -> decodificador.obtenerValorPpm(null)
        );
    }
}