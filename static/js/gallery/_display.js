import { passesFilters } from './_filters.js';

function _imageContainer(img) {
    const container = document.createElement("div");
    container.className = "image-container";

    container.innerHTML = `
        <img src="${img.url}" alt="Generated Image" style="cursor:pointer">
        <div class="image-details" style="display:none">
            <p>Model: ${img.model}</p>
            <p>Sampling: ${img["Sampling Method"]}</p>
            ${Object.entries(img.LoRA).map(([k,v]) => `<p>${k}: ${v}</p>`).join('')}
            ${img.Tags ? `<p>Tags: ${img.Tags.join(', ')}</p>` : ''}
        </div>
    `;

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
