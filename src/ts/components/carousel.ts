// Get an array of carousel objects
const carouselArray: HTMLElement[] = Array.from(document.querySelectorAll('.carousel'));


// Declare the startPosition and endPosition variables used for the touch-enabled carousel
let startPosition: number = 0;
let endPosition: number = 0;

// Iterate of each carousel in the carouselArray
carouselArray.forEach((carousel: HTMLElement): void => {
    // Get an array of the carousel items
    const carouselItemsArray: HTMLElement[] = Array.from(carousel.querySelectorAll('.carousel-item'));

    /* Define the isFadeCarousel variable, which can be either true or false,
    and specifies whether the carousel uses a fade effect */
    const isFadeCarousel: boolean = carousel.classList.contains('carousel-fade');

    // Make sure the carouselItemsArray is not empty
    if (carouselItemsArray.length < 1) return;

    // Call the setDefaultPosition function
    setDefaultPosition(carouselItemsArray);

    // Call the addIndicatorButtons function
    addIndicatorButtons(carousel, carouselItemsArray);

    // Call the loadCarouselItemImage function
    loadCarouselItemImage(carouselItemsArray);

    if (!isFadeCarousel) {
        // Call the moveCarouselToDefaultPosition function if the carousel is not fade-carousel
        moveCarouselToDefaultPosition(carousel, carouselItemsArray);
    }

    // Add event listeners to the carousel navigation buttons
    addEventListenersToNavigationButtons(carousel, carouselItemsArray, isFadeCarousel);
});


function addIndicatorButtons(
    carousel: HTMLElement,
    carouselItemsArray: HTMLElement[]
): void {
    /* The function is responsible for adding indicator buttons to
    * the carousel indicator wrapper if the indicator wrapper exists.
    *
    * Attributes:
    *   - carousel: The carousel HTML object which is used to get carousel indicators wrapper
    *   - carouselItemsArray: An array of the carousel item objects
    *  */

    // Define the defaultSlideIsSpecified variable
    let defaultSlideIsSpecified: boolean = false;

    // Get the carousel indicators wrapper or null if it does not exist
    const indicatorsWrapper: HTMLElement | null = carousel.querySelector('.carousel-indicators');

    // Make sure the indicatorsWrapper exists (is not null)
    if (!indicatorsWrapper) return;

    // Iterate over each item in the carouselItemsArray
    carouselItemsArray.forEach((item: HTMLElement, index: number): void => {
        // Create the indicator button object
        const indicatorBtn: HTMLSpanElement = document.createElement("span");

        // Add the 'carousel-indicator' class to the indicatorBtn
        indicatorBtn.classList.add('carousel-indicator');

        // Add the 'data-carousel-slide-index' attribute to the indicatorBtn
        indicatorBtn.setAttribute('data-carousel-slide-index', `${index}`);

        // Add the 'active' class to the indicatorBtn if the item object contains the 'active' class
        if (item.classList.contains('active') && !defaultSlideIsSpecified) {
            indicatorBtn.classList.add('active');
            defaultSlideIsSpecified = true;
        }

        // Append the indicatorBtn into the indicatorsWrapper
        indicatorsWrapper.appendChild(indicatorBtn);
    });
}


function loadCarouselItemImage(carouselItemsArray: HTMLElement[]): void {
    /* The function iterates over each carousel item in the carouselItemsArray, looks
    * for the .carousel-img tag, and if it exists, it takes the image src link and adds it
    * as a background-image style to the carousel item using the found src.
    *
    * Attributes:
    *   - carouselItemsArray: An array of the carousel item objects
    * */

    // Iterate over each item in the carouselItemsArray
    carouselItemsArray.forEach((item: HTMLElement): void => {
        // Retrieve the .carousel-img or null if it does not exist
        const carouselItemImage: HTMLImageElement | null = item.querySelector('.carousel-img');

        // Make sure the carouselItemImage exists (is not null)
        if (!carouselItemImage) return;

        // Retrieve the image src or null if it is not provided
        const src: string | null = carouselItemImage.getAttribute('src') ? carouselItemImage.getAttribute('src') : null;

        // Make sure the image's src is not null
        if (!src) return;

        // Update the carousel item background-image CSS property
        item.style.backgroundImage = `url(${src})`;
    });
}


