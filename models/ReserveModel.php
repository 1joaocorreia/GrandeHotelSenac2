<?php
class ReserveModel{

    public static function searchByRequest($conn, $pedido_id){
        $sql = "SELECT * FROM reservas WHERE pedido_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $pedido_id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public static function create($conn, $data) {
        $sql = "INSERT INTO reservas (pedido_id, quarto_id, adicional_id , fim, inicio) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iiiss",
            $data["pedido_id"],
            $data["quarto_id"],
            $data["adicional_id"],
            $data["fim"],
            $data["inicio"]
        );
        return $stmt->execute();
    }

    public static function getAvaibleOrder($conn, $id, $inicio, $fim) {
        $sql =
        "
        SELECT
            id
        FROM
            reservas
        WHERE
            quarto_id = ? AND
            (
                inicio < ? AND fim > ?
            )
        LIMIT 1;
            ";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "iss",
            $id,
            $fim,
            $inicio
        );  
        $stmt->execute();
        $result = $stmt->get_result();
        $isReserved = $result->num_rows > 0;
        $stmt->close();

        return $isReserved;
        }

}
?>