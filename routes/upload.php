<?php
require_once __DIR__ . "/../controllers/ImgController.php";

if ( $_SERVER['REQUEST_METHOD'] === "POST" ){
    $data = $_FILES['fotos'] ?? null;
    ImgController::upload($data);
}

else{
    jsonResponse(['status'=>'erro','message'=>'Método não permitido'], 405);
}

?>