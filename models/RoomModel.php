<?php
class RoomModel{
    public static function create($conn, $data) {
        $sql = "INSERT INTO quartos (nome, numero, qnt_cama_casal, qnt_cama_solteiro, preco, disponivel) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $disponivel = filter_var($data["disponivel"], FILTER_VALIDATE_BOOLEAN);
        $stmt->bind_param("siiidi",
            $data["nome"],
            $data["numero"],
            $data["qnt_cama_casal"],
            $data["qnt_cama_solteiro"],
            $data["preco"],
            $disponivel
        );
        
        if ($stmt->execute()) {
            return $conn->insert_id;
        } else {
            return false;
        }
    }

    public static function getAll($conn) {
        $sql = "SELECT * FROM quartos";
        $result = $conn->query($sql);
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public static function getById($conn, $id) {
        $sql = "SELECT * FROM quartos WHERE id= ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public static function delete($conn, $id) {
        $sql = "DELETE FROM quartos WHERE id= ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    public static function update($conn, $id, $data) {
        $sql = "UPDATE quartos SET nome=?, numero=?, qnt_cama_casal=?, qnt_cama_solteiro=?, preco=?, disponivel=? WHERE id= ?";
        $stmt = $conn->prepare($sql);
        $disponivel = filter_var($data["disponivel"], FILTER_VALIDATE_BOOLEAN);
        $stmt->bind_param("siiidii",
            $data["nome"],
            $data["numero"],
            $data["qnt_cama_casal"],
            $data["qnt_cama_solteiro"],
            $data["preco"],
            $disponivel,
            $id
        );
        return $stmt->execute();
    }

    public static function searchAvailable($conn, $data){

        $sql="SELECT q.*, (q.qnt_cama_casal * 2 + q.qnt_cama_solteiro) as capacidadeTotal 
            FROM quartos q 
            WHERE q.disponivel = true 
            AND q.id NOT IN (
            SELECT r.quarto_id 
            FROM reservas r 
            WHERE NOT (r.fim <= ? OR r.inicio >= ?))
            AND (q.qnt_cama_casal * 2 + q.qnt_cama_solteiro) >= ?;";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssi",
            $data["inicio"],
            $data["fim"],
            $data["capacidadeTotal"]
        );
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public static function lockById($conn, $id){
        $sql = "SELECT id FROM quartos WHERE id=? FOR UPDATE";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i",$id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result && $result -> num_rows > 0;
        $stmt-> close();
        return $row;

    }
}
?>