// Retrieve a NodeList of the toast elements
const toastElements: NodeListOf<HTMLElement> = document.querySelectorAll('.toast');

// Convert the NodeList to an array
const toastElementsArray: HTMLElement[] = Array.from(toastElements);

// Iterate over each toast in the toastElementsArray
toastElementsArray.forEach((toast: HTMLElement): void => {
    // Get the toast removal button or null
    const toastRemovalBtn: HTMLElement | null = toast.querySelector('button[data-bs-remove="toast"]');

    // Make sure the removal button exists
    if (!toastRemovalBtn) return;

    /* Declare the removeImmediately variable. It indicates whether
    the toast should be deleted immediately or after 300ms. */
    let removeImmediately: boolean = true;

    // Check whether the class name contains the '@' symbol, which indicates that the object is animated
    if (toast.className.includes('@')) {
        removeImmediately = false;
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