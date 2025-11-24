<?php
require_once __DIR__ . "/../controllers/AddonsController.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET'){
    $id =  $segments[2] ?? null;
    
    if(isset($id)){
        AddonsController::getById($conn, $id);
    }else{
        AddonsController::listAll($conn);
    }


}elseif ($_SERVER['REQUEST_METHOD'] === "DELETE"){
    validateTokenAPI('func');

    $data = json_decode(file_get_contents('php://input'), true);
    $id =  $data['id'];
    
    if(isset($id)){
        AddonsController::delete($conn, $id);
    }else{
        jsonResponse(['message'=>"ID necessario"], 400);
    }


}elseif ($_SERVER['REQUEST_METHOD'] === "POST"){ 
    validateTokenAPI('func');

    $data = json_decode(file_get_contents('php://input'), true);
    
    if(isset($data)){
        AddonsController::create($conn, $data);
    }else{
        jsonResponse(['message'=>"Atributos invalidos"], 400);
    }
    

}elseif ($_SERVER['REQUEST_METHOD'] === "PUT"){
    validateTokenAPI('func');
    
    $data = json_decode(file_get_contents('php://input'), true);
    $id =  $data['id'];
    
    if(isset($data)){
        AddonsController::update($conn, $id, $data);
    }else{
        jsonResponse(['message'=>"Atributos invalidos"], 400);
    }

    
}
else{
    jsonResponse([
    "status"=> "error",
    "message"=> "metodo nao premitiodo"
    ], 405);
}
?>