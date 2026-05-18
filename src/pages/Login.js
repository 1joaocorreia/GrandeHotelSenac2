import { loginRequest, saveToken, getCurrentUser } from "../api/authAPI.js";
import Form from "../components/Form.js";
import Navbar from "../components/Navbar.js";
import Footer from "../components/Footer.js";
import { showModal } from "../components/Modal.js";

export default function renderLoginPage() {
    const nav = document.getElementById('navbar');
    nav.innerHTML = '';

    const navbar = Navbar();
    nav.appendChild(navbar);

    const formulario = Form();
    const contentForm = formulario.querySelector('form');

    const linkVoltar = document.createElement('a');
    linkVoltar.textContent = "Não possui uma conta? Crie uma!";
    linkVoltar.href = '/register';
    linkVoltar.style.textAlign = 'center';
    linkVoltar.style.fontSize = '16px';
    linkVoltar.style.padding = '15px';
    linkVoltar.style.display = 'block';
    linkVoltar.style.textDecoration = 'none';
    linkVoltar.style.color = '#111111';

    const tabsContainer = document.createElement('div');
    tabsContainer.style.display = 'flex';
    tabsContainer.style.width = '100%';
    tabsContainer.style.marginBottom = '20px';
    tabsContainer.style.gap = '0';

    const btnCliente = document.createElement('button');
    btnCliente.textContent = 'Cliente';
    btnCliente.type = 'button';
    btnCliente.style.flex = '1';
    btnCliente.style.padding = '12px 0';
    btnCliente.style.fontSize = '16px';
    btnCliente.style.fontWeight = '600';
    btnCliente.style.background = '#f8f9fa';
    btnCliente.style.border = 'none';
    btnCliente.style.borderBottom = '2px solid #dee2e6';
    btnCliente.style.cursor = 'pointer';
    btnCliente.style.transition = 'all 0.3s ease';

    const btnFuncionario = document.createElement('button');
    btnFuncionario.textContent = 'Funcionário';
    btnFuncionario.type = 'button';
    btnFuncionario.style.flex = '1';
    btnFuncionario.style.padding = '12px 0';
    btnFuncionario.style.fontSize = '16px';
    btnFuncionario.style.fontWeight = '600';
    btnFuncionario.style.background = '#f8f9fa';
    btnFuncionario.style.border = 'none';
    btnFuncionario.style.borderBottom = '2px solid #dee2e6';
    btnFuncionario.style.cursor = 'pointer';
    btnFuncionario.style.transition = 'all 0.3s ease';

    contentForm.insertBefore(tabsContainer, contentForm.firstChild);
    tabsContainer.appendChild(btnCliente);
    tabsContainer.appendChild(btnFuncionario);

    const inputEmail = contentForm.querySelector('input[type="email"]');
    const inputSenha = contentForm.querySelector('input[type="password"]');

    let tipoLogin = 'client';

    function updateActiveTab(activeBtn, inactiveBtn, tipo) {
        activeBtn.style.background = '#ffffff';
        activeBtn.style.color = '#9DA16F';
        activeBtn.style.borderBottom = '2px solid #9DA16F';

        inactiveBtn.style.background = '#f8f9fa';
        inactiveBtn.style.color = '#6c757d';
        inactiveBtn.style.borderBottom = '2px solid #dee2e6';

        tipoLogin = tipo;
        linkVoltar.style.display = tipo === 'client' ? 'block' : 'none';
    }

    updateActiveTab(btnCliente, btnFuncionario, 'client');

    btnCliente.addEventListener('click', () => {
        updateActiveTab(btnCliente, btnFuncionario, 'client');
    });

    btnFuncionario.addEventListener('click', () => {
        updateActiveTab(btnFuncionario, btnCliente, 'user');
    });

    contentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = inputEmail.value.trim();
        const senha = inputSenha.value.trim();

        if (!email || !senha) {
            showModal("Campos obrigatórios", "Por favor, preencha todos os campos.");
            return;
        }

        try {
            const result = await loginRequest(email, senha, tipoLogin);

            if (result.ok && result.token) {
                saveToken(result.token);
                const current = getCurrentUser();
                const nome = current && current.nome ? current.nome.split(" ")[0] : "";
                showModal("Login realizado", nome ? "Bem-vindo, " + nome + "!" : "Login realizado com sucesso.");
                setTimeout(function () {
                    const redirect = sessionStorage.getItem("redirectAfterLogin");
                    if (redirect) {
                        sessionStorage.removeItem("redirectAfterLogin");
                        window.location.href = "/redirect";   // ex: "cart"
                    } else {
                        window.location.href = "/home";
                    }
                }, 800);
            } else {
                const mensagem = result && result.message ? result.message : "Erro ao realizar login.";
                showModal("Erro no login", mensagem);
            }

        } catch (error) {
            showModal("Erro de conexão", "Não foi possível conectar ao servidor. Tente novamente.");
        }
    });

    contentForm.insertBefore(linkVoltar, contentForm.children[3]);

    const footer = document.getElementById('footer');
    footer.innerHTML = '';

    const footers = Footer();
    footer.appendChild(footers);
}