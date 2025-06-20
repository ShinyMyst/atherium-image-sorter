import { initTags } from './_elements.js';
import { initImageContainers } from './_img_container.js';
import { initActionBar } from './_action_bar.js';


export function initGallery(IMAGE_DATA) {
    // ========== Constants ==========
    const modelSelect = document.querySelector("select[name='model']");
    const samplingSelect = document.getElementById('sampling-method');
    const loraSelect = document.querySelectorAll('.lora-box');
    const sidebarTagContainer = document.getElementById('tags-container');

    initTags();

    // ========== Event Listeners and Filter Updates (existing) ==========
    if (modelSelect) modelSelect.addEventListener('change', () => initImageContainers(IMAGE_DATA));
    if (samplingSelect) samplingSelect.addEventListener('change', () => initImageContainers(IMAGE_DATA));

    loraSelect.forEach(box => {
        const input = box.querySelector('.value-input');
        if (input) { // Ensure input exists before adding listeners
            box.addEventListener('click', () => {
                box.classList.toggle('active');
                input.value = box.classList.contains('active') ? '0.7' : '0';
                initImageContainers(IMAGE_DATA);
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const isActive = parseFloat(input.value) > 0;
                    box.classList.toggle('active', isActive);
                    if (isActive && input.value === '0') {
                        input.value = '0.7';
                    }
                    initImageContainers(IMAGE_DATA);
                    e.preventDefault();
                }
            });
            input.addEventListener('change', () => {
                box.classList.toggle('active', parseFloat(input.value) > 0);
                initImageContainers(IMAGE_DATA);
            });
        }
    });

    if (sidebarTagContainer) {
        sidebarTagContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag')) {
                e.target.classList.toggle('active');
                initImageContainers(IMAGE_DATA);
            }
        });
    }

    initActionBar();
    initImageContainers(IMAGE_DATA);
}
