/*
 * Nombre: rest.test.js
 * Descripción: Tests automáticos de integración del API REST del Sprint 0.
 * Copyright: (c) 2026 Pedro Fernández
 * Fecha: 11/10/2026
 * Autor: Pedro Fernández
 * Aportación: Verificación reproducible de las rutas HTTP y sus respuestas.
 */

const assert = require("assert");
const request = require("supertest");

const BaseDatos = require("../bd/BaseDatos");
const LogicaMediciones = require("../logica/LogicaMediciones");
const crearApp = require("../rest/crearApp");

describe("API REST", function () {

    let bd;
    let logica;
    let app;

    beforeEach(async function () {
        bd = new BaseDatos(":memory:");
        await bd.inicializar();

        logica = new LogicaMediciones(bd);
        app = crearApp(logica);
    });

    afterEach(async function () {
        await bd.cerrar();
    });

    it("POST /mediciones registra una medición válida y devuelve 201", async function () {
        const respuesta = await request(app)
            .post("/mediciones")
            .send({
                tipo: "ozono",
                fecha: "2026-10-11T10:00:00Z",
                valor: 7.5
            })
            .expect(201)
            .expect("Content-Type", /json/);

        assert.strictEqual(respuesta.body.id, 1);
        assert.strictEqual(respuesta.body.tipo, "ozono");
        assert.strictEqual(respuesta.body.fecha, "2026-10-11T10:00:00.000Z");
        assert.strictEqual(respuesta.body.valor, 7.5);
    });

    it("POST /mediciones rechaza un cuerpo incompleto", async function () {
        const respuesta = await request(app)
            .post("/mediciones")
            .send({
                tipo: "ozono",
                valor: 1.2
            })
            .expect(400);

        assert.strictEqual(respuesta.body.error, "FECHA_INVALIDA");
    });

    it("POST /mediciones rechaza un valor inválido", async function () {
        const respuesta = await request(app)
            .post("/mediciones")
            .send({
                tipo: "ozono",
                fecha: "2026-10-11T10:00:00Z",
                valor: -1
            })
            .expect(400);

        assert.strictEqual(respuesta.body.error, "VALOR_INVALIDO");
    });

    it("POST /mediciones rechaza JSON mal formado", async function () {
        const respuesta = await request(app)
            .post("/mediciones")
            .set("Content-Type", "application/json")
            .send('{"tipo":"ozono","fecha":')
            .expect(400);

        assert.strictEqual(respuesta.body.error, "JSON_INVALIDO");
    });

    it("GET /mediciones/ultima devuelve la única medición existente", async function () {
        await logica.registrarMedicion(
            "ozono",
            "2026-10-11T10:00:00Z",
            4.2
        );

        const respuesta = await request(app)
            .get("/mediciones/ultima")
            .query({ tipo: "ozono" })
            .expect(200);

        assert.strictEqual(respuesta.body.valor, 4.2);
    });

    it("GET /mediciones/ultima devuelve la más reciente entre varias", async function () {
        await logica.registrarMedicion(
            "ozono",
            "2026-10-11T09:00:00Z",
            1.1
        );

        await logica.registrarMedicion(
            "ozono",
            "2026-10-11T11:00:00Z",
            2.2
        );

        const respuesta = await request(app)
            .get("/mediciones/ultima")
            .query({ tipo: "ozono" })
            .expect(200);

        assert.strictEqual(respuesta.body.valor, 2.2);
    });

    it("GET /mediciones/ultima devuelve 404 si no existen mediciones", async function () {
        const respuesta = await request(app)
            .get("/mediciones/ultima")
            .query({ tipo: "ozono" })
            .expect(404);

        assert.strictEqual(respuesta.body.error, "SIN_MEDICIONES");
    });

    it("GET /mediciones/ultima rechaza la ausencia de tipo", async function () {
        const respuesta = await request(app)
            .get("/mediciones/ultima")
            .expect(400);

        assert.strictEqual(respuesta.body.error, "TIPO_INVALIDO");
    });

    it("devuelve 500 si la lógica produce un error interno inesperado", async function () {
        const logicaConFallo = {
            async registrarMedicion() {
                throw new Error("fallo inesperado");
            },
            async obtenerUltimaMedicion() {
                throw new Error("fallo inesperado");
            }
        };

        const appConFallo = crearApp(logicaConFallo);

        const respuesta = await request(appConFallo)
            .get("/mediciones/ultima")
            .query({ tipo: "ozono" })
            .expect(500);

        assert.strictEqual(respuesta.body.error, "ERROR_INTERNO");
    });
});
