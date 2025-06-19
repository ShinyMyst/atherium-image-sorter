// TODO - Rewrite initTags()
// TODO - Could any single use macros be rewritten here instead for consistency?
// TODO - Wouldn't tags be a better name if that's all I do here?

export function initTags() {
    const tagsContainer = document.getElementById('tags-container');
    const newTagInput = document.getElementById('new-tag-input');
    const addTagBtn = document.getElementById('add-tag-btn');

// Check if tag exists (case-insensitive)
    function tagExists(tagText) {
        return Array.from(tagsContainer.querySelectorAll('.tag'))
                   .some(tag => tag.textContent.toLowerCase() === tagText.toLowerCase());
    }

// Create new tag element
    function createTagElement(tagText) {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = tagText;
        tag.dataset.tag = tagText;
        return tag;
    }
// Add new tag
    function addNewTag() {
        const tagText = newTagInput.value.trim();
        if (tagText && !tagExists(tagText)) {
            tagsContainer.appendChild(createTagElement(tagText));
            newTagInput.value = '';
        }
    }

    addTagBtn.addEventListener('click', addNewTag);
    newTagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addNewTag();
    });
};
