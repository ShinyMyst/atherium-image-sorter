// Load other modules
import { initDisplay } from './gallery/display.js';
import { initFilters } from './gallery/filters.js';
import { initTags } from './gallery/tags.js';
import { initLoras } from './gallery/lora.js';

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    // TODO - change the name for these in HTML
    const grid = document.querySelector(".grid");
    const modelSelect = document.querySelector("select[name='model']");
    const samplingSelect = document.getElementById('sampling-method');
    const tagsContainer = document.getElementById('tags-container');

    if (!grid || !modelSelect || !samplingSelect || !tagsContainer) {
        console.error("Critical elements missing");
        return;
    }

    // Initialize each module
    initDisplay();
    initFilters();
    initTags();
    initLoras();

});

// TODO - Do not work on this futher until HTML updated to use WTForm everywhere