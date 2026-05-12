<?php

require_once __DIR__ . "/../controllers/ReviewController.php";

function subRouteRooms($conn, $roomId) {
	if (! isset($roomId)) {
		return jsonResponse([
			"status" => "failure",
			"message" => "Missing room ID"
		], 400);
	}

	$reviews = ReviewController::getReviewsByRoomId($conn, $roomId);
	if ($reviews === false) {
		return jsonResponse([
			"status" => "failure",
			"message" => "Not possible to fetch reviews for room with id $roomId"
		], 500);
	}

	return jsonResponse($reviews, 200);
}

$subroute = $segments[2] ?? null;

if (! isset($subroute)) {
	return jsonResponse([
		"status" => "failure",
		"message" => "O segundo componente da URL está faltando. Indique o ID ou Subrota!"
	], 400);
}


switch ($subroute) {
	case "room": {
		subRouteRooms($conn, $segments[3] ?? null);
		exit;
	}
}


// nesse caso, não há subrotas e o segmento 2 é o ID da review
// ex:
// - com subrota: api/reviews/room/1
// - sem subrota (neste caso): api/reviews/1
$review = ReviewController::getReviewById($conn, $subroute);
if ($review === false) {
	return jsonResponse([
		"status" => "failure",
		"message" => "Desculpe, o servidor encontrou problemas para realizar essa operação. Tente novamente mais tarde"
	], 500);
}

return jsonResponse($review, 200);

?>
