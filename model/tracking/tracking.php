<?php
require_once __DIR__ . '/../../database/conexion.php';

class Tracking
{
    private PDO $conn;
    private string $nowLima;

    public const FASES_ACTIVIDADES = [
        'Inicio' => [
            'Inicio de Proyecto',
            'Acta de Inicio del Proyecto',
            'Registro de Interesados'
        ],
        'Planificación' => [
            'Envió de Diseño Preliminar',
            'Aprobación del Diseño',
            'Compra de Materiales Crítico',
            'Compra Parcial de Materiales',
            'Llegada de Material Crítico',
            'Final de Compras de Materiales',
            'Envio de Documentos SST',
            'Envio del GANTT'
        ],
        'Fabricación' => [
            'Inicio de Fabricación',
            'Inicio de Programación',
            'Fin de Fabricación',
            'Fin de Programación',
            'Pruebas FAT',
            'Otras Pruebas',
            'Visita a Planta'
        ],
        'Instalación / Entrega' => [
            'Ingreso a Planta',
            'Inicio de Instalación',
            'Entrega de Materiales para Instalación',
            'Fin de Instalación',
            'Pruebas SAT',
            'Inicio en Puesta en Marcha',
            'Fin de Puesta en Marcha',
            'Salida de Planta'
        ],
        'Cierre' => [
            'Entrega de Dossier en la plataforma',
            'Envio de Acta de Conformidad',
            'Recepcion de Acta de Conformidad',
            'Final del Proyecto'
        ]
    ];

    public const PESOS_PROYECTO = [
        'Inicio' => [
            'Inicio de Proyecto' => 1.00,
            'Acta de Inicio del Proyecto' => 2.00,
            'Registro de Interesados' => 2.00
        ],
        'Planificación' => [
            'Envió de Diseño Preliminar' => 4.00,
            'Aprobación del Diseño' => 5.00,
            'Compra de Materiales Crítico' => 1.50,
            'Compra Parcial de Materiales' => 1.00,
            'Llegada de Material Crítico' => 2.00,
            'Final de Compras de Materiales' => 5.00,
            'Envio de Documentos SST' => 0.50,
            'Envio del GANTT' => 1.00
        ],
        'Fabricación' => [
            'Inicio de Fabricación' => 1.00,
            'Inicio de Programación' => 1.00,
            'Fin de Fabricación' => 20.00,
            'Fin de Programación' => 15.00,
            'Pruebas FAT' => 5.00,
            'Otras Pruebas' => 2.00,
            'Visita a Planta' => 1.00
        ],
        'Instalación / Entrega' => [
            'Ingreso a Planta' => 1.00,
            'Inicio de Instalación' => 2.00,
            'Entrega de Materiales para Instalación' => 3.00,
            'Fin de Instalación' => 10.00,
            'Pruebas SAT' => 2.00,
            'Inicio en Puesta en Marcha' => 1.00,
            'Fin de Puesta en Marcha' => 4.00,
            'Salida de Planta' => 2.00
        ],
        'Cierre' => [
            'Entrega de Dossier en la plataforma' => 2.00,
            'Envio de Acta de Conformidad' => 1.00,
            'Recepcion de Acta de Conformidad' => 1.00,
            'Final del Proyecto' => 1.00
        ]
    ];

    public const PESOS_FASE = [
        'Inicio' => [
            'Inicio de Proyecto' => 20.00,
            'Acta de Inicio del Proyecto' => 40.00,
            'Registro de Interesados' => 40.00
        ],
        'Planificación' => [
            'Envió de Diseño Preliminar' => 20.00,
            'Aprobación del Diseño' => 25.00,
            'Compra de Materiales Crítico' => 7.50,
            'Compra Parcial de Materiales' => 5.00,
            'Llegada de Material Crítico' => 10.00,
            'Final de Compras de Materiales' => 25.00,
            'Envio de Documentos SST' => 2.50,
            'Envio del GANTT' => 5.00
        ],
        'Fabricación' => [
            'Inicio de Fabricación' => 2.20,
            'Inicio de Programación' => 2.20,
            'Fin de Fabricación' => 44.00,
            'Fin de Programación' => 33.00,
            'Pruebas FAT' => 11.00,
            'Otras Pruebas' => 5.40,
            'Visita a Planta' => 2.20
        ],
        'Instalación / Entrega' => [
            'Ingreso a Planta' => 4.00,
            'Inicio de Instalación' => 8.00,
            'Entrega de Materiales para Instalación' => 12.00,
            'Fin de Instalación' => 40.00,
            'Pruebas SAT' => 8.00,
            'Inicio en Puesta en Marcha' => 4.00,
            'Fin de Puesta en Marcha' => 16.00,
            'Salida de Planta' => 8.00
        ],
        'Cierre' => [
            'Entrega de Dossier en la plataforma' => 40.00,
            'Envio de Acta de Conformidad' => 20.00,
            'Recepcion de Acta de Conformidad' => 20.00,
            'Final del Proyecto' => 20.00
        ]
    ];

