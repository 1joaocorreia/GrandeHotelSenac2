export default function ChangeDialog(label, oldValue, hideText = false) {

	const dialogContainer = document.createElement('div');
    dialogContainer.id = "dialog-container";
	dialogContainer.innerHTML = `
			<div class="dialog-header">
            	<h1>Alterando: ${label}</h1>
            </div>
            <div class="dialog-body">
            	<p style="border: 2px dashed white; padding: 5px;"><b>VALOR ATUAL</b>: ${oldValue}</p>
                <label for="dialog-input"><b>Novo valor:</b></label>
                <input id="dialog-input" type="${(hideText)?"hidden":"text"}">
            </div>
            <div style="display: flex; flex-flow: column nowrap;">
				<button id="save-change">SALVAR</button>
                <button id="cancel-change">CANCELAR</button>
            </div>
    `;
    return dialogContainer;
}
