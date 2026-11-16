ALTER TABLE header_notifications
    ADD COLUMN destinatario_id INT NULL DEFAULT NULL AFTER usuario_id,
    ADD KEY idx_header_notifications_destinatario_created (destinatario_id, created_at);
