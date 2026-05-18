const TOKEN_KEY = "auth_token";
const LOGIN_URL = "/api/login";

export async function loginRequest(email, senha, tipo) {
    const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: senha,
            tipo: tipo
        }),
        credentials: "same-origin"
    });

    let data = {};
    try {
        data = await response.json();
    } catch (e) {
        return {
            ok: false,
            token: null,
            message: "Resposta inválida da API de login."
        };
    }

    if (!response.ok) {
        return {
            ok: false,
            token: null,
            message: data && data.message ? data.message : "Erro no login."
        };
    }

    return {
        ok: !!data.token,
        token: data.token || null,
        raw: data,
        message: data && data.message ? data.message : null
    };
}

export function saveToken(token) {
    if (!token) return;
    try {
        localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
    }
}

export function getToken() {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch (e) {
        return null;
    }
}

export function clearToken() {
    try {
        localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
    }
}

export function decodeTokenPayload(token) {
    if (!token) return null;
    try {
        const parts = token.split(".");
        if (parts.length < 2) return null;
        let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        base64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
        const json = atob(base64);
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
}

export function getCurrentUser() {
    const token = getToken();
    if (!token) return null;
    const payload = decodeTokenPayload(token);
    if (!payload || !payload.sub) return null;
    return payload.sub;
}

export function isFuncionario() {
    const user = getCurrentUser();
    const cargo = user && user.cargo && typeof user.cargo === "string" ? user.cargo.toLowerCase() : "";
    return cargo === "func";
}

export function isCliente() {
    const user = getCurrentUser();
    const cargo = user && user.cargo && typeof user.cargo === "string" ? user.cargo.toLowerCase() : "";
    return cargo === "cliente";
}