/******************************
 * API    *
 ******************************/
export function updateRating(imageUrl, change) {
    fetch(`/entry/rating?image_url=${encodeURIComponent(imageUrl)}&change=${change}`, {
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
    fetch('/entries/tags', {
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

export function updateDetails(imageUrl) {
    fetch(`/submit/edit?image_url=${encodeURIComponent(imageUrl)}`, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            console.error('Failed to update image:', response.statusText);
        }
    })
    .catch(error => console.error('Error updating image:', error));
    window.open(`/submit/edit?image_url=${encodeURIComponent(imageUrl)}`, '_blank');
}
