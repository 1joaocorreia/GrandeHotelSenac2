<?php
require_once __DIR__ . "/../models/RequestModel.php";
require_once __DIR__ . "/ValidateController.php";

class RequestController{
    public static function create($conn, $data){
        $result = RequestModel::create($conn, $data);
        
        ValidateController::validateData($data, ['pagamento, quartos']);
        if($result){
            return jsonResponse(['message'=> 'criado']);
        }else{
        return jsonResponse(['message'=> 'Ocorreu um erro ao procesar a operação.'], 400);        }
    }
    
    public static function listAll($conn) {
        $requestList = RequestModel::getAll($conn);
        return jsonResponse($requestList);
    }

    public static function getById($conn, $id) {
        $result = RequestModel::getById($conn, $id);
        return jsonResponse($result);
    }

    public static function delete($conn, $id){
        $result = RequestModel::delete($conn, $id);
        if($result){
            return jsonResponse(['message'=> 'deletado']);
        }else{
        return jsonResponse(['message'=> ''], 400);
        }
    }

    public static function update($conn, $id, $data){
        $result = RequestModel::update($conn, $id, $data);
        if($result){
            return jsonResponse(['message'=> 'atualizado']);
        }else{
            return jsonResponse(['message'=> 'Não atualizou'], 400);
        }
    }

public static function createOrder($conn, $data){
    $data['usuario_id'] = isset($data['usuario_id']) ? $data['usuario_id'] : null;

    ValidateController::validateData($data, ['cliente_id', 'pagamento', 'quartos']);       
    
    foreach ($data['quartos'] as $index => $quarto) {
        ValidateController::validateData($quarto, ['id', 'inicio', 'fim']);

        $data['quartos'][$index]['inicio'] = ValidateController::timeInsert($quarto['inicio'], 14);
        $data['quartos'][$index]['fim']    = ValidateController::timeInsert($quarto['fim'], 12);
    }

    if (count($data['quartos']) == 0) {
        return jsonResponse(["message" => "nao tem quartos no pedido"], 400);
    }

    try {
        $result = RequestModel::createOrder($conn, $data);
        return jsonResponse($result);

    } catch (RuntimeException $erro) {
        return jsonResponse(['message' => $erro->getMessage()], 400);
    }
}

    
}
?>