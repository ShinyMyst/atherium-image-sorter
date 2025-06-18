import { passesFilters } from './_filters.js';

// Define updateRating and updateTags functions here or import them from _api.js
// (Assuming they are defined within this file as per your previous snippet)
function updateRating(imageUrl, change) {
    fetch(`/update-rating?image_url=${encodeURIComponent(imageUrl)}&change=${change}`, {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            console.error('Failed to update rating:', response.statusText);
        }
    })
    .catch(error => console.error('Error updating rating:', error));
}

function updateTags(imageUrls, tags) {
    console.warn("The updateTags function needs review and a proper endpoint for bulk operations.");
    fetch('/update-tags-bulk', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            imageUrls: imageUrls,
            tags: tags
        })
    })
    .then(response => {
        if (!response.ok) {
            console.error('Failed to update tags:', response.statusText);
        }
    })
    .catch(error => console.error('Error updating tags:', error));
}

function _imageContainer(img) {
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
                <p>Sampling: ${img["Sampling Method"]}</p>
                ${Object.entries(img.LoRA || {}).map(([k, v]) => `<p>${k}: ${v}</p>`).join('')}
                ${img.Tags && img.Tags.length > 0 ? `<p>Tags: ${img.Tags.join(', ')}</p>` : ''}
            </div>
        </div>
    `;

    // Button event handlers
    // NOW get references to the elements AFTER they are in the innerHTML
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

    container.querySelector('img').addEventListener('click', () => {
        window.open(img.url, "_blank");
    });

    // Get reference to the edit button from the innerHTML
    const editButton = container.querySelector(".edit-btn");
    if (editButton) { // Always good to check if element exists before adding listener
        editButton.addEventListener("click", (e) => {
            e.stopPropagation();
            alert("Edit clicked for: " + img.url);
        });
    }


    // Get reference to the checkbox from the innerHTML
    const checkbox = container.querySelector(".select-checkbox");
    if (checkbox) { // Always good to check if element exists before adding listener
        checkbox.addEventListener("change", () => {
            const anyChecked = document.querySelectorAll(".select-checkbox:checked").length > 0;
            const actionBar = document.querySelector("#action-bar");

            if (actionBar) {
                // Use "flex" here, as your action-bar CSS uses display: flex
                if (anyChecked) {
                    actionBar.style.display = "flex";
                } else {
                    actionBar.style.display = "none";
                }
            }
        });
    }

    return container;
}


export function displayImages(image_data) {
    const grid = document.querySelector(".grid");
    if (!grid) {
        console.error("Error: .grid element not found in the DOM. Images cannot be displayed.");
        return; // Exit if grid is not found
    }
    try {
        grid.innerHTML = "";

        image_data.forEach(img => {
            if (passesFilters(img)) {
                grid.appendChild(_imageContainer(img));
            }
        });
    } catch (error) {
        console.error("RENDER ERROR:", error);
    }
}