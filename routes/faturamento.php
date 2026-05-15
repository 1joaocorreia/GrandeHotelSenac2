<?php

require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../controllers/FaturamentoController.php";

function getHandler() {
    global $segments;
    global $conn;
    $subroute = $segments[2];
    $subsubroute = $segments[3];

    switch ($subroute) {
        case "cliente": {
            $dadosFaturamento = FaturamentoController::getDadosFaturamentoByClientId($conn, $subsubroute);
            if (! isset($dadosFaturamento) or $dadosFaturamento === false) {
                return jsonResponse([
                    "status" => "error",
                    "message" => "O servidor foi incapaz de obter dados de faturamento para o ID especificado: $subsubroute"
                ], 500);
            }
            return jsonResponse($dadosFaturamento, 200);
        }
        default: {
            return jsonResponse([
                "status" => "error",
                "message" => "Rota não encontrada"
            ], 404);
        }
    }
}


switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET': {
        getHandler();
        break;
    }
    default: {
        return jsonResponse([
            "status" => "error",
            "message" => "Método não permitido"
        ], 405);
    }
}

?>