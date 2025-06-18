// _action_bar.js
import { updateTags } from './_api.js'; // Assuming updateTags is in _api.js

// Declare variables, but don't assign document.querySelector results yet
// They will be assigned inside initActionBar when the DOM is ready.
let actionBar;
let actionBarTagInput;
let addActionBarTagBtn;
let actionBarTagsDisplay;
let bulkActionBtn;
let closeActionBarBtn;

// Helper functions (can remain outside, as they don't rely on DOM elements directly in their definition)
function actionBarTagExists(tagText) {
    // These still need actionBarTagsDisplay to be correctly assigned.
    // We'll rely on it being assigned when initActionBar runs.
    if (!actionBarTagsDisplay) return false; // Safety check
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
    if (!actionBarTagInput || !actionBarTagsDisplay) return; // Safety check
    const tagText = actionBarTagInput.value.trim();
    if (tagText && !actionBarTagExists(tagText)) {
        actionBarTagsDisplay.appendChild(createActionBarTagElement(tagText));
        actionBarTagInput.value = '';
    }
}

// Function to control action bar visibility (still exported for _image_container.js)
export function updateActionBarVisibility(isVisible) {
    // This function can be called by _img_container.js, so 'actionBar' needs to be available
    // and correctly assigned by initActionBar before this is called.
    if (actionBar) {
        actionBar.style.display = isVisible ? "flex" : "none";
    }
}

/**
 * Initializes all event listeners and sets up the action bar functionality.
 * This function should be called once the DOM is ready.
 */
export function initActionBar() {
    // ASSIGN the DOM elements here, when this function is called (which should be after DOMContentLoaded)
    actionBar = document.querySelector("#action-bar");
    actionBarTagInput = document.getElementById('action-bar-tag-input');
    addActionBarTagBtn = document.getElementById('action-bar-tag-btn');
    actionBarTagsDisplay = document.getElementById('action-bar-tags-display');
    bulkActionBtn = document.getElementById("bulk-action-btn");
    closeActionBarBtn = document.getElementById("close-action-bar-btn");

    if (actionBar) { // Now this check should reliably pass
        // Add Tag Event Listeners for Action Bar
        if (addActionBarTagBtn) {
            addActionBarTagBtn.addEventListener('click', addActionBarTag);
        }
        if (actionBarTagInput) {
            actionBarTagInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    addActionBarTag();
                }
            });
        }

        // Remove Tag Event Listener for Action Bar (Delegated)
        if (actionBarTagsDisplay) {
            actionBarTagsDisplay.addEventListener('click', (e) => {
                if (e.target.classList.contains('action-bar-tag')) {
                    e.target.remove();
                }
            });
        }

        // Bulk Action Button
        if (bulkActionBtn) {
            bulkActionBtn.addEventListener("click", () => {
                const checkedBoxes = document.querySelectorAll(".select-checkbox:checked");
                const urls = [];

                checkedBoxes.forEach(checkbox => {
                    const container = checkbox.closest(".image-container");
                    const img = container.querySelector("img");
                    if (img && img.src) {
                        urls.push(img.src);
                    }
                });

                const tagsToApply = Array.from(actionBarTagsDisplay.querySelectorAll('.action-bar-tag'))
                                         .map(tag => tag.textContent);

                if (urls.length > 0) {
                    alert(`Selected image URLs:\n\n${urls.join("\n")}\n\nApplying tags: ${tagsToApply.join(', ')}`);
                    updateTags(urls, tagsToApply);
                } else {
                    alert("No images selected.");
                }
            });
        }

        // Close Action Bar Button
        if (closeActionBarBtn) {
            closeActionBarBtn.addEventListener("click", () => {
                document.querySelectorAll(".select-checkbox:checked").forEach(checkbox => {
                    checkbox.checked = false;
                });

                actionBarTagsDisplay.innerHTML = '';
                updateActionBarVisibility(false);
            });
        }
    }

    // Set initial state: hide the action bar
    updateActionBarVisibility(false);
}