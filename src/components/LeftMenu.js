export function LeftMenuRow(selected = false, title, id) {
    return `
        <div style="max-width: 100%; width: 100%; margin-top: 10px;" class="${(selected) ? "selected-row": "unselected-row"}" id="${id}">
            <h1 style="color: white; font-size: 1rem; padding: 1rem; font-weight: bold;">${title}</h1>
        </div>
    `;
}

export default function LeftMenu(maxWidth, rows) {
    return `
        <div style="max-width: ${maxWidth}; width: ${maxWidth}; max-height: 100%; height: 100%; overflow-y: auto; background-color: #111111; align-self: flex-start;" id="left-menu-container">
            ${rows.join("\n")}
        </div>
    `;
}