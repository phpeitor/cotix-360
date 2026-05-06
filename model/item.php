<?php
require_once __DIR__ . '/../database/conexion.php';

class Item {
    private PDO $conn;
    private string $nowLima;

    public function __construct() {
        $conexion = new Conexion();
        $this->conn = $conexion->conectar();
        $tz = new DateTimeZone('America/Lima');
        $this->nowLima = (new DateTimeImmutable('now', $tz))->format('Y-m-d H:i:s');
    }

    public function baja(int $id): bool {
        $sql = "UPDATE item 
                SET estado = 0
                WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function actualizarPorHash(string $hash, array $data): bool {
        $sql = "UPDATE item 
                SET modelo = :modelo,
                    descripcion = :descripcion,
                    precio_unitario = :precio_unitario,
                    grupo_descuento = :grupo_descuento,
                    pais_origen = :pais_origen,
                    peso = :peso,
                    estado = :estado
                WHERE MD5(id) = :hash";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(':modelo', $data['modelo']);
        $stmt->bindValue(':descripcion', $data['descripcion']);
        $stmt->bindValue(':precio_unitario', $data['precio_unitario']);
        $stmt->bindValue(':grupo_descuento', $data['grupo_descuento']);
        $stmt->bindValue(':pais_origen', $data['pais_origen']);
        $stmt->bindValue(':peso', $data['peso']);
        $stmt->bindValue(':estado', (int)$data['estado'], PDO::PARAM_INT);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function v($value): string {
        return trim((string)($value ?? ''));
    }

    public function guardarLote(array $rows): int {
        if (empty($rows)) return 0;
        
        $cols = [
            'modelo',
            'precio_unitario',
            'moneda',
            'grupo_descuento',
            'descripcion',
            'categoria_producto',
            'clase_producto',
            'pais_origen',
            'peso',
            'status',
            'proveedor',
            'origen',
            'id_carga'
        ];

        $placeholders = [];
        $values = [];

        foreach ($rows as $r) {
            $placeholders[] = "(" . rtrim(str_repeat('?,', count($cols)), ',') . ")";
            $values[] = $this->v($r['modelo'] ?? '');
            $values[] = isset($r['precio_unitario']) && $r['precio_unitario'] !== '' ? (float)$r['precio_unitario'] : 0.0;
            $values[] = $this->v($r['moneda'] ?? '');
            $values[] = $this->v($r['grupo_descuento'] ?? '');
            $values[] = $this->v($r['descripcion'] ?? '');
            $values[] = $this->v($r['categoria_producto'] ?? '');
            $values[] = $this->v($r['clase_producto'] ?? '');
            $values[] = $this->v($r['pais_origen'] ?? '');
            $values[] = isset($r['peso']) && $r['peso'] !== '' ? (float)$r['peso'] : 0.0;
            $values[] = $this->v($r['status'] ?? '');
            $values[] = $this->v($r['proveedor'] ?? '');
            $values[] = $this->v($r['origen'] ?? '');
            $values[] = isset($r['id_carga']) ? (int)$r['id_carga'] : null;
        }

        $sql = "INSERT INTO item (" . implode(',', $cols) . ") VALUES " . implode(',', $placeholders);

        try {
            $this->conn->beginTransaction();
            $stmt = $this->conn->prepare($sql);
            $ok = $stmt->execute($values);
            if (!$ok) {
                $this->conn->rollBack();
                throw new Exception("Error al ejecutar insert masivo");
            }
            $count = $stmt->rowCount();
            $this->conn->commit();
            return $count;
        } catch (Throwable $t) {
            if ($this->conn->inTransaction()) $this->conn->rollBack();
            throw $t;
        }
    }

    public function table_item(
        $base = null,
        $grupo = null,
        $clase = null,
        $categoria = null,
        $md5_id = null
    ): array {

        $sql = "
            SELECT a.*
            FROM item a
            LEFT JOIN carga b ON a.id_carga = b.id
            WHERE 1 = 1
        ";

        $params = [];

        if (!$md5_id) {
            $sql .= " AND b.estado = 1";
        }

        if ($base) {
            $sql .= " AND a.id_carga = ?";
            $params[] = $base;
        }

        if ($grupo) {
            $sql .= " AND a.grupo_descuento = ?";
            $params[] = $grupo;
        }

        if ($clase) {
            $sql .= " AND a.clase_producto = ?";
            $params[] = $clase;
        }

        if ($categoria) {
            $sql .= " AND a.categoria_producto = ?";
            $params[] = $categoria;
        }

        if ($md5_id) {
            $sql .= " AND MD5(a.id_carga) = ?";
            $params[] = $md5_id;
        }

        $sql .= " ORDER BY a.id DESC";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function table_carga(): array{
         $sql = "SELECT *
                FROM carga
                ORDER BY id DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function select_bases(): array{
         $sql = "SELECT id,nombre_file as base
                FROM carga
                where estado=1
                group by id,nombre_file
                ORDER BY id DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function select_grupo_descuento($base = null): array{
         $sql = "SELECT grupo_descuento, count(1) as ctd 
                FROM item a
                left join carga b on a.id_carga=b.id
                where b.estado=1";
        $params = [];

        if ($base !== null && $base !== '') {
            $sql .= " and id_carga=?";
            $params[] = $base;
        }

        $sql .= " group by grupo_descuento";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function select_clase_producto($base = null): array{
         $sql = "SELECT clase_producto, count(1) as ctd 
                FROM item a
                left join carga b on a.id_carga=b.id
                where b.estado=1";
        $params = [];

        if ($base !== null && $base !== '') {
            $sql .= " and id_carga=?";
            $params[] = $base;
        }

        $sql .= " group by clase_producto";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function select_categoria_producto($base = null): array{
         $sql = "SELECT categoria_producto, count(1) as ctd 
                FROM item a
                left join carga b on a.id_carga=b.id
                where b.estado=1";
        $params = [];

        if ($base !== null && $base !== '') {
            $sql .= " and id_carga=?";
            $params[] = $base;
        }

        $sql .= " group by categoria_producto";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function limpiarFiltroReceta(?string $valor): ?string {
        $valor = trim((string)($valor ?? ''));
        return $valor === '' ? null : $valor;
    }

    private function agregarFiltroReceta(string &$sql, array &$params, string $campo, ?string $valor): void {
        $valor = $this->limpiarFiltroReceta($valor);
        if ($valor === null) {
            return;
        }

        $sql .= " AND {$campo} = :{$campo}";
        $params[":{$campo}"] = $valor;
    }

    public function obtenerRecetaTipos(): array {
        $sql = "SELECT DISTINCT tipo
                FROM receta_items
                WHERE tipo IS NOT NULL
                AND TRIM(tipo) <> ''
                ORDER BY tipo";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerRecetaCategorias(?string $tipo = null): array {
        $sql = "SELECT DISTINCT categoria
                FROM receta_items
                WHERE categoria IS NOT NULL
                AND TRIM(categoria) <> ''";
        $params = [];

        $this->agregarFiltroReceta($sql, $params, 'tipo', $tipo);
        $sql .= " ORDER BY categoria";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerRecetaSubCategorias1(?string $tipo = null, ?string $categoria = null): array {
        $sql = "SELECT DISTINCT sub_cat_1
                FROM receta_items
                WHERE sub_cat_1 IS NOT NULL
                AND TRIM(sub_cat_1) <> ''";
        $params = [];

        $this->agregarFiltroReceta($sql, $params, 'tipo', $tipo);
        $this->agregarFiltroReceta($sql, $params, 'categoria', $categoria);
        $sql .= " ORDER BY sub_cat_1";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerRecetaSubCategorias2(?string $tipo = null, ?string $categoria = null, ?string $subCat1 = null): array {
        $sql = "SELECT DISTINCT sub_cat_2
                FROM receta_items
                WHERE sub_cat_2 IS NOT NULL
                AND TRIM(sub_cat_2) <> ''";
        $params = [];

        $this->agregarFiltroReceta($sql, $params, 'tipo', $tipo);
        $this->agregarFiltroReceta($sql, $params, 'categoria', $categoria);
        $this->agregarFiltroReceta($sql, $params, 'sub_cat_1', $subCat1);
        $sql .= " ORDER BY sub_cat_2";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerItems(int $id): ?array {
        $sql = "SELECT 
                    id,
                    modelo,
                    descripcion,
                    categoria_producto,
                    grupo_descuento,
                    clase_producto,
                    precio_unitario,
                    moneda,
                    peso,
                    pais_origen,
                    status
                FROM item
                WHERE id_carga = :id and estado=1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerItemsRecetaFiltrados(?string $tipo = null, ?string $categoria = null, ?string $subCat1 = null, ?string $subCat2 = null): array {
        $sql = "SELECT 
                    id,
                    nombre,
                    descripcion,
                    uni_medida,
                    precio,
                    moneda,
                    tipo,
                    categoria,
                    sub_cat_1,
                    sub_cat_2,
                    marca,
                    modelo,
                    estado
                FROM receta_items
                WHERE 1 = 1";
        $params = [];

        $this->agregarFiltroReceta($sql, $params, 'tipo', $tipo);
        $this->agregarFiltroReceta($sql, $params, 'categoria', $categoria);
        $this->agregarFiltroReceta($sql, $params, 'sub_cat_1', $subCat1);
        $this->agregarFiltroReceta($sql, $params, 'sub_cat_2', $subCat2);

        $sql .= " ORDER BY nombre, modelo, id";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerItemsReceta(string $tipo): ?array {
        return $this->obtenerItemsRecetaFiltrados($tipo, null, null, null);
    }

    public function obtenerFlete(): ?array {
        $sql = "SELECT *
                FROM flete";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

     public function obtenerGastos(): ?array {
        $sql = "SELECT *
                FROM gastos";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerPorHash(string $hash): ?array {
        $sql = "SELECT *
                FROM item
                WHERE MD5(id) = :hash
                LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data ?: null;
    }

    public function crearCarga(string $nombreFile): int {
        $sql = "INSERT INTO carga (nombre_file, cargados, errores, fecha_registro)
                VALUES (:nombre_file, 0, 0, :fecha_registro)";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':nombre_file', $nombreFile);
        $stmt->bindValue(':fecha_registro', $this->nowLima);

        if ($stmt->execute()) {
            return (int)$this->conn->lastInsertId();
        }
        return 0;
    }

    public function actualizarCarga(int $idCarga, int $cargados, int $errores): bool {
        $sql = "UPDATE carga SET cargados = :cargados, errores = :errores WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':cargados', $cargados, PDO::PARAM_INT);
        $stmt->bindValue(':errores', $errores, PDO::PARAM_INT);
        $stmt->bindValue(':id', $idCarga, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function actualizar_estado(int $id, string $estado): bool {
        $sql = "UPDATE carga 
                SET estado = :estado
                WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':estado', $estado);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function valida_modelo_upd(string $modelo, string $hash): ?array
    {
        $sql = "SELECT id
                FROM item
                WHERE modelo = :modelo
                AND MD5(id) <> :hash
                LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':modelo', $modelo);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data ?: null;
    }

    public function guardarItemReceta(array $data): int
    {
        $sql = "INSERT INTO receta_items (
                    categoria,
                    sub_cat_1,
                    sub_cat_2,
                    marca,
                    modelo,
                    nombre,
                    descripcion,
                    uni_medida,
                    precio,
                    stock,
                    moneda,
                    tipo,
                    created_at
                ) VALUES (
                    :categoria,
                    :sub_cat_1,
                    :sub_cat_2,
                    :marca,
                    :modelo,
                    :nombre,
                    :descripcion,
                    :uni_medida,
                    :precio,
                    :stock,
                    :moneda,
                    :tipo,
                    :created_at
                )";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':categoria', (string)($data['categoria'] ?? ''));
        $stmt->bindValue(':sub_cat_1', (string)($data['sub_cat_1'] ?? ''));
        $stmt->bindValue(':sub_cat_2', (string)($data['sub_cat_2'] ?? ''));
        $stmt->bindValue(':marca', (string)($data['marca'] ?? ''));
        $stmt->bindValue(':modelo', (string)($data['modelo'] ?? ''));
        $stmt->bindValue(':nombre', (string)($data['nombre'] ?? ''));
        $stmt->bindValue(':descripcion', (string)($data['descripcion'] ?? ''));
        $stmt->bindValue(':uni_medida', (string)($data['uni_medida'] ?? ''));
        $stmt->bindValue(':precio', (float)($data['precio'] ?? 0));
        $stmt->bindValue(':stock', (int)($data['stock'] ?? 0), PDO::PARAM_INT);
        $stmt->bindValue(':moneda', (string)($data['moneda'] ?? ''));
        $stmt->bindValue(':tipo', (string)($data['tipo'] ?? ''));
        $stmt->bindValue(':created_at', $this->nowLima);

        $stmt->execute();

        return (int)$this->conn->lastInsertId();
    }

    public function bajaItemReceta(int $id): bool {
        $sql = "UPDATE receta_items 
                SET estado = 0
                WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function actualizarItemRecetaPorHash(string $hash, array $data): bool {
        $sql = "UPDATE receta_items 
                SET marca = :marca,
                    modelo = :modelo,
                    descripcion = :descripcion,
                    uni_medida = :uni_medida,
                    precio = :precio,
                    moneda = :moneda,
                    estado = :estado    
                WHERE MD5(id) = :hash";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(':marca', $data['marca']);
        $stmt->bindValue(':modelo', $data['modelo']);
        $stmt->bindValue(':descripcion', $data['descripcion']);
        $stmt->bindValue(':uni_medida', $data['uni_medida']);
        $stmt->bindValue(':precio', $data['precio']);
        $stmt->bindValue(':moneda', $data['moneda']);
        $stmt->bindValue(':estado', (int)$data['estado'], PDO::PARAM_INT);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function obtenerItemRecetaPorHash(string $hash): ?array {
        $sql = "SELECT *
                FROM receta_items
                WHERE MD5(id) = :hash
                LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data ?: null;
    }

    public function firmaItemsPrecioCero(): array {
        $sql = "SELECT
                    COUNT(*) AS total,
                    COALESCE(MAX(id), 0) AS max_id,
                    COALESCE(SUM(CRC32(CONCAT(id, '|', COALESCE(modelo, ''), '|', COALESCE(nombre, ''), '|', COALESCE(precio, 0), '|', COALESCE(moneda, '')))), 0) AS checksum
                FROM receta_items
                WHERE COALESCE(precio, 0) = 0
                  AND COALESCE(estado, 1) = 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];

        return [
            'total' => (int)($data['total'] ?? 0),
            'max_id' => (int)($data['max_id'] ?? 0),
            'checksum' => (string)($data['checksum'] ?? '0')
        ];
    }

    public function obtenerItemsPrecioCero(int $limit = 10): array {
        $sql = "SELECT
                    id,
                    nombre,
                    descripcion,
                    modelo,
                    marca,
                    tipo,
                    categoria,
                    sub_cat_1,
                    sub_cat_2,
                    moneda,
                    precio
                FROM receta_items
                WHERE COALESCE(precio, 0) = 0
                  AND COALESCE(estado, 1) = 1
                ORDER BY id DESC
                LIMIT :limit";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>