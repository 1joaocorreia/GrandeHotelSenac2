<?php
class ClientModel{
    public static function create($conn, $data) {
        $sql = "INSERT INTO clientes (nome, email, telefone, cpf, senha) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssss",
            $data["nome"],
            $data["email"],
            $data["telefone"],
            $data["cpf"],
            $data["senha"]
        );
        return $stmt->execute();
    }

    public static function getAll($conn) {
        $sql = "SELECT id, nome, email, telefone, cpf, cargo_id FROM clientes";
        $result = $conn->query($sql);
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public static function getById($conn, $id) {
        $sql = "SELECT id, nome, email, telefone, endereco, cpf, cargo_id FROM clientes WHERE id= ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public static function delete($conn, $id) {
        $sql = "DELETE FROM clientes WHERE id= ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    public static function update($conn ,$id ,$data) {
        $sql = "UPDATE clientes SET nome=?, email=?, telefone=?, cpf=?, senha=? WHERE id= ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssssi",
            $data["nome"],
            $data["email"],
            $data["telefone"],
            $data["cpf"],
            $data["senha"],
            $id
        );
        return $stmt->execute();
    }

    public static function updateSingle($conn, $column, $data, $cond, $condval) {
        $sql = "UPDATE clientes SET $column = ? WHERE $cond";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $data, $condval);
        return $stmt->execute();
    }

    public static function ClientValidation($conn,$email,$pass){
        
        $sql = "SELECT clientes.id, clientes.email, clientes.senha, clientes.nome, cargos.nome AS cargo 
        FROM clientes JOIN cargos ON clientes.cargo_id = cargos.id WHERE clientes.email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($client = $result->fetch_assoc()){
            
            if(PassController::validateHash($pass, $client['senha'])){ 
                unset($client['senha']);
                return $client;  
            }
        return false;
        }
    }
}
?>