/******************************
 * Image Containers           *
 ******************************/
import { passesFilters } from './_filters.js';
import { updateRating, updateDetails } from './_api.js';
import { updateActionBarVisibility } from './_action_bar.js';

export function initImageContainers(image_data) {
    const grid = document.querySelector(".grid");
    if (!grid) {
        console.error("Error: .grid element not found in the DOM. Images cannot be displayed.");
        return;
    }
    try {
        grid.innerHTML = "";

        image_data.forEach(img => {
            if (passesFilters(img)) {
                grid.appendChild(imageContainer(img));
            }
        });
    } catch (error) {
        console.error("RENDER ERROR:", error);
    }
}

function imageContainer(img) {
    const container = document.createElement("div");
    container.className = "image-container";

    container.innerHTML = `
        <img src="${img.url}" alt="Generated Image" style="cursor:pointer">

        <div class="image-overlay-details">
            <button class="edit-btn">Edit</button>
            <input type="checkbox" class="select-checkbox">

            <div class="rating-controls">
                <button class="rating-btn minus-btn">-</button>
                <span class="rating-value">${img.ranking || 0}</span>
                <button class="rating-btn plus-btn">+</button>
            </div>

            <div class="metadata-details">
                <p>Model: ${img.model}</p>
                <p>Sampling Method: ${img["Sampling Method"]}</p>
                <p>Sampling Steps: ${img["Sampling Steps"]}</p>
                <p>CFG Scale: ${img["CFG Scale"]}</p>
                ${Object.entries(img.LoRA || {}).map(([k, v]) => `<p>LoRA ${k}: ${v}</p>`).join('')}
                ${img.Tags && img.Tags.length > 0 ? `<p>Tags: ${img.Tags.join(', ')}</p>` : ''}
                ${img.Prompt ? `<p>Prompt: ${img.Prompt}</p>` : ''}
            </div>
        </div>
    `;

    // Image Event Handler
    container.querySelector('img').addEventListener('click', () => {
        window.open(img.url, "_blank");
    });


    // Rating Event Handlers
    container.querySelector('.plus-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const ratingEl = container.querySelector('.rating-value');
        ratingEl.textContent = parseInt(ratingEl.textContent) + 1;
        updateRating(img.url, 1);
    });

    container.querySelector('.minus-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const ratingEl = container.querySelector('.rating-value');
        ratingEl.textContent = parseInt(ratingEl.textContent) - 1;
        updateRating(img.url, -1);
    });

    // Edit Event Handlers
    const editButton = container.querySelector(".edit-btn");
    if (editButton) {
        editButton.addEventListener("click", (e) => {
            e.stopPropagation();
            updateDetails(img.url);
        });
    }

    // CheckBox Event Handlers
    const checkbox = container.querySelector(".select-checkbox");
    if (checkbox) {
        // Activate Action Bar
        checkbox.addEventListener("change", () => {
            const anyChecked = document.querySelectorAll(".select-checkbox:checked").length > 0;
            if (anyChecked) {
                updateActionBarVisibility(true); // Can only make bar appear but not disappear
            }
        });
    }
    return container;
};
