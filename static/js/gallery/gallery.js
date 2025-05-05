import { initTags } from './_elements.js';
import { displayImages } from './_display.js';



// ========== Image Display ==========
export function initGallery(IMAGE_DATA) {
    // ========== Constants ==========
    const modelSelect = document.querySelector("select[name='model']");
    const samplingSelect = document.getElementById('sampling-method');
    const loraSelect = document.querySelectorAll('.filter-box');
    const tagSelect = document.getElementById('tags-container');


    initTags()

    // ========== Event Listeners and Filter Updates ==========
    modelSelect.addEventListener('change', () => displayImages(IMAGE_DATA));
    samplingSelect.addEventListener('change', () => displayImages(IMAGE_DATA));

    loraSelect.forEach(box => {
        const input = box.querySelector('.value-input');

        // Click
        box.addEventListener('click', () => {
            box.classList.toggle('active');
            input.value = box.classList.contains('active') ? '0.7' : '0';
            displayImages(IMAGE_DATA);
        });

        // Enter key
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const isActive = parseFloat(input.value) > 0;
                box.classList.toggle('active', isActive);

                if (isActive && input.value === '0') {
                    input.value = '0.7';
                }
                displayImages(IMAGE_DATA);
                e.preventDefault();
            }
        });

        // Direct
        input.addEventListener('change', () => {
            box.classList.toggle('active', parseFloat(input.value) > 0);
            displayImages(IMAGE_DATA);
        });
    });

    tagSelect.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag')) {
            e.target.classList.toggle('active');
            displayImages(IMAGE_DATA);
        }
    });

    displayImages(IMAGE_DATA)
};

// TODO - GREAT now it works but I've made it a bit messy again in fixing it.  Compartmentalize it more?
// TODO - and redesign the boxes.  They're messy.

// TODO - Keep in mind that currently, this updates EVERYTHING when something is changed.
// Ideally, we should  only update the element being changed and not get all filters from scratch
// Get and set filters when webpage loaded.
// Update the portion of filter that changes only