    public const ACTIVIDADES_COMPRAS = [
        'Compra de Materiales Crítico',
        'Compra Parcial de Materiales',
        'Llegada de Material Crítico',
        'Final de Compras de Materiales'
    ];

    public const COLOR_ACTIVIDAD_DEFAULT = '#facc15';

    public function __construct()
    {
        $conexion = new Conexion();
        $this->conn = $conexion->conectar();
        $tz = new DateTimeZone('America/Lima');
        $this->nowLima = (new DateTimeImmutable('now', $tz))->format('Y-m-d H:i:s');
    }

    public function begin(): void
    {
        $this->conn->beginTransaction();
    }

    public function commit(): void
    {
        $this->conn->commit();
    }

    public function rollback(): void
    {
        if ($this->conn->inTransaction()) {
            $this->conn->rollBack();
        }
    }

    public function tableTracking(string $fecIni, string $fecFin): array
    {
        $sql = "SELECT
                    t.id,
                    t.id_receta,
                    t.nombre,
                    t.razon_social_empresa,
                    t.ruc,
                    t.cod_tracking,
                    t.cod_publico,
                    t.estado,
                    t.created_at,
                    t.updated_at,
                    CASE WHEN t.id_receta IS NULL THEN 0 ELSE 1 END AS origen_receta,
                    (SELECT COUNT(*) FROM tracking_actividades ta WHERE ta.tracking_id = t.id) AS total_actividades
                FROM trackings t
                WHERE t.updated_at BETWEEN :fecIni AND DATE_ADD(:fecFin, INTERVAL 1 DAY)
                ORDER BY t.id DESC";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':fecIni', $fecIni);
        $stmt->bindValue(':fecFin', $fecFin);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function crearDesdeReceta(int $recetaId): ?int
    {
        $existente = $this->conn->prepare(
            "SELECT id FROM trackings WHERE id_receta = :receta_id LIMIT 1"
        );
        $existente->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $existente->execute();
        if ($idExist = $existente->fetchColumn()) {
            return (int)$idExist;
        }

        $sql = "INSERT INTO trackings (
                    id_receta,
                    nombre,
                    razon_social_empresa,
                    ruc,
                    cod_tracking,
                    created_at
                )
                SELECT
                    r.id,
                    r.nombre,
                    rc.razon_social_empresa,
                    rc.ruc,
                    CONCAT('PEND-', UUID_SHORT()),
                    r.created_at
                FROM recetas r
                INNER JOIN receta_cliente rc ON rc.id_receta = r.id
                WHERE r.id = :receta_id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmt->execute();
        if ($stmt->rowCount() <= 0) {
            return null;
        }

        $id = (int)$this->conn->lastInsertId();
        $this->actualizarCodTracking($id);
        $this->asignarCodigoPublico($id);

        return $id;
    }

    public function crearManual(string $nombre, string $razonSocial, string $ruc, string $codTracking): int
    {
        $nombre = trim($nombre);
        $razonSocial = trim($razonSocial);
        $ruc = trim($ruc);
        $codTracking = trim($codTracking);

        if ($nombre === '' || $razonSocial === '' || $ruc === '') {
            throw new InvalidArgumentException('Nombre, razón social y RUC son obligatorios');
        }

        $sql = "INSERT INTO trackings (
                    id_receta,
                    nombre,
                    razon_social_empresa,
                    ruc,
                    cod_tracking,
                    created_at
                ) VALUES (
                    NULL,
                    :nombre,
                    :razon_social,
                    :ruc,
                    :cod_tracking,
                    :created_at
                )";

