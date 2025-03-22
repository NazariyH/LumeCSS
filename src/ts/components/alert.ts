// Retrieve a NodeList of HTML objects that have the 'alert' class
const alertElements: NodeListOf<HTMLElement> = document.querySelectorAll('.alert');

// Convert the NodeList to an array
const alertElementsArray: HTMLElement[] = Array.from(alertElements);

// Iterate over each element int the alertElementsArray
alertElementsArray.forEach((alert: HTMLElement): void => {
    // Retrieve the removal button or null if it does not exist
    const removalButton: HTMLElement | null = alert.querySelector('button[data-bs-remove="alert"]');

    // Make sure the removal button exists (not null)
    if (!removalButton) return;
    
    /* Declare the removeImmediately variable. It indicates whether
    the alert should be deleted immediately or after 300ms. */
    let removeImmediately: boolean = true;

    // Check whether the class name contains the '@' symbol, which indicates that the object is animated
    if (alert.className.includes('@')) {
        removeImmediately = false;
    }

    // Add an eventListener to the removal button
    removalButton.addEventListener('click', (e: MouseEvent): void => {
        e.preventDefault();

        deleteAlert(alert, removeImmediately); // Remove the alert
    });
});


function deleteAlert(alert: HTMLElement, removeImmediately: boolean): void {
    /* This function takes and remove the alert HTML object
    *
    * Attributes:
    * - 'alert': The HTML object that will be removed
    * - 'removeImmediately':  Indicates that the object should be removed immediately
    * */

    // Check if the object should be removed immediately
    if (removeImmediately) {
        alert.remove(); // Remove the alert object
        return; // End the function execution
    }

    // Add the 'removing' class to the alert object
    alert.classList.add('removing');

    // Remove the alert object
    setTimeout((): void => alert.remove(), 300);
}