// Get the breadcrumb objects array
const breadcrumbsArray: HTMLElement[] = Array.from(document.querySelectorAll('.breadcrumb'));

// Iterate over each item in the breadcrumbsArray
breadcrumbsArray.forEach((breadcrumb: HTMLElement):void => {
    // Get the data-breadcrumb-divider attribute or null if it does not exist
    const breadcrumbDivider: string | null = breadcrumb.getAttribute('data-breadcrumb-divider');

    // It specifies whether the breadcrumb divider is an image link or just a symbol
    let isImageLink: boolean;

    // Get an array of the breadcrumb items
    const breadcrumbItems: HTMLElement[] = Array.from(breadcrumb.querySelectorAll('.breadcrumb-item'));

    // Make sure the breadcrumbDivider exists and the breadcrumbItems array is not empty
    if (!breadcrumbDivider || breadcrumbItems.length === 0) return;

    // Check if the breadcrumbDivider looks like an image link (e.g., ends with .jpg, .png, etc.)
    const imageExtensions: string[] = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
    isImageLink = imageExtensions.some((ext: string): boolean =>
        breadcrumbDivider.toLowerCase().endsWith(ext) || breadcrumbDivider.toLowerCase().startsWith('http')
    );

    // Iterate over each breadcrumb item to change the ::before content style
    breadcrumbItems.forEach((item: HTMLElement, index: number):void => {
        // Dynamically create a style element to modify ::before pseudo-element styles
        const styleElement: HTMLStyleElement = document.createElement('style');

        // If it's an image link, we can modify the styles differently (e.g., as a background image)
        if (isImageLink) {
            styleElement.textContent += `
                .breadcrumb-item:nth-child(${index + 1})::before {
                    background-image: url('${breadcrumbDivider}') !important;
                    content: '' !important;
                    width: 10px !important;
                    height: 10px !important;
                    margin-right: 0.75rem;
                }
            `;
        } else {
            styleElement.textContent += `
                .breadcrumb-item:nth-child(${index + 1})::before {
                    content: '${breadcrumbDivider}' !important;
                }
            `;
        }

        // Append the style element to the head of the document
        document.head.appendChild(styleElement);
    });
});