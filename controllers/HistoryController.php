<?php

require_once __DIR__ . "/../models/HistoryModel.php";

class HistoryController {

	public static function getReservationHistoryByClientId($conn, $clientId) {

		if (! isset($conn) or ! isset($clientId)) {
			return jsonResponse([
                "status" => "error",
                "message" => "Erro interno do servidor."
            ], 500);
        }
		
		$query = HistoryModel::getReservationHistoryByClientId($conn, $clientId);
        if ($query === false) {
            return jsonResponse([
                "status" => "error",
                "message" => "Nenhuma reserva encontrada no histórico desse cliente."
            ], 404);
        }
		
		return jsonResponse($query, 200);

    }

	public static function getReservationHistoryById($conn, $reservationId) {

		if (! isset($conn) or ! isset($reservationId)) {
            return jsonResponse([
                "status" => "error",
                "message" => "Erro interno no servidor"
            ], 500);
        }

		$query = HistoryModel::getReservationHistoryById($conn, $reservationId);
		if ($query === false) {
			return jsonResponse([
                "status" => "error",
                "message" => "Nenhuma reserva encontrada no histórico com esse ID"
            ], 404);
        }
	
        return jsonResponse($query, 200);
    }
}

?>