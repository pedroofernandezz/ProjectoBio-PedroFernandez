/*
 * --------------------
 * Nombre: LogicaMediciones.js
 * Descripción: Lógica real del negocio para las mediciones del Sprint 0.
 * Copyright: (c) 2026 Pedro Fernández
 * Fecha: 11/10/2026
 * Autor: Pedro Fernández
 * Aportación: Validación, registro y consulta de la última medición.
 
 * --------------------
 */

class LogicaMediciones {

    /*
 * --------------------
     * base_datos: Text --> LogicaMediciones()
     * Crea la lógica del negocio utilizando una persistencia ya inicializada.
     
 * --------------------
 */
    constructor(baseDatos) {
        this.baseDatos = baseDatos;
    }

    /*
 * --------------------
     * tipo: Text --> validarTipo() --> tipo: Text
     * Normaliza y valida el tipo de medición admitido en Sprint 0.
     
 * --------------------
 */
    validarTipo(tipo) {
        if (typeof tipo !== "string") {
            throw this.crearError("TIPO_INVALIDO", "El tipo de medición debe ser texto.");
        }

        const tipoNormalizado = tipo.trim().toLowerCase();

        if (tipoNormalizado !== "ozono") {
            throw this.crearError("TIPO_INVALIDO", "En Sprint 0 solo se admite el tipo ozono.");
        }

        return tipoNormalizado;
    }

    /*
 * --------------------
     * fecha: Text --> validarFecha() --> fecha: Text
     * Valida una fecha ISO 8601 y la normaliza a UTC.
     
 * --------------------
 */
    validarFecha(fecha) {
        if (typeof fecha !== "string" || fecha.trim() === "") {
            throw this.crearError("FECHA_INVALIDA", "La fecha es obligatoria.");
        }

        const instante = Date.parse(fecha);

        if (Number.isNaN(instante)) {
            throw this.crearError("FECHA_INVALIDA", "La fecha debe tener un formato ISO 8601 válido.");
        }

        return new Date(instante).toISOString();
    }

    /*
 * --------------------
     * valor: R --> validarValor() --> valor: R
     * Comprueba que el valor sea un número real finito y no negativo.
     
 * --------------------
 */
    validarValor(valor) {
        if (typeof valor !== "number" || !Number.isFinite(valor) || valor < 0) {
            throw this.crearError(
                "VALOR_INVALIDO",
                "El valor debe ser un número real finito mayor o igual que cero."
            );
        }

        return valor;
    }

    /*
 * --------------------
     * codigo: Text, mensaje: Text --> crearError() --> error: Text
     * Crea un error de negocio identificable por las capas superiores.
     
 * --------------------
 */
    crearError(codigo, mensaje) {
        const error = new Error(mensaje);
        error.codigo = codigo;
        return error;
    }

    /*
 * --------------------
     * tipo: Text, fecha: Text, valor: R --> registrarMedicion() --> medicion: Medicion
     * Valida y registra una medición, devolviendo la fila persistida.
     
 * --------------------
 */
    async registrarMedicion(tipo, fecha, valor) {
        const tipoValido = this.validarTipo(tipo);
        const fechaValida = this.validarFecha(fecha);
        const valorValido = this.validarValor(valor);

        return this.baseDatos.insertarMedicion(
            tipoValido,
            fechaValida,
            valorValido
        );
    }

    /*
 * --------------------
     * tipo: Text --> obtenerUltimaMedicion() --> medicion: Medicion
     * Devuelve la última medición del tipo indicado o informa de su ausencia.
     
 * --------------------
 */
    async obtenerUltimaMedicion(tipo) {
        const tipoValido = this.validarTipo(tipo);
        const medicion = await this.baseDatos.obtenerUltimaMedicion(tipoValido);

        if (!medicion) {
            throw this.crearError(
                "SIN_MEDICIONES",
                "Todavía no hay mediciones del tipo solicitado."
            );
        }

        return medicion;
    }
}

module.exports = LogicaMediciones;
