function getActiveTags() {
    return Array.from(document.querySelectorAll('#tags-container .tag.active'))
        .map(tag => tag.dataset.tag);
}


function getActiveLoras() {
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

function getCurrentFilters() {
    return {
        model: document.querySelector("select[name='model']").value || "any",
        sampling: document.getElementById('sampling-method').value || "any",
        loras: getActiveLoras(),
        tags: getActiveTags()
    };
}

function checkLoras(imageLoras, activeLoras) {
    return activeLoras.every(filterLora => {
        const imgLoraKey = Object.keys(imageLoras).find(
            key => key.toLowerCase() === filterLora.name.toLowerCase()
        );
        return imgLoraKey && imageLoras[imgLoraKey] === filterLora.value;
    });
}

function checkTags(imageTags, activeTags) {
    return imageTags && imageTags.some(tag => activeTags.includes(tag));
}

export function passesFilters(img) {
    filters = getCurrentFilters()

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
}
