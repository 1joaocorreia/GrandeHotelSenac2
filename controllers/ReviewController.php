<?php

require_once __DIR__ . "/../models/ReviewModel.php";

class ReviewController {

	public static function getReviewById($conn, $id) {
		if (! isset($id)) {
			return null;
		}
		
		$query = ReviewModel::getReviewById($conn, $id);
		return $query;		
	}

	public static function getReviewsByRoomId($conn, $roomId) {
		if (! isset($roomId)) {
			return null;
		}

		$query = ReviewModel::getReviewsByRoomId($conn, $roomId);
		return $query;
	}
	
}

?>
