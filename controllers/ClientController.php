<?php
require_once __DIR__ . "/../models/ClientModel.php";
require_once "PassController.php";
require_once "AuthController.php";
require_once __DIR__ . "/../helpers/token_jwt.php";

class ClientController{
    public static function create($conn, $data){
        $passUser = [
            'email'=>$data['email'],
            'password'=>$data['senha']
        ];
        
        $data['senha'] = PassController::generateHash($data['senha']);

        $result = ClientModel::create($conn, $data);

        if($result){

            AuthController::loginClient($conn, $passUser);

        }else{
            return jsonResponse(['message'=> 'Ocorreu um erro ao procesar a operação.'], 400);        }
    }
    
    public static function listAll($conn) {
        $clientList = ClientModel::getAll($conn);
        return jsonResponse($clientList);
    }

    public static function getById($conn, $id) {
        $result = ClientModel::getById($conn, $id);
        return jsonResponse($result);
    }

    public static function delete($conn, $id){
        $result = ClientModel::delete($conn, $id);
        if($result){
            return jsonResponse(['message'=> 'deletado']);
        }else{
        return jsonResponse(['message'=> ''], 400);
        }
    }
    
    public static function update($conn, $id, $data){
        $result = ClientModel::update($conn, $id, $data);
        if($result){
            return jsonResponse(['message'=> 'atualizado']);
        }else{
            return jsonResponse(['message'=> 'Ocorreu um erro ao procesar a operação.'], 400);        }
    }

	public static function updateInterpret($conn, $data, $cond, $condval) {
        if (! isset($conn) || ! isset($data) || ! isset($cond) || ! isset($condval)) {
            return jsonResponse([
                "status" => "error",
                "message" => "Erro interno no servidor"
            ], 500);
        }

		foreach ($data as $column => $value) {

			if (ClientModel::updateSingle($conn, $column, $value, $cond, $condval) === false) {
                return jsonResponse([
                    "status" => "error",
                    "message" => "Não foi possivel atualizar a coluna $column"
                ], 500);
            }

        }
		
		return jsonResponse([
            "status" => "success",
            "message" => "Dados alterados com sucesso"
        ], 200);

    }

}
?>