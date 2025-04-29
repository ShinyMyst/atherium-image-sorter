function _getActiveTags() {
    return Array.from(document.querySelectorAll('#tags-container .tag.active'))
        .map(tag => tag.dataset.tag);
}


function _getActiveLoras() {
    const active = [];
    document.querySelectorAll('.lora-filter.active').forEach(box => {
        const input = box.querySelector('.lora-value');
        if (input) {
            active.push({
                name: box.dataset.loraName,
                value: parseFloat(input.value) || 0
            });
        }
    });
    return active;
}

export function getCurrentFilters() {
    return {
        model: document.querySelector("select[name='model']").value || "any",
        sampling: document.getElementById('sampling-method').value || "any",
        loras: _getActiveLoras(),
        tags: _getActiveTags()
    };
}
