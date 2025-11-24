<?php
require_once __DIR__ . "/../models/UserModel.php";
require_once __DIR__ . "/../models/ClientModel.php";
require_once "PassController.php";
require_once __DIR__ . "/../helpers/token_jwt.php";

class AuthController{
    public static function loginUser($conn, $data) {
        $data['email'] = trim($data['email']);
        $data['password'] = trim($data['password']);
 
        if (empty($data['email']) || empty($data['password'])) {
            return jsonResponse([
                "status" => "erro",
                "message" => "Preencha todos os campos!"
            ], 401);
        }
 
        $user = UserModel::UserValidation($conn, $data['email'], $data['password']);

        if ($user) {
            $token = createToken($user);
            return jsonResponse([ "token" => $token ]);
        } else {
            return jsonResponse([
                "status" => "erro",
                "message" => "Credenciais inválidas!"
            ], 401);
        }
    }

    public static function loginClient($conn, $data) {
    
        $data['email'] = trim($data['email']);
        $data['password'] = trim($data['password']);

        if (empty($data['email']) || empty($data['password'])) {
            return jsonResponse([
                "status" => "erro",
                "message" => "Preencha todos os campos!"
            ], 401);
        }

        $client = ClientModel::ClientValidation($conn, $data['email'], $data['password']);
        if ($client) {
            $token = createToken($client);
            return jsonResponse([ "token" => $token ]);
        } else {
            return jsonResponse([
                "status" => "erro",
                "message" => "Credenciais inválidas!"
            ], 401);
        }
    }
}