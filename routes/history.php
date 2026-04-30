<?php

global $conn;

$user_id = 1;

$sql = "SELECT * FROM reservations WHERE user_id = ? ORDER BY create_at DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();

$reservations = [];

while ($row = result_fetch_assoc()) {
    $reservations[] = $row;
}

return jsonResponse($reservations);