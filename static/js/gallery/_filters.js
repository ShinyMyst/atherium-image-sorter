/******************************
 * Filters          *
 ******************************/
export function passesFilters(img) {
    const filters = getCurrentFilters()

    // Model check
    if (filters.model !== "any" && img.model.toLowerCase() !== filters.model.toLowerCase()) {
        return false;
    }
    // Sampling check
    if (filters.sampling !== "any" && img["Sampling Method"].toLowerCase() !== filters.sampling.toLowerCase()) {
        return false;
    }
    // LoRA checks
    if (filters.loras.length > 0 && !checkLoras(img.LoRA, filters.loras)) {
        return false;
    }
    // Tag checks
    if (filters.tags.length > 0 && !checkTags(img.Tags, filters.tags)) {
        return false;
    }

    return true;
};

// Passes Filter Helpers
function getCurrentFilters() {
    return {
        model: document.querySelector("select[name='model']").value || "any",
        sampling: document.getElementById('sampling-method').value || "any",
        loras: _getActiveLoras(),
        tags: _getActiveTags()
    };
}

function checkLoras(imageLoras, activeLoras) {
    return activeLoras.every(filterLora => {
        const imgLoraKey = Object.keys(imageLoras).find(
            key => key.toLowerCase() === filterLora.name.toLowerCase()
        );
        const matches = imageLoras[imgLoraKey] == filterLora.value;
        return matches
    });
}

function checkTags(imageTags, selectedTags) {
    if (!imageTags || !Array.isArray(imageTags)) return false;

    const lowerImageTags = imageTags.map(tag => tag.toLowerCase());
    return selectedTags.every(selectedTag =>
        lowerImageTags.includes(selectedTag.toLowerCase())
    );
}

// Get Filter Helpers
function _getActiveTags() {
    return Array.from(document.querySelectorAll('#tags-container .tag.active'))
        .map(tag => tag.dataset.tag);
}

function _getActiveLoras() {
    const active = [];
    document.querySelectorAll('.lora-box.active').forEach(box => {
        const input = box.querySelector('.value-input');
        if (input) {
            active.push({
                name: box.dataset.lora,
                value: parseFloat(input.value) || 0
            });
        }
    });
    return active;
}