        $code = '';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':nombre', $nombre);
        $stmt->bindValue(':razon_social', $razonSocial);
        $stmt->bindValue(':ruc', $ruc);

        if ($codTracking !== '') {
            $code = $codTracking;
        } else {
            $code = 'PEND-' . bin2hex(random_bytes(6));
        }
        $stmt->bindValue(':cod_tracking', $code);
        $stmt->bindValue(':created_at', $this->nowLima);
        $stmt->execute();

        $id = (int)$this->conn->lastInsertId();

        if ($codTracking === '') {
            $this->actualizarCodTracking($id);
        }

        $this->asignarCodigoPublico($id);

        return $id;
    }

    public function generarCodigoPublico(): string
    {
        for ($intentos = 0; $intentos < 20; $intentos++) {
            $codigo = str_pad((string)random_int(0, 9999999999), 10, '0', STR_PAD_LEFT);

            if (!$this->codigoPublicoExiste($codigo)) {
                return $codigo;
            }
        }

        throw new RuntimeException('No se pudo generar un código público único');
    }

    public function codigoPublicoExiste(string $codPublico): bool
    {
        $stmt = $this->conn->prepare(
            "SELECT 1 FROM trackings WHERE cod_publico = :cod LIMIT 1"
        );
        $stmt->bindValue(':cod', trim($codPublico));
        $stmt->execute();
        return (bool)$stmt->fetchColumn();
    }

    public function asignarCodigoPublico(int $trackingId): string
    {
        $codigo = $this->generarCodigoPublico();

        $stmt = $this->conn->prepare(
            "UPDATE trackings SET cod_publico = :cod WHERE id = :id"
        );
        $stmt->bindValue(':cod', $codigo);
        $stmt->bindValue(':id', $trackingId, PDO::PARAM_INT);
        $stmt->execute();

        return $codigo;
    }

    public function trackingsSinCodigoPublico(): array
    {
        $sql = "SELECT id, cod_tracking
                FROM trackings
                WHERE cod_publico IS NULL OR TRIM(cod_publico) = ''
                ORDER BY id ASC";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function codigoExiste(string $codTracking): bool
    {
        $stmt = $this->conn->prepare(
            "SELECT 1 FROM trackings WHERE cod_tracking = :cod LIMIT 1"
        );
        $stmt->bindValue(':cod', trim($codTracking));
        $stmt->execute();
        return (bool)$stmt->fetchColumn();
    }

    public function trackingExiste(int $trackingId): bool
    {
        $stmt = $this->conn->prepare(
            "SELECT 1 FROM trackings WHERE id = :id LIMIT 1"
        );
        $stmt->bindValue(':id', $trackingId, PDO::PARAM_INT);
        $stmt->execute();
        return (bool)$stmt->fetchColumn();
    }

    public function trackingPorCodigo(string $codTracking): ?array
    {
        $sql = "SELECT
                    t.id,
                    t.id_receta,
                    t.nombre,
                    t.descripcion,
                    t.num_oc,
                    t.razon_social_empresa,
                    t.ruc,
                    t.cod_tracking,
                    t.cod_publico,
                    t.created_at,
                    t.updated_at,
                    CASE WHEN t.id_receta IS NULL THEN 0 ELSE 1 END AS origen_receta
                FROM trackings t
                WHERE t.cod_tracking = :cod
                LIMIT 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':cod', trim($codTracking));
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row === false ? null : $row;
    }

    public function trackingPorCodigoPublico(string $codPublico): ?array
    {
        $sql = "SELECT
                    t.id,
                    t.id_receta,
                    t.nombre,
                    t.descripcion,
                    t.num_oc,
                    t.razon_social_empresa,
                    t.ruc,
                    t.cod_tracking,
                    t.cod_publico,
                    t.created_at,
                    t.updated_at,
                    CASE WHEN t.id_receta IS NULL THEN 0 ELSE 1 END AS origen_receta
                FROM trackings t
                WHERE t.cod_publico = :cod
                LIMIT 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':cod', trim($codPublico));
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row === false ? null : $row;
    }

    public function trackingConActividadesPorCodigoPublico(string $codPublico): ?array
    {
        $tracking = $this->trackingPorCodigoPublico($codPublico);
        if ($tracking === null) {
            return null;
        }

        $tracking['actividades'] = $this->actividadesTracking((int)$tracking['id']);

        return $tracking;
    }

    public function trackingPorId(int $trackingId): ?array
    {
        $sql = "SELECT
                    t.id,
                    t.id_receta,
                    t.nombre,
                    t.razon_social_empresa,
                    t.ruc,
                    t.cod_tracking,
                    t.cod_publico,
                    t.created_at,
                    t.updated_at,
                    t.descripcion,
                    t.num_oc,
                    CASE WHEN t.id_receta IS NULL THEN 0 ELSE 1 END AS origen_receta
                FROM trackings t
                WHERE t.id = :id
                LIMIT 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $trackingId, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row === false ? null : $row;
    }

    public function trackingConActividades(string $codTracking): ?array
    {
        $tracking = $this->trackingPorCodigo($codTracking);
        if ($tracking === null) {
            return null;
        }

        $tracking['actividades'] = $this->actividadesTracking((int)$tracking['id']);

        return $tracking;
    }

    public function trackingConActividadesPorId(int $trackingId): ?array
    {
        $tracking = $this->trackingPorId($trackingId);
        if ($tracking === null) {
            return null;
        }

        $tracking['actividades'] = $this->actividadesTracking((int)$tracking['id']);

        return $tracking;
    }

    private function actualizarCodTracking(int $id): void
    {
        $sql = "UPDATE trackings
                SET cod_tracking = CONCAT(
                    'MGI-',
                    UPPER(LEFT(TRIM(razon_social_empresa), 1)),
                    '-',
                    YEAR(created_at),
                    '-',
                    id
                )
                WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
    }

    public function actividadesTracking(int $trackingId, bool $incluirAuditoria = false): array
    {
        $camposAuditoria = $incluirAuditoria
            ? ", COALESCE(pa.usuario, pc.usuario, '-') AS guardado_por"
            : '';
        $joinsAuditoria = $incluirAuditoria
            ? " LEFT JOIN personal pa ON pa.IDPERSONAL = ta.updated_by
               LEFT JOIN personal pc ON pc.IDPERSONAL = tc.updated_by"
            : '';
        $sql = "SELECT
                    id,
                    ta.fase,
                    ta.actividad,
                    ta.fecha,
                    ta.observacion,
                    COALESCE(tc.color, '#FACC15') AS color
                    $camposAuditoria
                FROM tracking_actividades ta
                LEFT JOIN tracking_actividad_colores tc
                    ON tc.tracking_id = ta.tracking_id
                   AND tc.fase COLLATE utf8mb4_unicode_ci = ta.fase COLLATE utf8mb4_unicode_ci
                   AND tc.actividad COLLATE utf8mb4_unicode_ci = ta.actividad COLLATE utf8mb4_unicode_ci
                $joinsAuditoria
                WHERE ta.tracking_id = :tracking_id
                ORDER BY ta.id ASC";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':tracking_id', $trackingId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function coloresActividadesTracking(int $trackingId): array
    {
        $stmt = $this->conn->prepare(
            "SELECT tc.fase, tc.actividad, tc.color, p.usuario AS actualizado_por
             FROM tracking_actividad_colores tc
             LEFT JOIN personal p ON p.IDPERSONAL = tc.updated_by
             WHERE tc.tracking_id = :tracking_id"
        );
        $stmt->bindValue(':tracking_id', $trackingId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function guardarColorActividad(int $trackingId, string $fase, string $actividad, string $color, ?int $usuarioId = null): string
    {
        $fase = trim($fase);
        $actividad = trim($actividad);
        $color = strtoupper(trim($color));

        if (!isset(self::FASES_ACTIVIDADES[$fase]) || !in_array($actividad, self::FASES_ACTIVIDADES[$fase], true)) {
            throw new InvalidArgumentException('La actividad seleccionada no es válida');
        }
        if (!preg_match('/^#[0-9A-F]{6}$/', $color)) {
            throw new InvalidArgumentException('El color debe ser un hexadecimal válido');
        }

        $actividadStmt = $this->conn->prepare(
            "SELECT id, fecha FROM tracking_actividades
             WHERE tracking_id = :tracking_id AND fase = :fase AND actividad = :actividad
             LIMIT 1"
        );
        $actividadStmt->execute([
            ':tracking_id' => $trackingId,
            ':fase' => $fase,
            ':actividad' => $actividad
        ]);
        $actividadGuardada = $actividadStmt->fetch(PDO::FETCH_ASSOC);
        if ($actividadGuardada && !empty($actividadGuardada['fecha'])) {
            $color = '#22C55E';
        }

        $stmt = $this->conn->prepare(
            "INSERT INTO tracking_actividad_colores (tracking_id, fase, actividad, color, updated_by)
             VALUES (:tracking_id, :fase, :actividad, :color, :updated_by)
             ON DUPLICATE KEY UPDATE color = VALUES(color), updated_by = VALUES(updated_by)"
        );
        $stmt->bindValue(':tracking_id', $trackingId, PDO::PARAM_INT);
        $stmt->bindValue(':fase', $fase);
        $stmt->bindValue(':actividad', $actividad);
        $stmt->bindValue(':color', $color);
        $stmt->bindValue(':updated_by', $usuarioId, $usuarioId === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
        $stmt->execute();

        if ($actividadGuardada && $usuarioId !== null) {
            $actualizarUsuario = $this->conn->prepare(
                "UPDATE tracking_actividades SET updated_by = :usuario_id WHERE id = :id"
            );
            $actualizarUsuario->bindValue(':usuario_id', $usuarioId, PDO::PARAM_INT);
            $actualizarUsuario->bindValue(':id', (int)$actividadGuardada['id'], PDO::PARAM_INT);
            $actualizarUsuario->execute();
        }
        return $color;
    }

    public function trackingPorReceta(int $recetaId): ?array
    {
        $stmt = $this->conn->prepare(
            "SELECT id, cod_tracking, cod_publico, estado
             FROM trackings
             WHERE id_receta = :receta_id
             LIMIT 1"
        );
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row === false ? null : $row;
    }

    public function actividadesComprasTracking(int $trackingId): array
    {
        $placeholders = implode(',', array_fill(0, count(self::ACTIVIDADES_COMPRAS), '?'));
        $stmt = $this->conn->prepare(
            "SELECT ta.fase, ta.actividad, ta.fecha, ta.observacion,
                    COALESCE(tc.color, '#FACC15') AS color,
                    COALESCE(pa.usuario, pc.usuario, '-') AS actualizado_por
             FROM tracking_actividades ta
             LEFT JOIN tracking_actividad_colores tc
                 ON tc.tracking_id = ta.tracking_id
                AND tc.fase COLLATE utf8mb4_unicode_ci = ta.fase COLLATE utf8mb4_unicode_ci
                AND tc.actividad COLLATE utf8mb4_unicode_ci = ta.actividad COLLATE utf8mb4_unicode_ci
             LEFT JOIN personal pa ON pa.IDPERSONAL = ta.updated_by
             LEFT JOIN personal pc ON pc.IDPERSONAL = tc.updated_by
             WHERE ta.tracking_id = ? AND ta.fase = 'Planificación'
               AND ta.actividad IN ($placeholders)"
        );
        $stmt->execute(array_merge([$trackingId], self::ACTIVIDADES_COMPRAS));
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function guardarActividadesCompras(int $trackingId, array $actividades, ?int $usuarioId = null): void
    {
        $porNombre = [];
        foreach ($actividades as $actividad) {
            if (!is_array($actividad)) {
                continue;
            }
            $nombre = trim((string)($actividad['actividad'] ?? ''));
            if (in_array($nombre, self::ACTIVIDADES_COMPRAS, true)) {
                $porNombre[$nombre] = $actividad;
            }
        }

        $this->begin();
        try {
            $delete = $this->conn->prepare(
                "DELETE FROM tracking_actividades
                 WHERE tracking_id = :tracking_id AND fase = 'Planificación' AND actividad = :actividad"
            );
            $insert = $this->conn->prepare(
                "INSERT INTO tracking_actividades (tracking_id, fase, actividad, fecha, observacion, updated_by)
                 VALUES (:tracking_id, 'Planificación', :actividad, :fecha, :observacion, :updated_by)
                 ON DUPLICATE KEY UPDATE fecha = VALUES(fecha), observacion = VALUES(observacion), updated_by = VALUES(updated_by)"
            );

            foreach (self::ACTIVIDADES_COMPRAS as $nombre) {
                $actividad = $porNombre[$nombre] ?? null;
                if (!$actividad) {
                    continue;
                }
                if (array_key_exists('cambiada', $actividad) && empty($actividad['cambiada'])) {
                    continue;
                }

                $fecha = trim((string)($actividad['fecha'] ?? ''));
                if ($fecha !== '' && !$this->fechaValida($fecha)) {
                    throw new InvalidArgumentException('Formato de fecha inválido para ' . $nombre);
                }

                if (empty($actividad['completada']) && $fecha === '') {
                    $delete->execute([':tracking_id' => $trackingId, ':actividad' => $nombre]);
                } else {
                    $observacion = trim((string)($actividad['observacion'] ?? ''));
                    $insert->bindValue(':tracking_id', $trackingId, PDO::PARAM_INT);
                    $insert->bindValue(':actividad', $nombre, PDO::PARAM_STR);
                    $insert->bindValue(':fecha', $fecha !== '' ? $fecha : null, $fecha !== '' ? PDO::PARAM_STR : PDO::PARAM_NULL);
                    $insert->bindValue(':observacion', $observacion !== '' ? $observacion : null, $observacion !== '' ? PDO::PARAM_STR : PDO::PARAM_NULL);
                    $insert->bindValue(':updated_by', $usuarioId, $usuarioId === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
                    $insert->execute();
                }

                $color = trim((string)($actividad['color'] ?? self::COLOR_ACTIVIDAD_DEFAULT));
                if ($fecha !== '') {
                    $color = '#22c55e';
                }
                $this->guardarColorActividad($trackingId, 'Planificación', $nombre, $color, $usuarioId);
            }
            $this->commit();
        } catch (Throwable $e) {
            $this->rollback();
            throw $e;
        }
    }

    public function guardarActividades(int $trackingId, array $actividades, ?int $usuarioId = null): void
    {
        $actividades = array_values(array_filter($actividades, static function ($item) {
            $item = is_array($item) ? $item : [];
            return isset($item['fase'], $item['actividad'])
                && trim((string)$item['fase']) !== ''
                && trim((string)$item['actividad']) !== '';
        }));

        $this->begin();

        try {
            $delete = $this->conn->prepare(
                "DELETE FROM tracking_actividades
                 WHERE tracking_id = :tracking_id AND fase = :fase AND actividad = :actividad"
            );
            $insert = $this->conn->prepare(
                "INSERT INTO tracking_actividades (
                    tracking_id,
                    fase,
                    actividad,
                    fecha,
                    observacion,
                    updated_by
                ) VALUES (
                    :tracking_id,
                    :fase,
                    :actividad,
                    :fecha,
                    :observacion,
                    :updated_by
                )
                ON DUPLICATE KEY UPDATE fecha = VALUES(fecha), observacion = VALUES(observacion), updated_by = VALUES(updated_by)"
            );

            foreach ($actividades as $item) {
                if (array_key_exists('cambiada', $item) && empty($item['cambiada'])) {
                    continue;
                }

                $fase = trim((string)$item['fase']);
                $actividad = trim((string)$item['actividad']);
                if (!isset(self::FASES_ACTIVIDADES[$fase]) || !in_array($actividad, self::FASES_ACTIVIDADES[$fase], true)) {
                    throw new InvalidArgumentException('La actividad seleccionada no es válida');
                }
                $fecha = trim((string)($item['fecha'] ?? ''));
                if ($fecha !== '' && !$this->fechaValida($fecha)) {
                    throw new InvalidArgumentException('Formato de fecha inválido');
                }
                $completada = !empty($item['completada']) || $fecha !== '';
                if (!$completada) {
                    $delete->execute([
                        ':tracking_id' => $trackingId,
                        ':fase' => $fase,
                        ':actividad' => $actividad
                    ]);
                } else {
                    $observacion = trim((string)($item['observacion'] ?? ''));
                    $insert->bindValue(':tracking_id', $trackingId, PDO::PARAM_INT);
                    $insert->bindValue(':fase', $fase);
                    $insert->bindValue(':actividad', $actividad);
                    $insert->bindValue(':fecha', $fecha !== '' ? $fecha : null, $fecha !== '' ? PDO::PARAM_STR : PDO::PARAM_NULL);
                    $insert->bindValue(':observacion', $observacion !== '' ? $observacion : null, $observacion !== '' ? PDO::PARAM_STR : PDO::PARAM_NULL);
                    $insert->bindValue(':updated_by', $usuarioId, $usuarioId === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
                    $insert->execute();
                }

                $color = trim((string)($item['color'] ?? self::COLOR_ACTIVIDAD_DEFAULT));
                if ($fecha !== '') {
                    $color = '#22c55e';
                }
                $this->guardarColorActividad($trackingId, $fase, $actividad, $color, $usuarioId);
            }

            $this->commit();
        } catch (Throwable $e) {
            $this->rollback();
            throw $e;
        }
    }

    private function fechaValida(string $fecha): bool
    {
        $d = DateTimeImmutable::createFromFormat('Y-m-d', $fecha);
        return $d !== false && $d->format('Y-m-d') === $fecha;
    }

    public function totalActividades(int $trackingId): int
    {
        $stmt = $this->conn->prepare(
            "SELECT COUNT(*) FROM tracking_actividades WHERE tracking_id = :id"
        );
        $stmt->bindValue(':id', $trackingId, PDO::PARAM_INT);
        $stmt->execute();
        return (int)$stmt->fetchColumn();
    }

    public function cerrarTracking(int $trackingId): bool
    {
        $total = $this->totalActividades($trackingId);

        if ($total < 2) {
            throw new InvalidArgumentException('Debe tener al menos 2 actividades registradas para cerrar el tracking');
        }

        $stmt = $this->conn->prepare(
            "UPDATE trackings SET estado = 'cerrado' WHERE id = :id AND estado = 'abierto'"
        );
        $stmt->bindValue(':id', $trackingId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    public function obtenerDescripcion(int $trackingId): ?string
    {
        $stmt = $this->conn->prepare(
            "SELECT descripcion FROM trackings WHERE id = :id LIMIT 1"
        );
        $stmt->bindValue(':id', $trackingId, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetchColumn();
        return $result !== false ? (string)$result : null;
    }

    public function guardarDescripcion(int $trackingId, ?string $descripcion): void
    {
        $stmt = $this->conn->prepare(
            "UPDATE trackings SET descripcion = :desc WHERE id = :id"
        );
        $stmt->bindValue(':desc', trim((string)$descripcion));
        $stmt->bindValue(':id', $trackingId, PDO::PARAM_INT);
        $stmt->execute();
    }

    public function obtenerNumOc(int $trackingId): ?string
    {
        $stmt = $this->conn->prepare(
            "SELECT num_oc FROM trackings WHERE id = :id LIMIT 1"
        );
        $stmt->bindValue(':id', $trackingId, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetchColumn();
        return $result !== false && $result !== null ? (string)$result : null;
    }

    public function guardarNumOc(int $trackingId, ?string $numOc): void
    {
        $stmt = $this->conn->prepare(
            "UPDATE trackings SET num_oc = :num_oc WHERE id = :id"
        );
        $stmt->bindValue(':num_oc', trim((string)$numOc));
        $stmt->bindValue(':id', $trackingId, PDO::PARAM_INT);
        $stmt->execute();
    }

    public function datosTrackingModal(int $trackingId): ?array
    {
        $stmt = $this->conn->prepare(
            "SELECT nombre, razon_social_empresa, ruc, estado FROM trackings WHERE id = :id LIMIT 1"
        );
        $stmt->bindValue(':id', $trackingId, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row === false ? null : $row;
    }

    public function guardarNombre(int $trackingId, string $nombre): void
    {
        $stmt = $this->conn->prepare(
            "UPDATE trackings SET nombre = :nombre WHERE id = :id"
        );
        $stmt->bindValue(':nombre', trim($nombre));
        $stmt->bindValue(':id', $trackingId, PDO::PARAM_INT);
        $stmt->execute();
    }
}
