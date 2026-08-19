<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    @session_start();
}

require_once __DIR__ . '/../database/conexion.php';

class Receta {
    private PDO $conn;
    private string $nowLima;

    public function __construct() {
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

    public function guardarCabecera(array $data): int
    {
        $sql = "INSERT INTO recetas (
                    usuario_id,
                    estado,
                    created_at,
                    updated_at,
                    usuario_upd,
                    tipo_cambio
                ) VALUES (
                    :usuario_id,
                    :estado,
                    :created_at,
                    :updated_at,
                    :usuario_upd,
                    :tipo_cambio
                )";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':usuario_id', (int)($data['usuario_id'] ?? 0), PDO::PARAM_INT);
        $stmt->bindValue(':estado', (string)($data['estado'] ?? 'Enviada'), PDO::PARAM_STR);
        $stmt->bindValue(':created_at', $this->nowLima);
        $stmt->bindValue(':updated_at', $this->nowLima);

        if (array_key_exists('usuario_upd', $data) && $data['usuario_upd'] !== null) {
            $stmt->bindValue(':usuario_upd', (int)$data['usuario_upd'], PDO::PARAM_INT);
        } else {
            $stmt->bindValue(':usuario_upd', null, PDO::PARAM_NULL);
        }

        $stmt->bindValue(':tipo_cambio', (float)($data['tipo_cambio'] ?? 0));

        $stmt->execute();

        return (int)$this->conn->lastInsertId();
    }

    public function guardarCliente(array $data): bool
    {
        $sql = "INSERT INTO receta_cliente (
                    id_receta,
                    razon_social_empresa,
                    direccion,
                    ruc,
                    nombre_completo,
                    correo,
                    celular,
                    motivo,
                    descripcion,
                    cantidad_items,
                    created_at,
                    updated_at
                ) VALUES (
                    :id_receta,
                    :razon_social_empresa,
                    :direccion,
                    :ruc,
                    :nombre_completo,
                    :correo,
                    :celular,
                    :motivo,
                    :descripcion,
                    :cantidad_items,
                    :created_at,
                    :updated_at
                ) ON DUPLICATE KEY UPDATE
                    razon_social_empresa = VALUES(razon_social_empresa),
                    direccion = VALUES(direccion),
                    ruc = VALUES(ruc),
                    nombre_completo = VALUES(nombre_completo),
                    correo = VALUES(correo),
                    celular = VALUES(celular),
                    motivo = VALUES(motivo),
                    descripcion = IF(:actualizar_datos_receta_desc = 1, VALUES(descripcion), descripcion),
                    cantidad_items = IF(:actualizar_datos_receta_cant = 1, VALUES(cantidad_items), cantidad_items),
                    updated_at = VALUES(updated_at)";

        $stmt = $this->conn->prepare($sql);
        $actualizarDatosReceta = array_key_exists('descripcion', $data) || array_key_exists('cantidad_items', $data);
        $stmt->bindValue(':id_receta', (int)($data['receta_id'] ?? 0), PDO::PARAM_INT);
        $stmt->bindValue(':razon_social_empresa', (string)($data['razon_social_empresa'] ?? ''));
        $stmt->bindValue(':direccion', (string)($data['direccion'] ?? ''));
        $stmt->bindValue(':ruc', (string)($data['ruc'] ?? ''));
        $stmt->bindValue(':nombre_completo', (string)($data['nombre_completo'] ?? ''));
        $stmt->bindValue(':correo', (string)($data['correo'] ?? ''));
        $stmt->bindValue(':celular', (string)($data['celular'] ?? ''));
        $stmt->bindValue(':motivo', (string)($data['motivo'] ?? ''));
        $stmt->bindValue(':descripcion', (string)($data['descripcion'] ?? ''));
        $stmt->bindValue(':cantidad_items', (int)($data['cantidad_items'] ?? 0), PDO::PARAM_INT);
        $stmt->bindValue(':actualizar_datos_receta_desc', $actualizarDatosReceta ? 1 : 0, PDO::PARAM_INT);
        $stmt->bindValue(':actualizar_datos_receta_cant', $actualizarDatosReceta ? 1 : 0, PDO::PARAM_INT);
        $stmt->bindValue(':created_at', $this->nowLima);
        $stmt->bindValue(':updated_at', $this->nowLima);

        return $stmt->execute();
    }

    public function guardarCondicionesComerciales(array $data): bool
    {
        $sql = "INSERT INTO receta_cliente (
                    id_receta,
                    razon_social_empresa,
                    direccion,
                    ruc,
                    nombre_completo,
                    correo,
                    celular,
                    motivo,
descripcion,
                    cantidad_items,
                    tiempo_entrega,
                    condiciones_pago,
                    vendedor,
                    vendedor_correo,
                    vendedor_telefono,
                    condiciones_economicas_dias,
                    condiciones_economicas_visible,
                    tiempo_entrega_unidad,
                    observaciones,
                    created_at,
                    updated_at
                ) VALUES (
                    :id_receta,
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    :descripcion,
                    :cantidad_items,
                    :tiempo_entrega,
                    :condiciones_pago,
                    :vendedor,
                    :vendedor_correo,
                    :vendedor_telefono,
                    :condiciones_economicas_dias,
                    :condiciones_economicas_visible,
                    :tiempo_entrega_unidad,
                    :observaciones,
                    :created_at,
                    :updated_at
                ) ON DUPLICATE KEY UPDATE
                    tiempo_entrega = VALUES(tiempo_entrega),
                    condiciones_pago = VALUES(condiciones_pago),
                    vendedor = VALUES(vendedor),
                    vendedor_correo = VALUES(vendedor_correo),
                    vendedor_telefono = VALUES(vendedor_telefono),
                    descripcion = VALUES(descripcion),
                    cantidad_items = VALUES(cantidad_items),
                    condiciones_economicas_dias = VALUES(condiciones_economicas_dias),
                    condiciones_economicas_visible = VALUES(condiciones_economicas_visible),
                    tiempo_entrega_unidad = VALUES(tiempo_entrega_unidad),
                    observaciones = VALUES(observaciones),
                    updated_at = VALUES(updated_at)";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id_receta', (int)($data['receta_id'] ?? 0), PDO::PARAM_INT);
        $stmt->bindValue(':tiempo_entrega', (string)($data['tiempo_entrega'] ?? ''));
        $stmt->bindValue(':condiciones_pago', (string)($data['condiciones_pago'] ?? ''));
        $stmt->bindValue(':vendedor', (string)($data['vendedor'] ?? ''));
        $stmt->bindValue(':vendedor_correo', (string)($data['vendedor_correo'] ?? ''));
        $stmt->bindValue(':vendedor_telefono', (string)($data['vendedor_telefono'] ?? ''));
        $stmt->bindValue(':descripcion', (string)($data['descripcion'] ?? ''));
        $stmt->bindValue(':cantidad_items', (int)($data['cantidad_items'] ?? 0), PDO::PARAM_INT);