function moveCarouselToDefaultPosition(
    carousel: HTMLElement,
    carouselItemsArray: HTMLElement[]
): void {
    /* The function is responsible for moving the carousel to its initial
    * position when the web page is loaded.
    *
    * Attributes:
    *   - carousel: The carousel HTML object is used to get the carousel inner element
    *   - carouselItemsArray: An array of the carousel item objects
    * */

    // Retrieve the carousel inner HTML object or null if it does not exist
    const carouselInner: HTMLElement | null = carousel.querySelector('.carousel-inner');

    // Make sure the carouselInner exists (is not null)
    if (!carouselInner) return;

    // Iterate over each item in the carouselItemsArray
    for (let index: number = 0; index < carouselItemsArray.length; index++) {
        const item: HTMLElement = carouselItemsArray[index];

        // Check if the item contains the 'active' class
        if (item.classList.contains('active')) {
            // Get the computed style of the element
            let style: CSSStyleDeclaration = window.getComputedStyle(carouselInner);

            // Retrieve the transition property value
            let transition: string = style.transition;

            // Disable the carouselInner transition property for a while
            carouselInner.style.transition = 'none';

            // Update the carousel inner position
            carouselInner.style.left = `-${index * 100}%`;

            // Enable the carouselInner transition property after a while
            setTimeout((): void => {
                carouselInner.style.transition = transition
            }, 100);

            // End the function execution
            return;
        }
    }
};


function setDefaultPosition(carouselItemsArray: HTMLElement[]): void {
    /* The function is responsible for setting the default active slide if it
    * is not specified by the user.
    *
    * Attributes:
    *   - carouselItemsArray: An array of the carousel item objects
    * */

    // Define the defaultSlideIsSpecified variable
    let defaultSlideIsSpecified: boolean = false;

    // Iterate over each item in the carouselItemsArray
    carouselItemsArray.forEach((item: HTMLElement, index: number): void => {
        // Check if the item contains the 'active' class
        if (item.classList.contains('active')) defaultSlideIsSpecified = true;
    });

    // Make sure the defaultSlideIsSpecified is not true
    if (defaultSlideIsSpecified) return;

    // Make the first item default by adding the 'active' class
    carouselItemsArray[0].classList.add('active');
}


function updateCarouselCurrentIndex(
    carouselItemsArray: HTMLElement[],
    carouselDirection: 'forward' | 'backward' | null,
    newIndex: number | null

): { previousIndex: number | null, currentIndex: number | null } {
    /* The function is responsible for updating the carousel's current index
    * and returns the previousIndex and currentIndex.
    *
    * Attributes:
    *   - carouselItemsArray: An array of the carousel item objects
    *   - carouselDirection: It indicates whether the currentIndex should
    *     be increased or decreased by one
    *   - newIndex: The new current position
    * */

    // Define the currentIndex, and previousIndex variable
    let currentIndex: number | null = null;
    let previousIndex: number | null = null;


    // Define the numberOfCarouselItems variable
    const numberOfCarouselItems: number = carouselItemsArray.length;

    // Make sure the numberOfCarouselItems is grater than 0
    if (numberOfCarouselItems <= 0) return { previousIndex: null, currentIndex: null };

    // Iterate over each item in the carouselItemsArray
    for (let index: number = 0; index < carouselItemsArray.length; index++) {
        // Check if the carousel item contains the 'active' class
        if (carouselItemsArray[index].classList.contains('active')) {
            // Update the current index
            currentIndex = index;
            break; // End the loop execution
        }
    }

    // Make sure the currentIndex is not null
    if (currentIndex === null) return { previousIndex: null, currentIndex: null };

    // Check if the carouselDirection is specified
    if (carouselDirection) {
        // Check the state of the carouselDirection
        if (carouselDirection === 'forward') {
            // Make sure the currentIndex is lower than the numberOfCarouselItems
            if (currentIndex + 1 >= numberOfCarouselItems) {
                previousIndex = currentIndex; // Specify the previous index
                currentIndex = 0; // Reset the currentIndex
            } else {
                previousIndex = currentIndex; // Specify the previous index
                currentIndex++; // Update the currentIndex
            }
        } else if (carouselDirection === 'backward') {
            // Make sure the currentIndex is greater than or equal to 0
            if (currentIndex <= 0) {
                previousIndex = currentIndex; // Specify the previous index
                currentIndex = numberOfCarouselItems - 1; // Update the currentIndex
            } else {
                previousIndex = currentIndex; // Specify the previous index
                currentIndex--; // Update the currentIndex
            }
        }

        // End the function execution
        return { previousIndex, currentIndex };
    }


    // Check if the newIndex is provided
    if (newIndex != null) {
        previousIndex = currentIndex; // Specify the previous index
        currentIndex = newIndex; // Update the currentIndex

        // End the function execution
        return { previousIndex, currentIndex };
    }


    return { previousIndex: null, currentIndex: null };
}


