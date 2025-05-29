document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const addButton = document.getElementById('add-lora');
    const container = document.getElementById('dynamic-lora-container');

    // Add new LoRA entry
    addButton.addEventListener('click', function() {
        const loraName = prompt("Enter LoRA name:");
        if (!loraName) return;

        const newEntry = document.createElement('div');
        newEntry.className = 'dynamic-lora-entry';
        newEntry.innerHTML = `
            <div class="lora-name">
                <span>${loraName}</span>
            </div>
            <div class="lora-value">
                <input type="number"
                       data-lora-name="${loraName}"
                       value="0.7" min="0" max="8" step="0.1">
            </div>
            <button type="button" class="remove-lora">×</button>
        `;

        newEntry.querySelector('.remove-lora').addEventListener('click', function() {
            container.removeChild(newEntry);
        });

        container.appendChild(newEntry);
    });

    // Process form submission
    form.addEventListener('submit', function(e) {
        const loraData = {};

    document.querySelectorAll('#lora-container input[type="number"]').forEach(input => {
        const name = input.name || input.dataset.loraName;
        const value = parseFloat(input.value);
        if (value !== 0) {
            loraData[name] = value;
        }
    });

        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = 'lora_data';
        hiddenField.value = JSON.stringify(loraData);
        form.appendChild(hiddenField);
    });
});