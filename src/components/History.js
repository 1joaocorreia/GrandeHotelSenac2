import { getCurrentUser, isCliente } from "../api/authAPI.js";
import { getReservationHistoryByClientId } from "../api/historyAPI.js";

export async function loadHistory() {

    const section = document.getElementById("history-section");
    const container = document.getElementById('history');
    
	if (! isCliente()) {
        container.innerHTML = `<p style="margin: 10px; color: red;">Somente clientes possuem histórico de reserva</p>`;
        return;
    }

    const currentUser = getCurrentUser();
    if (! currentUser) {
        container.innerHTML = `<p style="margin: 10px; color: red;">Um erro inesperado ocorreu. Verifique se você está logado no sistema</p>`;
        return;
    }
	
	const history = await getReservationHistoryByClientId(currentUser.id);
	if (! history.ok) {
        container.innerHTML = `<p>Não foi possivel obter o histórico de reservas. Mensagem deixada pelo servidor: ${history.message}</p>`;
        return;
    }

    const data = history.raw;
        
    if (!data || data.length === 0) {
        container.innerHTML = `<p style="margin: 10px">Nenhuma reserva encontrada</p>`;
        return;
       
    }
    
    container.innerHTML = data.map(res => `
        <div style="border: 1px solid #CCC; color: #F8F9FA; padding: 10px; margin: 10px; background-color: #9DA16F; border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
            <h3>Reserva #${res.id}</h3>
            <p><strong>Quarto:</strong> ${res.room_id}</p>
            <p><strong>Check-in:</strong> ${res.checkin}</p>
            <p><strong>Check-out:</strong> ${res.checkout}</p>

            <button type="button" 
            class="btn-repeat"
            data-room="${res.room_id}"
            data-checkin="${res.checkin}"
            data-checkout="${res.checkout}"
            style="background-color: #FFF; color: #000; border: 1px solid #CCC; border-radius: 10px; 
            padding: 5px 15px;">
            Repetir
            </button>
            <a class="btn-nfse" href="/nfse/servico/${res.id}">GERAR NFS-e</a>
        </div>
    `).join('');

        document.querySelectorAll(".btn-repeat").forEach(btn => {
            btn.addEventListener("click", () => {
                const room_id = btn.dataset.room;
                const checkin = btn.dataset.checkin;
                const checkout = btn.dataset.checkout;
                const reservationData = { room_id, checkin, checkout };

                localStorage.setItem("repeatReservation", JSON.stringify(reservationData));
                console.log(localStorage.getItem("repeatReservation"));

                window.location.href = "/home";
        })
    });

}
