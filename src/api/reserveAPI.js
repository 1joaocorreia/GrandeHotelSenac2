import { getToken } from "../api/authAPI.js";

export async function finishedOrder(items, metodoPagamento) {
    const url = "api/request/reservation";
    const body = {
        pagamento: metodoPagamento,
        quartos: items.map(item => ({
            id: item.id,
            inicio: item.checkIn,
            fim: item.checkOut
        }))
    };
    
    const token = getToken();
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
        method: "POST",
        headers: headers,
        credentials: "same-origin",
        body: JSON.stringify(body)
    });
    
    let data = null;
    try {
        data = await res.json();
    }
    catch { 
        data = null; 
    }
    
    if (!res.ok) {
        const message = data?.message || `Erro ao enviar pedido: ${res.status}`;
        return {ok: false, raw: data, message}; 
    }
    
    return {
        ok: true,
        raw: data
    }
}