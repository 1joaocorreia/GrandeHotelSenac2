<?php

require_once __DIR__ . "/../../helpers/response.php";
require_once __DIR__ . "/../../controllers/FaturamentoController.php";

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

function putHandler() {
    global $segments;
    global $conn;
    $subroute = $segments[2];
    $subsubroute = $segments[3] ?? null;
	$data = json_decode(file_get_contents("php://input"), true);

	switch ($subroute) {
    	case "cliente": {
			if (! isset($subsubroute)) {
                return jsonResponse([
                    "status" => "error",
                    "message" => "ID do cliente faltando"
                ], 400);
            }
            if (! isset($data)) {
                return jsonResponse([
                    "status" => "error",
                    "message" => "corpo da requisição faltando"
                ], 400);
            }

            $valid = false;
            foreach ($data as $column => $value) {
                if (in_array($column, ["id", "client_id", "endereco_faturamento", 'email_faturamento'])) {
                    $valid = true;
                } else {
                    $valid = false;
                }
                if (! $valid) {
                    if (! $valid) {
            			return jsonResponse([
                			"status" => "error",
                			"message" => "Campo invalido para alteração"
            			], 403);
        			}
                }
            }

			FaturamentoController::updateInterpret($conn, $data, "client_id = ?", $subsubroute);
        }
        default: {
            return jsonResponse([
                "status" => "error",
                "message" => "not implemented yet"
            ], 500);
        }
    }

}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET': {
        getHandler();
        break;
    }
    case 'PUT': {
        putHandler();
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