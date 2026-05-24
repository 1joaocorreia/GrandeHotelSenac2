import { getCurrentUser, isCliente, getToken } from "../api/authAPI.js";
import { getClientById } from "../api/clientAPI.js";
import { getDadosFaturamentoByClientId } from "../api/faturamentoAPI.js";
import { getEnderecoById, getEnderecoByCep } from "../api/enderecoAPI.js";
import { LeftMenu, LeftMenuRow } from "../components/LeftMenu.js";
import { ErrorMessage } from "../components/ErrorMessage.js";
import Navbar from "../components/Navbar.js";
import Footer from "../components/Footer.js";
import Loading from "../components/Loading.js";
import renderNotLoggedPage from "./NotLogged.js";
import ChangeDialog from "../components/ChangeDialog.js";
import { loadHistory } from "../components/History.js";


const rowsID = ["row-preferences", "row-faturamento", "row-historico"];

/*
    Atribui a classe "unselected-row" para todos os rows do menu lateral esquerdo.
    Atribui a classe "selected-row" apenas para o row com o id < rowId >
*/
function setActiveMenuRow(rowId) {
    const rowElement = document.getElementById(rowId);
    const allRows = document.getElementsByClassName("row-button");
    
    /* Desabilitando todos os rows */
    for (let c = 0; c < allRows.length; c++) {
        const currentRow = allRows[c];
        currentRow.classList.replace("selected-row", "unselected-row");
    }

    // Habilitando somente o escolhido
    rowElement.classList.replace("unselected-row", "selected-row");
}

function renderUnknownProblem() {
    const renderZone = document.getElementById('render-zone');
    if (! renderZone) { return; }

    const errorMessage = ErrorMessage("Um erro inesperado ocorreu.", "Tente novamente mais tarde.");
    renderZone.innerHTML = '';
    renderZone.appendChild(errorMessage);
}

function renderLoading() {
    const renderZone = document.getElementById('render-zone');
    if (! renderZone) { return; }
    renderZone.innerHTML = Loading("200px");
}

