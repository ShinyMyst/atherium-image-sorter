// tags.js - Just highlighting and tag creation with duplicate prevention
export function initTagSystem() {
    const tagsContainer = document.getElementById('tags-container');
    const newTagInput = document.getElementById('new-tag-input');
    const addTagBtn = document.getElementById('add-tag-btn');

    // Toggle highlight on click
    tagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag')) {
            e.target.classList.toggle('active');
        }
    });

    // Check if tag already exists (case-insensitive)
    function tagExists(tagText) {
        return Array.from(tagsContainer.querySelectorAll('.tag'))
                   .some(tag => tag.textContent.toLowerCase() === tagText.toLowerCase());
    }

    // Create new tag if it doesn't exist
    addTagBtn.addEventListener('click', () => {
        const tagText = newTagInput.value.trim();
        if (tagText && !tagExists(tagText)) {
            const newTag = document.createElement('span');
            newTag.className = 'tag';
            newTag.textContent = tagText;
            tagsContainer.appendChild(newTag);
            newTagInput.value = '';
        }
    });

    // Allow Enter key to create tags
    newTagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTagBtn.click();
    });
}