function addEventListenersToNavigationButtons(
    carousel: HTMLElement,
    carouselItemsArray: HTMLElement[],
    isFadeCarousel: boolean
): void {
    /* The function adds event listeners to the carousel navigation buttons.
    *
    * Attributes:
    *   - carousel: The main carousel wrapper
    *   - carouselItemsArray: An array of the carousel item objects
    *   - isFadeCarousel: it specifies whether the carousel uses a fade effect
    * */


    /* Define the carouselIsMoving variable; it is used to prevent the user
    from spamming the carousel navigation buttons.*/
    let carouselIsMoving: boolean = false;


    // Define the carousel previousIndex and nextIndex variables
    let previousIndex: number | null = null;
    let nextIndex: number | null = null;


    // Retrieve the carousel carousel-control-prev button or null if it does not exist
    const prevButton: HTMLElement | null = carousel.querySelector('.carousel-control-prev');

    // Retrieve the carousel carousel-control-next button or null if it does not exist
    const nextButton: HTMLElement | null = carousel.querySelector('.carousel-control-next');

    // Retrieve an array of the carousel indicator buttons
    const indicatorButtonsArray: HTMLElement[] = Array.from(carousel.querySelectorAll('.carousel-indicator'));


    const updateCarouselIsMoving: () => void = (): void => {
        // Assign true to the carouselIsMoving variable if the carousel does not use a fade effect
        if (!isFadeCarousel) {
            carouselIsMoving = true;

            // Assign false to the carouselIsMoving after 500 milliseconds
            setTimeout((): void => {carouselIsMoving = false}, 500);
        }
    }


    // Add an array listener to the prevButton if it exists (is not null)
    if (prevButton) {
        prevButton.addEventListener('click', (event: MouseEvent): void => {
            event.preventDefault();

            // Make sure the carouselIsMoving variable is false
            if (carouselIsMoving) return;

            // Call the updateCarouselCurrentIndex function
            const { previousIndex: prev, currentIndex: next } = updateCarouselCurrentIndex(
                carouselItemsArray, 'backward', null
            );

            // Retrieve the carousel previousIndex and nextIndex
            previousIndex = prev;
            nextIndex = next;

            // Make sure the previousIndex and nextIndex are not null
            if (previousIndex != null && nextIndex != null) {
                manageCarouselMovement(carousel, carouselItemsArray, previousIndex, nextIndex, 'backward');
            }

            // Call the updateCarouselIsMoving function
            updateCarouselIsMoving();
        });
    }

    // Add an array listener to the nextButton if it exists (is not null)
    if (nextButton) {
        nextButton.addEventListener('click', (event: MouseEvent): void => {
            event.preventDefault();

            // Make sure the carouselIsMoving variable is false
            if (carouselIsMoving) return;

            // Call the updateCarouselCurrentIndex function
            const { previousIndex: prev, currentIndex: next } = updateCarouselCurrentIndex(
                carouselItemsArray, 'forward', null
            );

            // Retrieve the carousel previousIndex and nextIndex
            previousIndex = prev;
            nextIndex = next;

            // Make sure the previousIndex and nextIndex are not null
            if (previousIndex != null && nextIndex != null) {
                manageCarouselMovement(carousel, carouselItemsArray, previousIndex, nextIndex, 'forward');
            }

            // Call the updateCarouselIsMoving function
            updateCarouselIsMoving();
        });
    }

    // Add event listeners to the indicator buttons if the indicatorButtonsArray is not empty
    if (indicatorButtonsArray.length > 0) {
        // Iterate over each item in the indicatorButtonsArray
        indicatorButtonsArray.forEach((item: HTMLElement, index: number): void => {
            item.addEventListener('click', (event: MouseEvent): void => {
                event.preventDefault();

                // Make sure the carouselIsMoving variable is false
                if (carouselIsMoving) return;

                // Call the updateCarouselCurrentIndex function
                const { previousIndex: prev, currentIndex: next } = updateCarouselCurrentIndex(
                    carouselItemsArray, null, index
                );


                // Retrieve the carousel previousIndex and nextIndex
                previousIndex = prev;
                nextIndex = next;

                // Make sure the previousIndex and nextIndex are not null
                if (previousIndex != null && nextIndex != null) {
                    manageCarouselMovement(
                        carousel,
                        carouselItemsArray,
                        previousIndex,
                        nextIndex,
                        getCarouselMovementDirection(previousIndex, nextIndex)
                    );
                }

                // Call the updateCarouselIsMoving function
                updateCarouselIsMoving();
            });
        });
    }


    // Handle the movement of the touch-enabled carousel
    carousel.addEventListener('touchstart', (event: TouchEvent): void => {
        event.preventDefault();

        // Make sure the carouselIsMoving variable is false
        if (carouselIsMoving) return;

        // Store the horizontal position where the touch started
        const touch: Touch = event.touches[0];
        startPosition = touch.clientX;
    });

    carousel.addEventListener('touchend', (event: TouchEvent): void => {
        event.preventDefault();

        // Make sure the carouselIsMoving variable is false
        if (carouselIsMoving) return;

        // Store the horizontal position where the touch started
        const touch: Touch = event.changedTouches[0];
        endPosition = touch.clientX;

        // Define the swipeDirection variable
        const swipeDirection: 'forward' | 'backward' | null = calculateTouchDirection(
            carousel.offsetWidth/3,
            startPosition,
            endPosition
        );

        // Make sure the swipeDirection is not null
        if (!swipeDirection) return;

        // Call the updateCarouselCurrentIndex function
        const { previousIndex: prev, currentIndex: next } = updateCarouselCurrentIndex(
            carouselItemsArray, swipeDirection, null
        );

        // Retrieve the carousel previousIndex and nextIndex
        previousIndex = prev;
        nextIndex = next;

        // Fire the handleCarouselMovement function
        manageCarouselMovement(
            carousel,
            carouselItemsArray,
            previousIndex,
            nextIndex,
            swipeDirection,
        );
    });


    // Handle the movement of the mouse-enabled carousel
    carousel.addEventListener('mousedown', (event: MouseEvent): void => {
        event.preventDefault();

        // Make sure the carouselIsMoving variable is false
        if (carouselIsMoving) return;

        // Store the horizontal position where the mouse click started
        startPosition = event.clientX;

        const onMouseUp: (event: MouseEvent) => void = (event: MouseEvent): void => {
            // Store the horizontal position where the mouse was released
            endPosition = event.clientX;

            // Define the swipeDirection variable
            const swipeDirection: 'forward' | 'backward' | null = calculateTouchDirection(
                carousel.offsetWidth/3,
                startPosition,
                endPosition
            );

            // Make sure the swipeDirection is not null
            if (!swipeDirection) return;

            // Call the updateCarouselCurrentIndex function
            const { previousIndex: prev, currentIndex: next } = updateCarouselCurrentIndex(
                carouselItemsArray, swipeDirection, null
            );

            // Retrieve the carousel previousIndex and nextIndex
            previousIndex = prev;
            nextIndex = next;

            // Fire the handleCarouselMovement function
            manageCarouselMovement(
                carousel,
                carouselItemsArray,
                previousIndex,
                nextIndex,
                swipeDirection,
            );

            // Remove the mouseup listener
            document.removeEventListener('mouseup', onMouseUp);
        };

        // Attach mouseup event to the document
        document.addEventListener('mouseup', onMouseUp);
    });


    // Retrieve the 'data-carousel-move-interval' attribute value from the carousel element, or return null if it doesn't exist
    const carouselMoveInterval: number | null = carousel.hasAttribute('data-carousel-move-interval')
        ? parseInt(carousel.getAttribute('data-carousel-move-interval')!)
        : null;

    // Check if the carouselMoveInterval exists (is not null)
    if (carouselMoveInterval != null) {
        /* Define the isHovering variable, which indicates whether the
        user's cursor is hovering over the carousel container. */
        let isHovering: boolean = false;

        setInterval((): void => {
            // Make sure the carouselIsMoving and isHovering variables are false
            if (carouselIsMoving || isHovering) return;

            // Call the updateCarouselCurrentIndex function
            const { previousIndex: prev, currentIndex: next } = updateCarouselCurrentIndex(
                carouselItemsArray, 'forward', null
            );

            // Retrieve the carousel previousIndex and nextIndex
            previousIndex = prev;
            nextIndex = next;

            // Make sure the previousIndex and nextIndex are not null
            if (previousIndex != null && nextIndex != null) {
                manageCarouselMovement(carousel, carouselItemsArray, previousIndex, nextIndex, 'forward');
            }

            // Call the updateCarouselIsMoving function
            updateCarouselIsMoving();
        }, carouselMoveInterval);

        // Clear the carouselMovingInterval if the user hovers over the carousel or touch it.
        carousel.addEventListener('mouseenter', (event: MouseEvent): void => {
            // Assign true to the isHovering variable
            isHovering = true;
        });

        carousel.addEventListener('touchstart', (event: TouchEvent): void => {
            // Assign true to the isHovering variable
            isHovering = true;
        });

        // Restore the carouselMovingInterval if the user's cursor leaves the carousel block or untouch it
        carousel.addEventListener('mouseleave', (event: MouseEvent): void => {
            // Assign false to the isHovering varialble after carouselMoveInterval milliseconds
            setTimeout((): void => {
                isHovering = false;
            }, carouselMoveInterval);
        });

        carousel.addEventListener('touchend', (event: TouchEvent): void => {
            // Assign false to the isHovering variable after carouselMoveInterval milliseconds
            setTimeout((): void => {
                isHovering = false;
            }, carouselMoveInterval);
        });
    }
}


