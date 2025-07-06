/******************************
 * API    *
 ******************************/
// TODO - Page 'could' reload here.  BUT there are two issues.
// 1.) AppManger does not actually resort the rankings when rank changes.
// 2.) It would have to rewrite every ranking each time...
// Better to just omit it for speed OR resort on client level
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
        } else {
            window.location.reload();
        }
    })
    .catch(error => console.error('Error updating tags:', error));
}

export function updateDetails(imageUrl) {
    window.open(`/submit/edit?image_url=${encodeURIComponent(imageUrl)}`, '_blank');
}

export function deleteEntries(imageUrls) {
    fetch('/entries/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ urls: imageUrls })
    })
    .then(response => {
        if (response.ok) {
            console.log('Images successfully deleted:', imageUrls);
            // Reload the page
            location.reload();
        } else {
            console.error('Failed to delete images:', response.statusText);
            alert('Failed to delete images. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error deleting images:', error);
        alert('An error occurred while deleting images.');
    });
}
