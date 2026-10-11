/*
 * Nombre: app.test.js
 * Descripción: Tests automáticos de la interfaz web de medición de ozono.
 * Copyright: (c) 2026 Pedro Fernández
 * Fecha: 11/10/2026
 * Autor: Pedro Fernández
 * Aportación: Verificación reproducible del comportamiento de la UX web.
 */

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

import {
    formatearFecha,
    mostrarCargando,
    mostrarMedicion,
    mostrarSinMediciones,
    mostrarError,
    actualizarMedicion,
    inicializarAplicacion
} from "./app.js";

/*
 * --> crearElementos() --> elementos: Text
 * Crea elementos mínimos simulados para probar la interfaz sin navegador real.
 */
function crearElementos() {

    return {
        valorMedicion: {
            textContent: "--"
        },

        fechaMedicion: {
            textContent: "--"
        },

        mensajeEstado: {
            textContent: ""
        },

        botonActualizar: {
            disabled: false,
            listener: null,

            addEventListener(
                evento,
                callback
            ) {

                if (evento === "click") {
                    this.listener = callback;
                }
            }
        }
    };
}

/*
 * --> esperarTareasAsincronas()
 * Espera a que terminen las operaciones asíncronas iniciadas por la UX.
 */
function esperarTareasAsincronas() {

    return new Promise(
        (resolver) => {
            setImmediate(resolver);
        }
    );
}

/*
 * --> muestraUnidadPpm()
 * Comprueba que la interfaz contiene la unidad ppm definida en el diseño.
 */
test(
    "la interfaz muestra la unidad ppm",
    async () => {

        const html =
            await fs.readFile(
                new URL(
                    "./index.html",
                    import.meta.url
                ),
                "utf8"
            );

        assert.match(
            html,
            />\s*ppm\s*</
        );
    }
);

/*
 * fecha: Text --> formateaFechaCorrectamente()
 * Comprueba la representación legible de fecha y hora.
 */
test(
    "formatea correctamente fecha y hora",
    () => {

        const resultado =
            formatearFecha(
                "2026-10-11T10:30:00"
            );

        assert.equal(
            resultado,
            "11/10/2026 · 10:30"
        );
    }
);

/*
 * --> muestraEstadoCarga()
 * Comprueba el mensaje de carga y el bloqueo del botón.
 */
test(
    "muestra el estado de carga",
    () => {

        const elementos =
            crearElementos();

        mostrarCargando(
            elementos
        );

        assert.equal(
            elementos.mensajeEstado.textContent,
            "Cargando..."
        );

        assert.equal(
            elementos.botonActualizar.disabled,
            true
        );
    }
);

/*
 * --> representaMedicionCorrectamente()
 * Comprueba que valor y fecha recibidos se muestran en la interfaz.
 */
test(
    "representa correctamente una medición",
    () => {

        const elementos =
            crearElementos();

        mostrarMedicion(
            {
                id: 1,
                tipo: "ozono",
                fecha: "2026-10-11T10:30:00",
                valor: 12.34
            },
            elementos
        );

        assert.equal(
            elementos.valorMedicion.textContent,
            "12.34"
        );

        assert.equal(
            elementos.fechaMedicion.textContent,
            "11/10/2026 · 10:30"
        );

        assert.equal(
            elementos.mensajeEstado.textContent,
            ""
        );
    }
);

/*
 * --> muestraAusenciaMediciones()
 * Comprueba el estado definido cuando todavía no existen mediciones.
 */
test(
    "muestra cuando todavía no hay mediciones",
    () => {

        const elementos =
            crearElementos();

        mostrarSinMediciones(
            elementos
        );

        assert.equal(
            elementos.valorMedicion.textContent,
            "--"
        );

        assert.equal(
            elementos.fechaMedicion.textContent,
            "--"
        );

        assert.equal(
            elementos.mensajeEstado.textContent,
            "Todavía no hay mediciones"
        );
    }
);

/*
 * --> muestraErrorConsulta()
 * Comprueba el estado mostrado cuando falla la consulta.
 */
test(
    "muestra un error de consulta",
    () => {

        const elementos =
            crearElementos();

        mostrarError(
            elementos
        );

        assert.equal(
            elementos.valorMedicion.textContent,
            "--"
        );

        assert.equal(
            elementos.fechaMedicion.textContent,
            "--"
        );

        assert.equal(
            elementos.mensajeEstado.textContent,
            "No se ha podido obtener la medición"
        );
    }
);

/*
 * --> actualizaMedicionDesdeLogicaFake()
 * Comprueba que la UX solicita ozono a la lógica fake y representa el resultado.
 */
