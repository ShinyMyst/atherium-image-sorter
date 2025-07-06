/******************************
 * Image Containers             *
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
                <p><strong><u>Model:</u></strong> ${img.model}</p>
                <p><strong><u>Sampling Method:</u></strong> ${img["Sampling Method"]}</p>
                <p><strong><u>Sampling Steps:</u></strong> ${img["Sampling Steps"]}</p>
                <p><strong><u>CFG Scale:</u></strong> ${img["CFG Scale"]}</p>
                ${img.LoRA && Object.keys(img.LoRA).length > 0 ?
                    `<p><strong><u>LoRA:</u></strong></p>` +
                    Object.entries(img.LoRA).map(([k, v]) => `<p>${k}: ${v}</p>`).join('')
                    : ''
                }
                ${img.Tags && img.Tags.length > 0 ? `<p><strong><u>Tags:</u></strong> ${img.Tags.join(', ')}</p>` : ''}
                ${img.Prompt ? `<p><strong><u>Prompt:</u></strong> ${img.Prompt}</p>` : ''}
            </div>
        </div>
    `;

    // Clicking box and check box.
    const checkbox = container.querySelector(".select-checkbox");

    container.addEventListener("click", (e) => {
        // Prevent immediate bubbling if a child element like a button was clicked.
        if (e.target.closest('.edit-btn') || e.target.closest('.select-checkbox') || e.target.closest('.rating-controls')) {
            return;
        }

        const editModeCheckbox = document.querySelector('.sidebar .switch input[type="checkbox"]');
        if (editModeCheckbox && editModeCheckbox.checked) {
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                // Manually trigger the change event to ensure the action bar updates
                const changeEvent = new Event('change');
                checkbox.dispatchEvent(changeEvent);
            }
        } else {
            // Open image in new tab if edit mode is off
            window.open(img.url, "_blank");
        }
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
    if (checkbox) {
        // Activate Action Bar
        checkbox.addEventListener("change", () => {
            const anyChecked = document.querySelectorAll(".select-checkbox:checked").length > 0;
            if (anyChecked) {
                updateActionBarVisibility(true);
            } else {
                updateActionBarVisibility(false);
            }
        });
    }
    return container;
}