export function ErrorMessage(...paragraphs) {

    let paragraphsTag = "";
    paragraphs.forEach(paragraph => {
        paragraphsTag =  `
            ${paragraphsTag}
            <p>${paragraph}</p>
        `
    });

    const alertDiv = document.createElement('div');
    alertDiv.classList.add("alert", "alert-danger");
    alertDiv.role = "alert";
    alertDiv.innerHTML = `
        <h4 class="alert-heading">Erro</h4>
        <hr>
        ${paragraphsTag}
    `;
    alertDiv.style.marginTop = "20px";

    return alertDiv;
}