function manageCarouselMovement(
    carousel: HTMLElement,
    carouselItemsArray: HTMLElement[],
    previousIndex: number | null,
    nextIndex: number | null,
    carouselMovementDirection: 'forward' | 'backward'
): void {
    /* The function manages the carousel movement based on the provided
    * attributes of the HTML tags.
    *
    * Attributes:
    *   - carousel: The carousel HTML object is used to get carousel attributes
    *   - carouselItemsArray: An array of the carousel items
    *   - previousIndex: Previous carousel's items position
    *   - nextIndex: Next carousel's items position
    *   - carouselMovementDirection: It specifies the carousel movement direction
    * */


    // Make sure the previousIndex and nextIndex are not null
    if (previousIndex == null || nextIndex == null) return;

    // Call the updateCarouselItemActiveClass function
    updateCarouselItemActiveClass(carouselItemsArray, previousIndex, nextIndex);

    // Call the updateCarouselIndicatorActiveClass function
    updateCarouselIndicatorActiveClass(carousel, previousIndex, nextIndex);

    /* Define the isSlideCarousel variable, which can be either true or false,
    and specifies whether the carousel uses a slide effect */
    const isSlideCarousel: boolean = carousel.classList.contains('carousel-slide');

    /* Define the isInfinitySlideCarousel variable, which can be either true or false,
    and specifies whether the carousel uses an infinity slider loop effect */
    const isInfinitySlideCarousel: boolean = carousel.classList.contains('infinity');


    // Move the carousel inner if the isSlideCarousel variable is true
    if (isSlideCarousel) {
        // Check if the isInfinitySlideCarousel is true
        if (isInfinitySlideCarousel) {
            // Call the handleCarouselInfinityMovement function
            handleCarouselInfinityMovement(
                carousel,
                carouselItemsArray,
                previousIndex,
                nextIndex,
                carouselMovementDirection
            );
            return;
        }

        // Call the moveCarouselInner function to create a carousel movement animation
        moveCarouselInner(carousel, nextIndex);
    }

}


