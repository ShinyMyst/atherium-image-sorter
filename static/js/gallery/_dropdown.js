export function initDropdown() {
    const dropdown = document.getElementById('collectionDropdown');

    if (dropdown) {
        dropdown.addEventListener('change', function() {
            const selectedValue = this.value;
            window.location.href = `/gallery/switch?option=${selectedValue}`;
        });
    } else {
        console.warn("Dropdown element with ID 'myDropdown' not found.");
    }
}
