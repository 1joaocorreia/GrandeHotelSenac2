import Hero from "../components/Hero.js";
import Navbar from "../components/Navbar.js";
import Footer from "../components/Footer.js";
import Card from "../components/RoomCard.js";
import CardLounge from "../components/CardLounge.js";
import dateSelector from "../components/DateSelector.js";
import { listAllRoomRequest } from "../api/roomsAPI.js";
import { showModal } from "../components/Modal.js";

export default function renderHomePage() {
    const nav = document.getElementById('navbar');
    nav.innerHTML = '';

    const navbar = Navbar();
    nav.appendChild(navbar);

    const divRoot = document.getElementById('root');
    divRoot.innerHTML = '';

    const hero = Hero();
    divRoot.appendChild(hero);

    const datesSelector = dateSelector();
    divRoot.appendChild(datesSelector.container);

    const {
        btnPesquisar,
        dateSelectorIn,
        dateSelectorOut,
        guestsAmount,
        errorCheckIn,
        errorCheckOut,
        errorGuests
    } = datesSelector.elements;

    const cardDiv = document.createElement('div');
    cardDiv.className = 'cards';

    btnPesquisar.addEventListener("click", async (e) => {
        e.preventDefault();

        const inicio = dateSelectorIn.value;
        const fim = dateSelectorOut.value;
        const capacidadeTotal = parseInt(guestsAmount.value, 10);

        clearErrors();

        let hasError = false;

        if (!inicio) {
            showError(errorCheckIn, dateSelectorIn, 'Data de Check-in é obrigatória');
            hasError = true;
        }

        if (!fim) {
            showError(errorCheckOut, dateSelectorOut, 'Data de Check-out é obrigatória');
            hasError = true;
        }

        if (inicio && fim && new Date(inicio) >= new Date(fim)) {
            showError(errorCheckIn, dateSelectorIn, 'Check-in deve ser antes do Check-out');
            hasError = true;
        }

        if (!capacidadeTotal || isNaN(capacidadeTotal) || capacidadeTotal <= 0) {
            showError(errorGuests, guestsAmount, 'Quantidade de pessoas é obrigatória');
            hasError = true;
        }

        if (hasError) return;

        btnPesquisar.disabled = true;
        btnPesquisar.style.backgroundColor = 'gray';
        btnPesquisar.textContent = 'Buscando...';

        try {
            const quartosArray = await listAllRoomRequest({ inicio, fim, capacidadeTotal });

            cardDiv.innerHTML = '';

            if (!quartosArray || quartosArray.length === 0) {
                showModal(
                    "Nenhum quarto disponível",
                    "Infelizmente não encontramos quartos disponíveis para as datas escolhidas. Tente alterar o período ou reduzir a quantidade de hóspedes."
                );
                return;
            }

            quartosArray.forEach((quarto, index) => {
                const card = Card(quarto, index);
                cardDiv.appendChild(card);
            });

        } catch (error) {
            console.error("Erro ao buscar quartos:", error);
            showModal(
                "Erro ao buscar quartos",
                error.message || "Não foi possível buscar quartos disponíveis. Tente novamente em instantes."
            );
        } finally {
            btnPesquisar.disabled = false;
            btnPesquisar.style.backgroundColor = '';
            btnPesquisar.textContent = 'Pesquisar';
        }
    });


    function showError(errorElement, inputElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.style.borderColor = '#dc3545';
    }

    function clearErrors() {
        [errorCheckIn, errorCheckOut, errorGuests].forEach(error => {
            error.style.display = 'none';
        });
        [dateSelectorIn, dateSelectorOut, guestsAmount].forEach(input => {
            input.style.borderColor = '';
        });
    }

    divRoot.appendChild(cardDiv);



    const tituloLounge = document.createElement('h1');
    tituloLounge.textContent = 'Nossa infraestrutura'
    tituloLounge.className = 'titulo';
    tituloLounge.style.fontSize = '28px';
    tituloLounge.style.textAlign = 'center';
    tituloLounge.style.marginTop = '2%';
    divRoot.appendChild(tituloLounge);

    const cardLoungeDiv = document.createElement('div');
    cardLoungeDiv.className = 'd-flex justify-content-center flex-wrap gap-4';
    cardLoungeDiv.style.marginTop = '2%';
    divRoot.appendChild(cardLoungeDiv);

    const loungeItems = [
        {
            path: "spa.jpg",
            title: "SPA",
            previewText: "Massagens e terapias relaxantes para renovar suas energias.",
            text: "Oferecemos terapeutas especializados, ambientes privativos e tratamentos personalizados para proporcionar bem‑estar total."
        },
        {
            path: "piscina-aquecida.jpg",
            title: "Piscina aquecida",
            previewText: "Água aquecida e ambiente aconchegante para lazer o ano todo.",
            text: "Idealizada para o seu conforto, nossa piscina possui raia para natação, área de descanso e serviços de borda para você aproveitar independentemente da estação."
        },
        {
            path: "bar.jpg",
            title: "Bar",
            previewText: "Drinks autorais e ambiente descontraído para encontros especiais.",
            text: "Cardápio preparado por mixologistas experientes e harmonizados com petiscos selecionados para tornar cada momento memorável."
        },
    ];

    for (let i = 0; i < loungeItems.length; i++) {
        const cardLoungeElement = CardLounge(loungeItems[i], i);
        cardLoungeDiv.appendChild(cardLoungeElement);
    }



    const footer = document.getElementById('footer');
    footer.innerHTML = '';

    const footers = Footer();
    footer.appendChild(footers);
}