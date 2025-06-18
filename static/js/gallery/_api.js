export function updateRating(imageUrl, change) {
    fetch(`/update-rating?image_url=${encodeURIComponent(imageUrl)}&change=${change}`, {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            console.error('Failed to update rating:', response.statusText);
        }
    })
    .catch(error => console.error('Error updating rating:', error));
}


export function updateTags(imageUrls, tags) {
    console.warn("The updateTags function needs review and a proper endpoint for bulk operations.");
    fetch('/update-tags-bulk', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            imageUrls: imageUrls,
            tags: tags
        })
    })
    .then(response => {
        if (!response.ok) {
            console.error('Failed to update tags:', response.statusText);
        }
    })
    .catch(error => console.error('Error updating tags:', error));
}