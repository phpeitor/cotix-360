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
            (SELECT COUNT(*) FROM carga) AS carga;
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
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
}
?>