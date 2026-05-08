export async function loadHistory() {

    const section = document.getElementById("history-section");
    const container = document.getElementById('history');
    
    
    const token = localStorage.getItem("auth_token");
    //console.log("TOKEN:", token);
    //const logado = localStorage.getItem("logado");

     if (!token) {
        section.style.display = "none";
        return;  
    }

    section.style.display = "block";

    try {
        
        const response = await fetch('/grandehotelsenac2/api/history', {
          //  method: 'GET',
            headers: {
                Authorization: 'Bearer ' + token
            //    'Content-Type': 'Application/json'
        }
        });

        const data = await response.json();

        if (response.status === 401) {
            section.style.display = "none";
            console.error("Usuário não autorizado");
            return;
        }
    
        
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
        </div>
    `).join('');

        document.querySelectorAll(".btn-repeat").forEach(btn => {
            btn.addEventListener("click", () => {
                const room_id = btn.dataset.room;
                const checkin = btn.dataset.checkin;
                const checkout = btn.dataset.checkout;

                console.log("Clicou repetir:", room_id, checkin, checkout);

                const reservationData = { room_id, checkin, checkout };

                localStorage.setItem("repeatReservation", JSON.stringify(reservationData));
                console.log(localStorage.getItem("repeatReservation"));

              //  alert("Salvou a reserva!");

                window.location.href = "/grandehotelsenac2/home";
        })
    })    
    
    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        container.innerHTML = `<p style="color: red;">Erro ao carregar as reservas</p>`
    }

}