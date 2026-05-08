<?php
require_once "config/database.php";
require_once "helpers/response.php";
require_once "helpers/token_jwt.php";

if ($errorDB) {
    echo "Erro no Site";
    exit;
}

$uri = Strtolower(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$method = $_SERVER['REQUEST_METHOD'];

$baseFolder = Strtolower(basename(dirname(__FILE__)));
$uri = str_replace("/$baseFolder", "", $uri);
$segments = explode("/", trim($uri, "/"));

$route = $segments[0] ?? null;
$subRoute = $segments[1] ?? null;



if ($route != "api"){
    require __DIR__ . "/public/index.html";
    exit;

}elseif($route === "api"){
    if(in_array($subRoute, ["login", "rooms", "client", "addon", "request", "reserve", "upload", "history"])){
        require "routes/${subRoute}.php";

    }else{
    return jsonResponse(['message'=>'rota nao encontrada', 404]); 

    }
    exit;
    
}else{
    echo "404 pagina nao encontrada";
    exit;
};
?>