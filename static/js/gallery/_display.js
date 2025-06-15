import { passesFilters } from './_filters.js';


function _imageContainer(img) {
    const container = document.createElement("div");
    container.className = "image-container";

    container.innerHTML = `
        <img src="${img.url}" alt="Generated Image" style="cursor:pointer">
        <div class="image-details" style="display:none">
            // Image Score (used to push it up or down the page)
            <div class="rating-controls">
                <button class="rating-btn minus-btn">-</button>
                <span class="rating-value">${img.ranking || 0}</span>
                <button class="rating-btn plus-btn">+</button>
            </div>
        // Image Data
            <p>Model: ${img.model}</p>
            <p>Sampling: ${img["Sampling Method"]}</p>
            ${Object.entries(img.LoRA).map(([k,v]) => `<p>${k}: ${v}</p>`).join('')}
            ${img.Tags ? `<p>Tags: ${img.Tags.join(', ')}</p>` : ''}

        </div>
    `;
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

    container.addEventListener('mouseenter', () => {
        container.querySelector('.image-details').style.display = 'block';
    });

    container.addEventListener('mouseleave', () => {
        container.querySelector('.image-details').style.display = 'none';
    });

    return container;
}


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
