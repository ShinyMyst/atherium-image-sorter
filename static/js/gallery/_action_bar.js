/******************************
 * Action Bar     *
 ******************************/
import { updateTags } from './_api.js';

// Variables need to be declared in order to use them in functions.
// However, they can't be assigned until bar is initialized.
// because the bar doesn't actually exist as an element at all times.
let actionBar;
let actionBarTagInput;
let addActionBarTagBtn;
let actionBarTagsDisplay;
let bulkActionBtn;
let closeActionBarBtn;

export function initActionBar() {
    // Init after DOMContentLoaded to assign DOM elements.
    actionBar = document.querySelector("#action-bar");
    actionBarTagInput = document.getElementById('action-bar-tag-input');
    addActionBarTagBtn = document.getElementById('action-bar-tag-btn');
    actionBarTagsDisplay = document.getElementById('action-bar-tags-display');
    bulkActionBtn = document.getElementById("bulk-action-btn");
    closeActionBarBtn = document.getElementById("close-action-bar-btn");

    if (actionBar) {
        _addTagEvent();
        _removeTagEvent();
        _bulkActionButton();
        _closeBarEvent();
    }

    updateActionBarVisibility(false);  // Bar starts invisible
};

export function updateActionBarVisibility(isVisible) {
    // Function also used by _img_container.js to activate bar when checkbox is clicked.
    if (actionBar) {
        actionBar.style.display = isVisible ? "flex" : "none";

    }
}

//////////////////////////////////
// Action Bar Helper Functions
//////////////////////////////////
// Add Tag Event Listener
function _addTagEvent(){
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
};
// Remove Tag Event Listener
function _removeTagEvent(){
    if (actionBarTagsDisplay) {
        actionBarTagsDisplay.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-bar-tag')) {
                e.target.remove();
            }
        });
    }
};
// Close Bar Event Listener
function _closeBarEvent(){
    if (closeActionBarBtn) {
        closeActionBarBtn.addEventListener("click", () => {
            document.querySelectorAll(".select-checkbox:checked").forEach(checkbox => {
                checkbox.checked = false;  // Clear checkboxes
            });
            actionBarTagsDisplay.innerHTML = '';  // Remove Tags
            updateActionBarVisibility(false);     // Close Bar
        });
    }
};
// Apply Tags Dialogue Box
function _applyTags(urls, tagsToApply) {
    if (urls.length > 0) {
        const userConfirmed = confirm(`Apply these tags?\n\n${tagsToApply.join(', ')}`);
        if (userConfirmed) {
            updateTags(urls, tagsToApply)
            location.reload();
        }
    } else {
        alert("No images selected.");
    }
};
// Bulk Action Button (Adds Tags)
function _bulkActionButton(){
    if (bulkActionBtn) {
        bulkActionBtn.addEventListener("click", () => {
            const checkedBoxes = document.querySelectorAll(".select-checkbox:checked");
            const urls = [];

            // Get the URLs
            checkedBoxes.forEach(checkbox => {
                const container = checkbox.closest(".image-container");
                const img = container.querySelector("img");
                if (img && img.src) {
                    urls.push(img.src);
                }
            });
            // Get the Tags
            const tagsToApply = Array.from(actionBarTagsDisplay.querySelectorAll('.action-bar-tag'))
                                        .map(tag => tag.textContent);
            // Apply Tags
            _applyTags(urls, tagsToApply)
        });
    }
};

//////////////////////////////////
// Tag Management Helper Functions
//////////////////////////////////
// Checks for duplicate tags
function tagExists(tagText) {
    if (!actionBarTagsDisplay) return false;
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
    if (!actionBarTagInput || !actionBarTagsDisplay) return;
    const tagText = actionBarTagInput.value.trim();
    if (tagText && !tagExists(tagText)) {
        actionBarTagsDisplay.appendChild(createActionBarTagElement(tagText));
        actionBarTagInput.value = '';
    }
}
