<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/bootstrap.php';

function permisosJsonResponse(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function permisosRequireAdmin(): void
{
    if ((int)($_SESSION['session_id'] ?? 0) <= 0) {
        permisosJsonResponse(401, ['success' => false, 'message' => 'Sesión expirada']);
    }
    if ((int)($_SESSION['session_cargo'] ?? 0) !== 1) {
        permisosJsonResponse(403, ['success' => false, 'message' => 'Solo el administrador puede gestionar permisos']);
    }
}

function permisosListarPaginas(): array
{
    $paginas = [];

    foreach (glob(ROOT . '/views/*.php') ?: [] as $file) {
        $paginas[] = basename($file);
    }

    foreach (glob(ROOT . '/views/*/index.php') ?: [] as $file) {
        $paginas[] = basename(dirname($file)) . '.php';
    }

    foreach (glob(ROOT . '/views/*/*.php') ?: [] as $file) {
        if (basename($file) === 'index.php') {
            continue;
        }
        $paginas[] = basename(dirname($file)) . '_' . basename($file);
    }

    $paginas = array_values(array_unique(array_filter($paginas, static fn($pagina) => $pagina !== 'permisos.php')));
    sort($paginas, SORT_NATURAL | SORT_FLAG_CASE);
    return $paginas;
}

function permisosContarUsuariosPorCargo(): array
{
    require_once ROOT . '/database/conexion.php';
    $conexion = new Conexion();
    $stmt = $conexion->conectar()->query(
        "SELECT CARGO AS cargo, COUNT(*) AS total FROM personal GROUP BY CARGO"
    );
    $counts = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $counts[(string)$row['cargo']] = (int)$row['total'];
    }
    return $counts;
}

function permisosLeer(string $path): array
{
    $raw = file_get_contents($path);
    if ($raw === false) {
        throw new RuntimeException('No se pudo leer config/permisos.json');
    }
    $roles = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($roles)) {
        throw new RuntimeException('El archivo de permisos no contiene una lista de roles válida');
    }
    return $roles;
}

try {
    permisosRequireAdmin();
    $path = ROOT . '/config/permisos.json';

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        permisosJsonResponse(200, [
            'success' => true,
            'roles' => permisosLeer($path),
            'paginas' => permisosListarPaginas(),
            'usuarios_por_cargo' => permisosContarUsuariosPorCargo()
        ]);
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        permisosJsonResponse(405, ['success' => false, 'message' => 'Método no permitido']);
    }

    $csrf = (string)($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    if ($csrf === '' || !hash_equals((string)($_SESSION['csrf_permisos'] ?? ''), $csrf)) {
        permisosJsonResponse(403, ['success' => false, 'message' => 'Token de seguridad inválido; recarga la página']);
    }

    $payload = json_decode((string)file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
    $rolesRaw = $payload['roles'] ?? null;
    if (!is_array($rolesRaw)) {
        throw new InvalidArgumentException('Debes enviar los roles a guardar');
    }

    $paginasDisponibles = permisosListarPaginas();
    $paginasLookup = array_fill_keys($paginasDisponibles, true);
    $roles = [];

    foreach ($rolesRaw as $id => $rol) {
        $id = (string)$id;
        if (!preg_match('/^\d{1,6}$/', $id) || !is_array($rol)) {
            throw new InvalidArgumentException('El ID o formato de un rol no es válido');
        }

        $nombre = trim((string)($rol['nombre'] ?? ''));
        if ($nombre === '' || mb_strlen($nombre, 'UTF-8') > 80) {
            throw new InvalidArgumentException("El nombre del rol $id es obligatorio y debe tener hasta 80 caracteres");
        }

        $acceso = $rol['acceso'] ?? [];
        if ($acceso === '*') {
            $roles[$id] = ['nombre' => $nombre, 'acceso' => '*'];
            continue;
        }
        if (!is_array($acceso)) {
            throw new InvalidArgumentException("Los permisos del rol $id tienen un formato inválido");
        }

        $accesoValidado = [];
        foreach ($acceso as $pagina) {
            $pagina = (string)$pagina;
            if (!isset($paginasLookup[$pagina])) {
                throw new InvalidArgumentException("La página '$pagina' no pertenece a la lista disponible");
            }
            $accesoValidado[$pagina] = true;
        }
        $roles[$id] = [
            'nombre' => $nombre,
            'acceso' => array_keys($accesoValidado)
        ];
    }

    $rolesExistentes = permisosLeer($path);
    $usuariosPorCargo = permisosContarUsuariosPorCargo();
    foreach ($rolesExistentes as $idExistente => $_rolExistente) {
        $idExistente = (string)$idExistente;
        if (!array_key_exists($idExistente, $roles) && (int)($usuariosPorCargo[$idExistente] ?? 0) > 0) {
            throw new InvalidArgumentException("No se puede eliminar el rol $idExistente: hay usuarios asignados. Reasígnalos primero.");
        }
    }

    if (!isset($roles['1'])) {
        throw new InvalidArgumentException('El rol Administrador (ID 1) no se puede eliminar');
    }
    $roles['1'] = ['nombre' => 'Admin', 'acceso' => '*'];
    uksort($roles, static fn($a, $b) => (int)$a <=> (int)$b);

    $json = json_encode($roles, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR) . PHP_EOL;
    $tmp = tempnam(dirname($path), '.permisos-');
    if ($tmp === false || file_put_contents($tmp, $json, LOCK_EX) === false) {
        throw new RuntimeException('No se pudo preparar el archivo de permisos');
    }

    if (!@rename($tmp, $path)) {
        $backup = $path . '.bak-' . bin2hex(random_bytes(4));
        if (!@rename($path, $backup)) {
            @unlink($tmp);
            throw new RuntimeException('No se pudo reemplazar config/permisos.json');
        }
        if (!@rename($tmp, $path)) {
            @rename($backup, $path);
            @unlink($tmp);
            throw new RuntimeException('No se pudo guardar config/permisos.json');
        }
        @unlink($backup);
    }

    permisosJsonResponse(200, ['success' => true, 'message' => 'Permisos guardados correctamente']);
} catch (JsonException | InvalidArgumentException $e) {
    permisosJsonResponse(400, ['success' => false, 'message' => $e->getMessage()]);
} catch (Throwable $e) {
    permisosJsonResponse(500, ['success' => false, 'message' => $e->getMessage()]);
}
