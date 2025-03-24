// Get all elements with the attribute data-bs-toggle="modal"
const modalTriggers: NodeListOf<HTMLElement> = document.querySelectorAll('[data-bs-toggle="modal"]');

// Convert the NodeList to an array
const modalTriggersArray: HTMLElement[] = Array.from(modalTriggers);

// Iterate over each item in the modalElementsArray to give it an eventListener
modalTriggersArray.forEach((element: HTMLElement): void => {

    const activateModal = (modalObject: HTMLElement): void => {
        /* Activate the modal object if it's not activated */

        // Get the modal content object
        const modalContent: HTMLElement | null = modalObject.querySelector('.modal-content');

        // Ensures the modal doesn't have active class
        if (!modalObject.classList.contains('active')) {
            // Add an active class to the modalObject
            modalObject.classList.add('active');

            // Disable the scrolling
            document.body.classList.add('disabled-scrolling');

            // Check if the modalContent exists
            if (modalContent) {
                // Add an active class to the modal content object after a 0.3 seconds
                setTimeout(():void => modalContent.classList.add('active'), 300);
            }
        }
    }

    const deactivateModal = (modalObject: HTMLElement): void => {
        /* Deactivate the modal object */

        // Get the modal content object
        const modalContent: HTMLElement | null = modalObject.querySelector('.modal-content');

        // Ensures the modal has active class
        if (modalObject.classList.contains('active')) {
            // Enable the scrolling
            document.body.classList.remove('disabled-scrolling');

            // Check if the modalContent exists
            if (modalContent) {
                // Remove an active class to the modal content object
                modalContent.classList.remove('active');

                // Remove an active class to the modalObject after 0.3 seconds
                setTimeout((): void => modalObject.classList.remove('active'), 300);
            } else {
                // Remove an active class to the modalObject
                modalObject.classList.remove('active');
            }
        }
    }

    const modalShake = (modalContent: HTMLElement): void => {
        /* Add a 'shaking' class to the modal content object for a 2 second */

        modalContent.classList.add('shaking');

        // Remove shaking class after 2 seconds
        setTimeout((): void => modalContent.classList.remove('shaking'), 2000);
    }


    // Give an event listener to each button
    element.addEventListener('click', (e: MouseEvent): void => {
        e.preventDefault();

        // Get the target id (Modal id)
        const targetId: string | null = element.getAttribute('data-bs-target');

        // Ensure the targetId is not null
        if (!targetId) return;

        // Get the modal object by the targetId
        const modalObject: HTMLElement | null = document.querySelector(targetId);

        // Ensure the modalObject exists
        if (!modalObject) return;

        // Get the modal content object
        const modalDialog: HTMLElement | null = modalObject.querySelector('.modal-dialog');

        // Add an event listener to the modalObject
        modalObject.addEventListener('click', (e: MouseEvent): void => {

            // Get the clicked HTML object
            const clickedObject: HTMLElement = e.target as HTMLElement;

            // Check if the user clicked on the empty space (outside modal dialog) to deactivate the modal
            if (clickedObject.classList.contains('modal') ||
                clickedObject.classList.contains('modal-dialog')) {

                /* Checked whether the modalObject is allowed to
                be deactivated by clicking on an empty place */
                if (modalObject.getAttribute('data-bs-backdrop') !== 'static') {
                    // Fire the deactivateModal function
                    deactivateModal(modalObject);
                } else {
                    // Make sure the modal dialog exists (is not null)
                    if (!modalDialog) return;

                    // Fire the modalShakeFunction
                    modalShake(modalDialog);
                }
            }
        });


        // Get all elements that can deactivate the modal
        const modalDeactivateElements: NodeListOf<HTMLElement> = modalObject.querySelectorAll('[data-bs-dismiss="modal"]');

        // Convert the NodeList to an array
        const modalDeactivateElementsArray: HTMLElement[] = Array.from(modalDeactivateElements);

        // Iterate over each element in the modalDeactivateElementsArray to give it an evenListener
        modalDeactivateElementsArray.forEach((element: HTMLElement): void => {
            // Give an event listener to each element
            element.addEventListener('click', (e: MouseEvent): void => {
                e.preventDefault();

                deactivateModal(modalObject); // Fire the deactivate function
            });
        });


        // Fire the activate modal function
        activateModal(modalObject);
    });
});