//////////////////////////////////
// Sidebar
//////////////////////////////////
let tagsContainer;
let newTagInput;
let addTagBtn;

export function initTags() {
    // Init after DOMContentLoaded to assign DOM elements.
    tagsContainer = document.getElementById('tags-container');
    newTagInput = document.getElementById('new-tag-input');
    addTagBtn = document.getElementById('add-tag-btn');

    // Add Tag Event Listener
    addTagBtn.addEventListener('click', addNewTag);
    newTagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addNewTag();
    });

    // Attach remove functionality to any existing tags on page load
    const existingTagElements = tagsContainer.querySelectorAll('.tag');
    existingTagElements.forEach(removeFunctionality);
}

//////////////////////////////////
// Tag Helper Functions
//////////////////////////////////
function tagExists(tagText) {
    return Array.from(tagsContainer.querySelectorAll('.tag'))
                   .some(tag => tag.textContent.toLowerCase().replace('×', '').trim() === tagText.toLowerCase());
}

function createTagElement(tagText) {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.dataset.tag = tagText;
    tag.innerHTML = `${tagText}<span class="remove-tag">×</span>`;
    return tag;
}

function addNewTag() {
    const tagText = newTagInput.value.trim();
    if (tagText && !tagExists(tagText)) {
        const newTagElement = createTagElement(tagText);
        tagsContainer.appendChild(newTagElement);
        removeFunctionality(newTagElement);
        newTagInput.value = ''; // Clear the input field
    }
}

function removeFunctionality(tagElement) {
    const removeBtn = tagElement.querySelector('.remove-tag');

    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            tagElement.remove();
        });
    } else {
        console.warn("Tag element found without a .remove-tag span:", tagElement);
    }
}