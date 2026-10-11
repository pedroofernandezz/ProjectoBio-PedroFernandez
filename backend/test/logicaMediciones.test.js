/*
 * Nombre: logicaMediciones.test.js
 * Descripción: Tests automáticos de la lógica real del negocio del Sprint 0.
 * Copyright: (c) 2026 Pedro Fernández
 * Fecha: 11/10/2026
 * Autor: Pedro Fernández
 * Aportación: Verificación reproducible de validaciones y operaciones de negocio.
 */

const assert = require("assert");
const BaseDatos = require("../bd/BaseDatos");
const LogicaMediciones = require("../logica/LogicaMediciones");

describe("LogicaMediciones", function () {

    let bd;
    let logica;

    beforeEach(async function () {
        bd = new BaseDatos(":memory:");
        await bd.inicializar();
        logica = new LogicaMediciones(bd);
    });

    afterEach(async function () {
        await bd.cerrar();
    });

    it("registra una medición válida", async function () {
        const medicion = await logica.registrarMedicion(
            "ozono",
            "2026-10-11T09:30:00Z",
            7.5
        );

        assert.strictEqual(medicion.id, 1);
        assert.strictEqual(medicion.tipo, "ozono");
        assert.strictEqual(medicion.fecha, "2026-10-11T09:30:00.000Z");
        assert.strictEqual(medicion.valor, 7.5);
    });

    it("devuelve la última medición registrada", async function () {
        await logica.registrarMedicion("ozono", "2026-10-11T09:00:00Z", 1.0);
        await logica.registrarMedicion("ozono", "2026-10-11T10:00:00Z", 2.0);

        const ultima = await logica.obtenerUltimaMedicion("ozono");

        assert.strictEqual(ultima.valor, 2.0);
    });

    it("informa de ausencia cuando no existen mediciones", async function () {
        await assert.rejects(
            () => logica.obtenerUltimaMedicion("ozono"),
            (error) => error.codigo === "SIN_MEDICIONES"
        );
    });

    it("rechaza tipos no admitidos", async function () {
        await assert.rejects(
            () => logica.registrarMedicion("temperatura", "2026-10-11T09:00:00Z", 1),
            (error) => error.codigo === "TIPO_INVALIDO"
        );
    });

    it("rechaza valores negativos", async function () {
        await assert.rejects(
            () => logica.registrarMedicion("ozono", "2026-10-11T09:00:00Z", -1),
            (error) => error.codigo === "VALOR_INVALIDO"
        );
    });

    it("rechaza valores no numéricos", async function () {
        await assert.rejects(
            () => logica.registrarMedicion("ozono", "2026-10-11T09:00:00Z", "7.5"),
            (error) => error.codigo === "VALOR_INVALIDO"
        );
    });

    it("rechaza NaN e infinito", async function () {
        await assert.rejects(
            () => logica.registrarMedicion("ozono", "2026-10-11T09:00:00Z", NaN),
            (error) => error.codigo === "VALOR_INVALIDO"
        );

        await assert.rejects(
            () => logica.registrarMedicion("ozono", "2026-10-11T09:00:00Z", Infinity),
            (error) => error.codigo === "VALOR_INVALIDO"
        );
    });

    it("rechaza fechas inválidas", async function () {
        await assert.rejects(
            () => logica.registrarMedicion("ozono", "esto-no-es-una-fecha", 1),
            (error) => error.codigo === "FECHA_INVALIDA"
        );
    });

    it("normaliza el tipo a minúsculas", async function () {
        const medicion = await logica.registrarMedicion(
            " OZONO ",
            "2026-10-11T09:00:00Z",
            1
        );

        assert.strictEqual(medicion.tipo, "ozono");
    });
});
