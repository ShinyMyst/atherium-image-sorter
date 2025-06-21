document.addEventListener('DOMContentLoaded', function() {
    const tagInput = document.getElementById('tag-input');
    const addTagButton = document.getElementById('add-tag');
    const tagsList = document.getElementById('tags-list');

    // Add a new tag
    function addTag(text) {
        if (!text.trim()) return;

        const tag = document.createElement('span');
        tag.className = 'tag-item';
        tag.innerHTML = `
            ${text}
            <input type="hidden" name="tags[]" value="${text}"> <!-- Using [] for array submission -->
            <span class="remove-tag">×</span>
        `;

        tagsList.appendChild(tag);
        tagInput.value = '';

        // Remove tag on click
        tag.querySelector('.remove-tag').addEventListener('click', () => tag.remove());
    }

    // Add tag on button click
    addTagButton.addEventListener('click', () => addTag(tagInput.value));

    // Add tag on Enter key
    tagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(tagInput.value);
        }
    });

    // Initialize existing tags (remove functionality)
    document.querySelectorAll('.tag-item .remove-tag').forEach(removeBtn => {
        removeBtn.addEventListener('click', function() {
            this.parentElement.remove();
        });
    });
});