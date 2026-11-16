<?php
require_once __DIR__ . '/../database/conexion.php';

class Dashboard {
    private PDO $conn;
    private string $nowLima;

    public function __construct() {
        $conexion = new Conexion();
        $this->conn = $conexion->conectar();
        $tz = new DateTimeZone('America/Lima');
        $this->nowLima = (new DateTimeImmutable('now', $tz))->format('Y-m-d H:i:s');
    }

    public function table_cotizacion(): array
    {
        $sql = "
            SELECT
                c.id,
                p.usuario,
                c.estado,
                c.created_at,
                c.updated_at,
                COUNT(cd.id) AS total_items,
                GROUP_CONCAT(
                    CONCAT(cd.modelo, ': ', cd.descripcion)
                    ORDER BY cd.modelo
                    SEPARATOR ' | '
                ) AS items
            FROM cotizaciones c
            LEFT JOIN cotizacion_detalle cd ON cd.cotizacion_id = c.id
            LEFT JOIN personal p on p.IDPERSONAL=c.usuario_id
            GROUP BY
                c.id, p.usuario, c.estado, c.created_at, c.updated_at
            ORDER BY c.id DESC
            limit 3
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function table_receta(): array
    {
        $sql = "
            SELECT
                c.id,
                p.usuario,
                c.nombre,
                c.estado,
                c.created_at,
                c.updated_at,
                COALESCE(SUM(rd.cantidad), 0) AS total_items,
                GROUP_CONCAT(
                    CONCAT(rd.nombre, ' x ', COALESCE(rd.cantidad, 0))
                    ORDER BY rd.nombre
                    SEPARATOR ' | '
                ) AS items
            FROM recetas c
            LEFT JOIN receta_detalle rd ON rd.receta_id = c.id
            LEFT JOIN personal p ON p.IDPERSONAL = c.usuario_id
            GROUP BY
                c.id, p.usuario, c.nombre, c.estado, c.created_at, c.updated_at
            ORDER BY c.id DESC
            LIMIT 3
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function items(): array
    {
        $sql = "
            SELECT * FROM item
            ORDER BY id DESC
            limit 5
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function contadores(): array
    {
        $sql = "
            SELECT
            (SELECT COUNT(*) FROM personal WHERE idestado = 1) AS usuarios,
            (SELECT COUNT(*) FROM item WHERE estado = 1) AS items,
            (SELECT COUNT(*) FROM cotizaciones) AS cotizaciones,
            (SELECT COUNT(*) FROM carga) AS carga,
            (SELECT COUNT(*) FROM recetas) AS recetas,
            (SELECT COUNT(*) FROM receta_items WHERE estado = 1) AS receta_items,
            (SELECT COUNT(*) FROM receta_items WHERE estado = 1 AND UPPER(TRIM(tipo)) = 'PRODUCTO') AS receta_productos,
            (SELECT COUNT(*) FROM receta_items WHERE estado = 1 AND UPPER(TRIM(tipo)) = 'SERVICIO') AS receta_servicios;
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function variaciones(string $fechaInicio, string $fechaFin): array
    {
        $inicio = new DateTimeImmutable($fechaInicio . ' 00:00:00', new DateTimeZone('America/Lima'));
        $finExclusivo = new DateTimeImmutable($fechaFin . ' 00:00:00', new DateTimeZone('America/Lima'));
        $finExclusivo = $finExclusivo->modify('+1 day');
        $dias = (int)$inicio->diff($finExclusivo)->format('%a');
        $anteriorInicio = $inicio->modify('-' . $dias . ' days');

        $sql = "
            SELECT
            (SELECT COUNT(*) FROM personal
                WHERE fecha_registro >= :actual_inicio AND fecha_registro < :actual_fin) AS usuarios_actual,
            (SELECT COUNT(*) FROM personal
                WHERE fecha_registro >= :anterior_inicio AND fecha_registro < :anterior_fin) AS usuarios_anterior,
            (SELECT COUNT(*) FROM item i
                INNER JOIN carga c ON c.id = i.id_carga
                WHERE c.fecha_registro >= :actual_inicio_items AND c.fecha_registro < :actual_fin_items) AS items_actual,
            (SELECT COUNT(*) FROM item i
                INNER JOIN carga c ON c.id = i.id_carga
                WHERE c.fecha_registro >= :anterior_inicio_items AND c.fecha_registro < :anterior_fin_items) AS items_anterior,
            (SELECT COUNT(*) FROM cotizaciones
                WHERE created_at >= :actual_inicio_cotizaciones AND created_at < :actual_fin_cotizaciones) AS cotizaciones_actual,
            (SELECT COUNT(*) FROM cotizaciones
                WHERE created_at >= :anterior_inicio_cotizaciones AND created_at < :anterior_fin_cotizaciones) AS cotizaciones_anterior,
            (SELECT COUNT(*) FROM carga
                WHERE fecha_registro >= :actual_inicio_carga AND fecha_registro < :actual_fin_carga) AS carga_actual,
            (SELECT COUNT(*) FROM carga
                WHERE fecha_registro >= :anterior_inicio_carga AND fecha_registro < :anterior_fin_carga) AS carga_anterior,
            (SELECT COUNT(*) FROM recetas
                WHERE created_at >= :actual_inicio_recetas AND created_at < :actual_fin_recetas) AS recetas_actual,
            (SELECT COUNT(*) FROM recetas
                WHERE created_at >= :anterior_inicio_recetas AND created_at < :anterior_fin_recetas) AS recetas_anterior,
            (SELECT COUNT(*) FROM receta_items
                WHERE estado = 1 AND created_at >= :actual_inicio_receta_items AND created_at < :actual_fin_receta_items) AS receta_items_actual,
            (SELECT COUNT(*) FROM receta_items
                WHERE estado = 1 AND created_at >= :anterior_inicio_receta_items AND created_at < :anterior_fin_receta_items) AS receta_items_anterior,
            (SELECT COUNT(*) FROM receta_items
                WHERE estado = 1 AND UPPER(TRIM(tipo)) = 'PRODUCTO'
                  AND created_at >= :actual_inicio_productos AND created_at < :actual_fin_productos) AS productos_actual,
            (SELECT COUNT(*) FROM receta_items
                WHERE estado = 1 AND UPPER(TRIM(tipo)) = 'PRODUCTO'
                  AND created_at >= :anterior_inicio_productos AND created_at < :anterior_fin_productos) AS productos_anterior,
            (SELECT COUNT(*) FROM receta_items
                WHERE estado = 1 AND UPPER(TRIM(tipo)) = 'SERVICIO'
                  AND created_at >= :actual_inicio_servicios AND created_at < :actual_fin_servicios) AS servicios_actual,
            (SELECT COUNT(*) FROM receta_items
                WHERE estado = 1 AND UPPER(TRIM(tipo)) = 'SERVICIO'
                  AND created_at >= :anterior_inicio_servicios AND created_at < :anterior_fin_servicios) AS servicios_anterior
        ";

        $stmt = $this->conn->prepare($sql);
        $actualInicio = $inicio->format('Y-m-d H:i:s');
        $actualFin = $finExclusivo->format('Y-m-d H:i:s');
        $anteriorInicioDate = $anteriorInicio;
        $anteriorInicio = $anteriorInicioDate->format('Y-m-d H:i:s');
        $anteriorFin = $inicio->format('Y-m-d H:i:s');

        foreach ([
            'actual_inicio', 'actual_inicio_items', 'actual_inicio_cotizaciones', 'actual_inicio_carga',
            'actual_inicio_recetas', 'actual_inicio_receta_items', 'actual_inicio_productos', 'actual_inicio_servicios'
        ] as $parameter) {
            $stmt->bindValue(':' . $parameter, $actualInicio);
        }
        foreach ([
            'actual_fin', 'actual_fin_items', 'actual_fin_cotizaciones', 'actual_fin_carga',
            'actual_fin_recetas', 'actual_fin_receta_items', 'actual_fin_productos', 'actual_fin_servicios'
        ] as $parameter) {
            $stmt->bindValue(':' . $parameter, $actualFin);
        }
        foreach ([
            'anterior_inicio', 'anterior_inicio_items', 'anterior_inicio_cotizaciones', 'anterior_inicio_carga',
            'anterior_inicio_recetas', 'anterior_inicio_receta_items', 'anterior_inicio_productos', 'anterior_inicio_servicios'
        ] as $parameter) {
            $stmt->bindValue(':' . $parameter, $anteriorInicio);
        }
        foreach ([
            'anterior_fin', 'anterior_fin_items', 'anterior_fin_cotizaciones', 'anterior_fin_carga',
            'anterior_fin_recetas', 'anterior_fin_receta_items', 'anterior_fin_productos', 'anterior_fin_servicios'
        ] as $parameter) {
            $stmt->bindValue(':' . $parameter, $anteriorFin);
        }

        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
        return [
            'usuarios' => [
                'actual' => (int)($result['usuarios_actual'] ?? 0),
                'anterior' => (int)($result['usuarios_anterior'] ?? 0),
            ],
            'items' => [
                'actual' => (int)($result['items_actual'] ?? 0),
                'anterior' => (int)($result['items_anterior'] ?? 0),
            ],
            'cotizaciones' => [
                'actual' => (int)($result['cotizaciones_actual'] ?? 0),
                'anterior' => (int)($result['cotizaciones_anterior'] ?? 0),
            ],
            'carga' => [
                'actual' => (int)($result['carga_actual'] ?? 0),
                'anterior' => (int)($result['carga_anterior'] ?? 0),
            ],
            'recetas' => [
                'actual' => (int)($result['recetas_actual'] ?? 0),
                'anterior' => (int)($result['recetas_anterior'] ?? 0),
            ],
            'receta_items' => [
                'actual' => (int)($result['receta_items_actual'] ?? 0),
                'anterior' => (int)($result['receta_items_anterior'] ?? 0),
            ],
            'productos' => [
                'actual' => (int)($result['productos_actual'] ?? 0),
                'anterior' => (int)($result['productos_anterior'] ?? 0),
            ],
            'servicios' => [
                'actual' => (int)($result['servicios_actual'] ?? 0),
                'anterior' => (int)($result['servicios_anterior'] ?? 0),
            ],
            'periodo' => [
                'inicio' => $inicio->format('Y-m-d'),
                'fin' => $finExclusivo->modify('-1 day')->format('Y-m-d'),
                'anterior_inicio' => $anteriorInicioDate->format('Y-m-d'),
                'anterior_fin' => $inicio->modify('-1 day')->format('Y-m-d'),
            ],
        ];
    }

    public function header(): array
    {
        $sql = "
                SELECT
                b.usuario,
                MD5(b.doc) AS doc,
                MAX(a.fecha) AS ultima_fecha,
                'usuario' as tipo,
                NULL AS receta_id,
                NULL AS total_items
                FROM login a
                LEFT JOIN personal b ON a.id_user = b.idpersonal
                WHERE a.tipo = 'IN'
                AND a.fecha >= DATE_SUB(sysdate(), INTERVAL 8 HOUR)
                AND b.usuario != 'php.io'
                GROUP BY b.usuario, b.doc

                UNION ALL

                SELECT
                t.usuario,
                t.estado AS doc,
                t.created_at AS ultima_fecha,
                'cotización' as tipo,
                NULL AS receta_id,
                NULL AS total_items
                FROM (
                    SELECT
                        b.usuario,
                        a.estado,
                        a.created_at
                    FROM cotizaciones a
                    LEFT JOIN personal b ON a.usuario_id = b.IDPERSONAL
                    WHERE a.created_at >= DATE_SUB(sysdate(), INTERVAL 8 HOUR)
                    ORDER BY a.created_at DESC
                    LIMIT 5
                ) t

                UNION ALL

                SELECT
                t2.usuario,
                t2.estado AS doc,
                t2.created_at AS ultima_fecha,
                'receta' as tipo,
                t2.id AS receta_id,
                t2.total_items
                FROM (
                    SELECT
                        a.id,
                        b.usuario,
                        a.estado,
                        a.created_at,
                        COALESCE(SUM(rd.cantidad), 0) AS total_items
                    FROM recetas a
                    LEFT JOIN personal b ON a.usuario_id = b.IDPERSONAL
                    LEFT JOIN receta_detalle rd ON rd.receta_id = a.id
                    WHERE a.created_at >= DATE_SUB(sysdate(), INTERVAL 8 HOUR)
                    GROUP BY a.id, b.usuario, a.estado, a.created_at
                    ORDER BY a.created_at DESC
                    LIMIT 5
                ) t2
                order by ultima_fecha desc
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function headerNotifications(int $limit = 10): array
    {
        $this->asegurarColumnaDestinatarioNotificaciones();
        $cutoff = (new DateTimeImmutable('now', new DateTimeZone('America/Lima')))
            ->sub(new DateInterval('PT5H'))
            ->format('Y-m-d H:i:s');
        $usuarioActual = (int)($_SESSION['session_id'] ?? 0);

        $sql = "
            SELECT
                id,
                tipo,
                lower(usuario) as usuario,
                titulo,
                detalle,
                icon,
                tone,
                meta_json,
                created_at
            FROM header_notifications
            WHERE estado = 1
              AND created_at >= :cutoff
              AND (destinatario_id IS NULL OR destinatario_id = :destinatario_id)
            ORDER BY created_at DESC, id DESC
            LIMIT :limit
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':cutoff', $cutoff);
        $stmt->bindValue(':destinatario_id', $usuarioActual, PDO::PARAM_INT);
        $stmt->bindValue(':limit', max(1, $limit), PDO::PARAM_INT);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

        foreach ($rows as &$row) {
            if (($row['tipo'] ?? '') !== 'item_receta') {
                continue;
            }

            $meta = json_decode((string)($row['meta_json'] ?? ''), true);
            if (!is_array($meta) || empty($meta['item_id'])) {
                continue;
            }

            $meta['item_hash'] = md5((string)$meta['item_id']);
            $row['meta_json'] = json_encode($meta, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        unset($row);

        return $rows;
    }

    private function asegurarColumnaDestinatarioNotificaciones(): void
    {
        $stmt = $this->conn->prepare("SHOW COLUMNS FROM header_notifications LIKE 'destinatario_id'");
        $stmt->execute();
        if (!$stmt->fetch(PDO::FETCH_ASSOC)) {
            $this->conn->exec("ALTER TABLE header_notifications ADD COLUMN destinatario_id INT NULL DEFAULT NULL AFTER usuario_id");
            $this->conn->exec("ALTER TABLE header_notifications ADD KEY idx_header_notifications_destinatario_created (destinatario_id, created_at)");
        }
    }

    public function headerNotificationsSignature(): array
    {
        $cutoff = (new DateTimeImmutable('now', new DateTimeZone('America/Lima')))
            ->sub(new DateInterval('PT24H'))
            ->format('Y-m-d H:i:s');

        $sql = "
            SELECT
                COUNT(*) AS total,
                COALESCE(MAX(id), 0) AS max_id
            FROM header_notifications
            WHERE estado = 1
              AND created_at >= :cutoff
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':cutoff', $cutoff);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];

        return [
            'total' => (int)($row['total'] ?? 0),
            'max_id' => (int)($row['max_id'] ?? 0),
        ];
    }

    public function graf_donut(): array
    {
        $sql = "
            SELECT estado, COUNT(*) AS ctd
            FROM cotizaciones
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY estado;
        ";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function graf_donut_receta(): array
    {
        $sql = "
            SELECT estado, COUNT(*) AS ctd
            FROM recetas
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY estado;
        ";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function graf_line(): array
    {
        $sql = "
            SELECT
            estado,
            DATE_FORMAT(created_at, '%M') AS mes,
            DATE_FORMAT(created_at, '%Y-%m') AS periodo,
            COUNT(*) AS ctd
            FROM cotizaciones
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY
            estado,
            DATE_FORMAT(created_at, '%Y-%m'),
            DATE_FORMAT(created_at, '%M')
            ORDER BY
            DATE_FORMAT(created_at, '%Y-%m') ASC;
        ";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function graf_line_receta(): array
    {
        $sql = "
            SELECT
            estado,
            DATE_FORMAT(created_at, '%M') AS mes,
            DATE_FORMAT(created_at, '%Y-%m') AS periodo,
            COUNT(*) AS ctd
            FROM recetas
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY
            estado,
            DATE_FORMAT(created_at, '%Y-%m'),
            DATE_FORMAT(created_at, '%M')
            ORDER BY
            DATE_FORMAT(created_at, '%Y-%m') ASC;
        ";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
