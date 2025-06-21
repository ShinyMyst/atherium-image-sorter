document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const addButton = document.getElementById('add-lora');
    const container = document.getElementById('dynamic-lora-container');

    // Add new LoRA entry
    addButton.addEventListener('click', () => {
        const loraName = prompt("Enter LoRA name:");
        if (!loraName) return;

        const entry = document.createElement('div');
        entry.className = 'dynamic-lora-entry';
        entry.innerHTML = `
            <div class="lora-name">${loraName}</div>
            <input type="number" name="lora-${loraName}"
                   value="0.7" min="0" max="2" step="0.1">
            <button type="button" class="remove-lora">×</button>
        `;

        entry.querySelector('.remove-lora').addEventListener('click', () => {
            entry.remove();
        });

        container.appendChild(entry);
    });

    // Process form submission
    form.addEventListener('submit', (e) => {
        const loraData = {};

        // Collect all LoRA values
        document.querySelectorAll('#lora-container input[type="number"]').forEach(input => {
            const value = parseFloat(input.value);
            if (!isNaN(value) && value !== 0) {
                loraData[input.name.replace('lora-', '')] = value;
            }
        });

        // Store data in hidden field
        const hiddenField = document.getElementById('lora-data');
        if (hiddenField) hiddenField.value = JSON.stringify(loraData);
    });
});