function updateCarouselItemActiveClass(
    carouselItemsArray: HTMLElement[],
    previousIndex: number,
    nextIndex: number
): void {
    /* The function is responsible for removing the 'active' class from the carousel
    * item based on the provided previousIndex and adding the 'active' class to the
    * carousel item based on the provided nextIndex.
    *
    * Attributes:
    *   - carouselItemsArray: An array of the carousel item objects
    *   - previousIndex: Previous carousel's items position
    *   - nextIndex: Next carousel's items position
    * */

    /* Make sure the carousel item at the provided previousIndex
    contains the 'active' class */
    if (!carouselItemsArray[previousIndex].classList.contains('active')) return;

    // Remove the 'active' class to the carouselItemsArray[previousIndex]
    carouselItemsArray[previousIndex].classList.remove('active');

    // Add the 'active' class to the carouselItemsArray[nextIndex]
    carouselItemsArray[nextIndex].classList.add('active');
}


function updateCarouselIndicatorActiveClass(
    carousel: HTMLElement,
    previousIndex: number,
    nextIndex: number
): void {
    /* The function is responsible for assigning the active class to the carousel
    * indicator buttons, if they exist.
    *
    * Attributes:
    *   - carousel: The carousel HTML object is used to get the carousel indicator buttons
    *   - previousIndex: Previous carousel's items position
    *   - nextIndex: Next carousel's items position
    * */

    // Get an array of the carousel indicator buttons
    const indicatorButtonsArray: HTMLElement[] = Array.from(carousel.querySelectorAll('.carousel-indicator'));

    // Make sure the indicatorButtonsArray is not empty
    if (indicatorButtonsArray.length < 1) return;

    // Remove the 'active' class from the indicator button corresponding to the previousIndex
    indicatorButtonsArray[previousIndex].classList.remove('active');

    // Add the 'active' class to the indicator button corresponding to the nextIndex
    indicatorButtonsArray[nextIndex].classList.add('active');
}


