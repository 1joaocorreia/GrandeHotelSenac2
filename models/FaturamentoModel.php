<?php

class FaturamentoModel {
    
    public static function getDadosFaturamentoByClientId($conn, $clientId) {
        $sql = "SELECT * FROM faturamento WHERE client_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $clientId);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

}

?>