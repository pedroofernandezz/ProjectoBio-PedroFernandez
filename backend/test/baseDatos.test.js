/*
 * Nombre: baseDatos.test.js
 * Descripción: Tests automáticos de la capa de persistencia del Sprint 0.
 * Copyright: (c) 2026 Pedro Fernández
 * Fecha: 11/10/2026
 * Autor: Pedro Fernández
 * Aportación: Verificación reproducible de inserción y consulta de mediciones.
 */

const assert = require("assert");
const BaseDatos = require("../bd/BaseDatos");

describe("BaseDatos", function () {

    let bd;

    beforeEach(async function () {
        bd = new BaseDatos(":memory:");
        await bd.inicializar();
    });

    afterEach(async function () {
        await bd.cerrar();
    });

    it("crea la tabla e inserta una medición con id autogenerado", async function () {
        const medicion = await bd.insertarMedicion(
            "ozono",
            "2026-10-11T09:00:00.000Z",
            1.234
        );

        assert.strictEqual(medicion.id, 1);
        assert.strictEqual(medicion.tipo, "ozono");
        assert.strictEqual(medicion.fecha, "2026-10-11T09:00:00.000Z");
        assert.strictEqual(medicion.valor, 1.234);
    });

    it("conserva el valor decimal", async function () {
        const medicion = await bd.insertarMedicion(
            "ozono",
            "2026-10-11T09:00:00.000Z",
            0.035
        );

        assert.strictEqual(medicion.valor, 0.035);
    });

    it("devuelve la medición con fecha más reciente", async function () {
        await bd.insertarMedicion("ozono", "2026-10-11T09:00:00.000Z", 1.0);
        await bd.insertarMedicion("ozono", "2026-10-11T10:00:00.000Z", 2.0);

        const ultima = await bd.obtenerUltimaMedicion("ozono");

        assert.strictEqual(ultima.valor, 2.0);
    });

    it("usa el id como desempate cuando las fechas son iguales", async function () {
        await bd.insertarMedicion("ozono", "2026-10-11T10:00:00.000Z", 1.0);
        const segunda = await bd.insertarMedicion(
            "ozono",
            "2026-10-11T10:00:00.000Z",
            2.0
        );

        const ultima = await bd.obtenerUltimaMedicion("ozono");

        assert.strictEqual(ultima.id, segunda.id);
        assert.strictEqual(ultima.valor, 2.0);
    });

    it("rechaza campos obligatorios nulos", async function () {
        await assert.rejects(
            () => bd.insertarMedicion(null, "2026-10-11T10:00:00.000Z", 1.0)
        );
    });

    it("devuelve undefined cuando no hay mediciones", async function () {
        const ultima = await bd.obtenerUltimaMedicion("ozono");
        assert.strictEqual(ultima, undefined);
    });
});
