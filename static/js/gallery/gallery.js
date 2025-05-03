import { initTags, initImageContainer } from './_elements.js';
import { passesFilters, getCurrentFilters } from './_filters.js';

export function initGallery(IMAGE_DATA) {
    // ========== Constants ==========
    const grid = document.querySelector(".grid");
    const modelSelect = document.querySelector("select[name='model']");
    const samplingSelect = document.getElementById('sampling-method');
    const loraSelect = document.querySelectorAll('.filter-box');
    const tagSelect = document.getElementById('tags-container');

    // ========== Image Display ==========
    function displayImages() {
        try {
            const imageArray = Array.isArray(IMAGE_DATA) ? IMAGE_DATA : [];
            console.log("First image:", imageArray[0]?.url);
            console.log("TRY")
            grid.innerHTML = "";
            //TODO - lora and tags are both [] so maybe the filter is looking for blank instead of any
            console.log("Image data length:", IMAGE_DATA.length);
            IMAGE_DATA.forEach(img => {
                console.log(":TEST")
                if (passesFilters(img)) {
                    console.log("TRUE")
                    grid.appendChild(initImageContainer(img));
                }
                console.log("FALSE")
            });
        } catch (error) {
            console.error("RENDER ERROR:", error);
        }
    }

    initTags()

    // ========== Event Listeners and Filter Updates ==========
    modelSelect.addEventListener('change', displayImages);
    samplingSelect.addEventListener('change', displayImages);

    loraSelect.forEach(box => {
        box.addEventListener('click', () => {
            box.classList.toggle('active');
            const input = box.querySelector('.value-input');
            input.value = box.classList.contains('active') ? '0.7' : '0';
            displayImages();
        });
    });

    tagSelect.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag')) {
            e.target.classList.toggle('active');
            displayImages();
        }
    });
    displayImages()
};

// TODO - Once everything located here, see if webpage functions again

// TODO - Lora box does not properly track value changes yet and only toggles

// TODO - Keep in mind that currently, this updates EVERYTHING when something is changed.
// Ideally, we should  only update the element being changed and not get all filters from scratch
// Get and set filters when webpage loaded.
// Update the portion of filter that changes only