function moveCarouselInner(
    carousel: HTMLElement,
    nextIndex: number,
): void {
    /* The function is responsible for moving the carousel inner element
    * to correspond with the next index.
    *
    * Attributes:
    *   - carousel: The carousel HTML object is used to get carouselInner
    *   - nextIndex: Next carousel's items position
    * */

    // Get the carouselInner object or null if it does not exist
    const carouselInner: HTMLElement | null = carousel.querySelector('.carousel-inner');

    // Make sure the carouselInner exists (is not null)
    if (!carouselInner) return;

    // Update the carouselInner style, imitating the movement
    carouselInner.style.left = `-${nextIndex * 100}%`;
}


function handleCarouselInfinityMovement(
    carousel: HTMLElement,
    carouselItemsArray: HTMLElement[],
    previousIndex: number,
    nextIndex: number,
    carouselMovementDirection: 'forward' | 'backward'
): void {
    /* The function is responsible for managing the infinite loop movement
    * of the carousel. It applies the display: none CSS property to all
    * carousel items that do not correspond to the previousIndex or nextIndex,
    * then moves the carousel inner element accordingly.
    *
    * Attributes:
    *   - carousel: The carousel HTML object is used to get the carouselInner
    *   - carouselItemsArray: An array of the carousel items
    *   - previousIndex: Previous carousel's items position
    *   - nextIndex: Next carousel's items position
    *   - carouselMovementDirection: It specifies the carousel movement direction
    * */


    // Retrieve the carousel inner object or null if it does not exist
    const carouselInner: HTMLElement | null = carousel.querySelector('.carousel-inner');

    // Make sure the carouselInner exists (is not null)
    if (!carouselInner) return;

    // Call the hideNonAdjacentItems function
    hideNonAdjacentItems(carouselInner, carouselItemsArray);

    // Call the moveCarouselInnerToSpecificDirection function
    moveCarouselInnerToSpecificDirection(
        carouselInner,
        carouselMovementDirection,
        carouselItemsArray,
        previousIndex,
        nextIndex,
    );
}


