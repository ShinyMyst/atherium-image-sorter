function updatePreview(url) {
    const img = document.getElementById("preview");
    if (url) {
        img.src = url;
        img.style.display = 'block';
    } else {
        img.style.display = 'none';
        img.src = '';
    }
}