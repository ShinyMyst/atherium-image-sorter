document.addEventListener('DOMContentLoaded', function() {
    const tagInput = document.getElementById('tag-input');
    const addTagButton = document.getElementById('add-tag');
    const tagsList = document.getElementById('tags-list');

    // Tag order is irrelevant but removing this breaks the entire functionaltiy.
    function reIndexTags() {
        tagsList.querySelectorAll('[name^="tags-"]').forEach((input, index) => {
            input.name = `tags-${index}`;
        });
    }

    // Remove Tags
    function attachRemoveFunctionality(tagElement) {
        tagElement.querySelector('.remove-tag').addEventListener('click', function() {
            tagElement.remove();
            reIndexTags();
        });
    }

    // Add Tags
    function addTag(tagText) {
        if (!tagText.trim()) return;

        const tagIndex = tagsList.querySelectorAll('[name^="tags-"]').length;
        const tagElement = document.createElement('span');
        tagElement.className = 'tag-item';
        tagElement.innerHTML = `
            ${tagText}
            <input type="hidden" name="tags-${tagIndex}" value="${tagText}">
            <span class="remove-tag">×</span>
        `;

        tagsList.appendChild(tagElement);
        tagInput.value = '';
        attachRemoveFunctionality(tagElement);
    }

    // Add tag on button click
    addTagButton.addEventListener('click', function() {
        addTag(tagInput.value);
    });

    // Add tag on Enter key
    tagInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(tagInput.value);
        }
    });

    tagsList.querySelectorAll('.tag-item').forEach(attachRemoveFunctionality);
    reIndexTags();
});