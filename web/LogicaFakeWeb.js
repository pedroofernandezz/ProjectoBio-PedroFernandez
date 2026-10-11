/*
 * Nombre: LogicaFakeWeb.js
 * Descripción: Proxy web de la lógica del negocio mediante el API REST.
 * Copyright: (c) 2026 Pedro Fernández
 * Fecha: 11/10/2026
 * Autor: Pedro Fernández
 * Aportación: Implementación de las operaciones remotas registrarMedicion()
 *             y obtenerUltimaMedicion() desde el navegador.
 */

export class LogicaFakeWeb {

    /*
     * url_servidor: Text --> LogicaFakeWeb()
     * Crea el proxy asociado a la dirección del servidor REST.
     */
    constructor(urlServidor) {

        if (
            typeof urlServidor !== "string"
            || urlServidor.trim() === ""
        ) {
            throw new Error(
                "La URL del servidor es obligatoria."
            );
        }

        let url = urlServidor.trim();

        if (url.endsWith("/")) {
            url = url.slice(0, -1);
        }

        this.urlServidor = url;
    }

    /*
     * tipo: Text, fecha: Text, valor: R
     *     --> registrarMedicion()
     * medicion: Medicion <--
     *
     * Envía una medición al servidor mediante POST /mediciones.
     */
    async registrarMedicion(tipo, fecha, valor) {

        const respuesta = await this.hacerPeticion(
            "/mediciones",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    tipo,
                    fecha,
                    valor
                })
            }
        );

        return respuesta;
    }

    /*
     * tipo: Text
     *     --> obtenerUltimaMedicion()
     * medicion: Medicion <--
     *
     * Solicita al servidor la última medición del tipo indicado.
     */
    async obtenerUltimaMedicion(tipo) {

        const tipoCodificado =
            encodeURIComponent(tipo);

        const respuesta = await this.hacerPeticion(
            "/mediciones/ultima?tipo=" + tipoCodificado,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        return respuesta;
    }

    /*
     * ruta: Text, opciones: Text
     *     --> hacerPeticion()
     * respuesta: Medicion <--
     *
     * Ejecuta una petición REST y distingue respuestas correctas,
     * ausencia de mediciones, errores HTTP y fallos de red.
     */
    async hacerPeticion(ruta, opciones) {

        let respuesta;

        try {

            respuesta = await fetch(
                this.urlServidor + ruta,
                opciones
            );

        } catch (error) {

            throw this.crearError(
                "ERROR_RED",
                "No se ha podido conectar con el servidor."
            );
        }

        const texto =
            await respuesta.text();

        let datos = null;

        if (texto !== "") {

            try {

                datos = JSON.parse(texto);

            } catch (error) {

                throw this.crearError(
                    "JSON_INVALIDO",
                    "El servidor ha devuelto una respuesta JSON inválida."
                );
            }
        }

        if (
            respuesta.status === 404
            && datos
            && datos.error === "SIN_MEDICIONES"
        ) {

            throw this.crearError(
                "SIN_MEDICIONES",
                "Todavía no hay mediciones."
            );
        }

        if (!respuesta.ok) {

            throw this.crearError(
                "ERROR_HTTP",
                "El servidor ha respondido con el código "
                    + respuesta.status
                    + "."
            );
        }

        return datos;
    }

    /*
     * codigo: Text, mensaje: Text
     *     --> crearError()
     * error: Text <--
     *
     * Crea un error identificable por la capa de interfaz.
     */
    crearError(codigo, mensaje) {

        const error =
            new Error(mensaje);

        error.codigo =
            codigo;

        return error;
    }
}