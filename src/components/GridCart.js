import { removeItemFromHotelCart, getCart, clearHotelCart } from "../store/CartStore.js";
import { finishedOrder } from "../api/reserveAPI.js";
import { getToken, loginRequest, saveToken, getCurrentUser } from "../api/authAPI.js";
import { createClient } from "../api/clientAPI.js";
import { showModal } from "./Modal.js";

function showAuthModal() {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'modal fade show d-block';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';

        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Acesse sua conta</h5>
                        <button type="button" class="btn-close" aria-label="Fechar"></button>
                    </div>
                    <div class="modal-body">
                        <div class="btn-group w-100 mb-3" role="group">
                            <button type="button" class="btn btn-outline-primary active" id="tab-login">
                                Já tenho conta
                            </button>
                            <button type="button" class="btn btn-outline-secondary" id="tab-register">
                                Quero me cadastrar
                            </button>
                        </div>

                        <form id="auth-login-form">
                            <div class="mb-3">
                                <label class="form-label">E-mail</label>
                                <input type="email" class="form-control" id="auth-login-email" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Senha</label>
                                <input type="password" class="form-control" id="auth-login-senha" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Entrar</button>
                        </form>

                        <form id="auth-register-form" style="display:none">
                            <div class="mb-2">
                                <label class="form-label">Nome completo</label>
                                <input type="text" class="form-control" id="auth-reg-nome" required>
                            </div>
                            <div class="mb-2">
                                <label class="form-label">CPF</label>
                                <input type="text" class="form-control" id="auth-reg-cpf" required>
                            </div>
                            <div class="mb-2">
                                <label class="form-label">Telefone</label>
                                <input type="tel" class="form-control" id="auth-reg-telefone" required>
                            </div>
                            <div class="mb-2">
                                <label class="form-label">E-mail</label>
                                <input type="email" class="form-control" id="auth-reg-email" required>
                            </div>
                            <div class="mb-2">
                                <label class="form-label">Senha</label>
                                <input type="password" class="form-control" id="auth-reg-senha" required>
                            </div>
                            <div class="mb-2">
                                <label class="form-label">Confirme a senha</label>
                                <input type="password" class="form-control" id="auth-reg-confirma-senha" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100 mt-2">Criar conta</button>
                        </form>

                        <div id="auth-error" class="text-danger mt-2" style="display:none"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const btnClose = modal.querySelector('.btn-close');
        const tabLogin = modal.querySelector('#tab-login');
        const tabRegister = modal.querySelector('#tab-register');
        const loginForm = modal.querySelector('#auth-login-form');
        const registerForm = modal.querySelector('#auth-register-form');
        const errorBox = modal.querySelector('#auth-error');

        function setError(message) {
            if (!message) {
                errorBox.style.display = 'none';
                errorBox.textContent = '';
            } else {
                errorBox.style.display = 'block';
                errorBox.textContent = message;
            }
        }

        function closeModal(result = false) {
            document.body.removeChild(modal);
            resolve(result);
        }

        tabLogin.addEventListener('click', () => {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            loginForm.style.display = '';
            registerForm.style.display = 'none';
            setError('');
        });

        tabRegister.addEventListener('click', () => {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            loginForm.style.display = 'none';
            registerForm.style.display = '';
            setError('');
        });

        btnClose.addEventListener('click', () => {
            closeModal(false);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(false);
            }
        });

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            setError('');

            const email = modal.querySelector('#auth-login-email').value.trim();
            const senha = modal.querySelector('#auth-login-senha').value.trim();

            if (!email || !senha) {
                setError("Preencha e-mail e senha para continuar.");
                return;
            }

            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = "Entrando...";

            try {
                const result = await loginRequest(email, senha, "client");
                if (result && result.ok && result.token) {
                    saveToken(result.token);
                    const current = getCurrentUser();
                    const nome = current && current.nome ? current.nome.split(" ")[0] : "";
                    showModal("Login realizado", nome ? "Bem-vindo, " + nome + "!" : "Login realizado com sucesso.");
                    closeModal(true);
                } else {
                    const mensagem = result && result.message ? result.message : "Não foi possível fazer login.";
                    setError(mensagem);
                }
            } catch (error) {
                console.error("Erro no login (modal):", error);
                setError("Erro ao tentar fazer login. Tente novamente.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = "Entrar";
            }
        });

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            setError('');

            const nome = modal.querySelector('#auth-reg-nome').value.trim();
            const cpf = modal.querySelector('#auth-reg-cpf').value.trim();
            const telefone = modal.querySelector('#auth-reg-telefone').value.trim();
            const email = modal.querySelector('#auth-reg-email').value.trim();
            const senha = modal.querySelector('#auth-reg-senha').value.trim();
            const confirmaSenha = modal.querySelector('#auth-reg-confirma-senha').value.trim();

            if (!nome || !cpf || !telefone || !email || !senha || !confirmaSenha) {
                setError("Preencha todos os campos para continuar.");
                return;
            }

            if (senha !== confirmaSenha) {
                setError("As senhas informadas não coincidem.");
                return;
            }

            const submitBtn = registerForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = "Cadastrando...";

            try {
                const result = await createClient(nome, cpf, telefone, email, senha);
                if (!result || !result.ok) {
                    const mensagem = result && result.message ? result.message : "Erro ao cadastrar.";
                    setError(mensagem);
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Criar conta";
                    return;
                }

                showModal("Cadastro realizado", "Sua conta foi criada com sucesso. Vamos fazer o login automaticamente.");

                try {
                    const loginResult = await loginRequest(email, senha, "client");
                    if (loginResult && loginResult.ok && loginResult.token) {
                        saveToken(loginResult.token);
                        const current = getCurrentUser();
                        const primeiroNome = current && current.nome ? current.nome.split(" ")[0] : "";
                        const msgLogin = primeiroNome ? "Bem-vindo, " + primeiroNome + "!" : "Login realizado com sucesso.";
                        showModal("Login automático realizado", msgLogin);
                        closeModal(true);
                    } else {
                        setError("Cadastro concluído, mas não foi possível fazer o login automático. Tente fazer login manualmente.");
                    }
                } catch (eLogin) {
                    console.error("Erro no login automático (modal):", eLogin);
                    setError("Cadastro concluído, mas ocorreu um erro ao tentar fazer login automático. Tente fazer login manualmente.");
                }

            } catch (error) {
                console.error("Erro no cadastro (modal):", error);
                setError("Ocorreu um erro ao tentar criar seu cadastro. Tente novamente.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = "Criar conta";
            }
        });
    });
}


