
const textToCopy = `function extractPageData() {
    // Clipboard function - will only work when called from user action
    function copyToClipboard(text) {
        return new Promise((resolve, reject) => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(resolve).catch(err => {
                    console.error('Clipboard API failed, trying fallback:', err);
                    fallbackCopyTextToClipboard(text, resolve, reject);
                });
            } else {
                fallbackCopyTextToClipboard(text, resolve, reject);
            }
        });
    }

    function fallbackCopyTextToClipboard(text, resolve, reject) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";   // Prevent scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            // This must be called during a user gesture
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (successful) {
                resolve();
            } else {
                reject(new Error('Fallback copy failed'));
            }
        } catch (err) {
            document.body.removeChild(textArea);
            reject(err);
        }
    }

    // Date finding function
    function findClosestDate() {
        const highlightedItem = document.querySelector('.ring-theme-primary');
        if (highlightedItem) {
            const itemGroup = highlightedItem.closest('[data-item-group-index]');
            if (itemGroup) {
                const allSiblings = Array.from(itemGroup.parentElement.children);
                const groupIndex = allSiblings.indexOf(itemGroup);
                for (let i = groupIndex - 1; i >= 0; i--) {
                    const sibling = allSiblings[i];
                    if (sibling.matches('div[data-index]') &&
                        sibling.classList.contains('px-2') &&
                        sibling.classList.contains('py-1')) {
                        return sibling.textContent.trim();
                    }
                }
            }
        }
        const dateDivs = document.querySelectorAll('div[data-index].px-2.py-1');
        return dateDivs.length > 0 ? dateDivs[0].textContent.trim() : null;
    }

    // Data extraction function
    function getExtractedDataAsJson() {
        const extractedData = {
            "url": document.getElementById('image-url')?.value?.trim() || "",
            "model": document.querySelector('p.font-semibold.text-sm.break-all.hyphens-auto a[href*="/model/"]')?.textContent?.trim() || "",
            "Prompt": "",
            "Tags": [],
            "LoRA": {},
            "Sampling Method": document.querySelector('div[role="combobox"][aria-expanded="false"].MuiSelect-select')?.textContent?.trim() || "",
            "Sampling Steps": parseInt(document.querySelector('input[type="number"].MuiInputBase-input.css-in64xc[min="1"][max="50"]')?.value) || null,
            "CFG Scale": parseFloat(document.querySelector('input[type="number"].MuiInputBase-input.css-in64xc[min="1.1"][max="15"]')?.value) || null,
            "ranking": 0,
            "Date": findClosestDate()
        };

        // --- Prompt extraction ---
        const promptSection = document.querySelector('section.z-10.px-4.py-3.pb-2.bg-neutral-100.dark\\\\:bg-neutral-700.rounded-xl.mx-4.flex.flex-col');
        if (promptSection) {
            extractedData.Prompt = promptSection.querySelector('textarea[placeholder="Enter prompts here"]')?.value?.trim() ||
                                   Array.from(promptSection.querySelectorAll('textarea'))
                                        .find(ta => ta.value?.includes(','))?.value?.trim() || "";
        }


        // Tags extraction (unchanged as it targets a specific ID)
        const tagItems = document.getElementById('tags-list')?.querySelectorAll('.tag-item');
        if (tagItems?.length > 0) {
            extractedData.Tags = Array.from(tagItems).map(tag =>
                tag.textContent.trim().replace(/×$/, '').trim().toLowerCase());
        }

        // --- LoRA extraction (Scoped to the lora-container ID) ---
        extractedData.LoRA = {}; // Ensure LoRA object is initialized
        const loraContainer = document.getElementById('lora-container'); // This ID should uniquely contain your active LoRAs
        if (loraContainer) {
            loraContainer.querySelectorAll('div.relative.flex.gap-3.bg-background-light.p-2.rounded-xl').forEach(entry => {
                const title = entry.querySelector('a.font-bold.text-sm')?.textContent?.replace(/&amp;/g, '&').trim();
                const weight = parseFloat(entry.querySelector('input[type="number"].MuiInputBase-input')?.value);
                if (title && !isNaN(weight)) {
                    extractedData.LoRA[title] = weight;
                }
            });
        }


        // Clean empty fields
        if (Object.keys(extractedData.LoRA).length === 0) delete extractedData.LoRA;
        if (extractedData.Tags.length === 0) delete extractedData.Tags;
        if (!extractedData.Date) delete extractedData.Date;

        return JSON.stringify(extractedData, null, 2);
    }

    // Main function to handle user interaction
    async function handleExtraction() {
        const jsonOutput = getExtractedDataAsJson();
        console.log("--- Extracted Data ---", jsonOutput);

        try {
            await copyToClipboard(jsonOutput);
            console.log("Data copied to clipboard!");
        } catch (err) {
            console.error("Copy failed:", err);
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '60px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
        notification.style.padding = '10px 15px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '10000';
        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    // Create UI button
    function createCopyButton() {
        let copyButton = document.getElementById('dynamic-copy-button');
        if (!copyButton) {
            copyButton = document.createElement('button');
            copyButton.id = 'dynamic-copy-button';
            copyButton.textContent = 'Copy Image Data';
            copyButton.style.position = 'fixed';
            copyButton.style.bottom = '20px';
            copyButton.style.right = '20px';
            copyButton.style.zIndex = '9999';
            copyButton.style.padding = '10px 15px';
            copyButton.style.backgroundColor = '#4CAF50';
            copyButton.style.color = 'white';
            copyButton.style.border = 'none';
            copyButton.style.borderRadius = '5px';
            copyButton.style.cursor = 'pointer';
            copyButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

            copyButton.addEventListener('click', (e) => {
                e.preventDefault();
                handleExtraction();
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy Image Data';
                }, 2000);
            });

            document.body.appendChild(copyButton);
        }
        return copyButton;
    }

    // Initialize
    createCopyButton();
    return getExtractedDataAsJson(); // This line will return the data when extractPageData() is called directly
}

extractPageData(); // Directly call the function to initialize and add the button`

const copyButton = document.getElementById('copy-quick-entry');
copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            console.log('Extractor function copied to clipboard!');
            const originalButtonText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = originalButtonText;
            }, 1500);
        })
        .catch(err => {
            console.error('Failed to copy extractor function:', err);
            alert('Failed to copy. Please try again or copy manually.');
        });
});