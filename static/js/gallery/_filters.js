/******************************
 * Filters          *
 ******************************/
export function passesFilters(img) {
    const filters = getCurrentFilters()

    // Model Check
    if (filters.model.length > 0) {
        if (!filters.model.map(m => m.toLowerCase()).includes(img.model.toLowerCase())) {
            return false;
        }
    }

    // Sampling check
    if (filters.sampling.toLowerCase() !== "any" && img["Sampling Method"].toLowerCase() !== filters.sampling.toLowerCase()) {
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
        model: _getModels(),
        sampling: document.getElementById('sampling-method').value || "any",
        loras: _getActiveLoras(),
        tags: _getActiveTags()
    };
}

function _getModels() {
    const modelSelectElement = document.querySelector("select[name='model']");
    let selectedModels = [];

    if (modelSelectElement) {
        selectedModels = Array.from(modelSelectElement.selectedOptions).map(option => option.value);
    }

    if (selectedModels.length === 0 || selectedModels.includes("Any")) {
        return [];
    }

    return selectedModels;
}


function checkLoras(imageLoras, activeLoras) {
    if (!imageLoras) return false;
    const lowerImageLoraNames = Object.keys(imageLoras).map(key => key.toLowerCase());
    return activeLoras.every(filterLoraName => {
        return lowerImageLoraNames.includes(filterLoraName.toLowerCase());
    });
    /* Disabled portion of code for also checking strength
    return activeLoras.every(filterLora => {
        const imgLoraKey = Object.keys(imageLoras).find(
            key => key.toLowerCase() === filterLora.name.toLowerCase()
        );
        const matches = imageLoras[imgLoraKey] == filterLora.value;
        return matches
    }); */
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
        active.push(box.dataset.lora);
        // Below is previous code for including strength as well.
        // Disabling it for time being as LoRAs alone are enough.
        /*const input = box.querySelector('.value-input');
        if (input) {
            active.push({
                name: box.dataset.lora,
                value: parseFloat(input.value) || 0
            });
        } */
    });
    return active;
}