async function redirectNfse(event) {
    const roomId = event.srcElement.getAttribute('data-room');
   	return fetch(`/nfse/quarto/${roomId}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    })
    .then( response => response.blob() )
    .then( blob => {
		var file = window.URL.createObjectURL(blob);
        window.location.assign(file);
    });
}

async function askUserFieldValue(label, oldValue) {
return new Promise((resolve, reject) => {

    const renderZone = document.getElementById('render-zone');
	
	if (! renderZone) { reject("Render Zone não encontrada"); }
	
	const removeDialog = () => {
		renderZone.removeChild(document.getElementById('dialog-container'));
    };

	const cancelAction = () => {
        removeDialog();
        reject("Cancelado");
    };

    const confirmAction = () => {
        const inputValue = document.getElementById('dialog-input').value;
        removeDialog();
        resolve(inputValue);
    };
	
    renderZone.appendChild(ChangeDialog(label, oldValue));

	document.getElementById('save-change').addEventListener('click', confirmAction);
	document.getElementById('cancel-change').addEventListener('click', cancelAction);

});
}

/* 
    Essa função é chamada quando o usuário clica no botão para modificar o valor de um campo.
    Exemplo de campo: nome, email, email de faturamento, etc...
*/
async function changeField(event, fieldId) {

    /* ID do campo x nome da coluna no banco de dados */
    const idsAndColumns = {
        "nome-field": "nome",
        "email-field": "email",
        "telefone-field": "telefone",
        "endereco-field": "endereco",
        "cpf-field": "cpf",
        "billing-address-field": "endereco_faturamento",
        "billing-email-field": "email_faturamento"
    };

    if(! idsAndColumns.hasOwnProperty(fieldId)) {
        console.error("fieldId não reconhecido");
        renderUnknownProblem();
        return;
    }

    const element = document.getElementById(fieldId);
    
    if (! element) {
        console.error(`Elemento com ID < ${fieldId} > não encontrado`);
        renderUnknownProblem();
        return;
    }
    
    const identifierElement = element.getElementsByClassName('value-identifier')[0];
    const valueitselfElement = element.getElementsByClassName('value-itself')[0];

    const label = identifierElement.textContent;
    const oldValue = valueitselfElement.textContent;
    let newValue = null;
    
    try {
    	newValue = await askUserFieldValue(label, oldValue);
    } catch (err) {
        newValue = null;
    }

	if (newValue == null) { return; }

    if (fieldId === "endereco-field" || fieldId === "billing-address-field") {
        const query = await getEnderecoByCep(newValue);
        if (! query || ! query.ok) {
            renderUnknownProblem();
            return;
        }
        newValue = query.raw.id;
    }

	const currentUser = getCurrentUser();
	
	if (! currentUser) {
        console.error("Não foi possível obter os dados do usuário atual");
		renderUnknownProblem();
        return;
    }

    const detailedUser = await getClientById(currentUser.id);
    if (! detailedUser.ok || ! detailedUser.raw) {
        console.error(`Falha ao requisitar os dados do cliente com ID: ${currentUser.id}`);
        renderUnknownProblem();
        return;
    }
    
	const rotas = {
        "cliente": `/api/client/${detailedUser.raw.id}`,
        "faturamento": `/api/faturamento/cliente/${detailedUser.raw.id}`
    };
	
	let choosenRoute = null;

    if (["nome-field", "email-field", "telefone-field", "endereco-field", "cpf-field"].includes(fieldId)) {
        choosenRoute = rotas.cliente;
    }
    if (["billing-address-field", "billing-email-field"].includes(fieldId)) {
        choosenRoute = rotas.faturamento;
    }
	

    const method = 'PUT';
    const choosenId = idsAndColumns[fieldId];
	const authToken = getToken();
    
	if (! authToken) {
        console.log("Token indisponível");
        renderUnknownProblem();
        return;
    }

	console.log(`Requesting < ${choosenRoute} >. [Method ${method}] ${choosenId}:${newValue}`);
	
    const response = await fetch(choosenRoute, {
        method: method,
        body: `{"${choosenId}": "${newValue}"}`,
        headers: {
            "Authorization": `Bearer ${authToken}`
        }
    });
    
	if (! response.ok) {
		renderUnknownProblem();
        return;
    }

    let data = null;
    try {
        data = await response.json();
    } catch (ex) {
        data = null;
    }

	if (data == null) {
		renderUnknownProblem();
        return;
    }
	
	if (data.status === "success") {
        location.reload();
        return;
    } else {
        renderUnknownProblem();
        return;
    }   	
}

/* 
    Essa função retorna um botão "Change" que, quando apertado, aciona o evento
    changeField() para o campo com id < targetFieldId >
 */
const changeButton = (buttonLabel, targetFieldId) => {
    const btn = document.createElement('button');
    btn.innerText = buttonLabel;
    btn.classList.add("btn-change-field");
    btn.onclick = (event) => {
        changeField(event, targetFieldId);
    };
    return btn;
}

/*
    Campo em sí.
    Representa um identificador e um valor.
    
    Exemplo:
        EMAIL: exemplodeemail@gmail.com
    
    Onde:
        EMAIL -> identificador
        exemplodeemail@gmail.com -> valor
*/
const field = (id, label, value, is_changeable) => {
    const fieldContainer = document.createElement('div');
    fieldContainer.classList.add("field");
    fieldContainer.id = id;
    fieldContainer.innerHTML = `
        <div class="profile-data-row">
            <div class="data-row-left">
                <p><span class="value-identifier"><b>${label}</b></span>: <span class="value-itself">${(value && value != '')? value : "undefined"}</span></p>
            </div>
            <div class="data-row-right"></div>
        </div>
    `;

    if (is_changeable) {
        const right = fieldContainer.getElementsByClassName("data-row-right")[0];
        if (right) {
            right.appendChild(changeButton("Change", id));
        }
    }

    return fieldContainer;
};


/* Renderiza a página de preferências */
async function renderPreferences() {
    const renderZone = document.getElementById('render-zone');
    if (! renderZone) { return; }

    let nome, email, telefone, endereco, cpf = "";

    if (isCliente()) {
        /* CLIENTE. USAR API clientAPI */
        const currentUser = getCurrentUser();
        if (! currentUser) {
            renderUnknownProblem();
            return;
        }
        
        const query = await getClientById(currentUser.id);
        if (! query || ! query.ok) {
            renderUnknownProblem();
            return;
        }

        const raw = query.raw;

        nome = raw.nome ?? null;
        email = raw.email ?? null;
        telefone = raw.telefone ?? null;
        endereco = raw.endereco ?? null;
        if (endereco) {
            const query = await getEnderecoById(endereco);
            if (! query || ! query.ok) {
                endereco = null;
            } else {
                endereco = query.raw.cep;
            }
        }
        cpf = raw.cpf ?? null;
    } else {
        /* FUNCIONÁRIO. USAR API userAPI */
        renderUnknownProblem();
        return;
    }

    const nomeField 	= field('nome-field', "NOME", nome, true);
    const emailField 	= field('email-field', "E-MAIL", email, true);
    const telefoneField	= field('telefone-field', "TELEFONE", telefone, true);
    const enderecoField	= field('endereco-field', "ENDEREÇO (CEP)", endereco, true);
    const cpfField 		= field('cpf-field', "CPF", cpf, true);

    renderZone.innerHTML = '';
    renderZone.appendChild(nomeField);
    renderZone.appendChild(emailField);
    renderZone.appendChild(telefoneField);
    renderZone.appendChild(enderecoField);
    renderZone.appendChild(cpfField);
}

/* Renderiza a página de faturamento */
async function renderFaturamento() {
    const renderZone = document.getElementById('render-zone');
    if (! renderZone) { return; }

    const currentUser = getCurrentUser();

    if (! currentUser) {
        renderUnknownProblem();
        return;
    }

    let billing_address, billing_email = null;

    let query = await getDadosFaturamentoByClientId(currentUser.id);
    if (query.ok && query.raw) {
        billing_address = query.raw.endereco_faturamento ?? null;
        if (billing_address) {
            const query = await getEnderecoById(billing_address);
            if (! query || ! query.ok) {
                billing_address = null;
            } else {
                billing_address = query.raw.cep;
            }
        }
        billing_email = query.raw.email_faturamento ?? null;
    } else {
        renderUnknownProblem();
        return;
    }
    const enderecoFaturamento   = field('billing-address-field', "Endereço de Faturamento (CEP)", billing_address, true);
    const emailFaturamento      = field('billing-email-field', "E-mail de faturamento", billing_email, true);

    renderZone.innerHTML = '';
    renderZone.appendChild(enderecoFaturamento);
    renderZone.appendChild(emailFaturamento);
}

/* Renderiza a página de historico de reservas passadas */
async function renderHistorico() {
	
	// 1. Adicionar a estrutura HTML
	const renderZone = document.getElementById('render-zone');

    if (! renderZone) {return;}

	const historySection = document.createElement('section');
    historySection.id = "history-section";
    historySection.innerHTML = `
    	<h2 style="margin: 20px; text-align: center; font-weight: 700;">Últimas Reservas</h2>
        <div id="history"></div>
    `;
	
	renderZone.innerHTML = '';
	renderZone.appendChild(historySection);

	await loadHistory();

	for (let element of document.getElementsByClassName('btn-nfse')) {
        element.addEventListener('click', redirectNfse);
    }
}

/* 
    Essa função determina qual render chamar com base em qual menu o usuário clicou.
    Ex: chama renderHistorico() caso o usuário clique no menu "HISTORICO DE RESERVAS"
*/
async function reRender(event) {
    renderLoading();
    setActiveMenuRow(event.target.id);

    switch (event.target.id) {
        case rowsID[0]: {
            await renderPreferences();
            break;
        }
        case rowsID[1]: {
            await renderFaturamento();
            break;
        }
        case rowsID[2]: {
            await renderHistorico();
            break;
        }
        default: {
            return;
        }
    }
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

    root.innerHTML = '';

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
                if (_class.includes("mt")) { problematicTags.push(_class);}
            });
            problematicFooter.classList.remove(problematicTags);
        }
    }

    // Incluindo estilo específico da página
    const stylesheet = document.createElement('link');
    stylesheet.rel = "stylesheet";
    stylesheet.href = "/src/css/profile.css";
    document.head.appendChild(stylesheet);

    /* Criando cada opção do menu lateral */
    const preferencesRow    = LeftMenuRow(true, 'PREFERÊNCIAS', rowsID[0]);
    const faturamentoRow    = LeftMenuRow(false, 'DADOS DE FATURAMENTO', rowsID[1]);
    const historicoRow      = LeftMenuRow(false, 'HISTÓRICO DE RESERVAS', rowsID[2]);

    const rows = [preferencesRow, faturamentoRow, historicoRow];

    /* Criando o menu lateral com todas as opções */
    const leftMenu = LeftMenu("100%", rows);

    const menu = document.createElement('div');
    menu.id = "left-menu";
    menu.innerHTML = leftMenu;

    root.appendChild(menu);
    root.classList.remove("justify-content-center", "align-items-center");


    const renderZone = document.createElement('div');
    renderZone.id = "render-zone";
    
    root.appendChild(renderZone);


    let initial_row = null;
    
    /* Atribuindo evento de click em cada row */
    rowsID.forEach(rowID => {

        const element = document.getElementById(rowID);
        element.addEventListener('click', reRender);

        if (element.classList.contains("selected-row")) {
            initial_row = element;
        }

    });
    
    /*
        Simulando o click na opção marcaca por padrão como selecionada. [opção: PREFERÊNCIAS].
        Isso irá indiretamente chamar a função reRender para renderizar o conteúdo da página de preferências.
    */
    if (initial_row != null) {
        initial_row.click();
    }
    
}
