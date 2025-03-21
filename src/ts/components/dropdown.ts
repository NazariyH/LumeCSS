// Get the NodeList of dropdown objects
const dropdownElements: NodeListOf<HTMLElement> = document.querySelectorAll('.dropdown');

// Convert the NodeList to an array
const dropdownElementsArray: HTMLElement[] = Array.from(dropdownElements);


/* Iterate over each dropdown element in the dropdownElementsArray
to give an event listener to each dropdown-toggle button */
dropdownElementsArray.forEach((element: HTMLElement):void => {
    /* Get the value of the data-close-previous attribute from the dropdown wrapper.
       By default, this is set to true. However, if it is set to false,
       every time the user tries to collapse the dropdown, a function will be triggered
       to deactivate any previously opened dropdowns. */
    const closePrevious: boolean = element ? element.getAttribute('data-close-previous') === 'true' : false;

    // Get the dropdown-toggle button
    const dropdownToggleBtn: HTMLElement | null = element.querySelector('.dropdown-toggle');

    // Get the dropdown menu or null
    const dropdownMenu: HTMLElement | null = element.querySelector('.dropdown-menu');

    // Check if the toggle button and dropdown menu exist
    if (dropdownToggleBtn && dropdownMenu) {
        /* Get the button attribute 'data-dropdown-trigger'.
         * It indicates how the dropdown will be collapsed.
         * The value can be either 'click' or 'hover-click'.
         * It is 'click' by default */
        const dropdown_trigger: string = dropdownToggleBtn.getAttribute('data-dropdown-trigger') || 'click';


        // Get the dropdown arrow button or null
        const dropdownArrowBtn: HTMLElement | null = dropdownToggleBtn.querySelector('.btn-arrow');

        // Declare the dropdown size variable
        let dropdownMenuSize: number;

        // Retrieve the dropdown direction
        let dropdownMenuDirection: 'x' | 'y';
        if (element.classList.contains('dropdown-left') || element.classList.contains('dropdown-right')) {
            dropdownMenuDirection = 'x';

            // Get the dropdown menu width
            dropdownMenuSize = dropdownMenu.offsetWidth;
        } else {
            dropdownMenuDirection = 'y';

            // Get the dropdown menu height
            dropdownMenuSize = dropdownMenu.offsetHeight;
        }


        /* It specifies whether the button can be closed after the mouse leaves.
        If the user collapses the dropdown using the button, it cannot be closed by mouseleave.
        However, if the user collapses the dropdown using mouseenter, it can be closed by mouseleave. */
        let allowCloseByMouseLeave: boolean = false;

        // Add the eventListeners to the toggle button
        dropdownToggleBtn.addEventListener('click', (e: MouseEvent):void => {
            e.preventDefault();

            // Check if the dropdown is already collapsed
            if (element.classList.contains('collapsed')) {
                // Hide the dropdown menu
                deactivateDropdownMenu(
                    element,
                    dropdownArrowBtn,
                    dropdownMenu,
                    dropdownMenuDirection
                );
            } else {
                // Check if it is allowed to open multiple dropdowns
                if (closePrevious) {
                    closeCollapsedDropdowns();
                }

                // Show the dropdown menu
                collapseDropdownMenu(
                    element,
                    dropdownArrowBtn,
                    dropdownMenu,
                    dropdownMenuSize,
                    dropdownMenuDirection
                );

                // Assign false to the allowCloseByMouseLeave
                allowCloseByMouseLeave = false;
            }
        });

        // Add the hover eventListeners to the toggle button
        if (dropdown_trigger === 'hover-click') {
            // Add the mouse enter eventListener
            dropdownToggleBtn.addEventListener('mouseenter', ():void => {
                // Ensure the dropdown is not collapsed
                if (element.classList.contains('collapsed')) return;


                // Check if it is allowed to open multiple dropdowns
                if (closePrevious) {
                    closeCollapsedDropdowns();
                }


                // Show the dropdown menu
                collapseDropdownMenu(
                    element,
                    dropdownArrowBtn,
                    dropdownMenu,
                    dropdownMenuSize,
                    dropdownMenuDirection
                );

                // Assign true to the allowCloseByMouseLeave
                allowCloseByMouseLeave = true;
            });

            // Add the mouse leave eventListener
            dropdownToggleBtn.addEventListener('mouseleave', ():void => {
                // Ensure the dropdown is already collapsed and allowCloseByMouseLeave is true
                if (!element.classList.contains('collapsed') || !allowCloseByMouseLeave) return;

                // Hide the dropdown menu
                deactivateDropdownMenu(
                    element,
                    dropdownArrowBtn,
                    dropdownMenu,
                    dropdownMenuDirection
                );
            });
        }
    }
});


