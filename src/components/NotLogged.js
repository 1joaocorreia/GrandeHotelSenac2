export default function NotLogged() {

    return `
        <div style="max-width: 80%; width: 80%; background-color: #262626; border: 10px solid #9da16e; text-align: center; margin-top: 10%; padding: 3rem;" id="not-logger-container">
            <h1 style="color: #9da16e;">PÁGINA INDISPONÍVEL</h1>
            <p style="color: white;">Para acessar esta página, você deve estar logado no sistema.</p>
            <p style="color: white;">Realize <a href="/login" style="color: #9da16e;">login</a> caso possua uma conta ou <a href="/register" style="color: #9da16e;">crie uma</a>.</p>
        </div>
    `;

}