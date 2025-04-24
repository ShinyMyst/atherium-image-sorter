function initTags() {
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

    // Toggle tag highlight
    tagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag')) {
            e.target.classList.toggle('active');
        }
    });

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
}

// Seperate functions and listeners