function closeCollapsedDropdowns(): void {
    /* The function deactivates all dropdowns which are collapsed */

    // Retrieve the NodeList of collapsed dropdowns
    const collapsedDropdowns: NodeListOf<HTMLElement> = document.querySelectorAll('.dropdown.collapsed');

    // Convert the NodeList to an array
    const collapsedDropdownsArray: HTMLElement[] = Array.from(collapsedDropdowns);

    // Iterate over each element in the collapsedDropdownsArray to deactivate it
    collapsedDropdownsArray.forEach((element: HTMLElement):void => {
        // Get the dropdown menu or null
        const dropdownMenu: HTMLElement | null = element.querySelector('.dropdown-menu');

        // Get the dropdown arrow button or null
        const dropdownArrowBtn: HTMLElement | null = element.querySelector('.btn-arrow');

        // Make sure that the dropdownMenu exists
        if (!dropdownMenu) return;

        // Retrieve the dropdown direction
        let dropdownMenuDirection: 'x' | 'y';
        if (element.classList.contains('dropdown-left') || element.classList.contains('dropdown-right')) {
            dropdownMenuDirection = 'x';
        } else {
            dropdownMenuDirection = 'y';
        }

        // Deactivate the dropdown
        deactivateDropdownMenu(element, dropdownArrowBtn, dropdownMenu, dropdownMenuDirection);
    });
}


function collapseDropdownMenu(
    dropdown: HTMLElement,
    dropdownArrowBtn: HTMLElement | null,
    dropdownMenu: HTMLElement,
    dropdownMenuSize: number,
    dropdownMenuDirection: 'x' | 'y',
):void {
    /* This function activates the dropdown menu.
     * Attributes:
     * - 'dropdown': The parent wrapper of the dropdown element.
     * - 'dropdownArrowBtn': The arrow button that indicates the dropdown can collapse.
     * - 'dropdownMenu': The dropdown menu element, which contains a list of links and tabs.
     * - 'dropdownMenuSize': The size of the dropdown menu. Used to make the dropdown animated
     * - 'dropdownMenuDirection': It specifies how we should collapse the menu list */

    // Give the 'collapsed' class to the dropdown wrapper
    dropdown.classList.add('collapsed');

    // Remove the height or width of the dropdownMenu to make it look animated
    if (dropdownMenuDirection === 'x') {
        dropdownMenu.style.width = '0';
    } else {
        dropdownMenu.style.height = '0';
    }

    // Ensure the dropdown arrow button exists and give it active class
    if (dropdownArrowBtn) {
        dropdownArrowBtn.classList.add('active');
    }

    // Assign the dropdownMenuSize to the dropdownMenu after 10ms
    setTimeout(():void => {
        if (dropdownMenuDirection === 'x') {
            dropdownMenu.style.width = `${dropdownMenuSize}px`
        } else {
            dropdownMenu.style.height = `${dropdownMenuSize}px`
        }
    }, 10);
}


function deactivateDropdownMenu(
    dropdown: HTMLElement,
    dropdownArrowBtn: HTMLElement | null,
    dropdownMenu: HTMLElement,
    dropdownMenuDirection: 'x' | 'y',
):void {
    /* This function deactivates the dropdown menu.
     * Attributes:
     * - 'dropdown': The parent wrapper of the dropdown element.
     * - 'dropdownArrowBtn': The arrow button that indicates the dropdown can collapse.
     * - 'dropdownMenu': The dropdown menu element, which contains a list of links and tabs.
     * - 'dropdownMenuDirection': It specifies how we should close the menu list */

    // Remove the height or width of the dropdownMenu to make it look animated
    if (dropdownMenuDirection === 'x') {
        dropdownMenu.style.width = `0`;
    } else {
        dropdownMenu.style.height = `0`;
    }

    // Ensure the dropdown arrow button exists and give it active class
    if (dropdownArrowBtn) {
        dropdownArrowBtn.classList.remove('active');
    }

    // Remove the 'collapsed' class of the dropdown wrapper
    dropdown.classList.remove('collapsed');
}