<?php

require_once __DIR__ . "/../../helpers/response.php";
require_once __DIR__ . "/../../controllers/ReviewController.php";

function subRouteRooms($conn, $roomId) {
	if (! isset($roomId)) {
		return jsonResponse([
			"status" => "error",
			"message" => "Missing room ID"
		], 400);
	}

	$reviews = ReviewController::getReviewsByRoomId($conn, $roomId);
	if ($reviews === false) {
		return jsonResponse([
			"status" => "error",
			"message" => "Not possible to fetch reviews for room with id $roomId"
		], 500);
	}

	return jsonResponse($reviews, 200);
}



$subroute = $segments[2] ?? null;

if (! isset($subroute)) {
	return jsonResponse([
		"status" => "error",
		"message" => "O segundo componente da URL está faltando. Indique o ID ou Subrota!"
	], 400);
}



if ($_SERVER['REQUEST_METHOD'] === 'GET') {
	switch ($subroute) {
		case "room": {
			subRouteRooms($conn, $segments[3] ?? null);
			exit;
		}
	}

	$review = ReviewController::getReviewById($conn, $subroute);
	if ($review === false) {
		return jsonResponse([
			"status" => "error",
			"message" => "Desculpe, o servidor encontrou problemas para realizar essa operação. Tente novamente mais tarde"
		], 500);
	}

	return jsonResponse($review, 200);
	
} else {
	return jsonResponse([
		"status" => "error",
		"message" => "Método não aceito."
	], 405);
}
?>
