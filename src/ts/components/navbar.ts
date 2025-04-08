// Get a NodeList of the navbar objects
const navbarElements: NodeListOf<HTMLElement> = document.querySelectorAll('.navbar');

// Convert the NodeList into an array
const navbarElementsArray: HTMLElement[] = Array.from(navbarElements);

// Iterate over each element in the navbarElementsArray
navbarElementsArray.forEach((navbar: HTMLElement): void => {
    // Get the toggle button for the adaptive menu, or null if it does not exist
    const navbarToggleBtn: HTMLElement | null = navbar.querySelector('.navbar-toggle');

    // Get the navbarCollapse element, or null if it does not exist
    const navbarCollapse: HTMLElement | null = navbar.querySelector('.navbar-collapse');

    // Make sure the navbarToggleBtn and navbarCollapse exist (are not null)
    if (!navbarToggleBtn || !navbarCollapse) return;

    // Add an event listener to the navbarToggleBtn
    navbarToggleBtn.addEventListener('click', (): void => {
        // Check if the navbarCollapse contains the 'collapsed' class
        if (navbarCollapse.classList.contains('collapsed')) {
            // Hide the adaptive menu
            hideAdaptiveMenu(navbarToggleBtn, navbarCollapse);
        } else {
            // Show the adaptive menu
            collapseAdaptiveMenu(navbarToggleBtn, navbarCollapse);
        }
    });


    // Check if the navbarCollapse object does not have the data-backdrop="static" attribute
    if (navbarCollapse.getAttribute('data-backdrop') !== 'static') {
        // Add an EventListener to the document object
        document.addEventListener('click', (event: MouseEvent): void => {

            // Check if the clicked target is outside the navbar element
            if (!navbar.contains(event.target as HTMLElement)) {

                // Check if the navbarCollapse has the 'collapsed' class
                if (navbarCollapse.classList.contains('collapsed')) {
                    hideAdaptiveMenu(navbarToggleBtn, navbarCollapse); // Hide the navbarCollapse object
                }
            }
        });
    }

    // Add a 'resize' event listener to the navbarObject to hide the navbarCollapse object
    window.addEventListener('resize', (): void => {
        // Check if the navbarCollapse is collapsed
        if (!navbarCollapse.classList.contains('collapsed')) return;

        // Hide the navbarCollapse object
        hideAdaptiveMenu(navbarToggleBtn, navbarCollapse);
    });
});



function collapseAdaptiveMenu(btn: HTMLElement, navbar: HTMLElement):void {
    /* The function collapses the adaptive menu by adding the 'collapsed' class to it
    * and adds the 'active' class to the toggle button
    *
    * Arguments:
    * - btn: The navbar toggle button
    * - navbar: The navbar adaptive menu */

    // Add the 'active' class to the toggle button
    btn.classList.add('active');

    // Add the 'collapsed' class to the navbar adaptive menu
    navbar.classList.add('collapsed');
}


function hideAdaptiveMenu(btn: HTMLElement, navbar: HTMLElement):void {
    /* The function hides the adaptive menu by removing the 'collapsed' class from it
    * and removes the 'active' class from the toggle button
    *
    * Arguments:
    * - btn: The navbar toggle button
    * - navbar: The navbar adaptive menu */

    // Remove the 'active' class from the toggle button
    btn.classList.remove('active');

    // Remove the 'collapsed' class from the navbar adaptive menu
    navbar.classList.remove('collapsed');
}