export async function createClient(nome, cpf, telefone, email, senha) {
    const dados = { nome, cpf, telefone, email, senha };

    try {
        const response = await fetch("api/client", {
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