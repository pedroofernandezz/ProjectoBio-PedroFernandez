-- ProyectoBio - Sprint 0
-- Persistencia mínima de mediciones.

CREATE TABLE IF NOT EXISTS MEDICION (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    fecha TEXT NOT NULL,
    valor REAL NOT NULL,
    CHECK (length(trim(tipo)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_medicion_tipo_fecha
ON MEDICION (tipo, fecha DESC, id DESC);
