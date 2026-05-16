export function LeftMenuRow(selected = false, title, id) {
    return `
        <button class="${(selected) ? "selected-row" : "unselected-row"} row-button" id=${id}>${title}</button>
    `;
}

export function LeftMenu(maxWidth, rows) {
    return `
        <div style="max-width: ${maxWidth}; width: ${maxWidth}; max-height: 100%; height: 100%; overflow-y: auto; background-color: #111111; align-self: flex-start;" id="left-menu-container">
            ${rows.join("\n")}
        </div>
    `;
}