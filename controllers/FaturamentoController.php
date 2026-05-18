<?php

require_once __DIR__ . "/../models/FaturamentoModel.php";

class FaturamentoController {

    public static function getDadosFaturamentoByClientId($conn, $clientId) {
        if (! isset($conn) || ! isset($clientId)) {return null;}
        $query = FaturamentoModel::getDadosFaturamentoByClientId($conn, $clientId);
        return $query;
    }
	
	public static function updateInterpret($conn, $data, $cond, $condval) {

		if (! isset($conn) || ! isset($data) || ! isset($cond) || ! isset($condval)) {
            return jsonResponse([
                "status" => "error",
                "message" => "Erro interno no servidor"
            ], 500);
        }
		
		foreach ($data as $column => $value) {

			if (FaturamentoModel::updateSingle($conn, $column, $value, $cond, $condval) === false) {
                return jsonResponse([
                    "status" => "error",
                    "message" => "Não foi possivel atualizar a coluna $column"
                ], 500);
            }
        }

        return jsonResponse([
            "status" => "success",
            "message" => "Dados alterados com sucesso"
        ], 200);

    }

}

?>