function hideNonAdjacentItems(
    carouselInner: HTMLElement,
    carouselItemsArray: HTMLElement[]
): void {
    /* The function is responsible for applying the display: none CSS property to all
    * carousel items
    *
    * Attributes:
    *   - carouselInner: The carouselInner HTML object is used for the carousel movement
    *   - carouselItemsArray: An array of the carousel items
    * */

    // Apply the display: none CSS property to all carousel items
    carouselItemsArray.forEach((item: HTMLElement): string => item.style.display = 'none');

    // Retrieve an array of the carousel temporary items
    const temporaryItems: HTMLElement[] = Array.from(carouselInner.querySelectorAll('.temporary-item'));

    // Make sure the temporaryItems array is not empty
    if (temporaryItems.length < 1) return;

    // Delete all items in the temporaryItems array
    temporaryItems.forEach((item: HTMLElement): void => item.remove());
}


function getCarouselMovementDirection(
    previousIndex: number,
    nextIndex: number,
): 'forward' | 'backward' {
    /* The function is responsible for determining and returning the carousel movement
    * direction by comparing the previousIndex and nextIndex.
    *
    * Attributes:
    *   - previousIndex: Previous carousel's items position
    *   - nextIndex: Next carousel's items position
    * */

    return nextIndex > previousIndex ? 'forward' : 'backward';
}


function moveCarouselInnerToSpecificDirection(
    carouselInner: HTMLElement,
    carouselMovementDirection: 'forward' | 'backward',
    carouselItemsArray: HTMLElement[],
    previousIndex: number,
    nextIndex: number,
): void {
    /* The function is responsible for moving the inner carousel corresponding
    * to the carousel movement direction.
    *
    * Attributes:
    *   - carouselInner: The carouselInner HTML object is used for the carousel movement
    *   - carouselMovementDirection: It specifies the carousel movement direction
    *   - carouselItemsArray: An array of the carousel items
    *   - previousIndex: Previous carousel's items position
    *   - nextIndex: Next carousel's items position
    * */


    // Get computed styles
    const computedStyles: CSSStyleDeclaration = window.getComputedStyle(carouselInner);

    // Get the transition property
    const transitionStyle: string = computedStyles.transition;

    // Disable the carouselInner transition style
    carouselInner.style.transition = 'none';


    if (carouselMovementDirection === 'forward') {
        // Update the carouselInner CSS left property to imitate movement forward

        // Call the appendCarouselItemAfterCurrent function
        appendCarouselItemAfterCurrent(
            carouselInner,
            carouselItemsArray,
            previousIndex,
            nextIndex,
        );

        // Set the default inner position of the carousel
        carouselInner.style.left = `0`;

        setTimeout((): void => {
            // Enable the carouselInner transition style
            carouselInner.style.transition = transitionStyle;

            // Update the carousel inner position
            carouselInner.style.left = '-100%';
        }, 10);

    } else if (carouselMovementDirection === 'backward') {
        // Update the carouselInner CSS left property to imitate movement backward

        // Call the appendCarouselItemBeforeCurrent function
        appendCarouselItemBeforeCurrent(
            carouselInner,
            carouselItemsArray,
            previousIndex,
            nextIndex,
        );

        // Set the default inner position of the carousel
        carouselInner.style.left = '-100%';

        setTimeout((): void => {
            // Enable the carouselInner transition style
            carouselInner.style.transition = transitionStyle;

            // Update the carousel inner position
            carouselInner.style.left = '0';
        }, 10);
    }
}


