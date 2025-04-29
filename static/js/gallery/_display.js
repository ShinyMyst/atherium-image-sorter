import { passesFilters } from './_filters_pass.js';

export function displayImages() {
    try {
        // Get active filters with fallbacks
        const filters = {
            model: modelSelect.value || "any",
            sampling: samplingSelect.value || "any",
            loras: getActiveLoras(),
            tags: getActiveTags()
        };

        // Process and display images
        grid.innerHTML = "";
        const images = JSON.parse('{{ image_json | tojson | safe }}');

        images.forEach(img => {
            if (passesFilters(img, filters)) {
                grid.appendChild(createImageContainer(img));
            }
        });
    } catch (error) {
        console.error("Error displaying images:", error);
    }
};

// Event Listeners

// Loras and tags need their own file
// Actually the LORA one is short.  TODO maybe put all event listeners in gallery.
// At the very least put these and the LoRA there.


// TODO - Keep in mind that currently, this updates EVERYTHING when something is changed.
// Ideally, we should  only update the element being changed and not get all filters from scratch
// Get and set filters when webpage loaded.
// Update the portion of filter that changes only