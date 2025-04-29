import { getCurrentFilters } from './getFilters.js';

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
    if (filters.loras.length > 0 && !_checkLoras(img.LoRA, filters.loras)) {
        return false;
    }

    // Tag checks
    if (filters.tags.length > 0 && !_checkTags(img.Tags, filters.tags)) {
        return false;
    }

    return true;
}
