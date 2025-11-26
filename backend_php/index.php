<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/db.php';

function json_response($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function body(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function fetchInventario(PDOStatement $stmt, int $productoId): array
{
    $stmt->execute([$productoId]);
    return $stmt->fetchAll();
}

function fetchImagenes(PDOStatement $stmt, int $productoId): array
{
    $stmt->execute([$productoId]);
    return $stmt->fetchAll();
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$base = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
$path = '/' . ltrim(str_replace($base, '', $uri), '/');
$segments = array_values(array_filter(explode('/', $path)));

try {
    $pdo = db();

    // Productos
    if (isset($segments[0]) && $segments[0] === 'productos') {
        $productoId = $segments[1] ?? null;
        $inventarioStmt = $pdo->prepare('SELECT * FROM inventario WHERE producto_id = ?');
        $imagenesStmt = $pdo->prepare('SELECT * FROM imagenes_producto WHERE producto_id = ?');

        if ($_SERVER['REQUEST_METHOD'] === 'GET' && !$productoId) {
            $productos = $pdo->query('SELECT * FROM productos')->fetchAll();
            foreach ($productos as &$p) {
                $p['inventario'] = fetchInventario($inventarioStmt, (int)$p['id']);
                $p['imagenes'] = fetchImagenes($imagenesStmt, (int)$p['id']);
            }
            json_response($productos);
        }

        if ($_SERVER['REQUEST_METHOD'] === 'GET' && $productoId) {
            $stmt = $pdo->prepare('SELECT * FROM productos WHERE id = ?');
            $stmt->execute([$productoId]);
            $p = $stmt->fetch();
            if (!$p) json_response(['detail' => 'Producto no encontrado'], 404);
            $p['inventario'] = fetchInventario($inventarioStmt, (int)$productoId);
            $p['imagenes'] = fetchImagenes($imagenesStmt, (int)$productoId);
            json_response($p);
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$productoId) {
            $d = body();
            $stmt = $pdo->prepare('INSERT INTO productos (nombre, descripcion, precio_minorista, precio_mayorista, cantidad_para_mayorista, categoria_id, destacado) VALUES (?,?,?,?,?,?,?)');
            $stmt->execute([
                $d['nombre'] ?? '',
                $d['descripcion'] ?? null,
                $d['precio_minorista'] ?? 0,
                $d['precio_mayorista'] ?? 0,
                $d['cantidad_para_mayorista'] ?? 6,
                $d['categoria_id'] ?? null,
                !empty($d['destacado']) ? 1 : 0,
            ]);
            json_response(['id' => $pdo->lastInsertId()], 201);
        }

        if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $productoId) {
            $d = body();
            $stmt = $pdo->prepare('UPDATE productos SET nombre=?, descripcion=?, precio_minorista=?, precio_mayorista=?, cantidad_para_mayorista=?, categoria_id=?, destacado=? WHERE id=?');
            $stmt->execute([
                $d['nombre'] ?? '',
                $d['descripcion'] ?? null,
                $d['precio_minorista'] ?? 0,
                $d['precio_mayorista'] ?? 0,
                $d['cantidad_para_mayorista'] ?? 6,
                $d['categoria_id'] ?? null,
                !empty($d['destacado']) ? 1 : 0,
                $productoId,
            ]);
            json_response(['ok' => true]);
        }

        if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && $productoId) {
            $stmt = $pdo->prepare('DELETE FROM productos WHERE id = ?');
            $stmt->execute([$productoId]);
            json_response(['ok' => true], 204);
        }
    }

    // Categorias
    if (isset($segments[0]) && $segments[0] === 'categorias') {
        $categoriaId = $segments[1] ?? null;
        if ($_SERVER['REQUEST_METHOD'] === 'GET' && !$categoriaId) {
            $cats = $pdo->query('SELECT * FROM categorias')->fetchAll();
            json_response($cats);
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$categoriaId) {
            $d = body();
            $stmt = $pdo->prepare('INSERT INTO categorias (nombre) VALUES (?)');
            $stmt->execute([$d['nombre'] ?? '']);
            json_response(['id' => $pdo->lastInsertId()], 201);
        }
        if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $categoriaId) {
            $d = body();
            $stmt = $pdo->prepare('UPDATE categorias SET nombre = ? WHERE id = ?');
            $stmt->execute([$d['nombre'] ?? '', $categoriaId]);
            json_response(['ok' => true]);
        }
        if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && $categoriaId) {
            $stmt = $pdo->prepare('DELETE FROM categorias WHERE id = ?');
            $stmt->execute([$categoriaId]);
            json_response(['ok' => true], 204);
        }
    }

    // Mensajes de contacto
    if (isset($segments[0]) && $segments[0] === 'mensajes_contacto') {
        $mensajeId = $segments[1] ?? null;
        if ($_SERVER['REQUEST_METHOD'] === 'GET' && !$mensajeId) {
            $msgs = $pdo->query('SELECT * FROM mensajes_contacto ORDER BY fecha_envio DESC')->fetchAll();
            json_response($msgs);
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$mensajeId) {
            $d = body();
            $stmt = $pdo->prepare('INSERT INTO mensajes_contacto (nombre_cliente, email, telefono, mensaje, interesado_en_mayorista) VALUES (?,?,?,?,?)');
            $stmt->execute([
                $d['nombre_cliente'] ?? '',
                $d['email'] ?? '',
                $d['telefono'] ?? null,
                $d['mensaje'] ?? '',
                !empty($d['interesado_en_mayorista']) ? 1 : 0,
            ]);
            json_response(['id' => $pdo->lastInsertId()], 201);
        }
        if ($_SERVER['REQUEST_METHOD'] === 'GET' && $mensajeId) {
            $stmt = $pdo->prepare('SELECT * FROM mensajes_contacto WHERE id = ?');
            $stmt->execute([$mensajeId]);
            $msg = $stmt->fetch();
            if (!$msg) json_response(['detail' => 'Mensaje no encontrado'], 404);
            json_response($msg);
        }
    }

    // Inventario por producto
    if (count($segments) >= 3 && $segments[0] === 'productos' && $segments[2] === 'inventario') {
        $productoId = $segments[1];
        $inventarioId = $segments[3] ?? null;

        if ($_SERVER['REQUEST_METHOD'] === 'GET' && !$inventarioId) {
            $stmt = $pdo->prepare('SELECT * FROM inventario WHERE producto_id = ?');
            $stmt->execute([$productoId]);
            json_response($stmt->fetchAll());
        }
        if ($_SERVER['REQUEST_METHOD'] === 'GET' && $inventarioId) {
            $stmt = $pdo->prepare('SELECT * FROM inventario WHERE id = ? AND producto_id = ?');
            $stmt->execute([$inventarioId, $productoId]);
            $row = $stmt->fetch();
            if (!$row) json_response(['detail' => 'Inventario no encontrado'], 404);
            json_response($row);
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$inventarioId) {
            $d = body();
            $stmt = $pdo->prepare('INSERT INTO inventario (producto_id, talla, stock_actual, sku) VALUES (?,?,?,?)');
            $stmt->execute([$productoId, $d['talla'] ?? '', $d['stock_actual'] ?? 0, $d['sku'] ?? null]);
            json_response(['id' => $pdo->lastInsertId()], 201);
        }
        if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $inventarioId) {
            $d = body();
            $stmt = $pdo->prepare('UPDATE inventario SET talla=?, stock_actual=?, sku=? WHERE id=? AND producto_id=?');
            $stmt->execute([$d['talla'] ?? '', $d['stock_actual'] ?? 0, $d['sku'] ?? null, $inventarioId, $productoId]);
            json_response(['ok' => true]);
        }
        if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && $inventarioId) {
            $stmt = $pdo->prepare('DELETE FROM inventario WHERE id=? AND producto_id=?');
            $stmt->execute([$inventarioId, $productoId]);
            json_response(['ok' => true], 204);
        }
    }

    // Imagenes por producto
    if (count($segments) >= 3 && $segments[0] === 'productos' && $segments[2] === 'imagenes') {
        $productoId = $segments[1];
        $imagenId = $segments[3] ?? null;

        if ($_SERVER['REQUEST_METHOD'] === 'GET' && !$imagenId) {
            $stmt = $pdo->prepare('SELECT * FROM imagenes_producto WHERE producto_id = ?');
            $stmt->execute([$productoId]);
            json_response($stmt->fetchAll());
        }
        if ($_SERVER['REQUEST_METHOD'] === 'GET' && $imagenId) {
            $stmt = $pdo->prepare('SELECT * FROM imagenes_producto WHERE id = ? AND producto_id = ?');
            $stmt->execute([$imagenId, $productoId]);
            $row = $stmt->fetch();
            if (!$row) json_response(['detail' => 'Imagen no encontrada'], 404);
            json_response($row);
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$imagenId) {
            $d = body();
            $stmt = $pdo->prepare('INSERT INTO imagenes_producto (producto_id, url_imagen, es_principal) VALUES (?,?,?)');
            $stmt->execute([$productoId, $d['url_imagen'] ?? '', !empty($d['es_principal']) ? 1 : 0]);
            json_response(['id' => $pdo->lastInsertId()], 201);
        }
        if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $imagenId) {
            $d = body();
            $stmt = $pdo->prepare('UPDATE imagenes_producto SET url_imagen=?, es_principal=? WHERE id=? AND producto_id=?');
            $stmt->execute([$d['url_imagen'] ?? '', !empty($d['es_principal']) ? 1 : 0, $imagenId, $productoId]);
            json_response(['ok' => true]);
        }
        if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && $imagenId) {
            $stmt = $pdo->prepare('DELETE FROM imagenes_producto WHERE id=? AND producto_id=?');
            $stmt->execute([$imagenId, $productoId]);
            json_response(['ok' => true], 204);
        }
    }

    json_response(['detail' => 'Ruta no encontrada'], 404);
} catch (Throwable $e) {
    json_response(['error' => $e->getMessage()], 500);
}
