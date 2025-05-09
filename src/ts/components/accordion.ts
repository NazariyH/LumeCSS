// Get the NodeList of the HTML elements that contains the class 'accordion'
const accordionElements: NodeListOf<HTMLElement> = document.querySelectorAll('.accordion');

// Convert the NodeList to an array
const accordionElementsArray: HTMLElement[] = Array.from(accordionElements);

// Iterate over each element in the accordionElementsArray
accordionElements.forEach((accordionObj: HTMLElement):void => {
    // Get the HTML elements that contains the 'accordion-header' class
    const headerElements: NodeListOf<HTMLElement> = document.querySelectorAll('.accordion-header');

    // Convert the headerElements to an array
    const headerElementsArray: HTMLElement[] = Array.from(headerElements);


    /* Get the data-allow-multiple attribute. It is used to specify whether
    the user can open only one accordion or multiple accordions. If data-allow-multiple
    is set to false, previous accordions will close when the user opens a new one. */
    const allowMultiple: boolean = accordionObj?.getAttribute('data-allow-multiple') === 'true';


    // Ensure that the headerElementsArray is not empty
    if (headerElementsArray.length > 1) {
        // Iterate over each headerElementsArray to add an eventListener to each header
        headerElementsArray.forEach((headerObj: HTMLElement):void => {
            // Add an event listener to each headerObj
            headerObj.addEventListener('click', (e: MouseEvent): void => {
                // Get the parent element
                const accordionItemElement: HTMLElement | null = (e.target as HTMLElement).closest('.accordion-item');

                // Declare the accordionCollapseElement variable
                let accordionCollapseElement: HTMLElement | null = null;

                // Get the collapse HTML element
                if (!accordionItemElement) return;
                accordionCollapseElement = accordionItemElement.querySelector('.accordion-collapse');

                // Make sure that the accordionCollapseElement exists
                if (!accordionCollapseElement) return;

                // Get the accordion header button or null if it does not exist
                const accordionHeaderButton: HTMLElement
                    | null = headerObj.querySelector('.accordion-header-button');

                // Get the body element of the accordionCollapseElement
                const bodyElement: HTMLElement |
                    null = accordionCollapseElement.querySelector('.accordion-body');

                // Check if the accordionItemElement has already the 'collapsed' class
                if (!accordionItemElement.classList.contains('collapsed')) {
                    // Check if the multiple accordion opening is allowed
                    if (!allowMultiple) {
                        closeOpenedAccordions(accordionObj);
                    }

                    collapseAccordion(accordionItemElement, accordionCollapseElement, accordionHeaderButton, bodyElement);

                } else {
                    uncollapseAccordion(accordionItemElement, accordionCollapseElement, accordionHeaderButton);
                }
            });
        });
    }
});


function closeOpenedAccordions(accordionObj: HTMLElement):void {
    /* This function searches for the opened accordions and closes them */

    // Get the NodeList of the opened accordions
    const openedAccordions: NodeListOf<HTMLElement> = accordionObj.querySelectorAll('.accordion-item.collapsed');

    // Convert the NodeList to an array
    const openedAccordionsArray: HTMLElement[] = Array.from(openedAccordions);

    // Ensure the array is not empty
    if (openedAccordionsArray.length < 1) return;

    // Iterate over each opened accordion to close it
    openedAccordionsArray.forEach((element: HTMLElement): void => {
        // Get the collapse HTML element
        const accordionCollapseElement: HTMLElement | null = element.querySelector('.accordion-collapse');

        // Make sure the collapse object exists
        if (!accordionCollapseElement) return;

        // Get the header button
        const accordionHeaderButton: HTMLElement | null = element.querySelector('.accordion-header-button');

        // Close the accordion
        uncollapseAccordion(element, accordionCollapseElement, accordionHeaderButton)
    });
}


function collapseAccordion(
    accordionItemElement: HTMLElement,
    accordionCollapseElement: HTMLElement,
    accordionHeaderButton: HTMLElement | null,
    bodyElement: HTMLElement | null
):void {
    /* Collapse the accordion object by giving the specific classes */

    // Add the 'collapsed' class to the accordionItemElement
    accordionItemElement.classList.add('collapsed');

    // Add the dynamic height to the accordionCollapseElement
    if (bodyElement) {
        accordionCollapseElement.style.height = `${bodyElement.offsetHeight}px`;
    }

    // Add the 'active' class to the header button if it is not null
    if (accordionHeaderButton) {
        accordionHeaderButton.classList.add('active');
    }
}


function uncollapseAccordion(
    accordionItemElement: HTMLElement,
    accordionCollapseElement: HTMLElement,
    accordionHeaderButton: HTMLElement | null
):void {
    /* Uncollapse the accordion object by removing the specific classes */

    // Remove the 'collapsed' class to the accordionItemElement
    accordionItemElement.classList.remove('collapsed');

    // Set the height to 0 in the accordionCollapseElement
    accordionCollapseElement.style.height = `0`;

    // Remove the 'active' class to the header button if it is not null
    if (accordionHeaderButton) {
        accordionHeaderButton.classList.remove('active');
    }
}