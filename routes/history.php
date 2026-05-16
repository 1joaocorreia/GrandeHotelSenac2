<?php
require_once __DIR__ . "/../helpers/token_jwt.php";
require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../controllers/HistoryController.php";

$subroute = $segments[2] ?? null;
$subsubroute = $segments[3] ?? null;

if (! isset($subroute)) {
    return jsonResponse([
        "status" => "error",
        "message" => "Sub rota ou ID faltando"
    ], 400);
}

function subRouteCliente() {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    	global $conn;
    	global $subsubroute;
		$user_id = $subsubroute;
		
		if (! isset($user_id)) {
        	return jsonResponse([
            	"status" => "error",
            	"message" => "ID do cliente faltando"
        	], 400);
    	}
		
		HistoryController::getReservationHistoryByClientId($conn, $user_id);
    } else {
        return jsonResponse([
            "status" => "error",
            "message" => "Método não permitido"
        ], 405);
    }
}

function defaultRoute() {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    	global $subroute;
        global $conn;
    	$reservationId = $subroute;

    	if (! isset($reservationId)) {
        	return jsonResponse([
            	"status" => "error",
            	"message" => "ID da reserva faltando!"
        	], 400);
    	}
		HistoryController::getReservationHistoryById($conn, $reservationId);

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

