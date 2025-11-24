<?php
require_once __DIR__ . "/../controllers/RequestController.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET'){
    $id =  $segments[2] ?? null;
    
    if(isset($id)){
        RequestController::getById($conn, $id);
    }else{
        RequestController::listAll($conn);
    }


}elseif ($_SERVER['REQUEST_METHOD'] === "POST"){
    $user = validateTokenAPI('cliente');

    $data = json_decode(file_get_contents('php://input'), true);
    $opcao = $segments[2] ?? null;
    $data['cliente_id'] = $user['id'];

    if ($opcao == "reservation"){
        RequestController::createOrder($conn, $data);

    }elseif($opcao == null){
        RequestController::create($conn, $data);

    }else{
        jsonResponse(['message'=>"Atributos invalidos"], 400);
    }
       
}elseif ($_SERVER['REQUEST_METHOD'] === "DELETE"){
    $data = json_decode(file_get_contents('php://input'), true);
    $id =  $data['id'];
    
    if(isset($id)){
        RequestController::delete($conn, $id);
    }else{
        jsonResponse(['message'=>"ID necessario"], 400);
    }
}elseif ($_SERVER['REQUEST_METHOD'] === "PUT"){  
    $data = json_decode(file_get_contents('php://input'), true);
    $id =  $data['id'];
    
    if(isset($data)){
        RequestController::update($conn, $id, $data);
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