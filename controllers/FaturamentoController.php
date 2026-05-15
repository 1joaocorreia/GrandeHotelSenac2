<?php

require_once __DIR__ . "/../models/FaturamentoModel.php";

class FaturamentoController {

    public static function getDadosFaturamentoByClientId($conn, $clientId) {
        if (! isset($conn) || ! isset($clientId)) {return null;}
        $query = FaturamentoModel::getDadosFaturamentoByClientId($conn, $clientId);
        return $query;
    }

}

?>