function mostrarPopupPagamento() {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'modal fade show d-block';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';

        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Selecione o Método de Pagamento</h5>
                    </div>
                    <div class="modal-body">
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="radio" name="pagamento" id="pagamentoCredito" value="credito" checked>
                            <label class="form-check-label" for="pagamentoCredito">
                                Cartão de Crédito
                            </label>
                        </div>
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="radio" name="pagamento" id="pagamentoDebito" value="debito">
                            <label class="form-check-label" for="pagamentoDebito">
                                Cartão de Débito
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="pagamento" id="pagamentoPix" value="pix">
                            <label class="form-check-label" for="pagamentoPix">
                                PIX
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary btn-cancelar">Cancelar</button>
                        <button type="button" class="btn btn-primary btn-confirmar">Confirmar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const btnConfirmar = modal.querySelector('.btn-confirmar');
        const btnCancelar = modal.querySelector('.btn-cancelar');

        btnConfirmar.addEventListener('click', () => {
            const metodoSelecionado = modal.querySelector('input[name="pagamento"]:checked').value;
            document.body.removeChild(modal);
            resolve(metodoSelecionado);
        });

        btnCancelar.addEventListener('click', () => {
            document.body.removeChild(modal);
            resolve(null);
        });
    });
}

async function finalizarReserva(cartItems, metodoPagamento) {
    try {
        let token = getToken();

        if (!token) {
            const loggedIn = await showAuthModal();
            if (!loggedIn) {
                return false;
            }
            token = getToken();
            if (!token) {
                return false;
            }
        }

        const result = await finishedOrder(cartItems, metodoPagamento);

        if (result.ok) {
            showModal(
                "Reserva concluída",
                "Sua reserva foi realizada com sucesso!"
            );
            clearHotelCart();
            return true;
        } else {
            showModal(
                "Erro ao realizar reserva",
                result.message || "Erro desconhecido ao tentar concluir a reserva."
            );
            return false;
        }

    } catch (error) {
        console.error("Erro na reserva:", error);
        showModal(
            "Erro de comunicação",
            "Ocorreu um erro ao tentar se comunicar com o servidor. Tente novamente em instantes."
        );
        return false;
    }
}




export default function Grid(cartItems = [], onUpdateCart) {
    const Grid = document.createElement('div');
    Grid.className = "grid";

    const items = Array.isArray(cartItems) ? cartItems : [];
    const totalGeral = items.reduce((total, item) => total + (item.subtotal || 0), 0);

    const linhasQuartos = items.map((item, index) => `
        <tr>
            <th>${item.nome || 'Nome do Quarto'}</th>
            <td>
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        ${item.guest || 0} ${item.guest === 1 ? 'hóspede' : 'hóspedes'}
                        <br>
                        <small class="text-muted">
                            ${item.checkIn || ''} a ${item.checkOut || ''}<br>
                            ${item.daily || 0} diária(s)
                        </small>
                    </div>
                    <button
                        class="btn btn-sm btn-outline-danger remove-item"
                        data-item-index="${index}"
                        title="Remover item"
                    >
                        <img src="/public/assets/images/trash.svg" alt="Remover" width="20" height="20">    
                    </button>
                </div>
            </td>
            <td>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.subtotal || 0)}</td>
        </tr>
    `).join('');

    Grid.innerHTML = `
        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th scope="col">Quarto</th>
              <th scope="col">Detalhes da Reserva</th>
              <th scope="col">Subtotal</th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            ${items.length > 0 ? linhasQuartos : `
                <tr>
                    <td colspan="3" class="text-center text-muted">
                        Nenhum quarto reservado
                    </td>
                </tr>
            `}
          </tbody>
          <tfoot>
            <th>Total:</th>
            <td class="text-center">
                ${items.length > 0 ? `
                    <button type="button" class="btn btn-primary btn-finalizar-reserva">
                        Finalizar Reserva
                    </button>
                ` : ''}
            </td>
            <td>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGeral)}</td>
          </tfoot>
        </table>
    `;

    Grid.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-item-index'));
            removeItemFromHotelCart(index);

            if (onUpdateCart) {
                onUpdateCart();
            }
        });
    });

    const btnFinalizar = Grid.querySelector('.btn-finalizar-reserva');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', async function () {
            const metodoPagamento = await mostrarPopupPagamento();

            if (!metodoPagamento) {
                return;
            }

            this.disabled = true;
            this.textContent = "Processando...";

            const success = await finalizarReserva(items, metodoPagamento);

            if (success && onUpdateCart) {
                onUpdateCart();
            } else {
                this.disabled = false;
                this.textContent = "Finalizar Reserva";
            }
        });
    }

    return Grid;
}