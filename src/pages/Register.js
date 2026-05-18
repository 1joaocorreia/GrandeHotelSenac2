import Form from "../components/Form.js";
import Navbar from "../components/Navbar.js";
import Footer from "../components/Footer.js";
import { createClient } from "../api/clientAPI.js";
import { loginRequest, saveToken, getCurrentUser } from "../api/authAPI.js";
import { showModal } from "../components/Modal.js";

export default function renderRegisterPage() {
    const nav = document.getElementById('navbar');
    nav.innerHTML = '';

    const navbar = Navbar();
    nav.appendChild(navbar);

    const formulario = Form();

    const titulo = formulario.querySelector('h1');
    titulo.textContent = "Crie sua conta e já planeje sua próxima viagem";

    const contentForm = formulario.querySelector('form');
    contentForm.innerHTML = '';

    const containerCadastro = document.createElement('div');
    containerCadastro.className = 'containerCadastro';

    contentForm.appendChild(containerCadastro);

    const nome = document.createElement('input');
    nome.type = "text";
    nome.placeholder = "Nome completo";
    nome.className = "InputNome";
    containerCadastro.appendChild(nome);

    const cpf = document.createElement('input');
    cpf.type = "text";
    cpf.placeholder = "CPF";
    cpf.className = "InputCpf";
    containerCadastro.appendChild(cpf);

    const telefone = document.createElement('input');
    telefone.type = "tel";
    telefone.placeholder = "Telefone";
    telefone.className = "InputTelefone";
    containerCadastro.appendChild(telefone);

    const email = document.createElement('input');
    email.type = "email";
    email.placeholder = "E-mail";
    email.className = "InputEmail";
    containerCadastro.appendChild(email);

    const senha = document.createElement('input');
    senha.type = "password";
    senha.placeholder = "Senha";
    senha.className = "InputSenha";
    containerCadastro.appendChild(senha);

    const conSenha = document.createElement('input');
    conSenha.type = "password";
    conSenha.placeholder = "Confirme sua senha";
    conSenha.className = "InputConfirmaSenha";
    containerCadastro.appendChild(conSenha);

    const spanErroSenha = document.createElement('span');
    spanErroSenha.style.display = 'block';
    spanErroSenha.style.marginTop = '4px';
    containerCadastro.appendChild(spanErroSenha);

    const btnCadastro = document.createElement('button');
    btnCadastro.type = 'submit';
    btnCadastro.textContent = 'Cadastrar';
    btnCadastro.className = 'btn btn-primary w-100 mt-3';
    contentForm.appendChild(btnCadastro);

    contentForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const valorNome = nome.value.trim();
        const valorCpf = cpf.value.trim();
        const valorTelefone = telefone.value.trim();
        const valorEmail = email.value.trim();
        const valorSenha = senha.value.trim();
        const valorConfirmaSenha = conSenha.value.trim();

        if (!valorNome || !valorCpf || !valorTelefone || !valorEmail || !valorSenha || !valorConfirmaSenha) {
            showModal("Campos obrigatórios", "Preencha todos os campos para continuar.");
            return;
        }

        if (valorSenha !== valorConfirmaSenha) {
            spanErroSenha.textContent = "As senhas não conferem.";
            spanErroSenha.style.color = "red";
            conSenha.style.borderBottom = "1px solid red";
            showModal("Senhas diferentes", "As senhas informadas não coincidem. Verifique e tente novamente.");
            return;
        }

        spanErroSenha.textContent = "";
        spanErroSenha.style.color = "";
        conSenha.style.borderBottom = "";

        try {
            const result = await createClient(valorNome, valorCpf, valorTelefone, valorEmail, valorSenha);
            if (!result.ok) {
                const mensagem = result && result.message ? result.message : "Erro ao cadastrar.";
                showModal("Erro no cadastro", mensagem);
                return;
            }

            showModal("Cadastro realizado", "Sua conta foi criada com sucesso. Você será autenticado automaticamente.");

            try {
                const loginResult = await loginRequest(valorEmail, valorSenha, "client");
                if (loginResult.ok && loginResult.token) {
                    saveToken(loginResult.token);
                    const current = getCurrentUser();
                    const primeiroNome = current && current.nome ? current.nome.split(" ")[0] : "";
                    const mensagemLogin = primeiroNome ? "Bem-vindo, " + primeiroNome + "!" : "Login realizado com sucesso.";
                    showModal("Login automático realizado", mensagemLogin);
                    setTimeout(function () {
                        const redirect = sessionStorage.getItem("redirectAfterLogin");
                        if (redirect) {
                            sessionStorage.removeItem("redirectAfterLogin");
                            window.location.href = "/redirect";
                        } else {
                            window.location.href = "/home";
                        }
                    }, 800);
                } else {
                    showModal("Atenção", "Cadastro concluído, mas não foi possível fazer o login automático. Tente fazer login manualmente.");
                }

            } catch (e) {
                showModal("Atenção", "Cadastro concluído, mas ocorreu um erro ao tentar fazer login automático. Tente fazer login manualmente.");
            }
        } catch (error) {
            showModal("Erro inesperado", "Ocorreu um erro ao tentar criar seu cadastro. Tente novamente.");
        }
    });

    const footer = document.getElementById('footer');
    footer.innerHTML = '';

    const footers = Footer();
    footer.appendChild(footers);
}