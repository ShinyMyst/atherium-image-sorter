import { initTags } from './_elements.js';
import { displayImages } from './_img_container.js';
import { initActionBar } from './_action_bar.js';
import { updateTags } from './_api.js';

export function initGallery(IMAGE_DATA) {
    // ========== Constants ==========
    const modelSelect = document.querySelector("select[name='model']");
    const samplingSelect = document.getElementById('sampling-method');
    const loraSelect = document.querySelectorAll('.lora-box');
    const sidebarTagContainer = document.getElementById('tags-container');

    initTags();

    // ========== Event Listeners and Filter Updates (existing) ==========
    if (modelSelect) modelSelect.addEventListener('change', () => displayImages(IMAGE_DATA));
    if (samplingSelect) samplingSelect.addEventListener('change', () => displayImages(IMAGE_DATA));

    loraSelect.forEach(box => {
        const input = box.querySelector('.value-input');
        if (input) { // Ensure input exists before adding listeners
            box.addEventListener('click', () => {
                box.classList.toggle('active');
                input.value = box.classList.contains('active') ? '0.7' : '0';
                displayImages(IMAGE_DATA);
            });
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
            input.addEventListener('change', () => {
                box.classList.toggle('active', parseFloat(input.value) > 0);
                displayImages(IMAGE_DATA);
            });
        }
    });

    if (sidebarTagContainer) {
        sidebarTagContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag')) {
                e.target.classList.toggle('active');
                displayImages(IMAGE_DATA);
            }
        });
    }

    initActionBar();
    displayImages(IMAGE_DATA);
}
