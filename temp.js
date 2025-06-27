function findDateForHighlighted() {
  // Find the highlighted item (with ring-theme-primary class)
  const highlightedItem = document.querySelector('.ring-theme-primary');
  if (!highlightedItem) {
    console.warn('No highlighted item found');
    return null;
  }

  // Find the item group container (parent of the grid)
  const itemGroup = highlightedItem.closest('[data-item-group-index]');
  if (!itemGroup) {
    console.warn('Could not find item group container');
    return null;
  }

  // Get all siblings at the same level
  const allSiblings = Array.from(itemGroup.parentElement.children);

  // Find our item group's position
  const groupIndex = allSiblings.indexOf(itemGroup);

  // Search backward for nearest date div
  for (let i = groupIndex - 1; i >= 0; i--) {
    const sibling = allSiblings[i];
    if (sibling.matches('div[data-index]') &&
        sibling.classList.contains('px-2') &&
        sibling.classList.contains('py-1')) {

      // Highlight the found date
      sibling.style.outline = '3px solid lime';
      sibling.style.boxShadow = '0 0 0 3px rgba(0,255,0,0.5)';

      const dateText = sibling.textContent.trim();
      console.log('Associated date:', dateText);
      return dateText;
    }
  }

  console.warn('No date div found preceding the item group');
  return null;
}

// Run it immediately and store the function for reuse
findDateForHighlighted();