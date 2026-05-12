<?php

class ReviewModel {

	public static function getReviewById($conn, $id) {
		$sql = "SELECT * FROM avaliacoes WHERE id = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('i', $id);
		$stmt->execute();
		return ($stmt->get_result()->fetch_assoc() ?? []);
	}

	public static function getReviewsByRoomId($conn, $roomId) {
		$sql = "SELECT * FROM avaliacoes WHERE room_id = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('i', $roomId);
		$stmt->execute();
		return ($stmt->get_result()->fetch_all(MYSQLI_ASSOC) ?? []);
	}
}
?>
