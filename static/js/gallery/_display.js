import { passesFilters } from './_filters.js';


function _imageContainer(img) {
    const container = document.createElement("div");
    container.className = "image-container";

    container.innerHTML = `
        <img src="${img.url}" alt="Generated Image" style="cursor:pointer">

        <div class="overlay-rating">
            <button class="rating-btn minus-btn">-</button>
            <span class="rating-value">${img.ranking || 0}</span>
            <button class="rating-btn plus-btn">+</button>
        </div>

        <div class="image-details">
            <p>Model: ${img.model}</p>
            <p>Sampling: ${img["Sampling Method"]}</p>
            ${Object.entries(img.LoRA).map(([k,v]) => `<p>${k}: ${v}</p>`).join('')}
            ${img.Tags ? `<p>Tags: ${img.Tags.join(', ')}</p>` : ''}
        </div>
    `;
    // TODO - Add more details into the image details?

    // Button event handlers
    container.querySelector('.plus-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const ratingEl = container.querySelector('.rating-value');  // live changes b4 file updates
        ratingEl.textContent = parseInt(ratingEl.textContent) + 1;  // live changes
        updateRating(img.url, 1);
    });

    container.querySelector('.minus-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const ratingEl = container.querySelector('.rating-value');  // live changes
        ratingEl.textContent = parseInt(ratingEl.textContent) - 1;  // live changes
        updateRating(img.url, -1);
    });

    // Event handlers
    container.querySelector('img').addEventListener('click', () => {
        window.open(img.url, "_blank");
    });



    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-btn";

editButton.addEventListener("click", (e) => {
    e.stopPropagation();
    alert("Edit clicked for: " + img.url);
});

container.style.position = "relative";  // Needed for absolute positioning inside
container.appendChild(editButton);

// Check Box
const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.className = "select-checkbox";
container.appendChild(checkbox);
checkbox.addEventListener("change", () => {
const anyChecked = document.querySelectorAll(".select-checkbox:checked").length > 0;
const actionBar = document.querySelector("#action-bar");

if (anyChecked) {
actionBar.style.display = "block";
} else {
actionBar.style.display = "none";
}
});


    return container;
}

document.getElementById("bulk-action-btn").addEventListener("click", () => {
    const checkedBoxes = document.querySelectorAll(".select-checkbox:checked");
    const urls = [];

    checkedBoxes.forEach(checkbox => {
        const container = checkbox.closest(".image-container");
        const img = container.querySelector("img");
        if (img && img.src) {
            urls.push(img.src);
        }
    });

    if (urls.length > 0) {
        alert("Selected image URLs:\n\n" + urls.join("\n"));
    } else {
        alert("No images selected.");
    }
});


export function displayImages(image_data) {
    const grid = document.querySelector(".grid");
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

// TODO - Maybe jsut add this to event handler directly?
function updateRating(imageUrl, change) {
    fetch(`/update-rating?image_url=${encodeURIComponent(imageUrl)}&change=${change}`, {
        method: 'POST'
    });
}

// TODO - Some of this does not actually need to be dynamic and could be moved to HTML?