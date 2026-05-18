<?php
require_once __DIR__ . "/../../controllers/RoomController.php";
require_once __DIR__ . "/../../helpers/token_jwt.php";

if ($_SERVER['REQUEST_METHOD'] === "GET") {
    $id = $segments[2] ?? null;

    if (isset($id)) {
        if (is_numeric($id)) { 
            RoomController::getById($conn, $id);

        } elseif ($id === "disponiveis") { 
            $data = [
                "inicio" => isset($_GET['inicio']) ? $_GET['inicio'] : null,
                "fim" => isset($_GET['fim']) ? $_GET['fim'] : null,
                "capacidadeTotal" => isset($_GET['capacidadeTotal']) ? $_GET['capacidadeTotal'] : null
            ];
            RoomController::searchAvailable($conn, $data);
        } else { 
            jsonResponse(['message' => "Essa rota não existe"], 400);

        }
    } else { 
        RoomController::listAll($conn);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === "POST") {
    validateTokenAPI("func");
    $data = $_POST;
    $data['fotos'] = $_FILES['fotos'] ?? null;
    RoomController::create($conn, $data);
} elseif ($_SERVER['REQUEST_METHOD'] === "PUT") {
    validateTokenAPI('func');

    $id = $segments[2] ?? null;
    parse_str(file_get_contents('php://input'), $data);

    if (isset($data) && isset($id)) {
        RoomController::update($conn, $id, $data);
    } else {
        jsonResponse(['message' => "Atributos invalidos"], 400);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === "DELETE") {
    validateTokenAPI('func');

    $id = $segments[2] ?? null;
    if ($id) {
        RoomController::delete($conn, $id);
    } else {
        jsonResponse(['message' => "ID inválido"], 400);
    }

} else {
    jsonResponse([
        "status" => "error",
        "message" => "metodo nao permitido"
    ], 405);
}
?>