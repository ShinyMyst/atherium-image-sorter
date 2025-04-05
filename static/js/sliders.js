document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.slider-input').forEach(slider => {
        const targetId = slider.getAttribute('data-target');
        const target = document.getElementById(targetId);

        slider.addEventListener('input', function() {
            target.textContent = this.value;
        });
    });
});