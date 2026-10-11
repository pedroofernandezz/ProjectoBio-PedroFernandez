-- Nombre: esquema.sql
-- Descripción: Esquema SQLite de persistencia de mediciones del Sprint 0.
-- Copyright: (c) 2026 Pedro Fernández
-- Fecha: 11/10/2026
-- Autor: Pedro Fernández
-- Aportación: Definición de la tabla MEDICION y su índice de consulta.

CREATE TABLE IF NOT EXISTS MEDICION (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    fecha TEXT NOT NULL,
    valor REAL NOT NULL,
    CHECK (length(trim(tipo)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_medicion_tipo_fecha
ON MEDICION (tipo, fecha DESC, id DESC);
