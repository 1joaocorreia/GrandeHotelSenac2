//import { getToken } from "../api/authAPI.js";

async function loadHistory() {

    const section = document.getElementById("history-section");
    const container = document.getElementById('history');
    
    
    const token = localStorage.getItem("auth_token");
    console.log("TOKEN:", token);
//  const logado = localStorage.getItem("logado");

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
        </div>
    `).join('');
    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        container.innerHTML = `<p style="color: red;">Erro ao carregar as reservas</p>`
    }

}

loadHistory();