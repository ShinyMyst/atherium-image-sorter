export function initUnitsPerRow() {
    const unitsPerRowInput = document.getElementById('unitsPerRowInput');
    let debounceTimer;

    function updateGridColumns() {
        // Timer ensures the function only runs after user done typing.
        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            const galleryGrid = document.querySelector('.grid');
            let numColumns = parseInt(unitsPerRowInput.value, 10);

            if (isNaN(numColumns) || numColumns < 1) {
                numColumns = 1;
            } else if (numColumns > 8) {
                numColumns = 8;
            }

            galleryGrid.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;
        }, 700);
    }

    unitsPerRowInput.addEventListener('input', updateGridColumns);
    updateGridColumns();
}
