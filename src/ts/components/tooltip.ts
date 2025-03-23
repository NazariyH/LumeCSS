// Retrieve a NodeList of the tooltip HTML objects
const tooltipElements: NodeListOf<HTMLElement> = document.querySelectorAll('*[data-tooltip="tooltip"]');

// Convert the NodeList into an array
const tooltipElementsArray: HTMLElement[] = Array.from(tooltipElements);


// Iterate over each tooltip object in the tooltipElementsArray
tooltipElementsArray.forEach((tooltip: HTMLElement): void => {
    // Get the tooltip title or null if it does not exist
    const tooltipTitle: string | null = tooltip.getAttribute('data-tooltip-title');

    // Make sure that the tooltipTitle exists (not null)
    if (!tooltipTitle) return;

    // Create a <style> element to add dynamic styles
    const style: HTMLStyleElement = document.createElement('style');

    // Apply dynamic content to the ::after pseudo-element for each tooltip element
    style.innerHTML = `
        [data-tooltip="tooltip"][data-tooltip-title="${tooltipTitle}"]::after {
            content: "${tooltipTitle}" !important;
        }
    `;

    // Append the style to the head of the document
    document.head.appendChild(style);
});