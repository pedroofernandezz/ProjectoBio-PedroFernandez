/*
 * crearApp.js
 * Construcción de la aplicación Express del Sprint 0.
 * Autor: Pedro Fernández
 */

const express = require("express");
const cors = require("cors");
const ReglasREST = require("./ReglasREST");

/*
 * logica: Text --> crearApp() --> app: Text
 * Construye la aplicación HTTP e instala las rutas REST usando la lógica recibida.
 */
function crearApp(logica) {
    const app = express();

    app.use(cors());
    app.use(express.json());

    ReglasREST.cargar(app, logica);

    /*
     * error: Text, peticion: Text, respuesta: Text, siguiente: Text --> manejarJSONInvalido()
     * Devuelve 400 cuando el cuerpo declarado como JSON no puede interpretarse.
     */
    app.use(function manejarJSONInvalido(error, peticion, respuesta, siguiente) {
        if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
            respuesta.status(400).json({ error: "JSON_INVALIDO" });
            return;
        }

        siguiente(error);
    });

    return app;
}

module.exports = crearApp;
