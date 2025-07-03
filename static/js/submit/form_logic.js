document.addEventListener('DOMContentLoaded', () => {
    const imageUrlInput = document.getElementById('image-url');
    const quickEntryTextarea = document.getElementById('quick-entry-textarea');
    const quickEntryToggle = document.getElementById('quick-entry-toggle');
    const imageSubmitForm = document.getElementById('image-submit-form');

    // Initialize image preview if an initial URL is present
    if (imageUrlInput && imageUrlInput.value && typeof updatePreview === 'function') {
        updatePreview(imageUrlInput.value);
    }

    // Auto-highlight functionality
    if (imageUrlInput) {
        imageUrlInput.addEventListener('click', function() {
            this.select();
        });
    }

    if (quickEntryTextarea) {
        quickEntryTextarea.addEventListener('click', function() {
            this.select();
        });
    }

    // --- JavaScript for Dynamic Form Action ---
    if (quickEntryToggle && imageSubmitForm) {
        const defaultSubmitUrl = imageSubmitForm.dataset.defaultSubmitUrl;
        const quickEntrySubmitUrl = imageSubmitForm.dataset.quickEntrySubmitUrl;

        function updateFormAction() {
            if (quickEntryToggle.checked) {
                imageSubmitForm.action = quickEntrySubmitUrl;
            } else {
                imageSubmitForm.action = defaultSubmitUrl;
            }
        }

        updateFormAction(); // Call on page load to set initial action
        quickEntryToggle.addEventListener('change', updateFormAction);
    }
});