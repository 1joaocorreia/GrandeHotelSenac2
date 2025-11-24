<?php
require_once __DIR__ . "/../controllers/ClientController.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET'){
    $id =  $segments[2] ?? null;
    
    if(isset($id)){
        ClientController::getById($conn, $id);
    }else{
        ClientController::listAll($conn);
    }


}elseif ($_SERVER['REQUEST_METHOD'] === "DELETE"){
    validateTokenAPI('ADM');

    $data = json_decode(file_get_contents('php://input'), true);
    $id =  $data['id'];
    
    if(isset($id)){
        ClientController::delete($conn, $id);
    }else{
        jsonResponse(['message'=>"ID necessario"], 400);
    }


}elseif ($_SERVER['REQUEST_METHOD'] === "POST"){  
    $data = json_decode(file_get_contents('php://input'), true);
    
    if(isset($data)){
        ClientController::create($conn, $data);
    }else{
        jsonResponse(['message'=>"Atributos invalidos"], 400);
    }
    

}elseif ($_SERVER['REQUEST_METHOD'] === "PUT"){  
    validateTokenAPI('ADM');
    $data = json_decode(file_get_contents('php://input'), true);
    $id =  $data['id'];
    
    if(isset($data)){
        ClientController::update($conn, $id, $data);
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