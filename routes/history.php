<?php
require_once "helpers/token_jwt.php";
require_once "helpers/response.php";

global $conn;

// Pegar headers da requisição
$headers = getallheaders();

// Se não tiver token
if(!isset($headers['Authorization'])) {
    return jsonResponse(['error' => 'Token não enviado'], 401);
}

// Extrair token
$token = str_replace('Bearer ', '', $headers['Authorization']);

// Validar token
$decoded = validateToken($token);

if(!$decoded) {
    return jsonResponse(['error' => 'Token inválido'], 401);
}

$user_id = $decoded['id'];


$sql = "SELECT * FROM reservations WHERE user_id = ? ORDER BY create_at DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();

$reservations = [];

while ($row = $result->fetch_assoc()) {
    $reservations[] = $row;
}

return jsonResponse($reservations);
