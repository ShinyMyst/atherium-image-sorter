import { displayImages } from './_display.js';

// Event Listeners for Filter Updates
const modelSelect = document.querySelector("select[name='model']");
const samplingSelect = document.getElementById('sampling-method');
const loraSelect = document.querySelectorAll('.filter-box');
const tagSelect = document.getElementById('tags-container');

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

// TODO - Combine the filter functions into a singular file.  Perhaps event put them with display.js
// TODO - Consider changing how files are named.
// Not all elements are related to filter and need the display image function
// TODO - Initialize all the other scripts here instead.
// Pass the displayImages function to them so they can handle their own events
// TODO - Once everything located here, see if webpage functions again

// TODO - Lora box does not properly track value changes yet and only toggles

