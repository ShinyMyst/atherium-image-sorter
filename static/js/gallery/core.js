// Load other modules
// import { initDisplay } from './gallery/display.js';
// import { initFilters } from './gallery/filters.js';
import { initTags } from './tags.js';
// import { initLoras } from './gallery/lora.js';

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    // TODO - change the name for these in HTML
    //const imageGrid = document.querySelector(".grid");
    //const modelSelect = document.querySelector("select[name='model']");
    //const samplingMethod = document.getElementById('sampling-method');
    //const tagsContainer = document.getElementById('tags-container');

    //if (!imageGrid || !modelSelect || !samplingMethod || !tagsContainer) {
    //    console.error("Critical elements missing");
    //    return;
    //}

    // Initialize each module
    //initDisplay();
    //initFilters();
    initTags();
    //initLoras();

    document.addEventListener('tagsChanged', displayImages);

});
