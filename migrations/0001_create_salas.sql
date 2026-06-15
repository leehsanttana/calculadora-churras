CREATE TABLE IF NOT EXISTS salas (
  id             TEXT    PRIMARY KEY,
  nome           TEXT    NOT NULL,
  entrada_json   TEXT    NOT NULL,
  resultado_json TEXT    NOT NULL,
  host_token     TEXT    NOT NULL,
  criada_em      INTEGER NOT NULL,
  expira_em      INTEGER NOT NULL,
  encerrada      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS participantes (
  id        TEXT    PRIMARY KEY,
  sala_id   TEXT    NOT NULL REFERENCES salas(id) ON DELETE CASCADE,
  nome      TEXT    NOT NULL,
  criado_em INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS compromissos (
  id               TEXT  PRIMARY KEY,
  sala_id          TEXT  NOT NULL,
  participante_id  TEXT  NOT NULL REFERENCES participantes(id) ON DELETE CASCADE,
  item_chave       TEXT  NOT NULL,
  item_nome        TEXT  NOT NULL,
  quantidade       REAL  NOT NULL,
  unidade          TEXT  NOT NULL,
  UNIQUE(sala_id, participante_id, item_chave)
);

CREATE INDEX IF NOT EXISTS idx_participantes_sala ON participantes(sala_id);
CREATE INDEX IF NOT EXISTS idx_compromissos_sala  ON compromissos(sala_id);
