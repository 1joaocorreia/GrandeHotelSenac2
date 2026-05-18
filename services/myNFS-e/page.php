<?php
/* CONFIGURABLE */
// ==============================================
$info_json = __DIR__ . "/info.json";
// ==============================================

$_nfse_success = true;
$_nfse_message = "";

if (! file_exists($info_json)) {
	$_nfse_success = false;
	$_nfse_message = "Config file missing";
	return;
}

$decoded = json_decode(file_get_contents($info_json), true);
if ($decoded == null) {
	$_nfse_success = false;
	$_nfse_message = "Not possible to decode json";
	return;
}
?>

<?php

/* AUXILIAR FUNCTIONS */
// ==============================================
function calcular_iss($servico_obj) {
	return ((float)$servico_obj["base_de_calculo"] * (float)$servico_obj["aliquota"] / 100);
}
function calcular_valor_total($obj) {
	$valor_total=0.0;

	foreach ($obj["body"]["servicos"] as $servico) {
		$valor_total += (float)$servico["base_de_calculo"] + (float)calcular_iss($servico);
	}

	return (float)$valor_total;
}
// ==============================================
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nota Fiscal de Serviço Eletrônica</title>
    <link rel="stylesheet" href="http://grandehotelsenac2.com/services/myNFS-e/style.css"></link>
</head>
<body>
    <div id="main-field">
        <div id="nfse-header">
        	<div id="nfse-header-logo">
	            <img src="http://grandehotelsenac2.com/services/myNFS-e/data/hotel_logo.png" alt="Logo do Grande Hotel Senac" id="logo">
	            <h1 style="font-size: 14px; text-align: center;">Grande Hotel Senac</h1>
            </div>
            <h1 style="font-size: 28px; margin-left: 2rem; margin-right: 2rem; border: 1px dashed black; padding: 4rem; background-color: lightgray;">Nota Fiscal de Serviços Eletrônicos</h1>
	        <div id="nfse-header-lateral-info">
	            <div class="row">
	            	<p>Número da Nota</p>
	            	<p><?php echo($decoded["header"]["numero_da_nota"]) ?></p>
	            </div>
	            <div class="row">
	            	<p>Data e Hora da Emissão</p>
	            	<p><?php echo($decoded["header"]["data_e_hora_da_emissao"]) ?></p>
	            </div>
	            <div class="row">
	            	<p>Código de Verificação</p>
	            	<p><?php echo($decoded["header"]["codigo_de_verificacao"]) ?></p>
	            </div>
	        </div>
        </div>
        <div id="nfse-body">
        	<div class="row wmargin">
        		<p class="row-title">
					PRESTADOR DE SERVIÇOS
        		</p>
        		<div class="content">
        			<div class="left">
						<p>Nome/Razão Social: <b><?php echo($decoded["body"]["prestador_de_servicos"]["nome_razao_social"]) ?></b></p>
						<p>CPF/CNPJ: <b><?php echo($decoded["body"]["prestador_de_servicos"]["cpf_cpnj"]) ?></b></p>																
        			</div>
        			<div class="right">
						<p>Endereço: <b><?php echo($decoded["body"]["prestador_de_servicos"]["endereco"]) ?></b></p>
						<p>Município: <b><?php echo($decoded["body"]["prestador_de_servicos"]["municipio"]) ?></b></p>
						<p>Inscrição Municipal: <b><?php echo($decoded["body"]["prestador_de_servicos"]["inscricao_municipal"]) ?></b></p>	
        			</div>
        		</div>
        	</div>
        	<div class="row wmargin">
        		<p class="row-title">
					TOMADOR DE SERVIÇOS
        		</p>
        		<div class="content">
        			<div class="left">
						<p>Nome/Razão Social: <b><?php echo($decoded["body"]["tomador_de_servicos"]["nome_razao_social"]) ?></b></p>
						<p>CPF/CNPJ: <b><?php echo($decoded["body"]["tomador_de_servicos"]["cpf_cnpj"]) ?></b></p>																
        			</div>
        			<div class="right">
						<p>Endereço: <b><?php echo($decoded["body"]["tomador_de_servicos"]["endereco"]) ?></b></p>
						<p>Município: <b><?php echo($decoded["body"]["tomador_de_servicos"]["municipio"]) ?></b></p>
						<p>Inscrição Municipal: <b><?php echo($decoded["body"]["tomador_de_servicos"]["inscricao_municipal"]) ?></b></p>	
        			</div>
        		</div>
        	</div>
        	<div class="row-service-discrimination wmargin">
        		<p class="row-title">
					DISCRIMINAÇÃO DOS SERVIÇOS
        		</p>
        		<div class="content">
        			<?php
						foreach ($decoded["body"]["discriminacao_servicos"] as $paragrafo) {
							echo("<p>$paragrafo</p>");
						}
        			?>
	       		</div>
        	</div>
        	<h1 style="margin: auto; margin-top: 10px; margin-bottom: 10px; font-size: 24px;">VALOR TOTAL DA NOTA = R$<?php echo(calcular_valor_total($decoded)) ?></h1>
        	<div class="row wmargin" id="tax-field">
        		<div class="content">
        		<?php
        			foreach ($decoded["body"]["servicos"] as $servico_prestado) {
	        			echo("<div class=\"margin-y-30\">
		        			<div class=\"row\">
		        				<p class=\"row-title\">Código da Atividade:</p>
		        				<p><b>" . $servico_prestado["codigo"] . "</b></p>
		        			</div>
		        			<div class=\"horizontal-container\">
			        			<div class=\"tax-row\">
									<p class=\"row-title ctext\">Valor total das reduções (R$)</p>
									<p class=\"rtext\">" . $servico_prestado["valor_total_das_reducoes"] . "</p>
			        			</div>
			        			<div class=\"tax-row\">
									<p class=\"row-title ctext\">Base de cálculo (R$)</p>
									<p class=\"rtext\">" . $servico_prestado["base_de_calculo"] . "</p>
			        			</div>
			        			<div class=\"tax-row\">
									<p class=\"row-title ctext\">Alíquota (%)</p>
									<p class=\"rtext\">" . $servico_prestado["aliquota"] . "</p>
			        			</div>
			        			<div class=\"tax-row\">
			        				<p class=\"row-title ctext\">Valor do ISS (R$)</p>
			        				<p class=\"rtext\">" . calcular_iss($servico_prestado) . "</p>
			        			</div>
			        			<div class=\"tax-row\">
			        				<p class=\"row-title ctext\">Cŕedito p/Abatimento do IPTU</p>
			        				<p class=\"rtext\">" . $servico_prestado["credito_abatimento_iptu"] . "</p>
			        			</div>
		        			</div>
	        			</div>");
        			}
        		?>
        		</div>
        	</div>
        </div>
    </div>
</body>
</html>
