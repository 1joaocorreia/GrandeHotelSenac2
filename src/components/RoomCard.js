import { addItemToHotelCart } from "../store/CartStore.js";
import CarrouselCard from "./CarrouselCard.js";
import { showModal } from "./Modal.js";

export function showAddedToCartModal({ nome, preco, daily, subtotal }) {
    const modal = document.createElement("div");
    modal.className = "modal fade show d-block";
    modal.style.backgroundColor = "rgba(0,0,0,0.5)";

    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Reserva adicionada ao carrinho</h5>
                    <button type="button" class="btn-close" aria-label="Fechar"></button>
                </div>
                <div class="modal-body">
                    <p>Quarto <strong>${nome}</strong> foi adicionado ao seu carrinho.</p>
                    <p>
                        Preço/diária: <strong>R$ ${Number(preco).toFixed(2)}</strong><br>
                        Nº de diárias: <strong>${daily}</strong><br>
                        Subtotal: <strong>R$ ${Number(subtotal).toFixed(2)}</strong>
                    </p>
                    <p>O que você deseja fazer agora?</p>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-outline-secondary" id="btnContinueReserve">
                        Continuar reservando
                    </button>
                    <button type="button" class="btn btn-primary" id="btnGoCart">
                        Ir para o carrinho
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const btnClose = modal.querySelector(".btn-close");
    const btnContinue = modal.querySelector("#btnContinueReserve");
    const btnGoCart = modal.querySelector("#btnGoCart");

    const close = () => {
        document.body.removeChild(modal);
    };

    btnClose.addEventListener("click", close);
    btnContinue.addEventListener("click", close);
    btnGoCart.addEventListener("click", () => {
        close();
        window.location.href = "/cart";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) close();
    });
}



export function calcularDiaria(checkIn, checkOut) {
    const [yin, min, din] = String(checkIn).split("-").map(Number);
    const [yout, mout, dout] = String(checkOut).split("-").map(Number);

    const tin = Date.UTC(yin, min - 1, din);
    const tout = Date.UTC(yout, mout - 1, dout);

    const diffTime = Math.abs(tout - tin);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

export default function Card(quarto, index) {
    const {
        id,
        nome,
        numero,
        qnt_cama_casal,
        qnt_cama_solteiro,
        preco,
        fotos,
        capacidadeTotal
    } = quarto || {};

    const listaFotos = Array.isArray(fotos) ? fotos : [];

    const camas = [
        (qnt_cama_casal > 0 ? `${qnt_cama_casal} cama(s) de casal` : null),
        (qnt_cama_solteiro > 0 ? `${qnt_cama_solteiro} cama(s) de solteiro` : null),
    ].filter(Boolean).join(' - ');

    const card = document.createElement('div');
    card.className = 'containerCard';
    card.innerHTML = `
        <div class="card" style="width: 18rem;">
            <div class="room-carousel-container"></div>
            <div class="card-body">
                <h5 class="card-title">${nome}</h5>
                <p class="card-text">
                    <strong>Capacidade:</strong> ${capacidadeTotal} pessoas<br>
                    ${camas ? `<strong>Camas:</strong> ${camas}<br>` : ''}
                    <strong>Preço:</strong> R$ ${preco}
                </p>
                <a href="#" class="btn btn-primary btn-reservar">Reservar</a>
                <a href="/room/info/${id}" class="btn btn-primary" style="margin-top: 10px;">Mais informações</a>
            </div>
        </div>
    `;


    const carouselContainer = card.querySelector(".room-carousel-container");
    const carousel = CarrouselCard(listaFotos, (id ?? index ?? 0).toString());
    carouselContainer.appendChild(carousel);


    card.querySelector(".btn-reservar").addEventListener('click', (e) => {
        e.preventDefault();

        const idDateCheckIn = document.getElementById("check-in");
        const idDateCheckOut = document.getElementById("check-out");
        const idGuestAmount = document.getElementById("guest-amount");

        const inicio = (idDateCheckIn?.value || "").trim();
        const fim = (idDateCheckOut?.value || "").trim();
        const qtdPessoas = parseInt((idGuestAmount?.value || "0").trim(), 10);

        if (!inicio || !fim || isNaN(qtdPessoas) || qtdPessoas <= 0) {
            showModal(
                "Dados incompletos",
                "Preencha as datas de check-in, check-out e o número de hóspedes antes de reservar."
            );
            return;
        }

        const daily = calcularDiaria(inicio, fim);
        const subtotal = parseFloat(preco) * daily;

        const novoItemReserva = {
            id,
            nome,
            checkIn: inicio,
            checkOut: fim,
            guest: qtdPessoas,
            daily,
            subtotal
        };

        addItemToHotelCart(novoItemReserva);
        showAddedToCartModal({
            nome,
            preco,
            daily,
            subtotal
        });
    });

    return card;
}
