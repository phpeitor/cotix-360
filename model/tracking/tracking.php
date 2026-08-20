<?php
require_once __DIR__ . '/../../database/conexion.php';

class Tracking
{
    private PDO $conn;
    private string $nowLima;

    public const FASES_ACTIVIDADES = [
        'Inicio' => [
            'Inicio de Proyecto'
        ],
        'Planificación' => [
            'Acta de Inicio del Proyecto',
            'Registro de Interesados',
            'Envió de Diseño Preliminar',
            'Aprobación del Diseño',
            'Envio de Documentos SST',
            'Envio del GANTT'
        ],
        'Fabricación' => [
            'Inicio de Fabricación',
            'Inicio de Programación',
            'Fin de Fabricación',
            'Fin de Programación',
            'Visita a Planta'
        ],
        'Instalación / Entrega' => [
            'Inicio de Instalación',
            'Fin de Instalación',
            'Entrega de Materiales',
            'Inicio en Puesta en Marcha',
            'Fin de Puesta en Marcha',
            'Ingreso a Planta',
            'Salida de Planta'
        ],
        'Cierre' => [
            'Entrega de Dossier en la plataforma',
            'Envio de Acta de Conformidad',
            'Recepcion de Acta de Conformidad'
        ]
    ];

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
                    t.created_at,
                    CASE WHEN t.id_receta IS NULL THEN 0 ELSE 1 END AS origen_receta
                FROM trackings t
                WHERE t.created_at BETWEEN :fecIni AND DATE_ADD(:fecFin, INTERVAL 1 DAY)
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

        return $id;
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
                    t.razon_social_empresa,
                    t.ruc,
                    t.cod_tracking,
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

    public function trackingConActividades(string $codTracking): ?array
    {
        $tracking = $this->trackingPorCodigo($codTracking);
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

    public function actividadesTracking(int $trackingId): array
    {
        $sql = "SELECT
                    id,
                    fase,
                    actividad,
                    fecha,
                    observacion
                FROM tracking_actividades
                WHERE tracking_id = :tracking_id
                ORDER BY id ASC";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':tracking_id', $trackingId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function guardarActividades(int $trackingId, array $actividades): void
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
                "DELETE FROM tracking_actividades WHERE tracking_id = :tracking_id"
            );
            $delete->bindValue(':tracking_id', $trackingId, PDO::PARAM_INT);
            $delete->execute();

            $insert = $this->conn->prepare(
                "INSERT INTO tracking_actividades (
                    tracking_id,
                    fase,
                    actividad,
                    fecha,
                    observacion
                ) VALUES (
                    :tracking_id,
                    :fase,
                    :actividad,
                    :fecha,
                    :observacion
                )"
            );

            foreach ($actividades as $item) {
                $fecha = trim((string)($item['fecha'] ?? ''));
                if ($fecha !== '' && !$this->fechaValida($fecha)) {
                    throw new InvalidArgumentException('Formato de fecha inválido');
                }

                $observacion = trim((string)($item['observacion'] ?? ''));

                $insert->bindValue(':tracking_id', $trackingId, PDO::PARAM_INT);
                $insert->bindValue(':fase', trim((string)$item['fase']));
                $insert->bindValue(':actividad', trim((string)$item['actividad']));
                $insert->bindValue(':fecha', $fecha !== '' ? $fecha : null, $fecha !== '' ? PDO::PARAM_STR : PDO::PARAM_NULL);
                $insert->bindValue(':observacion', $observacion !== '' ? $observacion : null, $observacion !== '' ? PDO::PARAM_STR : PDO::PARAM_NULL);
                $insert->execute();
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
}