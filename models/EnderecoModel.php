<?php

class EnderecoModel {
    public static function getEnderecoById($conn, $enderecoId) {
        $sql = "SELECT * FROM enderecos WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $enderecoId);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }
    public static function getEnderecoByCep($conn, $cep) {
        $sql = "SELECT * FROM enderecos WHERE cep = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $cep);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }
}

?>