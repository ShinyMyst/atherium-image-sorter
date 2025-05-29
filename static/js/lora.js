document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('add-lora');
    const container = document.getElementById('dynamic-lora-container');

    if (!addButton || !container) return;

    addButton.addEventListener('click', function() {
        const loraName = prompt("Enter LoRA name:");
        if (!loraName) return;

        // Create clean field name
        const fieldName = loraName;
        const entryId = container.children.length;

        const newEntry = document.createElement('div');
        newEntry.className = 'lora-submit';
        newEntry.innerHTML = `
            <div class="lora-name">
                <span>${loraName}</span>
            </div>
            <div class="lora-value">
                <input type="number" name="${fieldName}"
                       value="0.7" min="0" max="1" step="0.1">
            </div>
            <button type="button" class="remove-lora">×</button>
        `;

        newEntry.querySelector('.remove-lora').addEventListener('click', function() {
            container.removeChild(newEntry);
        });

        container.appendChild(newEntry);
    });
});