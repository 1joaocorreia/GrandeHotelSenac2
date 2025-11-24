<?php
require_once __DIR__ . "/../models/ReserveModel.php";
require_once __DIR__ . "/../models/RequestModel.php";
require_once __DIR__ . "/ValidateController.php";
require_once __DIR__ . "/RequestController.php";

class ReserveController{
    public static function create($conn, $data) {

        foreach($data['quartos'] as $quartos){
            $quartos['inicio'] = ValidateController::timeInsert($quartos['inicio'], 14);
            $quartos['fim'] = ValidateController::timeInsert($quartos['fim'], 12);
        }

        $result = ReserveModel::create($conn, $data);

        if ($result) {
            return jsonResponse(['message' => 'Reserva criada com sucesso']);
        } else {
            return jsonResponse(['message' => 'Erro inesperado'], 400);
        }
    }

    public static function searchByRequest($conn, $fk_pedidos) {
        $reservation = ReserveModel::searchByRequest($conn, $fk_pedidos);
        return jsonResponse($reservation);
    }

    public static function isReserved($conn, $id, $inicio, $fim) {
        $inicio = ValidateController::timeInsert($inicio, 14);
        $fim = ValidateController::timeInsert($fim, 12);

        $isReserved = ReserveModel::getAvaibleOrder($conn, $id, $inicio, $fim);
        if ($isReserved) {
            return jsonResponse(['message' => 'Existe uma reserva para este quarto neste período.']);
        } else {
            return jsonResponse(['message' => 'Não Existe reserva. O quarto está disponível.']);
        }
    } 
    public static function createOrder($conn,$data){
        $result = RequestController::createOrder($conn, $data);
    }
}
?>