/******************************
 * Gallery         *
 ******************************/
import { initTags } from './_tags.js';
import { initImageContainers } from './_img_container.js';
import { initActionBar } from './_action_bar.js';
import { initSidebar } from './_sidebar.js';
import { initDropdown } from './_dropdown.js';


export function initGallery(IMAGE_DATA) {
    initTags(IMAGE_DATA);
    initSidebar(IMAGE_DATA)
    initActionBar();
    initImageContainers(IMAGE_DATA);
    initDropdown();
};
