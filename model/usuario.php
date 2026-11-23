<?php
require_once "../database/conexion.php";

class Usuario {
    private PDO $conn;
    private string $nowLima;

    public function __construct() {
        $conexion = new Conexion();
        $this->conn = $conexion->conectar();
        $tz = new DateTimeZone('America/Lima');
        $this->nowLima = (new DateTimeImmutable('now', $tz))->format('Y-m-d H:i:s');
    }

    private function upper(string $value): string{
        return mb_strtoupper(trim($value), 'UTF-8');
    }

    public function baja(int $id): bool {
        $sql = "UPDATE personal 
                SET IDESTADO = 0, fecha_baja = :fecha_baja 
                WHERE IDPERSONAL = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':fecha_baja', $this->nowLima);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function actualizarPorHash(string $hash, array $data): bool {
        $sql = "UPDATE personal 
                SET APELLIDOS = :APELLIDOS,
                    NOMBRES = :NOMBRES,
                    EMAIL = :EMAIL,
                    DOC = :DOC,
                    TLF = :TLF,
                    SEXO = :SEXO,
                    IDESTADO = :IDESTADO,
                    CARGO = :CARGO
                WHERE MD5(IDPERSONAL) = :hash";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(':APELLIDOS', $this->upper($data['apellidos'] ?? ''));
        $stmt->bindValue(':NOMBRES', $this->upper($data['nombres']));
        $stmt->bindValue(':EMAIL', $data['email']);
        $stmt->bindValue(':DOC', $data['documento']);
        $stmt->bindValue(':TLF', $data['telefono']);
        $stmt->bindValue(':SEXO', (int)$data['sexo'], PDO::PARAM_INT);
        $stmt->bindValue(':IDESTADO', (int)$data['estado'], PDO::PARAM_INT);
        $stmt->bindValue(':CARGO', $data['cargo']);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function guardar(array $data): int {
        $nombres = trim($data['nombres'] ?? '');
        $apellidos = trim($data['apellidos'] ?? '');
        $primerNombre = explode(' ', $nombres)[0] ?? '';
        $primerApellido = explode(' ', $apellidos)[0] ?? '';
        $usuario = strtolower($primerNombre . '.' . $primerApellido);

        $sql = "INSERT INTO personal 
                (APELLIDOS, NOMBRES, EMAIL, DOC, TLF, SEXO, USUARIO, PASSWORD, fecha_registro, IDESTADO, CARGO)
                VALUES 
                (:apellidos, :nombres, :email, :documento, :telefono, :sexo, :usuario, MD5(:documento), :fecha_registro, 1, :cargo)";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(':nombres',   $this->upper($data['nombres'] ?? ''));
        $stmt->bindValue(':apellidos', $this->upper($data['apellidos'] ?? ''));
        $stmt->bindValue(':email',     $data['email'] ?? '');
        $stmt->bindValue(':documento', $data['documento'] ?? '');
        $stmt->bindValue(':telefono',  $data['telefono'] ?? '');
        $stmt->bindValue(':sexo', (int)($data['sexo'] ?? 0), PDO::PARAM_INT);
        $stmt->bindValue(':usuario', $usuario);
        $stmt->bindValue(':fecha_registro', $this->nowLima);
        $stmt->bindValue(':cargo',  $data['cargo'] ?? '0');
        $stmt->execute();
        return (int)$this->conn->lastInsertId();
    }

    public function guardar_session(array $data): int {
        $sql = "INSERT INTO login 
                (tipo, fecha, id_user, ip)
                VALUES 
                (:tipo, :fecha, :id_user, :ip)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':tipo', $data['tipo'] ?? 'IN');
        $stmt->bindValue(':fecha', $this->nowLima);
        $stmt->bindValue(':id_user', $data['id_user'] ?? null);
        $stmt->bindValue(':ip', $data['ip'] ?? '0.0.0.0');
        $stmt->execute();
        return (int)$this->conn->lastInsertId();
    }

