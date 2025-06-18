// Tags is list
function updateTags(imageUrls, tags) {
    fetch(`/update-tags?image_url=${encodeURIComponent(imageUrl)}&change=${change}`, {
        method: 'POST'
    });
}