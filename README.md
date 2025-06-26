python -m venv venv TO MAKE
venv\Scripts\activate

Running this in console on edit page gives parameters for image gen
Put in the function then just call extractPageData on each page.
function extractPageData() {
    function copy(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {}).catch(err => {
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
        } catch (err) {}

        document.body.removeChild(textArea);
    }

    function getExtractedDataAsJson() {
        const extractedData = {
            "ranking": 0
        };

        const urlInput = document.getElementById('image-url');
        if (urlInput && urlInput.value) {
            extractedData.url = urlInput.value.trim();
        }

        const modelNameElement = document.querySelector('p.font-semibold.text-sm.break-all.hyphens-auto a[href*="/model/"]');
        if (modelNameElement) {
            extractedData.model = modelNameElement.textContent.trim();
        }

        const promptTextarea = document.querySelector('textarea.w-full.min-h-\\[3em\\].max-h-\\[9em\\].dense\\:max-h-\\[5em\\].bg-transparent.outline-none.resize-none');
        if (promptTextarea) {
            extractedData.Prompt = promptTextarea.value.trim();
        }

        extractedData.Tags = [];
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
                const title = titleElement.textContent.replace(/&amp;/g, '&').split(' ')[0];
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
            extractedData['Sampling Steps'] = parseInt(samplingStepInput.value, 10);
        }

        const cfgScaleInput = document.querySelector('input[type="number"].MuiInputBase-input.css-in64xc[min="1.1"][max="15"]');
        if (cfgScaleInput) {
            extractedData['CFG Scale'] = parseFloat(cfgScaleInput.value);
        }

        if (Object.keys(extractedData.LoRA || {}).length === 0) {
            delete extractedData.LoRA;
        }
        if (extractedData.Tags.length === 0) {
            delete extractedData.Tags;
        }

        return JSON.stringify(extractedData, null, 2);
    }

    const jsonOutputOnLoad = getExtractedDataAsJson();
    console.log("--- Extracted Data Button ---");

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
            copyButton.style.backgroundColor = '#007bff'; // Turn blue
            setTimeout(() => {
                copyButton.style.backgroundColor = originalBg; // Revert color
            }, 500); // Blue for 200 milliseconds
        });
    } else {
        copyButton.textContent = 'Copy Data';
    }
}


