// Declare an array containing the scroll animation classes
const animationClasses: string[] = [
    'scroll-fade-up', 'scroll-fade-down', 'scroll-fade-left', 'scroll-fade-right',
    'scroll-fade-up-right', 'scroll-fade-up-left', 'scroll-fade-down-right', 'scroll-fade-down-left',
    'scroll-flip-left', 'scroll-flip-right', 'scroll-flip-up', 'scroll-flip-down',
    'scroll-zoom-in', 'scroll-zoom-in-up', 'scroll-zoom-in-down', 'scroll-zoom-in-left', 'scroll-zoom-in-right',
    'scroll-zoom-out', 'scroll-zoom-out-up', 'scroll-zoom-out-down', 'scroll-zoom-out-left', 'scroll-zoom-out-right',
];


// Declare an empty array of scroll animation objects
const animationObjects: HTMLElement[] = [];

/* Iterate over each class in animationClasses and append all
elements with that class to the animationObjects array */
animationClasses.forEach((className: string): void => {
    /*  Retrieve an array of elements with the specified className and push them into the animationObjects array */
    const elements: NodeListOf<HTMLElement> = document.querySelectorAll(`.${className}`);
    elements.forEach((el: HTMLElement): number => animationObjects.push(el));
});


// Add a listener for when the page finishes loading
window.addEventListener('load', (): void => {
    // On page load, we assume the user is starting at the top and scrolling down
    const isScrollingDown = true;

    // Loop through each element we're observing for animations
    animationObjects.forEach((el: HTMLElement): void => {
        // Get the element's position relative to the viewport
        const rect: DOMRect = el.getBoundingClientRect();

        /*
          Determine if the element is already within the visible part of the viewport.
          This mimics the IntersectionObserver's threshold of 0.2 (20% visibility).
          - If the top of the element is less than 80% of the window height,
            we assume it's "intersecting" (since 20% or more is visible).
        */
        const inViewport: boolean = rect.top < window.innerHeight * 0.8;

        // Retrieve the data-scroll-delay attribute of the element, or null if it does not exist.
        const scrollDelay: string | null = el?.getAttribute('data-scroll-delay');
        const scrollDelayValue: number | null = scrollDelay ? parseFloat(scrollDelay) : null;

        // If it's in the viewport and we're scrolling down (initial page load), add the animation class
        if (inViewport && isScrollingDown) {
            // Check if the scrollDelayValue is not null
            if (scrollDelayValue) {
                // Add the in-view class to the element after scrollDelayValue milliseconds
                setTimeout((): void => el.classList.add('in-view'), scrollDelayValue);

                return;
            }

            el.classList.add('in-view');
        }
    });
});



let lastScrollY: number = window.scrollY; // Store the last scroll Y position

// Create a new IntersectionObserver instance to monitor visibility of target elements
const observer = new IntersectionObserver(
    (
        entries: IntersectionObserverEntry[], // Array of observed entries (elements being watched)
        observer: IntersectionObserver        // The observer instance itself
    ): void => {
        // Determine current scroll direction
        const currentScrollY: number = window.scrollY;
        const isScrollingDown: boolean = currentScrollY > lastScrollY;
        lastScrollY = currentScrollY;

        // Loop through each observed entry
        entries.forEach((entry: IntersectionObserverEntry): void => {
            const target = entry.target as HTMLElement;

            // Retrieve the data-scroll-delay attribute of the target, or null if it does not exist.
            const scrollDelay: string | null = target?.getAttribute('data-scroll-delay');
            const scrollDelayValue: number | null = scrollDelay ? parseFloat(scrollDelay) : null;

            if (entry.isIntersecting && isScrollingDown) {
                // Check if the scrollDelayValue is not null
                if (scrollDelayValue) {
                    // Add the in-view class to the element after scrollDelayValue milliseconds
                    setTimeout((): void => target.classList.add('in-view'), scrollDelayValue);

                    return;
                }
                // Add the 'in-view' class ONLY when scrolling down and the element enters the viewport
                target.classList.add('in-view');
            } else if (!entry.isIntersecting && !isScrollingDown) {
                // Check if the scrollDelayValue is not null
                if (scrollDelayValue) {
                    // Add the in-view class to the element after scrollDelayValue milliseconds
                    setTimeout((): void => target.classList.remove('in-view'), scrollDelayValue);

                    return;
                }
                // Remove the class ONLY when scrolling up and the element leaves the viewport
                target.classList.remove('in-view');
            }
        });
    },
    {
        threshold: 0.2 // Trigger when 20% or more of the element is visible
    }
);



// Observe each animation object
animationObjects.forEach((el: HTMLElement): void => observer.observe(el));