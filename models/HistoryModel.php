<?php

class HistoryModel {

	public static function getReservationHistoryByClientId($conn, $clientId) {
		$sql = "SELECT * FROM reservations WHERE user_id = ? ORDER BY create_at DESC";

		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $clientId);
		$stmt->execute();

		return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
	
	public static function getReservationHistoryById($conn, $reservationId) {
		$sql = "SELECT * FROM reservations WHERE id = ? ORDER BY create_at DESC";
		
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("i", $reservationId);
		$stmt->execute();

		return $stmt->get_result()->fetch_assoc();
	}
	
	public static function getReservationHistoryByClientIdAndRoomId($conn, $clientId, $roomId) {
		$sql = "SELECT * FROM reservations WHERE user_id = ? AND room_id = ?";
		
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("ii", $clientId, $roomId);
		$stmt->execute();

		return $stmt->get_result()->fetch_assoc();
	}

}

?>