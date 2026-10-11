/*
 * Nombre: mainServidorREST.js
 * Descripción: Arranque del servidor REST del Sprint 0.
 * Copyright: (c) 2026 Pedro Fernández
 * Fecha: 11/10/2026
 * Autor: Pedro Fernández
 * Aportación: Inicialización de base de datos, lógica de negocio y servidor HTTP.
 */

const path = require("path");
const BaseDatos = require("./bd/BaseDatos");
const LogicaMediciones = require("./logica/LogicaMediciones");
const crearApp = require("./rest/crearApp");

/*
 * --> main()
 * Inicializa persistencia y lógica real y arranca el servidor REST.
 */
async function main() {
    const rutaBD = path.join(__dirname, "bd", "mediciones.sqlite");
    const bd = new BaseDatos(rutaBD);

    await bd.inicializar();

    const logica = new LogicaMediciones(bd);
    const app = crearApp(logica);

    const puerto = Number(process.env.PORT) || 8080;

    const servidor = app.listen(puerto, function () {
        console.log(`Servidor REST escuchando en el puerto ${puerto}`);
    });

    /*
     * --> cerrarServidor()
     * Cierra ordenadamente el servidor HTTP y la base de datos.
     */
    async function cerrarServidor() {
        servidor.close(async function () {
            await bd.cerrar();
            process.exit(0);
        });
    }

    process.on("SIGINT", cerrarServidor);
    process.on("SIGTERM", cerrarServidor);
}

main().catch(function (error) {
    console.error("No se pudo iniciar el servidor REST:", error);
    process.exit(1);
});
