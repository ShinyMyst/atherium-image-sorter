export function setupLoraBoxes() {
    document.querySelectorAll('.filter-box').forEach(box => {
        box.addEventListener('click', function() {
            this.classList.toggle('active');
            const input = this.querySelector('.value-input');
            input.value = this.classList.contains('active') ? '0.7' : '0';
            displayImages();
        });
    });
}