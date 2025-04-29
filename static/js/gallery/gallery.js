// TODO - Initialize all the other scripts here instead.
// Pass the displayImages function to them so they can handle their own events


function displayImages() {
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
}
