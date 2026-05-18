<?php
require_once __DIR__ . "/../../controllers/ClientController.php";

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
	$id =  $segments[2] ?? null;
    if (! isset($id)) {
        return jsonResponse([
            "status" => "error",
            "message" => "ID faltando"
        ], 400);
    }
	$data = json_decode(file_get_contents('php://input'), true);
    $valid = false;
    foreach ($data as $key => $value) {
        if (in_array($key, ["id", "nome", "email", "telefone", "endereco", "cpf", "senha"])) {
            $valid = true;
        } else {
            $valid = false;
        }
		if (! $valid) {
            return jsonResponse([
                "status" => "error",
                "message" => "Campo invalido para alteração"
            ], 403);
        }
    }
    
	ClientController::updateInterpret($conn, $data, "id = ?", $id);

}
else{
    jsonResponse([
    "status"=> "error",
    "message"=> "metodo nao premitiodo"
    ], 405);
}
?>