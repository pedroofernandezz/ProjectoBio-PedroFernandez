/*
 * Nombre: app.js
 * Descripción: Control de la interfaz web de la última medición de ozono.
 * Copyright: (c) 2026 Pedro Fernández
 * Fecha: 11/10/2026
 * Autor: Pedro Fernández
 * Aportación: Conexión de la UX con LogicaFakeWeb y gestión de los
 *             estados de carga, medición, ausencia de datos y error.
 */

import { LogicaFakeWeb } from "./LogicaFakeWeb.js";

/*
 * fecha: Text --> formatearFecha() --> fecha_formateada: Text
 * Convierte la fecha recibida del servidor a un formato legible.
 */
export function formatearFecha(fecha) {

    const fechaObjeto =
        new Date(fecha);

    if (Number.isNaN(fechaObjeto.getTime())) {
        return fecha;
    }

    const dia =
        String(fechaObjeto.getDate())
            .padStart(2, "0");

    const mes =
        String(fechaObjeto.getMonth() + 1)
            .padStart(2, "0");

    const anio =
        fechaObjeto.getFullYear();

    const horas =
        String(fechaObjeto.getHours())
            .padStart(2, "0");

    const minutos =
        String(fechaObjeto.getMinutes())
            .padStart(2, "0");

    return (
        dia
        + "/"
        + mes
        + "/"
        + anio
        + " · "
        + horas
        + ":"
        + minutos
    );
}

/*
 * elementos: Text --> mostrarCargando()
 * Muestra el estado de carga y desactiva el botón de actualización.
 */
export function mostrarCargando(elementos) {

    elementos.mensajeEstado.textContent =
        "Cargando...";

    elementos.botonActualizar.disabled =
        true;
}

/*
 * medicion: Medicion, elementos: Text --> mostrarMedicion()
 * Muestra en la interfaz el valor y la fecha de una medición.
 */
export function mostrarMedicion(
    medicion,
    elementos
) {

    elementos.valorMedicion.textContent =
        String(medicion.valor);

    elementos.fechaMedicion.textContent =
        formatearFecha(medicion.fecha);

    elementos.mensajeEstado.textContent =
        "";
}

/*
 * elementos: Text --> mostrarSinMediciones()
 * Informa de que todavía no existe ninguna medición almacenada.
 */
export function mostrarSinMediciones(elementos) {

    elementos.valorMedicion.textContent =
        "--";

    elementos.fechaMedicion.textContent =
        "--";

    elementos.mensajeEstado.textContent =
        "Todavía no hay mediciones";
}

/*
 * elementos: Text --> mostrarError()
 * Muestra un mensaje comprensible cuando ocurre un error.
 */
export function mostrarError(elementos) {

    elementos.valorMedicion.textContent =
        "--";

    elementos.fechaMedicion.textContent =
        "--";

    elementos.mensajeEstado.textContent =
        "No se ha podido obtener la medición";
}

/*
 * logica: LogicaFakeWeb, elementos: Text, estado: Text
 *     --> actualizarMedicion()
 *
 * Solicita la última medición de ozono y actualiza la interfaz.
 * Evita realizar varias actualizaciones simultáneamente.
 */
export async function actualizarMedicion(
    logica,
    elementos,
    estado
) {

    if (estado.actualizando) {
        return;
    }

    estado.actualizando =
        true;

    mostrarCargando(
        elementos
    );

    try {

        const medicion =
            await logica.obtenerUltimaMedicion(
                "ozono"
            );

        mostrarMedicion(
            medicion,
            elementos
        );

    } catch (error) {

        if (
            error.codigo ===
            "SIN_MEDICIONES"
        ) {

            mostrarSinMediciones(
                elementos
            );

        } else {

            mostrarError(
                elementos
            );
        }

    } finally {

        estado.actualizando =
            false;

        elementos.botonActualizar.disabled =
            false;
    }
}

/*
 * --> inicializarAplicacion()
 * Obtiene los elementos de la página, conecta la lógica fake y carga
 * automáticamente la última medición de ozono.
 */
export function inicializarAplicacion() {

    const elementos = {

        valorMedicion:
            document.getElementById(
                "valor-medicion"
            ),

        fechaMedicion:
            document.getElementById(
                "fecha-medicion"
            ),

        mensajeEstado:
            document.getElementById(
                "mensaje-estado"
            ),

        botonActualizar:
            document.getElementById(
                "boton-actualizar"
            )
    };

    const logica =
        new LogicaFakeWeb(
            "http://localhost:8080"
        );

    const estado = {
        actualizando: false
    };

    elementos.botonActualizar.addEventListener(
        "click",
        () => {

            actualizarMedicion(
                logica,
                elementos,
                estado
            );
        }
    );

    actualizarMedicion(
        logica,
        elementos,
        estado
    );
}

if (typeof document !== "undefined") {

    inicializarAplicacion();
}