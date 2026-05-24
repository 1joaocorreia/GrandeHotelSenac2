<?php

require_once __DIR__ . "/../helpers/response.php";
require_once __DIR__ . "/../models/ClientModel.php";
require_once __DIR__ . "/../models/EnderecoModel.php";

class EnderecoController {
    public static function getEnderecoById($conn, $enderecoId) {
        if (! isset($conn) || ! isset($enderecoId)) {
            return jsonResponse([
                "status" => "error",
                "message" => "Uma falha interna ocorreu."
            ], 500);
        }
        $enderecoQuery = EnderecoModel::getEnderecoById($conn, $enderecoId);
        if (! isset($enderecoQuery) || $enderecoQuery === false) {
            return jsonResponse([
                "status" => "error",
                "message" => "Endereço não encontrado"
            ], 404);
        }
        return jsonResponse($enderecoQuery, 200);
    }
    public static function getEnderecoByClientId($conn, $clientId) {

        if (! isset($conn) || ! isset($clientId)) {
            return jsonResponse([
                "status" => "error",
                "message" => "Falha interna no servidor. Não foi possível processar o pedido."
            ], 500);
        }

        $clientQuery = ClientModel::getById($conn, $clientId);
        if (! isset($clientQuery) || $clientQuery === false) {
            return jsonResponse([
                "status" => "error",
                "message" => "Cliente não encontrado."
            ], 404);
        }

        $enderecoQuery = EnderecoModel::getEnderecoById($conn, $clientQuery["endereco"]);
        if (! isset($enderecoQuery) || $enderecoQuery === false) {
            return jsonResponse([
                "status" => "error",
                "message" => "Endereço não encontrado"
            ], 404);
        }
        
        return jsonResponse($enderecoQuery, 200);

    }
    public static function getEnderecoByCep($conn, $cep) {

        if (! isset($conn) || ! isset($cep)) {
            return jsonResponse([
                "status" => "error",
                "message" => "Erro interno no servidor"
            ], 500);
        }

        $enderecoQuery = EnderecoModel::getEnderecoByCep($conn, $cep);
        if (! isset($enderecoQuery)) {
            return jsonResponse([
                "status" => "erorr",
                "message" => "Nenhum endereço encontrado com o cep: $cep"
            ], 404);
        }
		
		return jsonResponse($enderecoQuery, 200);

    }
}

?>