export async function getDadosFaturamentoByClientId(clientId) {

    const ret = {
        ok: false,
        raw: null,
        message: ""
    };

    const url = `/api/faturamento/cliente/${clientId}`;
    const response = await fetch(url);

    if (! response.ok) {
        ret.message = `Servidor respondeu de forma negativa à requisição. [url: ${url}]`;
        return ret;
    }

    try {
        ret.raw = await response.json();
    } catch (ex) {
        ret.message = "An error ocurred.";
        return ret;
    }

    ret.ok = true;
    ret.message = "No errors.";
    return ret;
}