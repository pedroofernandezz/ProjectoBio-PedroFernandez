package com.example.sprintpedro;

/*
 * Nombre: LogicaFakeAndroid.java
 * Descripción: Proxy Android de la lógica del negocio mediante el API REST.
 * Copyright: (c) 2026 Pedro Fernández
 * Fecha: 11/10/2026
 * Autor: Pedro Fernández
 * Aportación: Implementación de las llamadas remotas registrarMedicion()
 *             y obtenerUltimaMedicion() desde Android.
 */

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class LogicaFakeAndroid {

    private final String urlServidor;

    /*
     * url_servidor: Text --> LogicaFakeAndroid()
     * Crea el proxy asociado a la dirección del servidor REST.
     */
    public LogicaFakeAndroid(String urlServidor) {

        if (urlServidor == null || urlServidor.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "La URL del servidor es obligatoria."
            );
        }

        String url = urlServidor.trim();

        if (url.endsWith("/")) {
            url = url.substring(0, url.length() - 1);
        }

        this.urlServidor = url;
    }

    /*
     * tipo: Text, fecha: Text, valor: R --> registrarMedicion() --> medicion: Medicion
     * Envía una medición al servidor mediante POST /mediciones.
     */
    public Medicion registrarMedicion(
            String tipo,
            String fecha,
            double valor
    ) throws IOException {

        JSONObject cuerpo = new JSONObject();

        try {
            cuerpo.put("tipo", tipo);
            cuerpo.put("fecha", fecha);
            cuerpo.put("valor", valor);
        } catch (JSONException error) {
            throw new IOException(
                    "No se pudo construir el JSON de la medición.",
                    error
            );
        }

        String respuesta = hacerPeticion(
                "POST",
                "/mediciones",
                cuerpo.toString()
        );

        return convertirJsonAMedicion(respuesta);
    }

    /*
     * tipo: Text --> obtenerUltimaMedicion() --> medicion: Medicion
     * Solicita al servidor la última medición del tipo indicado.
     */
    public Medicion obtenerUltimaMedicion(String tipo) throws IOException {

        String tipoCodificado = URLEncoder.encode(
                tipo,
                StandardCharsets.UTF_8.toString()
        );

        String respuesta = hacerPeticion(
                "GET",
                "/mediciones/ultima?tipo=" + tipoCodificado,
                null
        );

        return convertirJsonAMedicion(respuesta);
    }

    /*
     * metodo: Text, ruta: Text, cuerpo: Text --> hacerPeticion() --> respuesta: Text
     * Ejecuta una petición HTTP al servidor y devuelve el cuerpo de una respuesta correcta.
     */
    private String hacerPeticion(
            String metodo,
            String ruta,
            String cuerpo
    ) throws IOException {

        URL url = new URL(urlServidor + ruta);

        HttpURLConnection conexion =
                (HttpURLConnection) url.openConnection();

        try {
            conexion.setRequestMethod(metodo);
            conexion.setRequestProperty(
                    "Accept",
                    "application/json"
            );

            conexion.setConnectTimeout(5000);
            conexion.setReadTimeout(5000);

            if (cuerpo != null) {

                conexion.setDoOutput(true);
                conexion.setRequestProperty(
                        "Content-Type",
                        "application/json; charset=UTF-8"
                );

                byte[] datos =
                        cuerpo.getBytes(StandardCharsets.UTF_8);

                try (OutputStream salida =
                             conexion.getOutputStream()) {

                    salida.write(datos);
                }
            }

            int codigo = conexion.getResponseCode();

            InputStream entrada;

            if (codigo >= 200 && codigo < 300) {
                entrada = conexion.getInputStream();
            } else {
                entrada = conexion.getErrorStream();
            }

            String respuesta = leerTexto(entrada);

            if (codigo < 200 || codigo >= 300) {
                throw new IOException(
                        "Error HTTP " + codigo + ": " + respuesta
                );
            }

            return respuesta;

        } finally {
            conexion.disconnect();
        }
    }

    /*
     * entrada: Text --> leerTexto() --> texto: Text
     * Lee completamente el cuerpo de una respuesta HTTP.
     */
    private String leerTexto(InputStream entrada)
            throws IOException {

        if (entrada == null) {
            return "";
        }

        StringBuilder texto = new StringBuilder();

        try (
                BufferedReader lector =
                        new BufferedReader(
                                new InputStreamReader(
                                        entrada,
                                        StandardCharsets.UTF_8
                                )
                        )
        ) {
            String linea;

            while ((linea = lector.readLine()) != null) {
                texto.append(linea);
            }
        }

        return texto.toString();
    }

    /*
     * json: Text --> convertirJsonAMedicion() --> medicion: Medicion
     * Convierte la respuesta JSON del servidor al tipo Medicion.
     */
    private Medicion convertirJsonAMedicion(String json)
            throws IOException {

        try {
            JSONObject objeto = new JSONObject(json);

            return new Medicion(
                    objeto.getInt("id"),
                    objeto.getString("tipo"),
                    objeto.getString("fecha"),
                    objeto.getDouble("valor")
            );

        } catch (JSONException error) {
            throw new IOException(
                    "La respuesta del servidor no contiene una medición válida.",
                    error
            );
        }
    }
}