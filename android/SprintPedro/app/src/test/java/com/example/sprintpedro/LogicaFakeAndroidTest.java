package com.example.sprintpedro;

/*
 * Nombre: LogicaFakeAndroidTest.java
 * Descripción: Tests automáticos del proxy REST utilizado por Android.
 * Copyright: (c) 2026 Pedro Fernández
 * Fecha: 11/10/2026
 * Autor: Pedro Fernández
 * Aportación: Verificación reproducible de las operaciones HTTP de la lógica
 *             fake Android del Sprint 0.
 */

import org.json.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;

import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.mockwebserver.RecordedRequest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;

public class LogicaFakeAndroidTest {

    private MockWebServer servidor;
    private String urlServidor;

    /*
     * --> prepararServidor()
     * Crea un servidor HTTP local para probar la lógica fake sin utilizar
     * el backend real ni hardware físico.
     */
    @Before
    public void prepararServidor() throws IOException {

        servidor = new MockWebServer();
        servidor.start();

        urlServidor = servidor.url("/").toString();
    }

    /*
     * --> detenerServidor()
     * Detiene el servidor HTTP utilizado por cada test.
     */
    @After
    public void detenerServidor() throws IOException {

        if (servidor != null) {
            servidor.shutdown();
        }
    }

    /*
     * --> registrarMedicionEnviaPostCorrecto()
     * Comprueba que registrarMedicion() realiza POST /mediciones
     * con el JSON esperado.
     */
    @Test
    public void registrarMedicionEnviaPostCorrecto()
            throws Exception {

        servidor.enqueue(
                new MockResponse()
                        .setResponseCode(201)
                        .setHeader(
                                "Content-Type",
                                "application/json"
                        )
                        .setBody(
                                "{\"id\":1,\"tipo\":\"ozono\","
                                        + "\"fecha\":\"2026-10-11T10:00:00.000Z\","
                                        + "\"valor\":12.34}"
                        )
        );

        LogicaFakeAndroid logica =
                new LogicaFakeAndroid(urlServidor);

        logica.registrarMedicion(
                "ozono",
                "2026-10-11T10:00:00.000Z",
                12.34
        );

        RecordedRequest peticion =
                servidor.takeRequest();

        assertEquals(
                "POST",
                peticion.getMethod()
        );

        assertEquals(
                "/mediciones",
                peticion.getPath()
        );

        JSONObject cuerpo =
                new JSONObject(
                        peticion.getBody().readUtf8()
                );

        assertEquals(
                "ozono",
                cuerpo.getString("tipo")
        );

        assertEquals(
                "2026-10-11T10:00:00.000Z",
                cuerpo.getString("fecha")
        );

        assertEquals(
                12.34,
                cuerpo.getDouble("valor"),
                0.0001
        );
    }

    /*
     * --> registrarMedicionDevuelveRespuesta()
     * Comprueba que la respuesta JSON del servidor se convierte correctamente
     * al tipo Medicion.
     */
    @Test
    public void registrarMedicionDevuelveRespuesta()
            throws Exception {

        servidor.enqueue(
                new MockResponse()
                        .setResponseCode(201)
                        .setHeader(
                                "Content-Type",
                                "application/json"
                        )
                        .setBody(
                                "{\"id\":7,\"tipo\":\"ozono\","
                                        + "\"fecha\":\"2026-10-11T10:00:00.000Z\","
                                        + "\"valor\":12.34}"
                        )
        );

        LogicaFakeAndroid logica =
                new LogicaFakeAndroid(urlServidor);

        Medicion medicion =
                logica.registrarMedicion(
                        "ozono",
                        "2026-10-11T10:00:00.000Z",
                        12.34
                );

        assertEquals(
                7,
                medicion.getId()
        );

        assertEquals(
                "ozono",
                medicion.getTipo()
        );

        assertEquals(
                "2026-10-11T10:00:00.000Z",
                medicion.getFecha()
        );

        assertEquals(
                12.34,
                medicion.getValor(),
                0.0001
        );
    }

    /*
     * --> obtenerUltimaMedicionEnviaGetCorrecto()
     * Comprueba que obtenerUltimaMedicion() utiliza la ruta GET definida
     * en el API REST.
     */
    @Test
    public void obtenerUltimaMedicionEnviaGetCorrecto()
            throws Exception {

        servidor.enqueue(
                new MockResponse()
                        .setResponseCode(200)
                        .setHeader(
                                "Content-Type",
                                "application/json"
                        )
                        .setBody(
                                "{\"id\":3,\"tipo\":\"ozono\","
                                        + "\"fecha\":\"2026-10-11T11:00:00.000Z\","
                                        + "\"valor\":4.2}"
                        )
        );

        LogicaFakeAndroid logica =
                new LogicaFakeAndroid(urlServidor);

        Medicion medicion =
                logica.obtenerUltimaMedicion(
                        "ozono"
                );

        RecordedRequest peticion =
                servidor.takeRequest();

        assertEquals(
                "GET",
                peticion.getMethod()
        );

        assertEquals(
                "/mediciones/ultima?tipo=ozono",
                peticion.getPath()
        );

        assertEquals(
                4.2,
                medicion.getValor(),
                0.0001
        );
    }

    /*
     * --> informaErrorHttp()
     * Comprueba que una respuesta HTTP incorrecta se comunica como error.
     */
    @Test
    public void informaErrorHttp()
            throws Exception {

        servidor.enqueue(
                new MockResponse()
                        .setResponseCode(400)
                        .setHeader(
                                "Content-Type",
                                "application/json"
                        )
                        .setBody(
                                "{\"error\":\"VALOR_INVALIDO\"}"
                        )
        );

        LogicaFakeAndroid logica =
                new LogicaFakeAndroid(urlServidor);

        IOException error =
                assertThrows(
                        IOException.class,
                        () -> logica.registrarMedicion(
                                "ozono",
                                "2026-10-11T10:00:00.000Z",
                                -1
                        )
                );

        assertTrue(
                error.getMessage()
                        .contains("Error HTTP 400")
        );
    }

    /*
     * --> informaFalloRed()
     * Comprueba que un fallo de conexión se propaga como IOException.
     */
    @Test
    public void informaFalloRed()
            throws Exception {

        String urlServidorApagado =
                urlServidor;

        servidor.shutdown();
        servidor = null;

        LogicaFakeAndroid logica =
                new LogicaFakeAndroid(
                        urlServidorApagado
                );

        assertThrows(
                IOException.class,
                () -> logica.registrarMedicion(
                        "ozono",
                        "2026-10-11T10:00:00.000Z",
                        12.34
                )
        );
    }
}