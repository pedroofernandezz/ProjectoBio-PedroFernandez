/*
 * ReglasREST.js
 * Adaptación HTTP/JSON de la lógica de negocio del Sprint 0.
 * Autor: Pedro Fernández
 */

/*
 * servidorExpress: Text, logica: Text --> cargar()
 * Registra las dos rutas REST del Sprint 0 sobre una aplicación Express.
 */
function cargar(servidorExpress, logica) {

    /*
     * peticion: Text, respuesta: Text --> POST /mediciones()
     * Recibe una medición JSON, delega en registrarMedicion() y devuelve la medición persistida.
     */
    servidorExpress.post("/mediciones", async function (peticion, respuesta) {
        try {
            const { tipo, fecha, valor } = peticion.body || {};

            const medicion = await logica.registrarMedicion(
                tipo,
                fecha,
                valor
            );

            respuesta.status(201).json(medicion);
        } catch (error) {
            responderError(error, respuesta);
        }
    });

    /*
     * peticion: Text, respuesta: Text --> GET /mediciones/ultima()
     * Consulta la última medición del tipo solicitado y la devuelve en JSON.
     */
    servidorExpress.get("/mediciones/ultima", async function (peticion, respuesta) {
        try {
            const tipo = peticion.query.tipo;

            const medicion = await logica.obtenerUltimaMedicion(tipo);

            respuesta.status(200).json(medicion);
        } catch (error) {
            responderError(error, respuesta);
        }
    });
}

/*
 * error: Text, respuesta: Text --> responderError()
 * Traduce errores conocidos de negocio a respuestas HTTP coherentes.
 */
function responderError(error, respuesta) {
    if (error && error.codigo === "SIN_MEDICIONES") {
        respuesta.status(404).json({ error: "SIN_MEDICIONES" });
        return;
    }

    if (
        error &&
        (
            error.codigo === "TIPO_INVALIDO" ||
            error.codigo === "FECHA_INVALIDA" ||
            error.codigo === "VALOR_INVALIDO"
        )
    ) {
        respuesta.status(400).json({
            error: error.codigo,
            mensaje: error.message
        });
        return;
    }

    console.error(error);
    respuesta.status(500).json({ error: "ERROR_INTERNO" });
}

module.exports = {
    cargar
};
