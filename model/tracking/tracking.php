<?php
require_once __DIR__ . '/../../database/conexion.php';

class Tracking
{
    private PDO $conn;
    private string $nowLima;

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
                    CONCAT(
                        'MGI-',
                        UPPER(LEFT(TRIM(rc.razon_social_empresa), 1)),
                        '-',
                        YEAR(r.created_at),
                        '-',
                        r.id
                    ) AS cod_tracking,
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

        return (int)$this->conn->lastInsertId();
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
        if ($codTracking === '') {
            $codTracking = $this->generarCodTracking($razonSocial);
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

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':nombre', $nombre);
        $stmt->bindValue(':razon_social', $razonSocial);
        $stmt->bindValue(':ruc', $ruc);
        $stmt->bindValue(':cod_tracking', $codTracking);
        $stmt->bindValue(':created_at', $this->nowLima);
        $stmt->execute();

        return (int)$this->conn->lastInsertId();
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

    public function generarCodTracking(string $razonSocial): string
    {
        $letra = strtoupper(mb_substr(trim($razonSocial), 0, 1, 'UTF-8'));
        if ($letra === '' || !preg_match('/[A-Z]/', $letra)) {
            $letra = 'X';
        }

        $stmt = $this->conn->query(
            "SELECT COALESCE(MAX(CAST(SUBSTRING_INDEX(cod_tracking, '-', -1) AS UNSIGNED)), 0) AS max_cod FROM trackings"
        );
        $max = (int)$stmt->fetch(PDO::FETCH_ASSOC)['max_cod'];

        return sprintf('MGI-%s-%s-%d', $letra, date('Y'), $max + 1);
    }
}