<?php
    require_once __DIR__ . "/../controllers/AuthController.php";
    require_once __DIR__ . "/../helpers/token_jwt.php";

    if ($_SERVER['REQUEST_METHOD'] === "POST") {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;
        $tipo = $data['tipo'] ?? null;
        
        if (!$email || !$password) {
            jsonResponse([
                "status" => "error",
                "message" => "Email e senha são obrigatórios"
            ], 400);
            exit;
        }

        if($tipo === "client"){
            $check = AuthController::loginClient($conn, $data);
            
            if($check !== false && $check !== null){
                jsonResponse([
                    "status" => "success",
                    "token" => $check,
                    "message" => "Login de cliente bem-sucedido"
                ], 200);
                exit;
            }
        }
        
        $check = AuthController::loginUser($conn, $data);
        
        if($check !== false && $check !== null){
            jsonResponse([
                "status" => "success", 
                "token" => $check,
                "message" => "Login de usuário bem-sucedido"
            ], 200);
        } else {
            jsonResponse([
                "status" => "error",
                "message" => "Credenciais inválidas"
            ], 401);
        }
        
    } else {
        jsonResponse([
            "status" => "error",
            "message" => "Método não permitido"
        ], 405);
    }
?>