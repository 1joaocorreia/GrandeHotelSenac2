<?php
/**
 * ===========================================
 *  OBJETIVO:
 *    Este arquivo serve para demonstrar e gerar,
 *    na prática, o HASH BCRYPT de uma senha.
 *
 *  POR QUE ISSO É IMPORTANTE?
 *    - Em sistemas reais, NUNCA devemos salvar a senha
 *      em texto puro no banco de dados.
 *    - O PHP oferece a função password_hash(), que cria
 *      um hash seguro e único para cada senha.
 *    - O back-end do projeto utiliza password_verify()
 *      para comparar a senha digitada com o hash salvo.
 *
 *  QUANDO USAR?
 *    - Sempre que você quiser inserir manualmente um
 *      usuário no banco de dados com uma senha segura.
 *    - Útil para testar login de funcionário ou criar
 *      contas iniciais no sistema.
 *
 *  COMO FUNCIONA?
 *    1. Define uma senha em texto puro (ex.: 123@senac).
 *    2. Usa password_hash() para gerar um hash BCRYPT.
 *    3. Exibe esse hash na tela.
 *    4. Você copia o hash gerado e salva no banco.
 *
 *
 * ===========================================
 */

// Inclui a classe responsável por gerar hash no projeto
require_once 'controllers/PassController.php';

// Defina aqui a senha que deseja testar
$senhaPura = "123@senac";

// Gera o hash utilizando a mesma função usada no sistema
$hash = PassController::generateHash($senhaPura);

// Exibe o resultado
echo "<h3>Senha original:</h3> $senhaPura <br><br>";
echo "<h3>Hash gerado (BCRYPT):</h3> $hash <br><br>";

echo "<p>Copie o hash acima e use em um INSERT ou UPDATE na tabela de usuários.</p>";
?>
