/*
 * BaseDatos.js
 * Persistencia SQLite para las mediciones del Sprint 0.
 * Autor: Pedro Fernández
 */

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

class BaseDatos {

    /*
     * ruta: Text --> BaseDatos()
     * Crea el objeto de acceso a datos asociado a un fichero SQLite.
     */
    constructor(ruta) {
        this.ruta = ruta;
        this.db = null;
    }

    /*
     * --> abrir()
     * Abre la conexión SQLite si todavía no está abierta.
     */
    abrir() {
        if (this.db) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.ruta, (err) => {
                if (err) {
                    this.db = null;
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    /*
     * --> inicializar()
     * Crea la estructura de la base de datos definida en esquema.sql.
     */
    async inicializar() {
        await this.abrir();

        const rutaEsquema = path.join(__dirname, "esquema.sql");
        const sql = fs.readFileSync(rutaEsquema, "utf8");

        await new Promise((resolve, reject) => {
            this.db.exec(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    /*
     * sql: Text, parametros: [Text] --> ejecutar() --> resultado: Text
     * Ejecuta una sentencia SQL de escritura y devuelve lastID y changes.
     */
    ejecutar(sql, parametros = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, parametros, function (err) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve({
                    lastID: this.lastID,
                    changes: this.changes
                });
            });
        });
    }

    /*
     * sql: Text, parametros: [Text] --> obtenerUno() --> fila: Text
     * Ejecuta una consulta SQL y devuelve una única fila o undefined.
     */
    obtenerUno(sql, parametros = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, parametros, (err, fila) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(fila);
            });
        });
    }

    /*
     * tipo: Text, fecha: Text, valor: R --> insertarMedicion() --> medicion: Medicion
     * Inserta una medición y devuelve la fila almacenada con el id generado.
     */
    async insertarMedicion(tipo, fecha, valor) {
        const resultado = await this.ejecutar(
            "INSERT INTO MEDICION (tipo, fecha, valor) VALUES (?, ?, ?)",
            [tipo, fecha, valor]
        );

        return this.obtenerUno(
            "SELECT id, tipo, fecha, valor FROM MEDICION WHERE id = ?",
            [resultado.lastID]
        );
    }

    /*
     * tipo: Text --> obtenerUltimaMedicion() --> medicion: Medicion
     * Devuelve la medición más reciente del tipo indicado o undefined.
     */
    obtenerUltimaMedicion(tipo) {
        return this.obtenerUno(
            `SELECT id, tipo, fecha, valor
             FROM MEDICION
             WHERE tipo = ?
             ORDER BY fecha DESC, id DESC
             LIMIT 1`,
            [tipo]
        );
    }

    /*
     * --> cerrar()
     * Cierra la conexión SQLite si está abierta.
     */
    cerrar() {
        if (!this.db) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                    return;
                }

                this.db = null;
                resolve();
            });
        });
    }
}

module.exports = BaseDatos;
