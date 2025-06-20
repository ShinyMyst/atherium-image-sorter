document.addEventListener('DOMContentLoaded', function() {
    const tagInput = document.getElementById('tag-input');
    const addTagButton = document.getElementById('add-tag');
    const tagsList = document.getElementById('tags-list');

    // Function to re-index hidden tag inputs
    function reIndexTags() {
        const hiddenInputs = tagsList.querySelectorAll('[name^="tags-"]');
        hiddenInputs.forEach((input, index) => {
            input.name = `tags-${index}`;
        });
    }

    // Function to attach remove functionality to a tag element
    function attachRemoveFunctionality(tagElement) {
        tagElement.querySelector('.remove-tag').addEventListener('click', function() {
            tagElement.remove();
            reIndexTags();
        });
    }

    function addTag(tagText) {
        if (!tagText.trim()) return;

        // Create the tag element
        const tagIndex = document.querySelectorAll('[name^="tags-"]').length;
        const tagElement = document.createElement('span');
        tagElement.className = 'tag-item';
        tagElement.innerHTML = `
            ${tagText}
            <input type="hidden" name="tags-${tagIndex}" value="${tagText}">
            <span class="remove-tag">×</span>
        `;

        // Add to the list
        tagsList.appendChild(tagElement);

        // Clear input
        tagInput.value = '';

        // Add remove functionality
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

    // Attach remove functionality to any tags already in the HTML on page load
    const existingTagElements = tagsList.querySelectorAll('.tag-item');
    existingTagElements.forEach(attachRemoveFunctionality);

    // Ensure initial indexing is correct after pre-population
    reIndexTags();
});
