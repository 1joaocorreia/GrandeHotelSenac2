<?php
require_once __DIR__ . "/../models/RoomModel.php";
require_once __DIR__ . "/../models/ImgModel.php";
require_once "ValidateController.php";
require_once "ImgController.php";

class RoomController{

    public static function create($conn, $data){
        ValidateController::validateData($data, ["nome", "numero", "qnt_cama_casal", "qnt_cama_solteiro", "preco", "disponivel"]);

        $result = RoomModel::create($conn, $data);
        if ($result){
            if ($data['fotos']){
                $pictures = ImgController::upload($data['fotos']);
                foreach($pictures['saves'] as $name){
                    $idPhoto = ImgModel::create($conn, $name['name']);
                    if($idPhoto){
                        ImgModel::createRelationRoom($conn, $result, $idPhoto);
                    }
                }
            }
            return jsonResponse(['message'=> 'criado', 'id' => $result]);
        }else{
            return jsonResponse(['message'=> 'Erro ao criar quarto'], 400);
        }
    }
    
    public static function listAll($conn){
        $roomList = RoomModel::getAll($conn);
        return jsonResponse($roomList);
    }

    public static function getById($conn, $id){
        $result = RoomModel::getById($conn, $id);
        jsonResponse($result);
    }

    public static function delete($conn, $id){
        $result = RoomModel::delete($conn, $id);
        if($result){
            jsonResponse(['message'=> 'deletado']);
        }else{
            jsonResponse(['message'=> 'Erro ao deletar'], 400);
        }
    }

    public static function update($conn, $id, $data){
        ValidateController::validateData($data, ["nome", "numero", "qnt_cama_casal", "qnt_cama_solteiro", "preco", "disponivel"]);
        $result = RoomModel::update($conn, $id, $data);
        if($result){
            jsonResponse(['message'=> 'atualizado']);
        }else{
            jsonResponse(['message'=> 'Erro ao atualizar'], 400);
        }
    }

    public static function searchAvailable($conn, $data){
        ValidateController::validateData($data, ["inicio", "fim", "capacidadeTotal"]);

        $data['inicio'] = ValidateController::timeInsert($data['inicio'], 14);
        $data['fim'] = ValidateController::timeInsert($data['fim'], 12);
        
        $result = RoomModel::searchAvailable($conn, $data);
        if($result){
            foreach($result as &$quarto){
                $quarto['fotos'] = ImgModel::getByRoomId($conn, $quarto['id']);
            }
            jsonResponse(['Quartos'=> $result]);
        }else{
            jsonResponse(['message'=> 'Nenhum quarto disponível encontrado'], 400);
        }
    }
}
?>