<?php

require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../controllers/EnderecoController.php";

global $segments;
$subroute = $segments[2];

if (! isset($subroute)) {
    return jsonResponse([
        "status" => "error",
        "message" => "Rota incompleta"
    ], 400);
}


function subRouteCliente() {

    global $segments;
    global $conn;

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {

        $id = $segments[3] ?? null;
        if (! isset($id)) {
            return jsonResponse([
                "status" => "error",
                "message" => "ID faltando"
            ], 400);
        }

        EnderecoController::getEnderecoByClientId($conn, $id);

    } else {
        return jsonResponse([
            "status" => "error",
            "message" => "Método não permitido"
        ], 405);
    }

}

/* Considera o segments[2] (subrota) como sendo o ID do endereço no banco de dados */
function defaultRoute() {
    global $subroute;
    global $conn;

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {

        EnderecoController::getEnderecoById($conn, $subroute);

    } else {
        return jsonResponse([
            "status" => "error",
            "message" => "Método não permitido"
        ], 405);
    }
}


switch ($subroute) {
    case "cliente": {
        subRouteCliente();
    }
    default: {
        defaultRoute();
    }
}

?>