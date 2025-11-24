export default function Footer() {
  const footer = document.createElement("div");

  footer.innerHTML = `
<footer class="footer-hotel mt-5">
  <div class="container py-4">
    <div class="row align-items-center gy-3">
      <div class="col-md-6 text-center text-md-start">
        <h5 class="footer-brand mb-1">Grande Hotel Senac</h5>
        <p class="footer-subtitle mb-0">Hotel-escola na Serra da Mantiqueira.</p>
      </div>
      <div class="col-md-6 text-center text-md-end">
        <p class="footer-contact mb-1">Campos do Jordão · SP · Brasil</p>
        <p class="footer-contact mb-2">Tel.: (12) 4000-2025 · reservas@grandehotelsenac.com.br</p>
        <div class="d-inline-flex gap-3">
          <a href="#"><img class="footer-link" src="public/assets/images/instagram.svg"></a>
          <a href="#"><img class="footer-link" src="public/assets/images/facebook.svg"></a>
          <a href="#"><img class="footer-link" src="public/assets/images/youtube.svg"></a>
        </div>
      </div>
    </div>
  </div>
  <div class="footer-bottom text-center py-2">
    <small>© ${new Date().getFullYear()} Grande Hotel Senac. Marca fictícia para fins acadêmicos.</small>
  </div>
</footer>
  `;

  return footer;
}