test(
    "actualiza la medición mediante la lógica fake",
    async () => {

        const elementos =
            crearElementos();

        const estado = {
            actualizando: false
        };

        let tipoRecibido = null;

        const logica = {

            async obtenerUltimaMedicion(tipo) {

                tipoRecibido = tipo;

                return {
                    id: 5,
                    tipo: "ozono",
                    fecha: "2026-10-11T12:45:00",
                    valor: 7.5
                };
            }
        };

        await actualizarMedicion(
            logica,
            elementos,
            estado
        );

        assert.equal(
            tipoRecibido,
            "ozono"
        );

        assert.equal(
            elementos.valorMedicion.textContent,
            "7.5"
        );

        assert.equal(
            elementos.fechaMedicion.textContent,
            "11/10/2026 · 12:45"
        );

        assert.equal(
            elementos.botonActualizar.disabled,
            false
        );
    }
);

/*
 * --> sustituyeMedicionAnterior()
 * Comprueba que una nueva consulta reemplaza los datos anteriores.
 */
test(
    "sustituye la medición anterior por la nueva",
    async () => {

        const elementos =
            crearElementos();

        const estado = {
            actualizando: false
        };

        let llamada = 0;

        const logica = {

            async obtenerUltimaMedicion() {

                llamada++;

                if (llamada === 1) {

                    return {
                        id: 1,
                        tipo: "ozono",
                        fecha: "2026-10-11T09:00:00",
                        valor: 2.5
                    };
                }

                return {
                    id: 2,
                    tipo: "ozono",
                    fecha: "2026-10-11T10:00:00",
                    valor: 8.75
                };
            }
        };

        await actualizarMedicion(
            logica,
            elementos,
            estado
        );

        assert.equal(
            elementos.valorMedicion.textContent,
            "2.5"
        );

        await actualizarMedicion(
            logica,
            elementos,
            estado
        );

        assert.equal(
            elementos.valorMedicion.textContent,
            "8.75"
        );
    }
);

/*
 * --> evitaActualizacionesSimultaneas()
 * Comprueba que una segunda actualización se ignora mientras existe otra pendiente.
 */
test(
    "evita actualizaciones simultáneas",
    async () => {

        const elementos =
            crearElementos();

        const estado = {
            actualizando: false
        };

        let numeroLlamadas = 0;
        let resolverPeticion;

        const logica = {

            obtenerUltimaMedicion() {

                numeroLlamadas++;

                return new Promise(
                    (resolver) => {
                        resolverPeticion = resolver;
                    }
                );
            }
        };

        const primera =
            actualizarMedicion(
                logica,
                elementos,
                estado
            );

        const segunda =
            actualizarMedicion(
                logica,
                elementos,
                estado
            );

        assert.equal(
            numeroLlamadas,
            1
        );

        resolverPeticion({
            id: 1,
            tipo: "ozono",
            fecha: "2026-10-11T10:00:00",
            valor: 4.2
        });

        await primera;
        await segunda;

        assert.equal(
            elementos.valorMedicion.textContent,
            "4.2"
        );
    }
);

/*
 * --> cargaInicialYBotonActualizar()
 * Comprueba que al iniciar la aplicación se consulta una medición y que
 * el botón permite solicitar posteriormente una nueva.
 */
test(
    "realiza carga inicial y actualiza al pulsar el botón",
    async () => {

        const elementos =
            crearElementos();

        global.document = {

            getElementById(id) {

                switch (id) {

                    case "valor-medicion":
                        return elementos.valorMedicion;

                    case "fecha-medicion":
                        return elementos.fechaMedicion;

                    case "mensaje-estado":
                        return elementos.mensajeEstado;

                    case "boton-actualizar":
                        return elementos.botonActualizar;

                    default:
                        return null;
                }
            }
        };

        let llamada = 0;

        global.fetch =
            async () => {

                llamada++;

                const valor =
                    llamada === 1
                        ? 3.25
                        : 9.5;

                return {
                    status: 200,
                    ok: true,

                    async text() {

                        return JSON.stringify({
                            id: llamada,
                            tipo: "ozono",
                            fecha:
                                "2026-10-11T10:30:00",
                            valor
                        });
                    }
                };
            };

        inicializarAplicacion();

        await esperarTareasAsincronas();

        assert.equal(
            elementos.valorMedicion.textContent,
            "3.25"
        );

        assert.ok(
            elementos.botonActualizar.listener
        );

        elementos.botonActualizar.listener();

        await esperarTareasAsincronas();

        assert.equal(
            elementos.valorMedicion.textContent,
            "9.5"
        );

        delete global.document;
        delete global.fetch;
    }
);