// Get Filter Info
function _getActiveTags() {
    return Array.from(document.querySelectorAll('#tags-container .tag.active'))
        .map(tag => tag.dataset.tag);
}


function _getActiveLoras() {
    const active = [];
    document.querySelectorAll('.lora-filter.active').forEach(box => {
        const input = box.querySelector('.lora-value');
        if (input) {
            active.push({
                name: box.dataset.loraName,
                value: parseFloat(input.value) || 0
            });
        }
    });
    return active;
}

export function getCurrentFilters() {
    return {
        model: document.querySelector("select[name='model']").value || "any",
        sampling: document.getElementById('sampling-method').value || "any",
        loras: _getActiveLoras(),
        tags: _getActiveTags()
    };
}

// Check if filter passes
function _checkLoras(imageLoras, activeLoras) {
    return activeLoras.every(filterLora => {
        const imgLoraKey = Object.keys(imageLoras).find(
            key => key.toLowerCase() === filterLora.name.toLowerCase()
        );
        return imgLoraKey && imageLoras[imgLoraKey] === filterLora.value;
    });
}

function _checkTags(imageTags, activeTags) {
    return imageTags && imageTags.some(tag => activeTags.includes(tag));
}

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
    if (filters.loras.length > 0 && !_checkLoras(img.LoRA, filters.loras)) {
        return false;
    }

    // Tag checks
    if (filters.tags.length > 0 && !_checkTags(img.Tags, filters.tags)) {
        return false;
    }

    return true;
}
