// Get a NodeList of the offcanvas trigger buttons
const triggerOffcanvasButtons: NodeListOf<HTMLElement> = document.querySelectorAll('*[data-toggle="offcanvas"]');

// Convert the NodeList to an array
const triggerOffcanvasButtonsArray: HTMLElement[] = Array.from(triggerOffcanvasButtons);

// Get an array of the offcanvas objects
const offcavasElementsArray: HTMLElement[] = Array.from(document.querySelectorAll('.offcanvas'));


// Iterate over each button in the triggerOffcanvasButtonsArray and add an event listener for each one
triggerOffcanvasButtonsArray.forEach((btn: HTMLElement):void => {
    // Get the data-target attribute of the button or null if it does not exist
    const btnTarget: string | null = btn.getAttribute('data-target'); // data-target contains an ID of the canvas object

    // Make sure that the btnTarget is not null
    if (!btnTarget) return;

    // Get the canvas object by the btnTarget ID, or return null if it does not exist
    const offcanvas: HTMLElement | null = document.querySelector(btnTarget);

    // Make sure the canvas exists (not null)
    if (!offcanvas) return;

    /* Get the "data-scroll" attribute of the canvas element.
       It indicates whether scrolling is allowed when the canvas is displayed. */
    const allowScrolling: boolean = offcanvas.getAttribute('data-scroll') === 'true';


    // Give an eventListener to the trigger button
    btn.addEventListener('click', (event: MouseEvent): void => {
        event.preventDefault();

        // Check if the canvas object is already shown
        if (offcanvas.classList.contains('show')) {
            // Hide the offcanvas object
            hideOffcanvas(offcanvas);
        } else {
            // Show the offcanvas object
            showOffcanvas(offcanvas, allowScrolling);
        }
    });

    // Get the offcanvas dismiss buttons
    const dismissButtonsArray: HTMLElement[] = Array.from(offcanvas.querySelectorAll('*[data-dismiss="offcanvas"]'));

    // Iterate over each dismiss button to give it an eventListener
    dismissButtonsArray.forEach((btn: HTMLElement):void => {
        // Give an eventListener
        btn.addEventListener('click', (event: MouseEvent): void => {
            event.preventDefault();

            // Hide the offcanvas object
            hideOffcanvas(offcanvas);
        });
    });


    /* Check whether the offcanvas object is allowed to
       be hidden by clicking on an empty place */
    if (offcanvas.getAttribute('data-backdrop') !== 'static') {
        // Add an EventListener to the canvas object
        document.addEventListener('click', (event: MouseEvent): void => {

            // Check if the clicked target is outside the offcanvas element and not its trigger button
            if (btn !== event.target as HTMLElement &&
                !offcanvas.contains(event.target as HTMLElement)) {

                hideOffcanvas(offcanvas); // Hide the offcanvas object
            }
        });
    }
});

// Iterate over each offcanvas in the offcavasElementsArray and add en event listner for each one
offcavasElementsArray.forEach((offcanvas: HTMLElement):void => {
    // Add an event listener to the offcanvas
    offcanvas.addEventListener('click', (event: MouseEvent): void => {
        /* Check whether the offcanvas object is allowed to
           be hidden by clicking on an empty place */
        if (offcanvas.getAttribute('data-backdrop') !== 'static') {

            // Check if the clicked target is outside the offcanvas element
            if (offcanvas === event.target as HTMLElement) {
                hideOffcanvas(offcanvas); // Hide the offcanvas object
            }
        }
    });
});


function showOffcanvas(offcanvas: HTMLElement, allowScrolling: boolean):void {
    /* The function shows the offcanvas by adding the 'show' class
    * to both the offcanvas and offcanvas-content elements
    *
    * Attributes:
    *  - 'offcanvas': The HTML object that is supposed to be shown
    *  - 'allowScrolling': The boolean variable that indicates whether the user
    *                   is allowed to scroll when the offcanvas is shown
    * */

    // Get the offcanvas content block or null if it does not exist
    const offcanvasContent: HTMLElement | null = offcanvas.querySelector('.offcanvas-content');

    // Show the offcanvas by adding the 'show' class
    offcanvas.classList.add('show');

    // Show the offcanvas content after 300ms if it is not null
    if (offcanvasContent) {
        setTimeout(():void => offcanvasContent.classList.add('show'), 300);
    }

    // Check whether the user is allowed to scroll
    if (allowScrolling) return;

    // Disable scrolling
    document.body.style.overflow = 'hidden';
}

function hideOffcanvas(offcanvas: HTMLElement):void {
    /* The function hides the offcanvas object by removing the 'show' class
    *
    * Attributes:
    * - 'offcanvas': The HTML object that is supposed to be hidden
    * */

    // Get the offcanvas content block or null if it does not exist
    const offcanvasContent: HTMLElement | null = offcanvas.querySelector('.offcanvas-content.show');

    // Hide the offcanvasContent object if it exists, by removing the 'show' class
    if (offcanvasContent) {
        offcanvasContent.classList.remove('show');
    }

    // Hide the offcanvas object after 300ms
    setTimeout(():void => offcanvas.classList.remove('show'), 300);

    // Enable scrolling
    document.body.style.overflow = 'auto';
}