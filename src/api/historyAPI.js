export async function getReservationHistoryByClientId(clientId) {
    const ret = {
        ok: false,
        raw: null,
        message: ""
    };

    const url = `/api/history/cliente/${clientId}`;
	const response = await fetch(url);
	
	if (! response.ok) {
        ret.message = `Falha ao requisitar a API. Status-code: ${response.status}`;
    	return ret;
    }
	
    try {
        ret.raw = await response.json();
    } catch (ex) {
        ret.message = "Não foi possivel interpretar a resposta do servidor.";
        return ret;
    }

	ret.ok = true;
    ret.message = "No errors.";
    return ret;
}