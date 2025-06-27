function extractPageData() {
    // Clipboard functions remain the same
    function copy(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {}).catch(err => {
                console.error('Clipboard writeText failed:', err);
                fallbackCopyTextToClipboard(text);
            });
        } else {
            fallbackCopyTextToClipboard(text);
        }
    }

    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (!successful) {
                console.error('Fallback copy command unsuccessful.');
            }
        } catch (err) {
            console.error('Fallback copy command failed:', err);
        }

        document.body.removeChild(textArea);
    }

    // NEW: Precise date finding function based on our previous work
    function findClosestDate() {
        // Try to find highlighted item first
        const highlightedItem = document.querySelector('.ring-theme-primary');
        if (highlightedItem) {
            // Find the item group container
            const itemGroup = highlightedItem.closest('[data-item-group-index]');
            if (itemGroup) {
                // Get all siblings at the same level
                const allSiblings = Array.from(itemGroup.parentElement.children);
                const groupIndex = allSiblings.indexOf(itemGroup);

                // Search backward for nearest date div
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

        // Fallback: Find first date div if no highlighted item
        const dateDivs = document.querySelectorAll('div[data-index].px-2.py-1');
        if (dateDivs.length > 0) {
            return dateDivs[0].textContent.trim();
        }

        return null;
    }

    function getExtractedDataAsJson() {
        const extractedData = {
            "url": "",
            "model": "",
            "Prompt": "",
            "Tags": [],
            "LoRA": {},
            "Sampling Method": "",
            "Sampling Steps": null,
            "CFG Scale": null,
            "ranking": 0,
            "Date": findClosestDate() // Using our date finder
        };

        // Rest of your existing extraction logic...
        const urlInput = document.getElementById('image-url');
        if (urlInput && urlInput.value) {
            extractedData.url = urlInput.value.trim();
        }

        const modelNameElement = document.querySelector('p.font-semibold.text-sm.break-all.hyphens-auto a[href*="/model/"]');
        if (modelNameElement) {
            extractedData.model = modelNameElement.textContent.trim();
        }

        const promptTextarea = document.querySelector('section textarea[placeholder="Enter prompts here"]');
        if (promptTextarea) {
            extractedData.Prompt = promptTextarea.value.trim();
        } else {
            const textareas = document.querySelectorAll('textarea');
            for (const textarea of textareas) {
                if (textarea.value && textarea.value.includes(',')) {
                    extractedData.Prompt = textarea.value.trim();
                    break;
                }
            }
        }

        const tagsList = document.getElementById('tags-list');
        if (tagsList) {
            const tagItems = tagsList.querySelectorAll('.tag-item');
            if (tagItems.length > 0) {
                extractedData.Tags = Array.from(tagItems).map(tag => tag.textContent.trim().replace(/×$/, '').trim().toLowerCase());
            }
        }

        const loraEntries = [];
        const loraContainers = document.querySelectorAll('div.relative.flex.gap-3.bg-background-light.p-2.rounded-xl');
        loraContainers.forEach(entry => {
            const titleElement = entry.querySelector('a.font-bold.text-sm');
            const weightInput = entry.querySelector('input[type="number"].MuiInputBase-input');

            if (titleElement && weightInput) {
                const title = titleElement.textContent.replace(/&amp;/g, '&').trim();
                const weight = parseFloat(weightInput.value);
                if (!isNaN(weight)) {
                    loraEntries.push({
                        name: title,
                        weight: weight
                    });
                }
            }
        });
        if (loraEntries.length > 0) {
            extractedData.LoRA = {};
            loraEntries.forEach(lora => {
                extractedData.LoRA[lora.name] = lora.weight;
            });
        }

        const samplingMethodElement = document.querySelector('div[role="combobox"][aria-expanded="false"].MuiSelect-select');
        if (samplingMethodElement) {
            extractedData['Sampling Method'] = samplingMethodElement.textContent.trim();
        }

        const samplingStepInput = document.querySelector('input[type="number"].MuiInputBase-input.css-in64xc[min="1"][max="50"]');
        if (samplingStepInput) {
            const valueAsNumber = Number(samplingStepInput.value);
            const steps = parseInt(valueAsNumber, 10);
            extractedData['Sampling Steps'] = isNaN(steps) ? null : steps;
        }

        const cfgScaleInput = document.querySelector('input[type="number"].MuiInputBase-input.css-in64xc[min="1.1"][max="15"]');
        if (cfgScaleInput) {
            const scale = parseFloat(cfgScaleInput.value);
            extractedData['CFG Scale'] = isNaN(scale) ? null : scale;
        }

        // Clean empty fields
        if (Object.keys(extractedData.LoRA || {}).length === 0) {
            delete extractedData.LoRA;
        }
        if (extractedData.Tags.length === 0) {
            delete extractedData.Tags;
        }
        if (!extractedData.Date) {
            delete extractedData.Date;
        }

        return JSON.stringify(extractedData, null, 2);
    }

    // Rest of your existing UI code...
    const jsonOutputOnLoad = getExtractedDataAsJson();
    console.log("--- Extracted Data with Date ---");
    console.log(jsonOutputOnLoad);
    console.log("--------------------------------");

    let copyButton = document.getElementById('dynamic-copy-button');
    if (!copyButton) {
        copyButton = document.createElement('button');
        copyButton.id = 'dynamic-copy-button';
        copyButton.textContent = 'Copy Data';
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

        document.body.appendChild(copyButton);

        copyButton.addEventListener('click', () => {
            const latestJsonOutput = getExtractedDataAsJson();
            copy(latestJsonOutput);

            const originalBg = copyButton.style.backgroundColor;
            copyButton.style.backgroundColor = '#007bff';
            setTimeout(() => {
                copyButton.style.backgroundColor = originalBg;
            }, 200);
        });
    } else {
        copyButton.textContent = 'Copy Data';
    }
}

// Run it
extractPageData();