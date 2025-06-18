import { initTags } from './_elements.js';
import { displayImages } from './_img_container.js';

export function initGallery(IMAGE_DATA) {
    // ========== Constants ==========
    const modelSelect = document.querySelector("select[name='model']");
    const samplingSelect = document.getElementById('sampling-method');
    const loraSelect = document.querySelectorAll('.lora-box');
    const sidebarTagContainer = document.getElementById('tags-container'); // Renamed for clarity


    initTags(); // This still initializes your *sidebar* tags

    // ========== Event Listeners and Filter Updates (existing) ==========
    modelSelect.addEventListener('change', () => displayImages(IMAGE_DATA));
    samplingSelect.addEventListener('change', () => displayImages(IMAGE_DATA));

    loraSelect.forEach(box => {
        const input = box.querySelector('.value-input');
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
    });

    sidebarTagContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag')) {
            e.target.classList.toggle('active');
            displayImages(IMAGE_DATA);
        }
    });


    // ===========================================
    // BULK ACTION BAR FUNCTIONALITY
    // ===========================================

    // Reference to action bar elements
    const actionBar = document.querySelector("#action-bar");
    const actionBarTagInput = document.getElementById('action-bar-tag-input');
    const addActionBarTagBtn = document.getElementById('action-bar-tag-btn');
    const actionBarTagsDisplay = document.getElementById('action-bar-tags-display');

    // Helper functions for action bar tags
    function actionBarTagExists(tagText) {
        return Array.from(actionBarTagsDisplay.querySelectorAll('.action-bar-tag'))
                   .some(tag => tag.textContent.toLowerCase() === tagText.toLowerCase());
    }

    function createActionBarTagElement(tagText) {
        const tag = document.createElement('span');
        tag.className = 'action-bar-tag';
        tag.textContent = tagText;
        return tag;
    }

    function addActionBarTag() {
        const tagText = actionBarTagInput.value.trim();
        if (tagText && !actionBarTagExists(tagText)) {
            actionBarTagsDisplay.appendChild(createActionBarTagElement(tagText));
            actionBarTagInput.value = '';
        }
    }

    // Add Tag Event Listeners for Action Bar
    addActionBarTagBtn.addEventListener('click', addActionBarTag);
    actionBarTagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addActionBarTag();
        }
    });

    // Remove Tag Event Listener for Action Bar (Delegated)
    actionBarTagsDisplay.addEventListener('click', (e) => {
        if (e.target.classList.contains('action-bar-tag')) {
            e.target.remove();
        }
    });

    // Bulk Action Button
    document.getElementById("bulk-action-btn").addEventListener("click", () => {
        const checkedBoxes = document.querySelectorAll(".select-checkbox:checked");
        const urls = [];

        checkedBoxes.forEach(checkbox => {
            const container = checkbox.closest(".image-container");
            const img = container.querySelector("img");
            if (img && img.src) {
                urls.push(img.src);
            }
        });

        // Get all currently displayed action bar tags for the bulk action
        const tagsToApply = Array.from(actionBarTagsDisplay.querySelectorAll('.action-bar-tag'))
                                 .map(tag => tag.textContent);

        if (urls.length > 0) {
            alert(`Selected image URLs:\n\n${urls.join("\n")}\n\nApplying tags: ${tagsToApply.join(', ')}`);
            // TODO: Implement the actual bulk action here (e.g., send to server)
        } else {
            alert("No images selected.");
        }
        updateTags(imageUrl, tags)
    });

    // Close Action Bar Button
    document.getElementById("close-action-bar-btn").addEventListener("click", () => {
        document.querySelectorAll(".select-checkbox:checked").forEach(checkbox => {
            checkbox.checked = false;
        });

        // Clear all tags from the action bar when closing
        actionBarTagsDisplay.innerHTML = '';

        actionBar.style.display = "none";
    });

    displayImages(IMAGE_DATA);
}

// Tags is list
function updateTags(imageUrls, tags) {
    fetch(`/update-tags?image_url=${encodeURIComponent(imageUrl)}&change=${change}`, {
        method: 'POST'
    });
}