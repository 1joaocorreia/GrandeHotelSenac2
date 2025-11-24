<?php
require_once 'config.php';

$errorDB = false;

try{
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if($conn->connect_error){
        $errorDB = true;
    }

}catch(mysqli_sql_exception $erro){
    $errorDB = true;
}
?>