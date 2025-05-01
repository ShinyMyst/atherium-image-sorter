// TODO - Rewrite initTags()
// TODO - Could any single use macros be rewritten here instead for consistency?

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

export function initImageContainer(img) {
    const container = document.createElement("div");
    container.className = "image-container";

    container.innerHTML = `
        <img src="${img.url}" alt="Generated Image" style="cursor:pointer">
        <div class="image-details" style="display:none">
            <p>Model: ${img.model}</p>
            <p>Sampling: ${img["Sampling Method"]}</p>
            ${Object.entries(img.LoRA).map(([k,v]) => `<p>${k}: ${v}</p>`).join('')}
            ${img.Tags ? `<p>Tags: ${img.Tags.join(', ')}</p>` : ''}
        </div>
    `;

    // Event handlers
    container.querySelector('img').addEventListener('click', () => {
        window.open(img.url, "_blank");
    });

    container.addEventListener('mouseenter', () => {
        container.querySelector('.image-details').style.display = 'block';
    });

    container.addEventListener('mouseleave', () => {
        container.querySelector('.image-details').style.display = 'none';
    });

    return container;
}