export async function createClient(nome, cpf, telefone, email, senha) {
    const dados = { nome, cpf, telefone, email, senha };

    try {
        const response = await fetch("/api/client", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados),
            credentials: "same-origin"
        });

        const responseText = await response.text();
        let data = null;
        try {
            data = JSON.parse(responseText);
        } catch (error) {
            data = null;
        }

        if (!response.ok) {
            const message = data && data.message ? data.message : "Erro ao cadastrar cliente.";
            return {
                ok: false,
                raw: data,
                message: message
            };
        }

        return {
            ok: true,
            raw: data,
            message: data && data.message ? data.message : "Cliente cadastrado com sucesso."
        };
    } catch (error) {
        return {
            ok: false,
            raw: null,
            message: "Erro de rede: " + error.message
        };
    }
}

export async function getClientById(id) {
	const ret = {
		ok: false,
		raw: null,
		message: ""
	};
	
    const url = `/api/client/${id}`;
    const response = await fetch(url);
    
    try {
        ret.raw = await response.json();
    } catch (ex) {
    	ret.raw = null;
        ret.message = `An error ocurred. Tried: ${url}. Cause: < ${ex.cause} >. Message: ${ex.message}`
        return ret;
    }

    if (! response.ok) {
    	ret.message = `An error ocurred. Tried: ${url}. Code: ${response.status}. Server message: ${ret.raw.message}`;
    	return ret;
    }

	ret.ok = true;
	ret.message = "No errors.";
    return ret;
}
