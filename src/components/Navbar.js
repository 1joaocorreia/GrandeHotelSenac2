import { getCurrentUser, isFuncionario, clearToken } from "../api/authAPI.js";

export default function Navbar() {
    const user = getCurrentUser();
    const funcionario = isFuncionario();
    const nome = user && user.nome ? user.nome.split(" ")[0] : null;

    const navbar = document.createElement("div");
    navbar.innerHTML = `
    <nav class="navbar navbar-expand-lg navbarTop">
        <div class="container-fluid">
            <a class="navbar-brand" href="/home">
                <img src="/public/assets/images/icon.ico" style="width: 35px; height: 35px;">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/home">Home</a>
                    </li>
                    ${funcionario ? `
                    <li class="nav-item">
                        <a class="nav-link" href="/room/create">Cadastrar quarto</a>
                    </li>
                    ` : ""}
                    ${!user ? `
                    <li class="nav-item">
                        <a class="nav-link" href="/register">Cadastre-se</a>
                    </li>
                    ` : ""}
                    ${!user ? `
                    <li class="nav-item">
                        <a class="nav-link" href="/login">Faça seu login</a>
                    </li>
                    ` : `
                    <li class="nav-item">
                        <a class="nav-link" href="#" id="logout-link">Sair</a>
                    </li>
                    `}
                </ul>
                <div class="d-flex align-items-center gap-2">
                    ${nome ? `<span class="navbar-text d-none d-md-inline">Bem-vindo, ${nome}</span>` : ""}
                    <a class="nav-link" href="/profile">
                        <img src="/public/assets/images/user_profile_icon.png" style="width: 30px; height: 30px;">
                    </a>
                    <a class="nav-link" href="/cart">
                        <img src="/public/assets/images/cart.svg" style="width: 30px; height: 30px;">
                    </a>
                </div>
            </div>
        </div>
    </nav>
    `;

    const logoutLink = navbar.querySelector("#logout-link");
    if (logoutLink) {
        logoutLink.addEventListener("click", function (e) {
            e.preventDefault();
            clearToken();
            window.location.href = "/home";
        });
    }

    return navbar;
}
