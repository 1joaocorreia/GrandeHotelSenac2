<?php

require_once __DIR__ ."/../controllers/PassController.php";

class UserModel{

    public static function UserValidation($conn,$email,$pass){
        
        $sql = "SELECT usuarios.id, usuarios.email, usuarios.senha, usuarios.nome, cargos.nome AS cargo 
        FROM usuarios JOIN cargos ON usuarios.cargo_id = cargos.id WHERE usuarios.email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

    

        if($user = $result->fetch_assoc()){
            
            if(PassController::validateHash($pass, $user['senha'])){ 
                unset($user['senha']);
                return $user;
            }
            
        }
        return false;
    }
}
?>