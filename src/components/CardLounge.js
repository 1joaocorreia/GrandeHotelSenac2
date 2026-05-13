export default function CardLounge(cardLoungeItem, index) {
    const { path, title, previewText, text } = cardLoungeItem || {};
    const delay = typeof index === "number" ? index * 80 : 0;

    const cardWrapper = document.createElement("div");
    cardWrapper.className = "card-lounge-wrapper";
    cardWrapper.innerHTML = `
    <div class="card card-lounge" style="animation-delay: ${delay}ms">
        <div class="card-lounge-image-wrapper">
            <img 
                src="/public/assets/images/${path}" 
                class="card-img-top card-lounge-img" 
                alt="${title || ""}"
            >
            <div class="card-lounge-overlay">
                <span class="card-lounge-overlay-text">Ver detalhes</span>
            </div>
        </div>
        <div class="card-body card-lounge-body">
            <h3 class="card-lounge-title">${title}</h3>
            <p class="card-lounge-preview">${previewText}</p>
            <div class="card-lounge-more">
                <p class="card-lounge-text">${text}</p>
            </div>
        </div>
    </div>
    `;

    return cardWrapper;
}
