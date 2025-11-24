<?php
require_once __DIR__ . "/../controllers/ReserveController.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET'){

    $pedido_id =  $segments[2] ?? null;

        if (isset($fk_pedidos)) {
        ReserveController::searchByRequest($conn, $pedido_id);    
    } else {
        jsonResponse(["message"=>"Atributos Invalidos!"], 400);
    }

}elseif ($_SERVER['REQUEST_METHOD'] === "POST"){  
    $pedido_id =  $segments[2] ?? null;
    $data = json_decode(file_get_contents('php://input'), true);
    
    if(isset($data)){
        ReserveController::createOrder($conn, $data);
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