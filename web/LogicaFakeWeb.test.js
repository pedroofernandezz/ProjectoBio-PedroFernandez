/*
 * Nombre: LogicaFakeWeb.test.js
 * Descripción: Tests automáticos de la lógica fake utilizada por la web.
 * Copyright: (c) 2026 Pedro Fernández
 * Fecha: 11/10/2026
 * Autor: Pedro Fernández
 * Aportación: Verificación reproducible de las operaciones REST y del
 *             tratamiento de respuestas y errores de LogicaFakeWeb.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { LogicaFakeWeb } from "./LogicaFakeWeb.js";

/*
 * estado: N, datos: Text --> crearRespuesta() --> respuesta: Text
 * Crea una respuesta HTTP simulada para los tests.
 */
function crearRespuesta(estado, datos) {

    return {
        status: estado,
        ok: estado >= 200 && estado < 300,

        async text() {

            if (datos === null) {
                return "";
            }

            if (typeof datos === "string") {
                return datos;
            }

            return JSON.stringify(datos);
        }
    };
}

/*
 * --> obtieneUltimaMedicionCorrectamente()
 * Comprueba que una respuesta REST válida se devuelve como medición.
 */
test(
    "obtiene la última medición correctamente",
    async () => {

        global.fetch = async () =>
            crearRespuesta(
                200,
                {
                    id: 3,
                    tipo: "ozono",
                    fecha: "2026-10-11T10:00:00.000Z",
                    valor: 12.34
                }
            );

        const logica =
            new LogicaFakeWeb(
                "http://localhost:8080"
            );

        const medicion =
            await logica.obtenerUltimaMedicion(
                "ozono"
            );

        assert.equal(
            medicion.id,
            3
        );

        assert.equal(
            medicion.tipo,
            "ozono"
        );

        assert.equal(
            medicion.fecha,
            "2026-10-11T10:00:00.000Z"
        );

        assert.equal(
            medicion.valor,
            12.34
        );
    }
);

/*
 * --> construyeUrlGetCorrectamente()
 * Comprueba la ruta y el parámetro tipo utilizados en el GET.
 */
test(
    "construye correctamente la petición GET",
    async () => {

        let urlRecibida = null;
        let opcionesRecibidas = null;

        global.fetch =
            async (url, opciones) => {

                urlRecibida = url;
                opcionesRecibidas = opciones;

                return crearRespuesta(
                    200,
                    {
                        id: 1,
                        tipo: "ozono",
                        fecha: "2026-10-11T10:00:00.000Z",
                        valor: 1.5
                    }
                );
            };

        const logica =
            new LogicaFakeWeb(
                "http://localhost:8080/"
            );

        await logica.obtenerUltimaMedicion(
            "ozono"
        );

        assert.equal(
            urlRecibida,
            "http://localhost:8080/mediciones/ultima?tipo=ozono"
        );

        assert.equal(
            opcionesRecibidas.method,
            "GET"
        );
    }
);

/*
 * --> distingueAusenciaMediciones()
 * Comprueba que el 404 SIN_MEDICIONES se comunica de forma diferenciada.
 */
test(
    "distingue cuando todavía no hay mediciones",
    async () => {

        global.fetch = async () =>
            crearRespuesta(
                404,
                {
                    error: "SIN_MEDICIONES"
                }
            );

        const logica =
            new LogicaFakeWeb(
                "http://localhost:8080"
            );

        await assert.rejects(
            () =>
                logica.obtenerUltimaMedicion(
                    "ozono"
                ),
            (error) =>
                error.codigo ===
                "SIN_MEDICIONES"
        );
    }
);

/*
 * --> informaErrorHttp()
 * Comprueba que un error HTTP diferente de SIN_MEDICIONES se comunica como ERROR_HTTP.
 */
test(
    "informa de un error HTTP",
    async () => {

        global.fetch = async () =>
            crearRespuesta(
                500,
                {
                    error: "ERROR_INTERNO"
                }
            );

        const logica =
            new LogicaFakeWeb(
                "http://localhost:8080"
            );

        await assert.rejects(
            () =>
                logica.obtenerUltimaMedicion(
                    "ozono"
                ),
            (error) =>
                error.codigo ===
                "ERROR_HTTP"
        );
    }
);

/*
 * --> informaFalloRed()
 * Comprueba que un fallo de fetch se transforma en ERROR_RED.
 */
test(
    "informa de un fallo de red",
    async () => {

        global.fetch = async () => {
            throw new Error(
                "fallo de conexión"
            );
        };

        const logica =
            new LogicaFakeWeb(
                "http://localhost:8080"
            );

        await assert.rejects(
            () =>
                logica.obtenerUltimaMedicion(
                    "ozono"
                ),
            (error) =>
                error.codigo ===
                "ERROR_RED"
        );
    }
);

/*
 * --> informaJsonInvalido()
 * Comprueba que una respuesta no interpretable como JSON se identifica correctamente.
 */
test(
    "informa de JSON inválido",
    async () => {

        global.fetch = async () =>
            crearRespuesta(
                200,
                "esto no es json"
            );

        const logica =
            new LogicaFakeWeb(
                "http://localhost:8080"
            );

        await assert.rejects(
            () =>
                logica.obtenerUltimaMedicion(
                    "ozono"
                ),
            (error) =>
                error.codigo ===
                "JSON_INVALIDO"
        );
    }
);

/*
 * --> registraMedicionMediantePost()
 * Comprueba que registrarMedicion() utiliza POST /mediciones y envía el JSON esperado.
 */
test(
    "registra una medición mediante POST",
    async () => {

        let urlRecibida = null;
        let opcionesRecibidas = null;

        global.fetch =
            async (url, opciones) => {

                urlRecibida = url;
                opcionesRecibidas = opciones;

                return crearRespuesta(
                    201,
                    {
                        id: 8,
                        tipo: "ozono",
                        fecha: "2026-10-11T10:00:00.000Z",
                        valor: 12.34
                    }
                );
            };

        const logica =
            new LogicaFakeWeb(
                "http://localhost:8080"
            );

        const medicion =
            await logica.registrarMedicion(
                "ozono",
                "2026-10-11T10:00:00.000Z",
                12.34
            );

        assert.equal(
            urlRecibida,
            "http://localhost:8080/mediciones"
        );

        assert.equal(
            opcionesRecibidas.method,
            "POST"
        );

        const cuerpo =
            JSON.parse(
                opcionesRecibidas.body
            );

        assert.deepEqual(
            cuerpo,
            {
                tipo: "ozono",
                fecha: "2026-10-11T10:00:00.000Z",
                valor: 12.34
            }
        );

        assert.equal(
            medicion.id,
            8
        );
    }
);