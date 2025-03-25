// Retrieve a NodeList of the toast elements
const toastElements: NodeListOf<HTMLElement> = document.querySelectorAll('.toast');

// Convert the NodeList to an array
const toastElementsArray: HTMLElement[] = Array.from(toastElements);

// Iterate over each toast in the toastElementsArray
toastElementsArray.forEach((toast: HTMLElement): void => {
    // Get the toast removal button or null
    const toastRemovalBtn: HTMLElement | null = toast.querySelector('button[data-remove="toast"]');

    // Make sure the removal button exists
    if (!toastRemovalBtn) return;

    /* Declare the removeImmediately variable. It indicates whether
    the toast should be deleted immediately or after 300ms. */
    let removeImmediately: boolean = true;

    // Check whether the class name contains the '@' symbol, which indicates that the object is animated
    if (toast.className.includes('@')) {
        removeImmediately = false;
    }

    // Check if the toast object needs to be removed after a certain period of time
    const attr: string | null = toast.getAttribute('data-toast-duration');
    const toastDuration: number | boolean = attr && !isNaN(+attr) ? +attr : false;

    // Fire the removal timeout if the toastDuration is of type number
    if (toastDuration) {
        updateExpirationBar(toast, toastDuration, removeImmediately);
    }

    // Give an event listener to the removal button
    toastRemovalBtn.addEventListener('click', (e: MouseEvent):void => {
        e.preventDefault();

        // Fire the toast removal function
        deleteToast(toast, removeImmediately);
    });
});


function deleteToast(toast: HTMLElement, removeImmediately: boolean): void {
    /* This function takes and remove the toast HTML object
    *
    * Attributes:
    * - 'toast': The HTML object that will be removed
    * - 'removeImmediately':  Indicates that the object should be removed immediately
    * */

    // Check if the object should be removed immediately
    if (removeImmediately) {
        toast.remove(); // Remove the HTML object
        return; // End the function execution
    }

    // Add the 'removing' class to the toast object
    toast.classList.add('removing');

    // Remove the toast object after 300ms
    setTimeout(():void => toast.remove(), 300);
}

function updateExpirationBar(toast: HTMLElement, duration: number, removeImmediately: boolean): void {
    /* This function updates the expiration bar every 10ms
    * and fires the removal function when the time has elapsed.
    *
    * Attributes:
    * - 'toast': The html object that supposed to be deleted
    * - 'duration': The duration for which the toast is displayed
    * - 'removeImmediately': It should be passed as an attribute to the removal function
    */

    // Get the toast expiration bar or null if it does not exist
    const expirationBar: HTMLElement | null = toast.querySelector('.toast-expiry-bar');

    // Declare the updateExpirationBarInterval
    let updateExpirationBarInterval: NodeJS.Timeout | null = null;

    // Set the updateExpirationBarInterval interval if the expirationBar exists (not null)
    if (expirationBar) {
        // Declare the elapsedTime variable
        let elapsedTime: number = 0;

        updateExpirationBarInterval = setInterval(():void => {
            // Updated the elapsedTime
            elapsedTime += 10;

            // Change the expirationBar width
            expirationBar.style.width = `${100 - (elapsedTime * 100 / duration)}%`;
        }, 10);
    }


    // Remove the toast and clear the updateExpirationBarInterval if it is not null
    setTimeout(():void => {
        deleteToast(toast, removeImmediately); // Remove the toast object

        // Remove the updateExpirationBarInterval if it is not null
        if (updateExpirationBarInterval) {
            clearInterval(updateExpirationBarInterval);
        }

    }, duration);
}