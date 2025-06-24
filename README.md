python -m venv venv TO MAKE
venv\Scripts\activate

Running this in console on edit page gives parameters for image gen
Put in the function then just call extractPageData on each page.
function extractPageData() {
    const extractedData = {};

    const promptTextarea = document.querySelector('textarea.w-full.min-h-\\[3em\\].max-h-\\[9em\\].dense\\:max-h-\\[5em\\].bg-transparent.outline-none.resize-none');
    if (promptTextarea) {
        extractedData.Prompt = promptTextarea.value.trim();
    }

    const modelNameElement = document.querySelector('p.font-semibold.text-sm.break-all.hyphens-auto a[href*="/model/"]');
    if (modelNameElement) {
        extractedData.model = modelNameElement.textContent.trim();
    }

    const loraEntries = [];
    const loraContainers = document.querySelectorAll('div.relative.flex.gap-3.bg-background-light.p-2.rounded-xl');
    loraContainers.forEach(entry => {
        const titleElement = entry.querySelector('a.font-bold.text-sm');
        const weightInput = entry.querySelector('input[type="number"].MuiInputBase-input');

        if (titleElement && weightInput) {
            const title = titleElement.textContent.replace(/&amp;/g, '&').split(' ')[0];
            const weight = parseFloat(weightInput.value);
            loraEntries.push({
                name: title,
                weight: weight
            });
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

    extractedData.Tags = [];

    if (Object.keys(extractedData.LoRA || {}).length === 0) {
        delete extractedData.LoRA;
    }
    if (extractedData.Tags.length === 0) {
        delete extractedData.Tags;
    }

    const jsonOutput = JSON.stringify(extractedData, null, 2);
    copy(jsonOutput);

    console.log("--- Extracted Data (JSON Format) ---");
    console.log(JSON.stringify(extractedData, null, 2));
    console.log("----------------------------------");
}