$stmt->bindValue(':condiciones_economicas_dias', (int)($data['condiciones_economicas_dias'] ?? 0), PDO::PARAM_INT);
        $stmt->bindValue(':condiciones_economicas_visible', (int)($data['condiciones_economicas_visible'] ?? 0), PDO::PARAM_INT);
        $stmt->bindValue(':tiempo_entrega_unidad', (string)($data['tiempo_entrega_unidad'] ?? 'dias'));
        $stmt->bindValue(':observaciones', (string)($data['observaciones'] ?? ''));
        $stmt->bindValue(':created_at', $this->nowLima);
        $stmt->bindValue(':updated_at', $this->nowLima);

        return $stmt->execute();
    }

    public function guardarDetalle(array $data): bool
    {
        $sql = "INSERT INTO receta_detalle (
                    receta_id,
                    item_id,
                    categoria,
                    sub_cat_1,
                    sub_cat_2,
                    marca,
                    modelo,
                    nombre,
                    descripcion,
                    uni_medida,
                    precio,
                    precio_manual,
                    moneda,
                    tipo,
                    created_at,
                    cantidad
                ) VALUES (
                    :receta_id,
                    :item_id,
                    :categoria,
                    :sub_cat_1,
                    :sub_cat_2,
                    :marca,
                    :modelo,
                    :nombre,
                    :descripcion,
                    :uni_medida,
                    :precio,
                    :precio_manual,
                    :moneda,
                    :tipo,
                    :created_at,
                    :cantidad
                )";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', (int)($data['receta_id'] ?? 0), PDO::PARAM_INT);
        $stmt->bindValue(':item_id', (int)($data['item_id'] ?? 0), PDO::PARAM_INT);
        $stmt->bindValue(':categoria', (string)($data['categoria'] ?? ''));
        $stmt->bindValue(':sub_cat_1', (string)($data['sub_cat_1'] ?? ''));
        $stmt->bindValue(':sub_cat_2', (string)($data['sub_cat_2'] ?? ''));
        $stmt->bindValue(':marca', (string)($data['marca'] ?? ''));
        $stmt->bindValue(':modelo', (string)($data['modelo'] ?? ''));
        $stmt->bindValue(':nombre', (string)($data['nombre'] ?? ''));
        $stmt->bindValue(':descripcion', (string)($data['descripcion'] ?? ''));
        $stmt->bindValue(':uni_medida', (string)($data['uni_medida'] ?? ''));
        $stmt->bindValue(':precio', (float)($data['precio'] ?? 0));
        $stmt->bindValue(':precio_manual', !empty($data['precio_manual']) ? 1 : 0, PDO::PARAM_INT);
        $stmt->bindValue(':moneda', (string)($data['moneda'] ?? ''));
        $stmt->bindValue(':tipo', (string)($data['tipo'] ?? ''));
        $stmt->bindValue(':created_at', $this->nowLima);
        $stmt->bindValue(':cantidad', (int)($data['cantidad'] ?? 0), PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function table_receta(string $fec_ini, string $fec_fin): array
    {
        $sessionCargo = $_SESSION['session_cargo'] ?? null;
        $sessionId = $_SESSION['session_id'] ?? null;
        $isAdmin = in_array((int)$sessionCargo, [1, 3], true);

        $where = "c.created_at BETWEEN :fec_ini AND DATE_ADD(:fec_fin, INTERVAL 1 DAY)";

        if (!$isAdmin) {
            if ((int)$sessionId <= 0) {
                return [];
            }

            $where .= " AND c.usuario_id = :usuario_id";
        }

        $sql = "
            SELECT
                c.id,
                p.usuario,
                c.nombre,
                rc.ruc AS cliente_ruc,
                rc.razon_social_empresa AS cliente_razon_social_empresa,
                c.estado,
                c.created_at,
                c.updated_at,
                COALESCE(SUM(cd.cantidad), 0) AS total_items,
                GROUP_CONCAT(
                    CONCAT(cd.nombre, ' x ', COALESCE(cd.cantidad, 0))
                    ORDER BY cd.nombre
                    SEPARATOR ' | '
                ) AS items
            FROM recetas c
            LEFT JOIN receta_detalle cd ON cd.receta_id = c.id
            LEFT JOIN personal p ON p.IDPERSONAL = c.usuario_id
            LEFT JOIN receta_cliente rc ON rc.id_receta = c.id
            WHERE $where
            GROUP BY
                c.id, p.usuario, c.nombre, rc.ruc, rc.razon_social_empresa, c.estado, c.created_at, c.updated_at
            ORDER BY c.id DESC
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':fec_ini', $fec_ini);
        $stmt->bindValue(':fec_fin', $fec_fin);

        if (!$isAdmin) {
            $stmt->bindValue(':usuario_id', (int)$sessionId, PDO::PARAM_INT);
        }
        
        //echo $sql;
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (!$rows) {
            return [];
        }

        return $rows;
    }

    public function tableIngenieria(string $fec_ini, string $fec_fin): array
    {
        $this->crearTablaHistorialIngenieria();

        $sql = "
            SELECT
                c.id,
                c.id_receta_duplicada,
                p.usuario,
                p2.usuario AS usuario_aprobador,
                c.nombre,
                rc.ruc AS cliente_ruc,
                rc.razon_social_empresa AS cliente_razon_social_empresa,
                c.estado,
                c.created_at,
                c.updated_at,
                COALESCE(SUM(cd.cantidad), 0) AS total_items,
                COALESCE(h.historial_count, 0) AS historial_count,
                GROUP_CONCAT(
                    CONCAT(cd.nombre, ' x ', COALESCE(cd.cantidad, 0))
                    ORDER BY cd.nombre
                    SEPARATOR ' | '
                ) AS items
            FROM recetas_ingenieria c
            LEFT JOIN detalle_ingenieria cd ON cd.receta_id = c.id
            LEFT JOIN (
                SELECT ingenieria_id, COUNT(*) AS historial_count
                FROM ingenieria_historial
                GROUP BY ingenieria_id
            ) h ON h.ingenieria_id = c.id
            LEFT JOIN personal p ON p.IDPERSONAL = c.usuario_id
            LEFT JOIN personal p2 ON p2.IDPERSONAL = c.usuario_upd
            LEFT JOIN receta_cliente rc ON rc.id_receta = c.id_receta_duplicada
            WHERE c.created_at BETWEEN :fec_ini AND DATE_ADD(:fec_fin, INTERVAL 1 DAY)
            GROUP BY
                c.id,
                c.id_receta_duplicada,
                p.usuario,
                p2.usuario,
                c.nombre,
                rc.ruc,
                rc.razon_social_empresa,
                c.estado,
                c.created_at,
                c.updated_at,
                h.historial_count
            ORDER BY c.id DESC
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':fec_ini', $fec_ini);
        $stmt->bindValue(':fec_fin', $fec_fin);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function obtenerIngenieriaPorHash(string $hash): ?array
    {
        $sql = "SELECT c.*,
                       p.usuario,
                       p2.usuario AS usuario_aprobador,
                       rc.razon_social_empresa AS cliente_razon_social_empresa,
                       rc.direccion AS cliente_direccion,
                       rc.ruc AS cliente_ruc,
                        rc.nombre_completo AS cliente_nombre_completo,
                        rc.correo AS cliente_correo,
                        rc.celular AS cliente_celular,
                        rc.motivo AS cliente_motivo,
                        rc.descripcion AS cliente_descripcion,
                        rc.cantidad_items AS cliente_cantidad_items,
rc.tiempo_entrega AS cliente_tiempo_entrega,
                         rc.condiciones_pago AS cliente_condiciones_pago,
                          rc.vendedor AS cliente_vendedor,
                          rc.vendedor_correo AS cliente_vendedor_correo,
                          rc.vendedor_telefono AS cliente_vendedor_telefono,
                           rc.condiciones_economicas_dias AS cliente_condiciones_economicas_dias,
                           rc.condiciones_economicas_visible AS cliente_condiciones_economicas_visible,
                           rc.tiempo_entrega_unidad AS cliente_tiempo_entrega_unidad,
                           rc.observaciones AS cliente_observaciones
                FROM recetas_ingenieria c
                LEFT JOIN personal p ON p.IDPERSONAL = c.usuario_id
                LEFT JOIN personal p2 ON p2.IDPERSONAL = c.usuario_upd
                LEFT JOIN receta_cliente rc ON rc.id_receta = c.id_receta_duplicada
                WHERE MD5(c.id) = :hash
                LIMIT 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function obtenerDetalleIngenieriaPorHash(string $hash): array
    {
        $this->asegurarColumnasAdicionalesIngenieria();

        $sql = "SELECT d.*
                FROM detalle_ingenieria d
                INNER JOIN recetas_ingenieria r ON r.id = d.receta_id
                LEFT JOIN vw_receta_items_orden o
                    ON o.tipo COLLATE utf8mb4_unicode_ci = d.tipo COLLATE utf8mb4_unicode_ci
                   AND o.sub_cat_1 COLLATE utf8mb4_unicode_ci = d.sub_cat_1 COLLATE utf8mb4_unicode_ci
                WHERE MD5(r.id) = :hash
                ORDER BY d.tipo ASC, COALESCE(o.orden, 9999) ASC, d.sub_cat_1 ASC, d.sub_cat_2 ASC";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function prepararTablasComprasIngenieria(): void
    {
        $this->asegurarEstadoValidadoIngenieria();
        $this->crearTablaCompras();
        $this->crearTablaHistorialIngenieria();
        $this->asegurarColumnasAdicionalesIngenieria();
        $this->asegurarColumnasAdicionalesCompras();
    }

    public function aprobarIngenieriaParaCompras(int $ingenieriaId, int $usuarioId): int
    {
        $this->asegurarEstadoValidadoIngenieria();

        $stmtHistorial = $this->conn->prepare("SELECT COUNT(*) FROM ingenieria_historial WHERE ingenieria_id = :ingenieria_id");
        $stmtHistorial->bindValue(':ingenieria_id', $ingenieriaId, PDO::PARAM_INT);
        $stmtHistorial->execute();

        if ((int)$stmtHistorial->fetchColumn() <= 0) {
            throw new RuntimeException('No se puede validar ingeniería porque no tiene historial registrado');
        }

        $stmtIngenieria = $this->conn->prepare("SELECT * FROM recetas_ingenieria WHERE id = :id LIMIT 1");
        $stmtIngenieria->bindValue(':id', $ingenieriaId, PDO::PARAM_INT);
        $stmtIngenieria->execute();
        $ingenieria = $stmtIngenieria->fetch(PDO::FETCH_ASSOC);

        if (!$ingenieria) {
            throw new RuntimeException('Ingeniería no encontrada');
        }

        if (!in_array(($ingenieria['estado'] ?? ''), ['Aprobada', 'Validado'], true)) {
            $stmtEstado = $this->conn->prepare("UPDATE recetas_ingenieria
                                                SET estado = 'Validado', updated_at = :updated_at, usuario_upd = :usuario_upd
                                                WHERE id = :id");
            $stmtEstado->bindValue(':updated_at', $this->nowLima);
            $stmtEstado->bindValue(':usuario_upd', $usuarioId, PDO::PARAM_INT);
            $stmtEstado->bindValue(':id', $ingenieriaId, PDO::PARAM_INT);
            $stmtEstado->execute();
        }

        $stmtCompra = $this->conn->prepare("SELECT id FROM receta_compras WHERE ingenieria_id = :ingenieria_id LIMIT 1");
        $stmtCompra->bindValue(':ingenieria_id', $ingenieriaId, PDO::PARAM_INT);
        $stmtCompra->execute();
        $compraId = (int)($stmtCompra->fetchColumn() ?: 0);

        if ($compraId > 0) {
            return $compraId;
        }

        $sqlCabecera = "INSERT INTO receta_compras (
                            ingenieria_id,
                            id_receta_duplicada,
                            usuario_id,
                            estado,
                            created_at,
                            updated_at,
                            usuario_upd,
                            tipo_cambio,
                            nombre,
                            observacion
                        ) SELECT
                            id,
                            id_receta_duplicada,
                            usuario_id,
                            'Validado',
                            :created_at,
                            :updated_at,
                            :usuario_upd,
                            tipo_cambio,
                            nombre,
                            observacion
                        FROM recetas_ingenieria
                        WHERE id = :ingenieria_id";
        $stmtCabecera = $this->conn->prepare($sqlCabecera);
        $stmtCabecera->bindValue(':created_at', $this->nowLima);
        $stmtCabecera->bindValue(':updated_at', $this->nowLima);
        $stmtCabecera->bindValue(':usuario_upd', $usuarioId, PDO::PARAM_INT);
        $stmtCabecera->bindValue(':ingenieria_id', $ingenieriaId, PDO::PARAM_INT);
        $stmtCabecera->execute();

        $compraId = (int)$this->conn->lastInsertId();
        if ($compraId <= 0) {
            throw new RuntimeException('No se pudo crear la receta de compras');
        }

        $sqlDetalle = "INSERT INTO detalle_compras (
                           compra_id,
                           ingenieria_detalle_id,
                           item_id,
                           categoria,
                           sub_cat_1,
                           sub_cat_2,
                           marca,
                           modelo,
                           nombre,
                           descripcion,
                           uni_medida,
                           precio,
                           moneda,
                           tipo,
                           created_at,
                           cantidad,
                           es_adicional,
                           adicional_signo
                       ) SELECT
                           :compra_id,
                           id,
                           item_id,
                           categoria,
                           sub_cat_1,
                           sub_cat_2,
                           marca,
                           modelo,
                           nombre,
                           descripcion,
                           uni_medida,
                           precio,
                           moneda,
                           tipo,
                           :created_at,
                           cantidad,
                           COALESCE(es_adicional, 0),
                           adicional_signo
                       FROM detalle_ingenieria
                       WHERE receta_id = :ingenieria_id";
        $stmtDetalle = $this->conn->prepare($sqlDetalle);
        $stmtDetalle->bindValue(':compra_id', $compraId, PDO::PARAM_INT);
        $stmtDetalle->bindValue(':created_at', $this->nowLima);
        $stmtDetalle->bindValue(':ingenieria_id', $ingenieriaId, PDO::PARAM_INT);
        $stmtDetalle->execute();

        return $compraId;
    }

    public function actualizarNombreIngenieria(string $hash, string $nombre): bool
    {
        $sql = "UPDATE recetas_ingenieria
                SET nombre = :nombre, updated_at = :updated_at
                WHERE MD5(id) = :hash";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':nombre', $nombre);
        $stmt->bindValue(':updated_at', $this->nowLima);
        $stmt->bindValue(':hash', $hash);
        return $stmt->execute();
    }

    public function actualizarTipoCambioIngenieria(string $hash, float $tipoCambio): bool
    {
        $sql = "UPDATE recetas_ingenieria
                SET tipo_cambio = :tipo_cambio, updated_at = :updated_at
                WHERE MD5(id) = :hash";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':tipo_cambio', $tipoCambio);
        $stmt->bindValue(':updated_at', $this->nowLima);
        $stmt->bindValue(':hash', $hash);
        return $stmt->execute();
    }

    public function agregarDetalleIngenieriaDesdeItem(string $hash, int $itemId, int $cantidad = 1, bool $esAdicional = false, string $adicionalSigno = 'positivo'): bool
    {
        $this->asegurarColumnasAdicionalesIngenieria();

        $adicionalSigno = $adicionalSigno === 'negativo' ? 'negativo' : 'positivo';
        $sql = "INSERT INTO detalle_ingenieria (
                    receta_id,
                    item_id,
                    categoria,
                    sub_cat_1,
                    sub_cat_2,
                    marca,
                    modelo,
                    nombre,
                    descripcion,
                    uni_medida,
                    precio,
                    moneda,
                    tipo,
                    created_at,
                    cantidad,
                    es_adicional,
                    adicional_signo
                ) SELECT
                    r.id,
                    i.id,
                    i.categoria,
                    i.sub_cat_1,
                    i.sub_cat_2,
                    i.marca,
                    i.modelo,
                    i.nombre,
                    i.descripcion,
                    i.uni_medida,
                    i.precio,
                    i.moneda,
                    i.tipo,
                    :created_at,
                    :cantidad,
                    :es_adicional,
                    :adicional_signo
                FROM recetas_ingenieria r
                INNER JOIN receta_items i ON i.id = :item_id
                WHERE MD5(r.id) = :hash
                LIMIT 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':created_at', $this->nowLima);
        $stmt->bindValue(':cantidad', min(5000, max(1, $cantidad)), PDO::PARAM_INT);
        $stmt->bindValue(':es_adicional', $esAdicional ? 1 : 0, PDO::PARAM_INT);
        if ($esAdicional) {
            $stmt->bindValue(':adicional_signo', $adicionalSigno);
        } else {
            $stmt->bindValue(':adicional_signo', null, PDO::PARAM_NULL);
        }
        $stmt->bindValue(':item_id', $itemId, PDO::PARAM_INT);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    public function obtenerPrecioItemReceta(int $itemId): float
    {
        $stmt = $this->conn->prepare("SELECT COALESCE(precio, 0) FROM receta_items WHERE id = :item_id LIMIT 1");
        $stmt->bindValue(':item_id', $itemId, PDO::PARAM_INT);
        $stmt->execute();
        return (float)($stmt->fetchColumn() ?: 0);
    }

    public function eliminarDetalleIngenieria(string $hash, int $detalleId): bool
    {
        $sql = "DELETE d
                FROM detalle_ingenieria d
                INNER JOIN recetas_ingenieria r ON r.id = d.receta_id
                WHERE MD5(r.id) = :hash
                  AND d.id = :detalle_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->bindValue(':detalle_id', $detalleId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function actualizarCantidadDetalleIngenieria(string $hash, int $detalleId, int $cantidad): bool
    {
        $sql = "UPDATE detalle_ingenieria d
                INNER JOIN recetas_ingenieria r ON r.id = d.receta_id
                SET d.cantidad = :cantidad
                WHERE MD5(r.id) = :hash
                  AND d.id = :detalle_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':cantidad', min(5000, max(1, $cantidad)), PDO::PARAM_INT);
        $stmt->bindValue(':hash', $hash);
        $stmt->bindValue(':detalle_id', $detalleId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function totalIngenieriaDolaresPorHash(string $hash): float
    {
        $this->asegurarColumnasAdicionalesIngenieria();

        $sql = "SELECT ROUND(COALESCE(SUM(
                    CASE
                        WHEN UPPER(COALESCE(d.moneda, '')) = 'DOLLAR' THEN COALESCE(d.precio, 0) * COALESCE(d.cantidad, 0)
                        ELSE (COALESCE(d.precio, 0) * COALESCE(d.cantidad, 0)) / NULLIF(COALESCE(r.tipo_cambio, 0), 0)
                    END
                ), 0), 2) AS total
                FROM detalle_ingenieria d
                INNER JOIN recetas_ingenieria r ON r.id = d.receta_id
                WHERE MD5(r.id) = :hash
                  AND COALESCE(d.es_adicional, 0) = 0";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
        return (float)($row['total'] ?? 0);
    }

    public function totalRecetaOrigenDolares(int $recetaId): float
    {
        $sql = "SELECT ROUND(COALESCE(SUM(
                    CASE
                        WHEN UPPER(COALESCE(d.moneda, '')) = 'DOLLAR' THEN COALESCE(d.precio, 0) * COALESCE(d.cantidad, 0)
                        ELSE (COALESCE(d.precio, 0) * COALESCE(d.cantidad, 0)) / NULLIF(COALESCE(r.tipo_cambio, 0), 0)
                    END
                ), 0), 2) AS total
                FROM receta_detalle d
                INNER JOIN recetas r ON r.id = d.receta_id
                WHERE r.id = :receta_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
        return (float)($row['total'] ?? 0);
    }

    public function registrarHistorialIngenieria(int $ingenieriaId, string $accion, ?int $detalleId, ?int $itemId, array $antes, array $despues, int $usuarioId): bool
    {
        $this->crearTablaHistorialIngenieria();

        $sql = "INSERT INTO ingenieria_historial (
                    ingenieria_id,
                    detalle_id,
                    item_id,
                    accion,
                    antes_json,
                    despues_json,
                    usuario_id,
                    created_at
                ) VALUES (
                    :ingenieria_id,
                    :detalle_id,
                    :item_id,
                    :accion,
                    :antes_json,
                    :despues_json,
                    :usuario_id,
                    :created_at
                )";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':ingenieria_id', $ingenieriaId, PDO::PARAM_INT);
        if ($detalleId !== null) {
            $stmt->bindValue(':detalle_id', $detalleId, PDO::PARAM_INT);
        } else {
            $stmt->bindValue(':detalle_id', null, PDO::PARAM_NULL);
        }
        if ($itemId !== null) {
            $stmt->bindValue(':item_id', $itemId, PDO::PARAM_INT);
        } else {
            $stmt->bindValue(':item_id', null, PDO::PARAM_NULL);
        }
        $stmt->bindValue(':accion', $accion);
        $stmt->bindValue(':antes_json', json_encode($antes, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        $stmt->bindValue(':despues_json', json_encode($despues, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        $stmt->bindValue(':usuario_id', $usuarioId, PDO::PARAM_INT);
        $stmt->bindValue(':created_at', $this->nowLima);
        return $stmt->execute();
    }

    private function crearTablaHistorialIngenieria(): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS ingenieria_historial (
                    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                    ingenieria_id BIGINT UNSIGNED NOT NULL,
                    detalle_id INT NULL DEFAULT NULL,
                    item_id INT NULL DEFAULT NULL,
                    accion VARCHAR(40) NOT NULL,
                    antes_json JSON NULL,
                    despues_json JSON NULL,
                    usuario_id INT NULL DEFAULT NULL,
                    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (id),
                    KEY idx_ingenieria_historial_ingenieria (ingenieria_id),
                    KEY idx_ingenieria_historial_accion (accion)
                )";
        $this->conn->exec($sql);
    }

    private function crearTablaCompras(): void
    {
        $sqlCabecera = "CREATE TABLE IF NOT EXISTS receta_compras (
                            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                            ingenieria_id BIGINT UNSIGNED NOT NULL,
                            id_receta_duplicada INT NULL DEFAULT NULL,
                            usuario_id BIGINT UNSIGNED NOT NULL,
                            estado ENUM('Pendiente','Validado','Aprobada','Anulada') NULL DEFAULT 'Validado',
                            created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            usuario_upd INT NULL DEFAULT NULL,
                            tipo_cambio DECIMAL(7,3) NULL DEFAULT NULL,
                            nombre VARCHAR(100) NULL DEFAULT NULL,
                            observacion VARCHAR(300) NOT NULL DEFAULT '',
                            PRIMARY KEY (id),
                            UNIQUE KEY uq_receta_compras_ingenieria (ingenieria_id),
                            KEY idx_receta_compras_origen (id_receta_duplicada),
                            KEY idx_receta_compras_estado (estado)
                        )";
        $this->conn->exec($sqlCabecera);
        $this->asegurarEstadoValidadoCompras();

        $sqlDetalle = "CREATE TABLE IF NOT EXISTS detalle_compras (
                           id INT NOT NULL AUTO_INCREMENT,
                           compra_id BIGINT UNSIGNED NOT NULL,
                           ingenieria_detalle_id INT NULL DEFAULT NULL,
                           item_id INT NULL DEFAULT NULL,
                           categoria VARCHAR(255) NULL DEFAULT NULL,
                           sub_cat_1 VARCHAR(255) NULL DEFAULT NULL,
                           sub_cat_2 VARCHAR(255) NULL DEFAULT NULL,
                           marca VARCHAR(255) NULL DEFAULT NULL,
                           modelo VARCHAR(255) NULL DEFAULT NULL,
                           nombre VARCHAR(255) NULL DEFAULT NULL,
                           descripcion VARCHAR(500) NULL DEFAULT NULL,
                           uni_medida VARCHAR(50) NULL DEFAULT NULL,
                           precio DECIMAL(15,2) NULL DEFAULT NULL,
                           moneda VARCHAR(20) NULL DEFAULT NULL,
                           tipo VARCHAR(50) NULL DEFAULT NULL,
                           created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                            cantidad INT NULL DEFAULT NULL,
                            es_adicional TINYINT(1) NOT NULL DEFAULT 0,
                            adicional_signo ENUM('positivo','negativo') NULL DEFAULT NULL,
                            PRIMARY KEY (id),
                           KEY idx_detalle_compras_compra (compra_id),
                           KEY idx_detalle_compras_item (item_id)
                       )";
        $this->conn->exec($sqlDetalle);
    }

    private function asegurarColumnasAdicionalesIngenieria(): void
    {
        $this->asegurarColumna('detalle_ingenieria', 'es_adicional', "ALTER TABLE detalle_ingenieria ADD COLUMN es_adicional TINYINT(1) NOT NULL DEFAULT 0 AFTER cantidad");
        $this->asegurarColumna('detalle_ingenieria', 'adicional_signo', "ALTER TABLE detalle_ingenieria ADD COLUMN adicional_signo ENUM('positivo','negativo') NULL DEFAULT NULL AFTER es_adicional");
    }

    private function asegurarColumnasAdicionalesCompras(): void
    {
        $this->asegurarColumna('detalle_compras', 'es_adicional', "ALTER TABLE detalle_compras ADD COLUMN es_adicional TINYINT(1) NOT NULL DEFAULT 0 AFTER cantidad");
        $this->asegurarColumna('detalle_compras', 'adicional_signo', "ALTER TABLE detalle_compras ADD COLUMN adicional_signo ENUM('positivo','negativo') NULL DEFAULT NULL AFTER es_adicional");
    }

    private function asegurarEstadoValidadoIngenieria(): void
    {
        $stmt = $this->conn->query("SHOW COLUMNS FROM recetas_ingenieria LIKE 'estado'");
        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
        if (strpos((string)($row['Type'] ?? ''), "'Validado'") === false) {
            $this->conn->exec("ALTER TABLE recetas_ingenieria MODIFY estado ENUM('Borrador','Enviada','Aprobada','Validado','Rechazada','Anulada','GANADO') NULL DEFAULT 'GANADO'");
        }
    }

    private function asegurarEstadoValidadoCompras(): void
    {
        $stmt = $this->conn->query("SHOW COLUMNS FROM receta_compras LIKE 'estado'");
        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
        if (strpos((string)($row['Type'] ?? ''), "'Validado'") === false) {
            $this->conn->exec("ALTER TABLE receta_compras MODIFY estado ENUM('Pendiente','Validado','Aprobada','Anulada') NULL DEFAULT 'Validado'");
        }
    }

    private function asegurarColumna(string $tabla, string $columna, string $alterSql): void
    {
        $stmt = $this->conn->prepare("SHOW COLUMNS FROM `$tabla` LIKE :columna");
        $stmt->bindValue(':columna', $columna);
        $stmt->execute();
        if (!$stmt->fetch(PDO::FETCH_ASSOC)) {
            $this->conn->exec($alterSql);
        }
    }

    public function listarHistorialIngenieriaPorHash(string $hash, int $page = 1, int $perPage = 10): array
    {
        $this->crearTablaHistorialIngenieria();

        $page = max(1, $page);
        $perPage = max(1, min(50, $perPage));
        $offset = ($page - 1) * $perPage;

        $sqlTotal = "SELECT COUNT(*) AS total
                     FROM ingenieria_historial h
                     INNER JOIN recetas_ingenieria i ON i.id = h.ingenieria_id
                     WHERE MD5(i.id) = :hash";
        $stmtTotal = $this->conn->prepare($sqlTotal);
        $stmtTotal->bindValue(':hash', $hash);
        $stmtTotal->execute();
        $total = (int)(($stmtTotal->fetch(PDO::FETCH_ASSOC) ?: [])['total'] ?? 0);

        $sql = "SELECT h.id,
                       h.ingenieria_id,
                       h.detalle_id,
                       h.item_id,
                       h.accion,
                       h.antes_json,
                       h.despues_json,
                       h.usuario_id,
                       p.usuario,
                       h.created_at
                FROM ingenieria_historial h
                INNER JOIN recetas_ingenieria i ON i.id = h.ingenieria_id
                LEFT JOIN personal p ON p.IDPERSONAL = h.usuario_id
                WHERE MD5(i.id) = :hash
                ORDER BY h.id DESC
                LIMIT :limit OFFSET :offset";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return [
            'rows' => $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [],
            'total' => $total,
            'page' => $page,
            'per_page' => $perPage,
            'total_pages' => max(1, (int)ceil($total / $perPage)),
        ];
    }

    public function firmaListaReceta(string $fec_ini, string $fec_fin): array
    {
        $sessionCargo = $_SESSION['session_cargo'] ?? null;
        $sessionId = $_SESSION['session_id'] ?? null;
        $isAdmin = in_array((int)$sessionCargo, [1, 3], true);

        $where = "c.created_at BETWEEN :fec_ini AND DATE_ADD(:fec_fin, INTERVAL 1 DAY)";

        if (!$isAdmin) {
            if ((int)$sessionId <= 0) {
                return [
                    'total_recetas' => 0,
                    'max_receta_id' => 0,
                    'total_detalle' => 0,
                ];
            }

            $where .= " AND c.usuario_id = :usuario_id";
        }

        $sql = "SELECT
                    COUNT(*) AS total_recetas,
                    COALESCE(MAX(c.id), 0) AS max_receta_id,
                    COALESCE(SUM(COALESCE(d.total_detalle, 0)), 0) AS total_detalle
                FROM recetas c
                LEFT JOIN (
                    SELECT receta_id, COUNT(*) AS total_detalle
                    FROM receta_detalle
                    GROUP BY receta_id
                ) d ON d.receta_id = c.id
                WHERE $where";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':fec_ini', $fec_ini);
        $stmt->bindValue(':fec_fin', $fec_fin);

        if (!$isAdmin) {
            $stmt->bindValue(':usuario_id', (int)$sessionId, PDO::PARAM_INT);
        }

        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];

        return [
            'total_recetas' => (int)($row['total_recetas'] ?? 0),
            'max_receta_id' => (int)($row['max_receta_id'] ?? 0),
            'total_detalle' => (int)($row['total_detalle'] ?? 0),
        ];
    }

    public function obtenerPorHash(string $hash): ?array {
        $sql = "SELECT c.*,p.usuario, p2.usuario as usu_upd,
                       rc.razon_social_empresa AS cliente_razon_social_empresa,
                       rc.direccion AS cliente_direccion,
                       rc.ruc AS cliente_ruc,
                       rc.nombre_completo AS cliente_nombre_completo,
                       rc.correo AS cliente_correo,
                        rc.celular AS cliente_celular,
                        rc.motivo AS cliente_motivo,
                        rc.descripcion AS cliente_descripcion,
                        rc.cantidad_items AS cliente_cantidad_items,
rc.tiempo_entrega AS cliente_tiempo_entrega,
                       rc.condiciones_pago AS cliente_condiciones_pago,
                       rc.vendedor AS cliente_vendedor,
                       rc.vendedor_correo AS cliente_vendedor_correo,
                       rc.vendedor_telefono AS cliente_vendedor_telefono,
                        rc.condiciones_economicas_dias AS cliente_condiciones_economicas_dias,
                        rc.condiciones_economicas_visible AS cliente_condiciones_economicas_visible,
                        rc.tiempo_entrega_unidad AS cliente_tiempo_entrega_unidad,
                        rc.observaciones AS cliente_observaciones
                FROM recetas c
                LEFT JOIN personal p on p.IDPERSONAL=c.usuario_id
                LEFT JOIN personal p2 on p2.IDPERSONAL=c.usuario_upd
                LEFT JOIN receta_cliente rc ON rc.id_receta = c.id
                WHERE MD5(c.id) = :hash
                LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function obtenerPorId(int $id): ?array {
        $sql = "SELECT c.*,p.usuario, p2.usuario as usu_upd
                FROM recetas c
                LEFT JOIN personal p on p.IDPERSONAL=c.usuario_id
                LEFT JOIN personal p2 on p2.IDPERSONAL=c.usuario_upd
                WHERE c.id = :id
                LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function duplicarReceta(int $recetaId, int $usuarioId): int
    {
        $original = $this->obtenerPorId($recetaId);
        if (!$original) {
            throw new RuntimeException('Receta no encontrada');
        }

        $nombreOriginal = trim((string)($original['nombre'] ?? ''));
        $nombreCopia = $nombreOriginal !== '' ? 'COPIA - ' . $nombreOriginal : '';

        $sqlCabecera = "INSERT INTO recetas (
                            id_receta_duplicada,
                            usuario_id,
                            nombre,
                            observacion,
                            estado,
                            created_at,
                            updated_at,
                            usuario_upd,
                            tipo_cambio
                        ) SELECT
                            :receta_id_origen,
                            :usuario_id,
                            :nombre,
                            observacion,
                            'Enviada',
                            :created_at,
                            :updated_at,
                            :usuario_upd,
                            tipo_cambio
                        FROM recetas
                        WHERE id = :receta_id";

        $stmtCabecera = $this->conn->prepare($sqlCabecera);
        $stmtCabecera->bindValue(':receta_id_origen', $recetaId, PDO::PARAM_INT);
        $stmtCabecera->bindValue(':usuario_id', $usuarioId, PDO::PARAM_INT);
        $stmtCabecera->bindValue(':nombre', $nombreCopia);
        $stmtCabecera->bindValue(':created_at', $this->nowLima);
        $stmtCabecera->bindValue(':updated_at', $this->nowLima);
        $stmtCabecera->bindValue(':usuario_upd', $usuarioId, PDO::PARAM_INT);
        $stmtCabecera->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmtCabecera->execute();

        $nuevoId = (int)$this->conn->lastInsertId();
        if ($nuevoId <= 0) {
            throw new RuntimeException('No se pudo crear la copia de la receta');
        }

        $sqlDetalle = "INSERT INTO receta_detalle (
                            receta_id,
                            item_id,
                            categoria,
                            sub_cat_1,
                            sub_cat_2,
                            marca,
                            modelo,
                            nombre,
                            descripcion,
                            uni_medida,
                            precio,
                            precio_manual,
                            moneda,
                            tipo,
                            created_at,
                            cantidad
                        ) SELECT
                            :nuevo_id,
                            item_id,
                            categoria,
                            sub_cat_1,
                            sub_cat_2,
                            marca,
                            modelo,
                            nombre,
                            descripcion,
                            uni_medida,
                            precio,
                            precio_manual,
                            moneda,
                            tipo,
                            :created_at,
                            cantidad
                        FROM receta_detalle
                        WHERE receta_id = :receta_id";

        $stmtDetalle = $this->conn->prepare($sqlDetalle);
        $stmtDetalle->bindValue(':nuevo_id', $nuevoId, PDO::PARAM_INT);
        $stmtDetalle->bindValue(':created_at', $this->nowLima);
        $stmtDetalle->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmtDetalle->execute();

        $sqlCategorias = "INSERT INTO receta_categoria (
                              receta_id,
                              sub_cat_1,
                              subtotal,
                              cantidad,
                              margen,
                              moneda
                          ) SELECT
                              :nuevo_id,
                              sub_cat_1,
                              subtotal,
                              cantidad,
                              margen,
                              moneda
                          FROM receta_categoria
                          WHERE receta_id = :receta_id";

        $stmtCategorias = $this->conn->prepare($sqlCategorias);
        $stmtCategorias->bindValue(':nuevo_id', $nuevoId, PDO::PARAM_INT);
        $stmtCategorias->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmtCategorias->execute();

        $sqlCliente = "INSERT INTO receta_cliente (
                            id_receta,
                            razon_social_empresa,
                            direccion,
                            ruc,
                            nombre_completo,
                            correo,
                            celular,
                            motivo,
                            descripcion,
                            cantidad_items,
                            tiempo_entrega,
                            condiciones_pago,
                            vendedor,
                             vendedor_correo,
                             vendedor_telefono,
                             condiciones_economicas_dias,
                             condiciones_economicas_visible,
                             created_at,
                            updated_at
                       ) SELECT
                            :nuevo_id,
                            razon_social_empresa,
                            direccion,
                            ruc,
                            nombre_completo,
                            correo,
                            celular,
                            motivo,
                            descripcion,
                            cantidad_items,
                            tiempo_entrega,
                            condiciones_pago,
                            vendedor,
                             vendedor_correo,
                             vendedor_telefono,
                             condiciones_economicas_dias,
                             condiciones_economicas_visible,
                             :created_at,
                            :updated_at
                       FROM receta_cliente
                       WHERE id_receta = :receta_id";

        $stmtCliente = $this->conn->prepare($sqlCliente);
        $stmtCliente->bindValue(':nuevo_id', $nuevoId, PDO::PARAM_INT);
        $stmtCliente->bindValue(':created_at', $this->nowLima);
        $stmtCliente->bindValue(':updated_at', $this->nowLima);
        $stmtCliente->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmtCliente->execute();

        return $nuevoId;
    }

    public function obtenerDetallePorHash(string $hash): array {
        $sql = "SELECT a.*, b.orden, r.updated_at AS precio_updated_at
                FROM receta_detalle a
                LEFT JOIN vw_receta_items_orden b on a.tipo=b.tipo and a.sub_cat_1=b.sub_cat_1
                LEFT JOIN receta_items r on r.id = a.item_id
                WHERE MD5(receta_id) = :hash
                order by tipo asc, COALESCE(b.orden, 9999) asc, a.sub_cat_1 asc, sub_cat_2 asc";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function actualizar_estado(int $id, string $estado, int $usuario_upd): bool {
        $sql = "UPDATE recetas 
                SET estado = :estado, updated_at = :updated_at, usuario_upd = :usuario_upd
                WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':estado', $estado);
        $stmt->bindValue(':usuario_upd', $usuario_upd);
        $stmt->bindValue(':updated_at', $this->nowLima);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function crearRecetaIngenieriaDesdeReceta(int $recetaId, int $usuarioUpd): int
    {
        $stmtExistente = $this->conn->prepare("SELECT id FROM recetas_ingenieria WHERE id_receta_duplicada = :receta_id LIMIT 1");
        $stmtExistente->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmtExistente->execute();
        $existente = (int)($stmtExistente->fetchColumn() ?: 0);

        if ($existente > 0) {
            return $existente;
        }

        $sqlCabecera = "INSERT INTO recetas_ingenieria (
                            id_receta_duplicada,
                            usuario_id,
                            nombre,
                            observacion,
                            estado,
                            created_at,
                            updated_at,
                            usuario_upd,
                            tipo_cambio
                        ) SELECT
                            id,
                            usuario_id,
                            nombre,
                            observacion,
                            'GANADO',
                            :created_at,
                            :updated_at,
                            :usuario_upd,
                            tipo_cambio
                        FROM recetas
                        WHERE id = :receta_id";

        $stmtCabecera = $this->conn->prepare($sqlCabecera);
        $stmtCabecera->bindValue(':created_at', $this->nowLima);
        $stmtCabecera->bindValue(':updated_at', $this->nowLima);
        $stmtCabecera->bindValue(':usuario_upd', $usuarioUpd, PDO::PARAM_INT);
        $stmtCabecera->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmtCabecera->execute();

        $ingenieriaId = (int)$this->conn->lastInsertId();
        if ($ingenieriaId <= 0) {
            throw new RuntimeException('No se pudo crear la receta de ingeniería');
        }

        $sqlDetalle = "INSERT INTO detalle_ingenieria (
                           receta_id,
                           item_id,
                           categoria,
                           sub_cat_1,
                           sub_cat_2,
                           marca,
                           modelo,
                           nombre,
                           descripcion,
                           uni_medida,
                           precio,
                           moneda,
                           tipo,
                           created_at,
                           cantidad
                       ) SELECT
                           :ingenieria_id,
                           item_id,
                           categoria,
                           sub_cat_1,
                           sub_cat_2,
                           marca,
                           modelo,
                           nombre,
                           descripcion,
                           uni_medida,
                           precio,
                           moneda,
                           tipo,
                           :created_at,
                           cantidad
                       FROM receta_detalle
                       WHERE receta_id = :receta_id";

        $stmtDetalle = $this->conn->prepare($sqlDetalle);
        $stmtDetalle->bindValue(':ingenieria_id', $ingenieriaId, PDO::PARAM_INT);
        $stmtDetalle->bindValue(':created_at', $this->nowLima);
        $stmtDetalle->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmtDetalle->execute();

        return $ingenieriaId;
    }

    public function recetaTieneMargenes(int $recetaId): bool
    {
        $sql = "SELECT COUNT(*) AS total
                FROM receta_categoria
                WHERE receta_id = :receta_id
                  AND COALESCE(margen, 0) > 0";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];

        return (int)($row['total'] ?? 0) > 0;
    }

    public function recetaTieneMargenesCompletos(int $recetaId): bool
    {
        $categorias = $this->obtenerCategoriasParaEdicion($recetaId);
        $rows = $categorias['rows'] ?? [];

        if (!is_array($rows) || count($rows) === 0) {
            return false;
        }

        foreach ($rows as $row) {
            if ((float)($row['margen'] ?? 0) <= 0) {
                return false;
            }
        }

        return true;
    }

    public function recetaTieneNombre(int $recetaId): bool
    {
        $sql = "SELECT COUNT(*) AS total
                FROM recetas
                WHERE id = :receta_id
                  AND nombre IS NOT NULL
                  AND TRIM(nombre) <> ''";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];

        return (int)($row['total'] ?? 0) > 0;
    }

    public function recetaTieneClienteCompleto(int $recetaId): bool
    {
        $sql = "SELECT COUNT(*) AS total
                FROM receta_cliente
                WHERE id_receta = :receta_id
                  AND TRIM(COALESCE(razon_social_empresa, '')) <> ''
                  AND TRIM(COALESCE(direccion, '')) <> ''
                  AND TRIM(COALESCE(ruc, '')) <> ''
                  AND TRIM(COALESCE(nombre_completo, '')) <> ''
                  AND TRIM(COALESCE(correo, '')) <> ''
                  AND TRIM(COALESCE(celular, '')) <> ''
                  AND TRIM(COALESCE(motivo, '')) <> ''
                  AND TRIM(COALESCE(tiempo_entrega, '')) <> ''
                  AND TRIM(COALESCE(condiciones_pago, '')) <> ''
                  AND TRIM(COALESCE(vendedor, '')) <> ''
                  AND TRIM(COALESCE(vendedor_correo, '')) <> ''
                  AND TRIM(COALESCE(vendedor_telefono, '')) <> ''
                  AND COALESCE(condiciones_economicas_dias, 0) > 0";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];

        return (int)($row['total'] ?? 0) > 0;
    }

    public function recetaTieneProductosPrecioCero(int $recetaId): bool
    {
        $sql = "SELECT COUNT(*) AS total
                FROM receta_detalle
                WHERE receta_id = :receta_id
                  AND COALESCE(precio, 0) = 0";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];

        return (int)($row['total'] ?? 0) > 0;
    }

    public function actualizarCabeceraEdicion(int $id, float $tipoCambio, int $usuarioUpd): bool
    {
        $sql = "UPDATE recetas
                SET tipo_cambio = :tipo_cambio,
                    updated_at = :updated_at,
                    usuario_upd = :usuario_upd
                WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':tipo_cambio', $tipoCambio);
        $stmt->bindValue(':updated_at', $this->nowLima);
        $stmt->bindValue(':usuario_upd', $usuarioUpd, PDO::PARAM_INT);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function actualizarNombrePorHash(string $hash, string $nombre, ?int $usuarioUpd = null): bool
    {
        $sql = "UPDATE recetas
                SET nombre = UPPER(:nombre),
                    updated_at = :updated_at,
                    usuario_upd = :usuario_upd
                WHERE MD5(id) = :hash";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':nombre', trim($nombre));
        $stmt->bindValue(':updated_at', $this->nowLima);

        if ($usuarioUpd !== null && $usuarioUpd > 0) {
            $stmt->bindValue(':usuario_upd', $usuarioUpd, PDO::PARAM_INT);
        } else {
            $stmt->bindValue(':usuario_upd', null, PDO::PARAM_NULL);
        }

        $stmt->bindValue(':hash', $hash);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    public function actualizarObservacionPorHash(string $hash, string $observacion, ?int $usuarioUpd = null): bool
    {
        $sql = "UPDATE recetas
                SET observacion = :observacion,
                    updated_at = :updated_at,
                    usuario_upd = :usuario_upd
                WHERE MD5(id) = :hash";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':observacion', trim((string)$observacion));
        $stmt->bindValue(':updated_at', $this->nowLima);

        if ($usuarioUpd !== null && $usuarioUpd > 0) {
            $stmt->bindValue(':usuario_upd', $usuarioUpd, PDO::PARAM_INT);
        } else {
            $stmt->bindValue(':usuario_upd', null, PDO::PARAM_NULL);
        }

        $stmt->bindValue(':hash', $hash);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    public function eliminarDetalle(int $recetaId): bool
    {
        $sql = "DELETE FROM receta_detalle WHERE receta_id = :receta_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function obtenerCambiosPrecio(int $recetaId): array
    {
        $sql = "SELECT
                    d.nombre,
                    d.categoria,
                    d.sub_cat_1,
                    d.sub_cat_2,
                    d.descripcion,
                    COALESCE(r_original.created_at, r1.created_at) AS fecha_anterior,
                    d.precio AS precio_receta,
                    d.moneda AS moneda_receta,
                    r.updated_at AS fecha_cambio,
                    r.precio AS precio_actual,
                    r.moneda AS moneda_actual
                FROM receta_detalle d
                INNER JOIN recetas r1 ON r1.id = d.receta_id
                LEFT JOIN recetas r_original ON r_original.id = r1.id_receta_duplicada
INNER JOIN receta_items r ON r.id = d.item_id
                WHERE d.receta_id = :receta_id
                  AND COALESCE(d.precio_manual, 0) = 0
                  AND (
                    ROUND(COALESCE(d.precio, 0), 4) <> ROUND(COALESCE(r.precio, 0), 4)
                    OR COALESCE(d.moneda, '') <> COALESCE(r.moneda, '')
                  )
                                ORDER BY d.nombre, d.categoria, d.sub_cat_1, d.sub_cat_2";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function obtenerDetallePorId(int $recetaId): array
    {
        $sql = "SELECT *
                FROM receta_detalle
                WHERE receta_id = :receta_id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function obtenerCambiosPrecioFirma(int $recetaId): array
    {
        $sql = "SELECT
                    COUNT(*) AS total,
                    COALESCE(
                        SUM(
                            CAST(
                                CRC32(
                                    CONCAT_WS(
                                        '|',
                                        d.nombre,
                                        d.categoria,
                                        d.sub_cat_1,
                                        d.sub_cat_2,
                                        d.descripcion,
                                        ROUND(COALESCE(d.precio, 0), 4),
                                        COALESCE(d.moneda, ''),
                                        ROUND(COALESCE(r.precio, 0), 4),
                                        COALESCE(r.moneda, '')
                                    )
                                ) AS UNSIGNED
                            )
                        ),
                        0
                    ) AS checksum
FROM receta_detalle d
                                INNER JOIN receta_items r ON r.id = d.item_id
                WHERE d.receta_id = :receta_id
                  AND COALESCE(d.precio_manual, 0) = 0
                  AND (
                    ROUND(COALESCE(d.precio, 0), 4) <> ROUND(COALESCE(r.precio, 0), 4)
                    OR COALESCE(d.moneda, '') <> COALESCE(r.moneda, '')
                  )";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];

        return [
            'count' => (int)($row['total'] ?? 0),
            'checksum' => (string)($row['checksum'] ?? '0'),
        ];
    }

    public function sincronizarPreciosDetalle(int $recetaId): int
    {
$sql = "UPDATE receta_detalle d
                                INNER JOIN receta_items r ON r.id = d.item_id
                SET d.precio = r.precio,
                    d.moneda = r.moneda,
                    d.precio_manual = 0
                WHERE d.receta_id = :receta_id
                  AND COALESCE(d.precio_manual, 0) = 0
                  AND (
                    ROUND(COALESCE(d.precio, 0), 4) <> ROUND(COALESCE(r.precio, 0), 4)
                    OR COALESCE(d.moneda, '') <> COALESCE(r.moneda, '')
                  )";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmt->execute();
        return (int)$stmt->rowCount();
    }

    public function obtenerCategoriasParaEdicion(int $recetaId): array
    {
        $sql = "SELECT
                    a.*, 
                    COALESCE(b.margen, 0) AS margen
                FROM (
                    /* =========================================================
                    1. SERVICIOS
                    Agrupa por categoria
                    Concatena sub_cat_1
                    ========================================================= */
                    SELECT
                        rd.tipo,
                        CONCAT(
                            rd.categoria,
                            ' (',
                            GROUP_CONCAT(
                                DISTINCT CONCAT(
                                    UPPER(LEFT(rd.sub_cat_1, 1)),
                                    LOWER(SUBSTRING(rd.sub_cat_1, 2))
                                )
                                ORDER BY rd.sub_cat_1
                                SEPARATOR ', '
                            ),
                            ')'
                        ) AS sub_cat_1,

                        SUM(COALESCE(rd.cantidad, 0)) AS cantidad,

                        ROUND(
                            SUM(
                                CASE 
                                    WHEN rd.moneda = 'SOL' THEN 
                                        (COALESCE(rd.precio, 0) * COALESCE(rd.cantidad, 0)) 
                                        / NULLIF(r.tipo_cambio, 0)

                                    WHEN rd.moneda = 'DOLLAR' THEN 
                                        COALESCE(rd.precio, 0) * COALESCE(rd.cantidad, 0)

                                    ELSE 0
                                END
                            ),
                            2
                        ) AS subtotal,

                        'DOLLAR' AS moneda,
                        MIN(COALESCE(o.orden, 9999)) AS orden_key,
                        rd.receta_id

                    FROM receta_detalle rd
                    INNER JOIN recetas r
                        ON r.id = rd.receta_id
                    LEFT JOIN vw_receta_items_orden o
                        ON o.tipo = rd.tipo
                       AND o.sub_cat_1 = rd.sub_cat_1

                    WHERE rd.receta_id = :receta_id
                    AND rd.tipo = 'SERVICIO'

                    GROUP BY 
                        rd.tipo,
                        rd.categoria,
                        rd.receta_id
                        
                    UNION ALL

                    /* =========================================================
                    2. PRODUCTOS
                    Agrupa por sub_cat_1
                    Concatena sub_cat_2
                    ========================================================= */
                    SELECT
                        rd.tipo,
                        CONCAT(
                            rd.sub_cat_1,
                            ' (',
                            GROUP_CONCAT(
                                DISTINCT rd.sub_cat_2
                                ORDER BY rd.sub_cat_2
                                SEPARATOR ', '
                            ),
                            ')'
                        ) AS sub_cat_1,

                        SUM(COALESCE(rd.cantidad, 0)) AS cantidad,

                        ROUND(
                            SUM(
                                CASE 
                                    WHEN rd.moneda = 'SOL' THEN 
                                        (COALESCE(rd.precio, 0) * COALESCE(rd.cantidad, 0)) 
                                        / NULLIF(r.tipo_cambio, 0)

                                    WHEN rd.moneda = 'DOLLAR' THEN 
                                        COALESCE(rd.precio, 0) * COALESCE(rd.cantidad, 0)

                                    ELSE 0
                                END
                            ),
                            2
                        ) AS subtotal,

                        'DOLLAR' AS moneda,
                        MIN(COALESCE(o.orden, 9999)) AS orden_key,
                        rd.receta_id

                    FROM receta_detalle rd
                    INNER JOIN recetas r
                        ON r.id = rd.receta_id
                    LEFT JOIN vw_receta_items_orden o
                        ON o.tipo = rd.tipo
                       AND o.sub_cat_1 = rd.sub_cat_1

                    WHERE rd.receta_id = :receta_id
                    AND rd.tipo = 'PRODUCTO'

                    GROUP BY 
                        rd.tipo,
                        rd.sub_cat_1,
                        rd.receta_id

                ) AS a
                LEFT JOIN receta_categoria b
                    ON a.receta_id = b.receta_id
                AND a.sub_cat_1 = b.sub_cat_1

                WHERE a.receta_id = :receta_id
                ORDER BY a.tipo, a.orden_key, a.sub_cat_1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

        return [
            'source' => 'detalle+margen',
            'rows' => $rows,
        ];
    }

    public function eliminarCategoriasReceta(int $recetaId): bool
    {
        $sql = "DELETE FROM receta_categoria WHERE receta_id = :receta_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', $recetaId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function guardarCategoriaReceta(array $data): bool
    {
        $sql = "INSERT INTO receta_categoria (
                    receta_id,
                    sub_cat_1,
                    subtotal,
                    cantidad,
                    margen,
                    moneda
                ) VALUES (
                    :receta_id,
                    :sub_cat_1,
                    :subtotal,
                    :cantidad,
                    :margen,
                    :moneda
                )";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':receta_id', (int)($data['receta_id'] ?? 0), PDO::PARAM_INT);
        $stmt->bindValue(':sub_cat_1', (string)($data['sub_cat_1'] ?? ''));
        $stmt->bindValue(':subtotal', (float)($data['subtotal'] ?? 0));
        $stmt->bindValue(':cantidad', (float)($data['cantidad'] ?? 0));
        $stmt->bindValue(':margen', (float)($data['margen'] ?? 0));
        $stmt->bindValue(':moneda', (string)($data['moneda'] ?? ''));

        return $stmt->execute();
    }
}
