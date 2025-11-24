<?php
require_once __DIR__ . "/../models/AddonsModel.php";
require_once "ValidateController.php";

    class AddonsController{
        public static function create($conn, $data){

            ValidateController::validateData($data,['nome', 'preco']);
            $result = AddonsModel::create($conn, $data);
            if($result){
                return jsonResponse(['message'=> 'criado']);
            }else{
            return jsonResponse(['message'=> 'Ocorreu um erro ao procesar a operação.'], 400);            }
        }
        
        public static function listAll($conn) {
            $addonsList = AddonsModel::getAll($conn);
            return jsonResponse($addonsList);
        }

        public static function getById($conn, $id) {
            $result = AddonsModel::getById($conn, $id);
            return jsonResponse($result);
        }

        public static function delete($conn, $id){
            $result = AddonsModel::delete($conn, $id);
            if($result){
                return jsonResponse(['message'=> 'deletado']);
            }else{
            return jsonResponse(['message'=> ''], 400);
            }
        }

        public static function update($conn, $id, $data){
            ValidateController::validateData($data,['id', 'nome', 'preco']);
            $result = AddonsModel::update($conn, $id, $data);
            if($result){
                return jsonResponse(['message'=> 'atualizado']);
            }else{
                return jsonResponse(['message'=> 'Ocorreu um erro ao procesar a operação.'], 400);            }
        }
}
?>