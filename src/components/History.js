async function loadHistory() {
    const response = await fetch('/grandehotelsenac2/api/history');
    const data = await response.json();

    const container = document.getElementById('history');

    if (data.length === 0) {
        container.innerHTML = "<p>Nenhuma reserva encontrada</p>";
        return;
    }

    container.innerHTML = data.map(res => `
        <h3 style="text-align: center;">Últimas Reservas</h3>
        <div style="border: 1px solid #F8F9FA; padding: 10px; margin: 10px;">
            <h3>Reserva #${res.id}</h3>
            <p><strong>Quarto:</strong>${res.room_id}</p>
            <p><strong>Check-in:</strong>${res.checkin}</p>
            <p><strong>Check-out:</strong>${res.checkout}</p>
        </div>
        `).join('')
}

loadHistory();