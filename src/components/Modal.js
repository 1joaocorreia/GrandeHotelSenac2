export function showModal(title, message) {
  let modal = document.getElementById("globalModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "globalModal";
    modal.className = "modal fade";
    modal.tabIndex = -1;
    modal.innerHTML = `
<div class="modal-dialog modal-dialog-centered">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title"></h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body"></div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Fechar</button>
    </div>
  </div>
</div>`;
    document.body.appendChild(modal);
  }
  const titleElement = modal.querySelector(".modal-title");
  const bodyElement = modal.querySelector(".modal-body");
  if (titleElement) {
    titleElement.textContent = title || "";
  }
  if (bodyElement) {
    bodyElement.textContent = message || "";
  }
  const instance = window.bootstrap && window.bootstrap.Modal ? window.bootstrap.Modal.getOrCreateInstance(modal) : null;
  if (instance) {
    instance.show();
  } else {
    modal.classList.add("show");
    modal.style.display = "block";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

    const closeBtn = modal.querySelector(".btn-close");
    const okBtn = modal.querySelector("#modalOkButton");

    const hideModal = () => {
      modal.classList.remove("show");
      modal.style.display = "none";
      modal.style.backgroundColor = "";
    };

    if (closeBtn) closeBtn.onclick = hideModal;
    if (okBtn) okBtn.onclick = hideModal;
  }
}