function appendCarouselItemAfterCurrent(
    carouselInner: HTMLElement,
    carouselItemsArray: HTMLElement[],
    previousIndex: number,
    nextIndex: number
): void {
    /* The function is responsible for appending the carousel item corresponding to
    * the nextIndex after the current carousel item.
    *
    * Attributes:
    *   - carouselInner: The carouselInner HTML object is used for the carousel movement
    *   - carouselItemsArray: An array of the carousel items
    *   - previousIndex: Previous carousel's items position
    *   - nextIndex: Next carousel's items position
    * */

    // Get the carouselItemsArray length
    const carouselItemsArrayLength: number = carouselItemsArray.length;

    // Make sure the carouselItemsArrayLength is grater than zero
    if (carouselItemsArrayLength < 1) return;

    // Append the current carousel item to the end of the carousel-inner object
    const currentItem = carouselItemsArray[previousIndex].cloneNode(true) as HTMLElement;

    // Add the display flex CSS property to the currentItem
    currentItem.style.display = 'flex';

    // Add the 'temporary-item' class to the currentItem
    currentItem.classList.add('temporary-item');

    carouselInner.appendChild(currentItem);



    // Append the next carousel item after the currentItem
    const nextItem = carouselItemsArray[nextIndex].cloneNode(true) as HTMLElement;

    // Add the display flex CSS property to the nextItem
    nextItem.style.display = 'flex';

    // Add the 'temporary-item' class to the nextItem
    nextItem.classList.add('temporary-item');

    carouselInner.appendChild(nextItem);
}


function appendCarouselItemBeforeCurrent(
    carouselInner: HTMLElement,
    carouselItemsArray: HTMLElement[],
    previousIndex: number,
    nextIndex: number
): void {
    /* The function is responsible for appending the carousel item corresponding to
    * the nextIndex before the current carousel item.
    *
    * Attributes:
    *   - carouselInner: The carouselInner HTML object is used for the carousel movement
    *   - carouselItemsArray: An array of the carousel items
    *   - previousIndex: Previous carousel's items position
    *   - nextIndex: Next carousel's items position
    * */

    // Get the carouselItemsArray length
    const carouselItemsArrayLength: number = carouselItemsArray.length;

    // Make sure the carouselItemsArrayLength is grater than zero
    if (carouselItemsArrayLength < 1) return;

    // Append the next carousel item to the end of the carousel-inner object
    const nextItem = carouselItemsArray[nextIndex].cloneNode(true) as HTMLElement;

    // Add the display flex CSS property to the nextItem
    nextItem.style.display = 'flex';

    // Add the 'temporary-item' class to the nextItem
    nextItem.classList.add('temporary-item');

    carouselInner.appendChild(nextItem);


    // Append the current carousel item after the nextItem
    const currentItem = carouselItemsArray[previousIndex].cloneNode(true) as HTMLElement;

    // Add the display flex CSS property to the currentItem
    currentItem.style.display = 'flex';

    // Add the 'temporary-item' class to the currentItem
    currentItem.classList.add('temporary-item');

    carouselInner.appendChild(currentItem);
}


function calculateTouchDirection(
    carouselWrapperWidth: number,
    startPosition: number,
    endPosition: number
): 'forward' | 'backward' | null {
    /* The function is responsible for returning 'forward' or 'backward' after calculating the touch movement
    *
    * Attributes:
    *   - carouselWrapperWidth: The width of the carousel wrapper element divided by three, used to check whether
    *     the difference between the start position and the end position exceeds this value.
    *   - startPosition: The initial position of the touch, as obtained by the touchstart event listener
    *   - endPosition: Final position of the touch, captured when the touchend event is triggered
    * */

    /* Determine swipe direction based on how far the user swiped.
    If the horizontal swipe distance exceeds half the width of the carousel,
    return 'forward' for a left swipe or 'backward' for a right swipe. */
    if (startPosition - endPosition > carouselWrapperWidth) {
        return 'forward';
    } else if (endPosition - startPosition > carouselWrapperWidth) {
        return 'backward';
    }

    return null;
}