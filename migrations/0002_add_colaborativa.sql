-- Distingue listas PESSOAIS (somente leitura, compartilháveis para visualização)
-- das SALAS DE RATEIO colaborativas (editáveis por quem tem o link/token).
-- 0 = lista pessoal · 1 = sala de rateio ("dividida com a galera").
ALTER TABLE salas ADD COLUMN colaborativa INTEGER NOT NULL DEFAULT 0;

-- As salas que já existiam foram criadas no modo colaborativo (rateio),
-- então preservamos esse comportamento para elas.
UPDATE salas SET colaborativa = 1;
