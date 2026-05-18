<?php

require_once __DIR__ . "/../models/NfseModel.php";
require_once __DIR__ . "/../models/ClientModel.php";
require_once __DIR__ . "/../models/EnderecoModel.php";
require_once __DIR__ . "/../models/ReserveModel.php";
require_once __DIR__ . "/../models/HistoryModel.php";
require_once __DIR__ . "/../models/RoomModel.php";

class NfseController {
	
	private static function generateDiscrimination($nfseRow) {
		global $conn;

		$quartoBracket = substr($nfseRow["servico_consumido"], strpos($nfseRow["servico_consumido"], "[") + 1, strpos($nfseRow["servico_consumido"], "]"));
        $quartoId = explode("=", $quartoBracket)[1];

		$reservationQuery = HistoryModel::getReservationHistoryByClientIdAndRoomId($conn, $nfseRow["tomador_servico"], $quartoId);
        if (! isset($reservationQuery) || $reservationQuery === false) {
            return null;
        }
        
        $clienteQuery = ClientModel::getById($conn, $nfseRow["tomador_servico"]);
        if (! isset($clienteQuery) || $clienteQuery === false) {
            return null;
        }
        $quartoQuery = RoomModel::getById($conn, $quartoId);
        if (! isset($quartoQuery) || $quartoQuery === false) {
            return null;
        }
        $inicio = new DateTime($reservationQuery["checkin"]);
		$fim = new DateTime($reservationQuery["checkout"]);
		$diferenca = $inicio->diff($fim)->days;

        return "O tomador de serviços alugou o quarto número < " . $quartoQuery["numero"] .  " > por $diferenca dias, à R$ " . $quartoQuery["preco"] . " por dia.";
    }
	
	private static function generateService($nfseRow) {
        global $conn;
        $quartoBracket = substr($nfseRow["servico_consumido"], strpos($nfseRow["servico_consumido"], "[") + 1, strpos($nfseRow["servico_consumido"], "]"));
        $quartoId = explode("=", $quartoBracket)[1];

        $reservationQuery = HistoryModel::getReservationHistoryByClientIdAndRoomId($conn, $nfseRow["tomador_servico"], $quartoId);
        if (! isset($reservationQuery) || $reservationQuery === false) {
            return null;
        }

        $quartoQuery = RoomModel::getById($conn, $quartoId);
        if (! isset($quartoQuery) || $quartoQuery === false) {
            return null;
        }

        $dataInicio = new DateTime($reservationQuery["checkin"]);
        $dataFinal = new DateTime($reservationQuery["checkout"]);
        $diferenca = $dataInicio->diff($dataFinal);
        $diferencaDias = $diferenca->days;
        
        $cost = ((int)$quartoQuery["preco"]) * $diferencaDias;

        $servicesObj = [
			"codigo" => "ALUGUEL DE QUARTO",
            "valor_total_das_reducoes" => 0,
            "base_de_calculo" => $cost,
            "aliquota" => 5,
            "credito_abatimento_iptu" => 0
        ];

        return $servicesObj;
    }

	private static function generateTemplateJson($dbNfseRow) {
		
    	global $conn;
		$tomadorServicos = ClientModel::getById($conn, $dbNfseRow["tomador_servico"]);
		if ($tomadorServicos === false) {
            return jsonResponse([
                "status" => "error",
                "message" => "Tomador de serviços não encontrado no banco de dados"
            ], 404);
        }
		
		$_endereco = EnderecoModel::getEnderecoById($conn, $tomadorServicos["endereco"]);
		
		$endereco = (!isset($_endereco)) ? "xxxxxxxxxxxxxxx" : $_endereco["bairro"] . "/" . $_endereco["rua"] . " - " . $_endereco["complemento"] . ", " . $_endereco["numero"];
        $municipio = (!isset($_endereco)) ? "xxxxxxxxxxxxxxx" : $_endereco["cidade"] . "/" . $_endereco["estado"];

		$infoObj = [
            "header" => [
                "numero_da_nota" => $dbNfseRow["numero_nota"],
                "data_e_hora_da_emissao" => $dbNfseRow["data_e_hora"],
                "codigo_de_verificacao" => $dbNfseRow["codigo_verificacao"]
            ],
            "body" => [
				"prestador_de_servicos" => [
                    "nome_razao_social" => "GRANDE HOTEL SENAC HOTELARIA & SERVIÇOS",
                    "cpf_cpnj" => "000.000.000.00/0000",
                    "endereco" => "xxx xxxxxxxxxx xxxxxxxxxx xxxxxx xx",
      				"municipio" => "xxxxxxx",
      				"inscricao_municipal" => "xxxxxxxxxxxxxxxxxxxxx"
                ],
                "tomador_de_servicos" => [
                    "nome_razao_social" => $tomadorServicos["nome"],
                    "cpf_cnpj" => $tomadorServicos["cpf"],
                    "endereco" => $endereco,
                    "municipio"=> $municipio,
                    "inscricao_municipal" => "-------------------------"
                ],
                "discriminacao_servicos" => [
                    NfseController::generateDiscrimination($dbNfseRow)
                ],
                "servicos" => [
					NfseController::generateService($dbNfseRow)
                ]
            ]
        ];

		if (file_put_contents(
            (__DIR__ . "/../services/myNFS-e/info.json"),
            json_encode($infoObj)
        ) === false) {
            return false;
        }

        return true;
    }
	
    private static function render() {
        ob_start();
        require __DIR__ . "/../services/myNFS-e/page.php";
        $output = ob_get_clean();
        if ($output === false) {
            return jsonResponse([
                "status" => "error",
                "message" => "Falha ao renderizar a NFS-e"
            ], 500);
        }
        echo($output);
        exit;
    }
	
	public static function renderNfseByQuartoId($conn, $clientId, $quartoId) {
		
		if (! isset($clientId) || ! isset($quartoId)) {
            return jsonResponse([
                "status" => "error",
                "message" => "Erro interno no servidor"
            ], 500);
        }
		
		$query = NfseModel::getNfseByClientAndService($conn, $clientId, "quartos[id=$quartoId]");
		if (! isset($query) || $query === false) {
            return jsonResponse([
                "status" => "error",
                "message" => "Nenhuma nota fiscal para esse serviço foi encontrada no registro desse usuário"
            ], 404);
        }
		
		if (NfseController::generateTemplateJson($query)) {
            NfseController::render();
            exit(0);
        } else {
            return jsonResponse([
                "status" => "error",
                "message" => "Erro interno no servidor"
            ], 500);
        }
    }

}

?>