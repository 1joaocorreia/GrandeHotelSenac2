import { getToken } from "./authAPI.js";

export async function listAllRoomRequest({ inicio, fim, capacidadeTotal }) {
    const params = new URLSearchParams();
    if (inicio) params.set("inicio", inicio);
    if (fim) params.set("fim", fim);
    if (capacidadeTotal !== null && capacidadeTotal !== "") params.set("capacidadeTotal", String(capacidadeTotal));


 const url = `api/rooms/disponiveis?${params.toString()}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
        credentials: "same-origin"
    });
    let data = null;
    try {
        data = await response.json();
    }
    catch {
        data = null;
    }
    if (!response.ok) {
        const msg = data?.message || "Falha ao buscar quartos disponíveis!";
        throw new Error(msg);
    }
    const quartos = Array.isArray(data?.Quartos) ? data.Quartos : [];
    console.log(quartos);
    return quartos;
}

export async function getRoomById(id) {
    const url = `/api/rooms/${id}`;
    const response = await fetch(url);

    let data = null;
    try {
        data = await response.json();
    } catch (ex) {
        throw new Error(`Failure parsing json from API response.`);
    }
    if (data == null || data == '') {
        throw new Error(`No room found with id < ${id} >`);
    }

    return data;
}

export async function createRoomRequest(formData) {
    const token = getToken();
    if (!token) {
        return {
            ok: false,
            message: "Token não encontrado. Faça login novamente.",
            raw: null
        };
    }

    try {
        const response = await fetch("api/rooms", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData,
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
            const message = data && data.message ? data.message : "Erro ao criar o quarto.";
            return {
                ok: false,
                data: null,
                message: message
            };
        }

        return {
            ok: true,
            data: data,
            message: data && data.message ? data.message : "Quarto criado com sucesso."
        };
    } catch (error) {
        return {
            ok: false,
            data: null,
            message: "Erro de rede: " + error.message
        };
    }
}