    public function table_personal(): array{
         $this->asegurarTablaPresencia();
         $onlineSince = (new DateTimeImmutable('now', new DateTimeZone('America/Lima')))
             ->sub(new DateInterval('PT90S'))
             ->format('Y-m-d H:i:s');
         $sql = "SELECT
                    p.*,
                    CONCAT(p.nombres,' ',p.apellidos) AS nombre_completo,
                    CASE WHEN p.IDESTADO = 1 AND up.ultima_actividad >= :online_since THEN 1 ELSE 0 END AS online
                 FROM personal p
                 LEFT JOIN usuario_presencia up ON up.usuario_id = p.IDPERSONAL
                 ORDER BY p.IDPERSONAL DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':online_since', $onlineSince);
        $stmt->execute();
        $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($usuarios as &$usuario) {
            $usuario['presence_search'] = ((int)$usuario['online'] === 1)
                ? 'online en línea conectado'
                : 'offline desconectado';
        }
        unset($usuario);
        return $usuarios;
    }

    public function registrarPresencia(int $usuarioId): void
    {
        if ($usuarioId <= 0) return;
        $this->asegurarTablaPresencia();
        $sql = "INSERT INTO usuario_presencia (usuario_id, ultima_actividad)
                SELECT IDPERSONAL, :ultima_actividad
                FROM personal
                WHERE IDPERSONAL = :usuario_id AND IDESTADO = 1
                ON DUPLICATE KEY UPDATE ultima_actividad = VALUES(ultima_actividad)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':ultima_actividad', $this->nowLima);
        $stmt->bindValue(':usuario_id', $usuarioId, PDO::PARAM_INT);
        $stmt->execute();
    }

    public function desconectarUsuario(int $usuarioId): void
    {
        if ($usuarioId <= 0) return;
        $this->asegurarTablaPresencia();
        $sql = "DELETE FROM usuario_presencia WHERE usuario_id = :usuario_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':usuario_id', $usuarioId, PDO::PARAM_INT);
        $stmt->execute();
    }

    private function asegurarTablaPresencia(): void
    {
        $this->conn->exec("CREATE TABLE IF NOT EXISTS usuario_presencia (
            usuario_id INT NOT NULL,
            ultima_actividad DATETIME NOT NULL,
            PRIMARY KEY (usuario_id),
            KEY idx_usuario_presencia_actividad (ultima_actividad)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    }

    public function obtenerPorHash(string $hash): ?array {
        $sql = "SELECT 
                    IDPERSONAL,
                    NOMBRES,
                    APELLIDOS,
                    DOC,
                    EMAIL,
                    TLF,
                    SEXO,
                    IDESTADO,
                    CARGO
                FROM personal
                WHERE MD5(IDPERSONAL) = :hash
                LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data ?: null;
    }

    public function obtenerPerfil(int $id): ?array
    {
        $sql = "SELECT
                    IDPERSONAL,
                    DOC,
                    NOMBRES,
                    APELLIDOS,
                    EMAIL,
                    TLF,
                    SEXO,
                    USUARIO,
                    CARGO
                FROM personal
                WHERE IDPERSONAL = :id AND IDESTADO = 1
                LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data ?: null;
    }

    public function actualizarPerfil(int $id, array $data): bool
    {
        $sql = "UPDATE personal
                SET NOMBRES = :nombres,
                    APELLIDOS = :apellidos,
                    EMAIL = :email,
                    TLF = :telefono,
                    SEXO = :sexo";

        if (($data['nueva_password'] ?? '') !== '') {
            $sql .= ", PASSWORD = :password";
        }

        $sql .= " WHERE IDPERSONAL = :id AND IDESTADO = 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':nombres', $this->upper((string)($data['nombres'] ?? '')));
        $stmt->bindValue(':apellidos', $this->upper((string)($data['apellidos'] ?? '')));
        $stmt->bindValue(':email', trim((string)($data['email'] ?? '')));
        $stmt->bindValue(':telefono', trim((string)($data['telefono'] ?? '')));
        $stmt->bindValue(':sexo', (int)($data['sexo'] ?? 0), PDO::PARAM_INT);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        if (($data['nueva_password'] ?? '') !== '') {
            $stmt->bindValue(':password', md5((string)$data['nueva_password']));
        }

        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function validarPassword(int $id, string $password): bool
    {
        $sql = "SELECT 1 FROM personal
                WHERE IDPERSONAL = :id AND PASSWORD = :password AND IDESTADO = 1
                LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':password', md5($password));
        $stmt->execute();
        return (bool)$stmt->fetchColumn();
    }

    public function acceso_user(array $data):  ?array {
        $sql = "SELECT 
                    IDPERSONAL,
                    DOC,
                    NOMBRES,
                    USUARIO,
                    PASSWORD,
                    IDESTADO,
                    CARGO
                FROM personal
                WHERE USUARIO = :USUARIO
                AND PASSWORD= :PASSWORD
                LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':USUARIO', $data['usuario']);
        $stmt->bindValue(':PASSWORD', $data['password']);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data ?: null;
    }

    public function existe_usuario(string $usuario): bool {
        $sql = "SELECT 1
                FROM personal
                WHERE USUARIO = :USUARIO
                LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':USUARIO', $usuario);
        $stmt->execute();
        return (bool)$stmt->fetchColumn();
    }

    public function valida_documento(string $documento): ?array
    {
        $sql = "SELECT IDPERSONAL
                FROM personal
                WHERE DOC = :documento
                LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':documento', $documento);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data ?: null;
    }

    public function valida_documento_upd(string $documento, string $hash): ?array
    {
        $sql = "SELECT IDPERSONAL
                FROM personal
                WHERE DOC = :documento
                AND MD5(IDPERSONAL) <> :hash
                LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':documento', $documento);
        $stmt->bindValue(':hash', $hash);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data ?: null;
    }

}
?>
