export async function getEnderecoById(enderecoId) {
    
    const ret = {
        ok: false,
        raw: null,
        message: ""
    };

    const url = `/api/endereco/${enderecoId}`;
    const result = await fetch(url);

    if (! result.ok) {
        ret.message = `Requisição para a API falhou. Status-code: ${result.status}.`
        return ret;
    }

    try {
        ret.raw = await result.json();
    } catch (ex) {
        ret.message = `Um erro ocorreu. Causa: ${ex.cause}. Mensagem: ${ex.message}`;
        return ret;
    }

    if (ret.raw == null) {
        ret.message = `Um erro ocorreu.`;
        return ret;
    }

    if (ret.raw.status === "error") {
        ret.message = `Um erro ocorreu. Mensagem deixada pelo servidor: ${ret.raw.message}`;
        return ret;
    }

    ret.ok = true;
    ret.message = "No errors.";
    return ret;

}

export async function getEnderecoByClientId(clientId) {
    
    const ret = {
        ok: false,
        raw: null,
        message: ""
    };

    const url = `/api/enderecos/cliente/${clientId}`;
    const response = await fetch(url);

    if (! response.ok) {
        ret.message = `Requisição para a API falhou. Status-code: ${response.status}`;
        return ret;
    }

    try {
        ret.raw = await response.json();
    } catch (ex) {
        ret.message = `Um erro ocorreu. Causa: ${ex.cause}. Mensagem: ${ex.message}`;
        return ret;
    }


    if (ret.raw.status === 'error') {
        ret.message = `Um erro ocorreu. Mensagem deixada pelo servidor: ${ret.raw.message}`;
        return ret;
    }

    ret.ok = true;
    ret.message = "No errors.";
    return ret;

}

export async function getEnderecoByCep(cep) {

    const ret = {
        ok: false,
        raw: null,
        message: ""
    };

    const url = `/api/endereco/cep/${cep}`;
    const response = await fetch(url);

    if (! response.ok) {
        ret.message = `Requisição para a API falhou. Status-code: ${response.status}`;
        return ret;
    }

    try {
        ret.raw = await response.json();
    } catch (ex) {
        ret.message = `Um erro ocorreu. Causa: ${ex.cause}. Mensagem: ${ex.message}`;
        return ret;
    }


    if (ret.raw.status === 'error') {
        ret.message = `Um erro ocorreu. Mensagem deixada pelo servidor: ${ret.raw.message}`;
        return ret;
    }

    ret.ok = true;
    ret.message = "No errors.";
    return ret;

}