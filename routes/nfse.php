<?php

require_once __DIR__ . "/../helpers/token_jwt.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../controllers/NfseController.php";

$subroute = $segments[1] ?? null;

if (! isset($subroute)) {
	return jsonResponse([
        "status" => "error",
        "message" => "Subrota ou ID da nota fiscal faltando"
    ], 400);
}

function subRouteQuarto() {
    global $segments;
    global $conn;
	
	$headers = getallheaders();
    if (! isset($headers['Authorization'])) {
        return jsonResponse([
            "status" => "error",
            "message" => "Token de autenticação faltando"
        ], 400);
    }
	
	$token = str_replace("Bearer ", "", $headers['Authorization']);
	$client = validateToken($token);
	if (! isset($client) || $client === false) {
		return jsonResponse([
            "status" => "error",
            "message" => "Token invalido"
        ], 400);
    }
	
    $clientId = $client["id"];
    $quartoId = $segments[2] ?? null;
    if (! isset($quartoId)) {
        return jsonResponse([
            "status" => "error",
            "message" => "ID do quarto faltando!"
        ], 400);
    }
	
	NfseController::renderNfseByQuartoId($conn, $clientId, $quartoId);

}

function defaultRoute() {
	return jsonResponse([
        "status" => "error",
        "message" => "not implemented yet"
    ], 500);
}


switch ($subroute) {
    case "quarto": {
        subRouteQuarto();
    }
    default: {
        defaultRoute();
    }
}

?>