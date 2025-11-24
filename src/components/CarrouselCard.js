export default function CarrouselCard(fotos = [], idSuffix = "") {
    const carrousel = document.createElement('div');

    const temFotos = Array.isArray(fotos) && fotos.length > 0;
    const carouselId = `carouselRoom${idSuffix || ""}`;

    if (!temFotos) {
        carrousel.innerHTML = `
            <div class="carousel-placeholder">
                <img src="public/assets/images/icon.ico" class="d-block w-100" alt="Imagem do quarto">
            </div>
        `;
        return carrousel;
    }

    const indicators = fotos.map((_, index) => `
        <button 
            type="button" 
            data-bs-target="#${carouselId}" 
            data-bs-slide-to="${index}" 
            class="${index === 0 ? 'active' : ''}" 
            ${index === 0 ? 'aria-current="true"' : ''} 
            aria-label="Slide ${index + 1}">
        </button>
    `).join("");

    const items = fotos.map((foto, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="uploads/${foto}" class="d-block w-100" alt="Foto do quarto">
        </div>
    `).join("");

    carrousel.innerHTML = `
    <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
        ${indicators}
      </div>

      <div class="carousel-inner shadow">
        ${items}
      </div>

      <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Anterior</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Próximo</span>
      </button>
    </div>
    `;

    return carrousel;
}
