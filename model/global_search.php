<?php
require_once __DIR__ . '/../database/conexion.php';

class GlobalSearch
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = (new Conexion())->conectar();
    }

    public function buscarUsuarios(string $like): array
    {
        $stmt = $this->conn->prepare(
            "SELECT MD5(IDPERSONAL) AS hash_id,
                    CONCAT_WS(' ', NOMBRES, APELLIDOS) AS titulo,
                    USUARIO AS subtitulo,
                    DOC
             FROM personal
             WHERE IDESTADO = 1
               AND (NOMBRES LIKE :q
                    OR APELLIDOS LIKE :q
                    OR USUARIO LIKE :q
                    OR DOC LIKE :q)
             ORDER BY NOMBRES, APELLIDOS
             LIMIT 5"
        );
        $stmt->execute(['q' => $like]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarCotizaciones(string $like, int $cargo, int $usuarioId): array
    {
        $where = "(CAST(c.id AS CHAR) LIKE :q
                   OR p.usuario LIKE :q
                   OR c.estado LIKE :q)";
        $params = ['q' => $like];
        if (!in_array($cargo, [1, 3], true)) {
            $where .= " AND c.usuario_id = :usuario_id";
            $params['usuario_id'] = $usuarioId;
        }

        $stmt = $this->conn->prepare(
            "SELECT MD5(c.id) AS hash_id, c.id, c.estado, p.usuario
             FROM cotizaciones c
             LEFT JOIN personal p ON p.IDPERSONAL = c.usuario_id
             WHERE $where
             ORDER BY c.id DESC
             LIMIT 5"
        );
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarRecetas(string $like, int $cargo, int $usuarioId): array
    {
        $where = "(CAST(r.id AS CHAR) LIKE :q
                   OR r.nombre LIKE :q
                   OR p.usuario LIKE :q)";
        $params = ['q' => $like];
        if (!in_array($cargo, [1, 3, 8], true)) {
            $where .= " AND r.usuario_id = :usuario_id";
            $params['usuario_id'] = $usuarioId;
        }

        $stmt = $this->conn->prepare(
            "SELECT MD5(r.id) AS hash_id, r.id,
                    r.nombre AS titulo,
                    r.estado, p.usuario
             FROM recetas r
             LEFT JOIN personal p ON p.IDPERSONAL = r.usuario_id
             WHERE $where
             ORDER BY r.id DESC
             LIMIT 5"
        );
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarItems(string $like): array
    {
        $stmt = $this->conn->prepare(
            "SELECT MD5(i.id) AS hash_id, i.modelo, i.descripcion, i.grupo_descuento
             FROM item i
             LEFT JOIN carga c ON c.id = i.id_carga
             WHERE (i.modelo LIKE :q
                    OR i.descripcion LIKE :q
                    OR i.grupo_descuento LIKE :q
                    OR i.clase_producto LIKE :q
                    OR i.categoria_producto LIKE :q)
               AND c.estado = 1
             ORDER BY i.id DESC
             LIMIT 5"
        );
        $stmt->execute(['q' => $like]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarCompras(string $like): array
    {
        $stmt = $this->conn->prepare(
            "SELECT MD5(c.id) AS hash_id, c.id, c.estado,
                    c.nombre,
                    rc.razon_social_empresa,
                    rc.ruc
             FROM receta_compras c
             LEFT JOIN receta_cliente rc ON rc.id_receta = c.id_receta_duplicada
             WHERE CAST(c.id AS CHAR) LIKE :q
                OR c.estado LIKE :q
                OR c.nombre LIKE :q
                OR rc.razon_social_empresa LIKE :q
                OR rc.ruc LIKE :q
             ORDER BY c.id DESC
             LIMIT 5"
        );
        $stmt->execute(['q' => $like]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarIngenieria(string $like, int $cargo, int $usuarioId): array
    {
        $where = "(CAST(i.id AS CHAR) LIKE :q
                   OR i.nombre LIKE :q
                   OR i.estado LIKE :q
                   OR p.usuario LIKE :q
                   OR rc.razon_social_empresa LIKE :q
                   OR rc.ruc LIKE :q)";
        $params = ['q' => $like];
        if (!in_array($cargo, [1, 3, 8], true)) {
            $where .= " AND i.usuario_id = :usuario_id";
            $params['usuario_id'] = $usuarioId;
        }

        $stmt = $this->conn->prepare(
            "SELECT MD5(i.id) AS hash_id, i.id, i.nombre, i.estado,
                    p.usuario,
                    rc.razon_social_empresa,
                    rc.ruc
             FROM recetas_ingenieria i
             LEFT JOIN personal p ON p.IDPERSONAL = i.usuario_id
             LEFT JOIN receta_cliente rc ON rc.id_receta = i.id_receta_duplicada
             WHERE $where
             ORDER BY i.id DESC
             LIMIT 5"
        );
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarTrackings(string $like): array
    {
        $stmt = $this->conn->prepare(
            "SELECT t.id, t.nombre, t.razon_social_empresa,
                    t.ruc, t.cod_tracking, t.estado
             FROM trackings t
             WHERE CAST(t.id AS CHAR) LIKE :q
                OR t.nombre LIKE :q
                OR t.razon_social_empresa LIKE :q
                OR t.ruc LIKE :q
                OR t.cod_tracking LIKE :q
             ORDER BY t.id DESC
             LIMIT 5"
        );
        $stmt->execute(['q' => $like]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
