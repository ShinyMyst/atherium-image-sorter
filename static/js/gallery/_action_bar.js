/******************************
 * Action Bar     *
 ******************************/
import { updateTags, deleteEntries } from './_api.js';

// Variables need to be declared in order to use them in functions.
// However, they can't be assigned until bar is initialized.
// because the bar doesn't actually exist as an element at all times.
let actionBar;
let actionBarTagInput;
let addActionBarTagBtn;
let actionBarTagsDisplay;
let bulkActionBtn;
let deleteSelectedBtn;
let closeActionBarBtn;

export function initActionBar() {
    // Init after DOMContentLoaded to assign DOM elements.
    actionBar = document.querySelector("#action-bar");
    actionBarTagInput = document.getElementById('action-bar-tag-input');
    addActionBarTagBtn = document.getElementById('action-bar-tag-btn');
    actionBarTagsDisplay = document.getElementById('action-bar-tags-display');
    bulkActionBtn = document.getElementById("bulk-action-btn");
    deleteSelectedBtn = document.getElementById("delete-selected-btn"); // Initialize new button
    closeActionBarBtn = document.getElementById("close-action-bar-btn");

    if (actionBar) {
        _addTagEvent();
        _removeTagEvent();
        _addTagsButton();
        _deleteSelectedButton();
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
    updateTags(urls, tagsToApply)
    if (urls.length > 0) {
        const userConfirmed = confirm(`Apply these tags?\n\n${tagsToApply.join(', ')}`);
        if (userConfirmed) {
            updateTags(urls, tagsToApply)
            //location.reload();  This line breaks everything
        }
    } else {
        alert("No images selected.");
    }
};

// Delete Tags Dialogue Box
function _deleteImages(urls) {
    if (urls.length > 0) {
        const confirmation = confirm(`Are you sure you want to delete ${urls.length} selected image(s)? This action cannot be undone.`);
        if (confirmation) {
            deleteEntries(urls);
        }
    } else {
        alert("No images selected for deletion.");
    }
};

// Get URLs
function _getUrls() {
    const checkedBoxes = document.querySelectorAll(".select-checkbox:checked");
    const urls = [];

    checkedBoxes.forEach(checkbox => {
        const container = checkbox.closest(".image-container");
        const img = container.querySelector("img");
        if (img && img.src) {
            urls.push(img.src);
        }
    });

    return urls
}

// Bulk Action Button (Adds Tags)
function _addTagsButton(){
    if (bulkActionBtn) {
        bulkActionBtn.addEventListener("click", () => {
            const urls = _getUrls()
            const tagsToApply = Array.from(actionBarTagsDisplay.querySelectorAll('.action-bar-tag'))
                                        .map(tag => tag.textContent);
            _applyTags(urls, tagsToApply)
        });
    }
};

// Delete Button
function _deleteSelectedButton() {
    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener("click", () => {
            const urls = _getUrls()
            _deleteImages(urls)
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

// TODO - Bulk Action Button could be renamed like the function to something about tags.
// TODO - Delete/Add Tags share similar structure for getting URLs.  Make it a helper.
