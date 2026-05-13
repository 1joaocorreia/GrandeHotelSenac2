export default function Hero() {
    const containerHero = document.createElement('div');
    containerHero.className = 'hero w-100 d-flex justify-content-center';
    containerHero.innerHTML =
   `
   <div class = "hero-frame  w-100">
     <div id="carouselExampleIndicators" class="carousel slide">
    <div class="carousel-indicators">
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
    </div>

    <div class="carousel-inner shadow">

      <div class="carousel-item active">
        <img src="/public/assets/images/carousel1.jpg" class="d-block w-100" alt="...">
      </div>

      <div class="carousel-item">
        <img src="/public/assets/images/carousel2.jpg" class="d-block w-100" alt="...">
      </div>

      <div class="carousel-item">
        <img src="/public/assets/images/carousel3.jpg" class="d-block w-100" alt="...">
      </div>

    </div>

    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
      <span aria-hidden="true"></span>
      <span class="visually-hidden"></span>
    </button>

    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
      <span aria-hidden="true"></span>
      <span class="visually-hidden"></span>
    </button>

  </div>
</div>`;
 
return containerHero;
}