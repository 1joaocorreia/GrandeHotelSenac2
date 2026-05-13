export default function Loading(gifsize) {

    return `
        <div style="text-align: center;">
            <img src="/public/assets/images/loading.gif" alt="Gif de carregamento" style="width: ${gifsize};">
            <h1 style="color: #E0E0E0; font-size: 18px; font-weigth: bold; margin-top: 10px;">Carregando...</h1>
        </div>
    `;

}