import { getCurrentUser } from "../api/authAPI.js";
import Navbar from "../components/Navbar.js";
import Footer from "../components/Footer.js";
import LeftMenu from "../components/LeftMenu.js";
import { LeftMenuRow } from "../components/LeftMenu.js";
import Loading from "../components/Loading.js";
import renderNotLoggedPage from "./NotLogged.js";

/* 
    Essa função renderiza o conteúdo da página com base no row escolhido.
    Ex: informações relacionadas à dados de faturamento caso o row escolhido seja o de faturamento.
*/
function reRender(event) {
    console.log("reRender called by target: ");
    console.log(event.target);
}

export default function renderProfilePage() {

    const current = getCurrentUser();
    if (! current) {
        renderNotLoggedPage();
        return;
    }
    
    const navbar = document.getElementById('navbar');
    const root = document.getElementById('root');
    const footer = document.getElementById('footer');

    // Problema crítico: div root não foi encontrada.
    // Redirecionando para /home
    if (! root) {window.location.href = "/home";}

    if (navbar) {
        navbar.appendChild(Navbar())
    }
    if (footer) {
        footer.appendChild(Footer())
        footer.style.marginTop = "0";
        /*
            Aqui, estou removendo todas as classes com 'mt', pois essas tags aplicam margem superior,
            e isso deixa o menu lateral feio...
        */
        const problematicFooter = footer.getElementsByTagName('footer')[0];
        if (problematicFooter) {
            const problematicTags = [];
            problematicFooter.classList.forEach(_class => {
                if (_class.includes("mt")) {
                    problematicTags.push(_class);
                }
            });
            problematicFooter.classList.remove(problematicTags);
        }
    }

    // Incluindo estilo específico da página
    const stylesheet = document.createElement('link');
    stylesheet.rel = "stylesheet";
    stylesheet.href = "/src/css/profile.css";
    document.head.appendChild(stylesheet);

    root.innerHTML = '';

    const rowsID = ["row-preferences", "row-faturamento", "row-historico"];

    const preferencesRow    = LeftMenuRow(true, 'PREFERÊNCIAS', rowsID[0]);
    const faturamentoRow    = LeftMenuRow(false, 'DADOS DE FATURAMENTO', rowsID[1]);
    const historicoRow      = LeftMenuRow(false, 'HISTÓRICO DE RESERVAS', rowsID[2]);

    const rows = [preferencesRow, faturamentoRow, historicoRow];

    const leftMenu = LeftMenu("100%", rows);

    const menu = document.createElement('div');
    menu.id = "left-menu";
    menu.innerHTML = leftMenu;
    menu.style.marginTop = "3rem";
    menu.style.width = "25%";
    menu.style.height = "500px";
    menu.style.overflowY = "auto";
    
    root.appendChild(menu);
    root.classList.remove("justify-content-center", "align-items-center");
    root.style.marginTop = "0";
    root.style.marginBottom = "0";
    root.style.flexDirection = "row";


    const loading = document.createElement('div');
    loading.id = 'loading';
    loading.innerHTML = Loading("200px");
    loading.style.width = "100%";
    loading.style.marginTop = "10rem";

    root.appendChild(loading);

    let initial_row = null;
    
    /* Atribuindo evento de click em cada row */
    rowsID.forEach(rowID => {

        const element = document.getElementById(rowID);
        element.addEventListener('click', reRender);

        if (element.classList.contains("selected-row")) {
            initial_row = element;
        }

    });
    
    if (initial_row != null) {
        initial_row.click();
    }
    
}