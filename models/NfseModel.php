<?php

class NfseModel {
	
	public static function getNfseByClientAndService($conn, $clientId, $servico) {

		$sql = "SELECT * FROM notas_fiscais WHERE tomador_servico = ? AND servico_consumido = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("is", $clientId, $servico);
		$stmt->execute();
		return $stmt->get_result()->fetch_assoc();
	}

}

?>