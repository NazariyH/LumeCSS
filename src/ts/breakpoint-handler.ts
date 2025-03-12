/*
* This file contains a function that is fired every time the page is
* opened or when a user resizes the page window.
*
* The file defines a few arrays containing HTML tags with breakpoint
* class keys (e.g., xs:, sm:, md:, lg:, xl:) and the array of breakpoint values.
*
* The function iterates over each HTML tag containing breakpoint class keys and checks
* which breakpoint key matches the web screen size. It ensures that all classes containing
* breakpoint class keys that don't match the web screen size are disabled by adding '!' before the class name.
* Additionally, it ensures that classes with breakpoint keys matching the web screen size are activated.
* */


// Define an object that contains breakpoint key values
const breakpoints: Record<string, number> = {
    "xs": 0,
    "sm": 480,
    "md": 720,
    "lg": 960,
    "xl": 1200,
}


/* Define a few arrays that contain all HTML tags with breakpoint
class keys (e.g., xs:, sm:, md:, lg:, xl:) */
const xs_classes: NodeListOf<Element> = document.querySelectorAll('[class*="xs:"]') !;
const sm_classes: NodeListOf<Element> = document.querySelectorAll('[class*="sm:"]') !;
const md_classes: NodeListOf<Element> = document.querySelectorAll('[class*="md:"]') !;
const lg_classes: NodeListOf<Element> = document.querySelectorAll('[class*="lg:"]') !;
const xl_classes: NodeListOf<Element> = document.querySelectorAll('[class*="xl:"]') !;


function getCurrentBreakpoint(): string {
    // Function to get the current screen size (width) and determine the matching breakpoint

    const width: number = window.innerWidth;

    // Check which breakpoint matches the current web page size
    if (width < breakpoints.sm) return "xs:";
    if (width < breakpoints.md) return "sm:";
    if (width < breakpoints.lg) return "md:";
    if (width < breakpoints.xl) return "lg:";

    return "xl:"; // Default to 'xl' if the width is larger than the 'xl' breakpoint
}


function applyBreakpointClasses() : void {
    // Function to apply appropriate classes based on the screen size

    const currentBreakpoint: string = getCurrentBreakpoint();


    function updateClassesForBreakpoint(classes: NodeListOf<Element>, breakpoint: string): void {
        // Iterate through all elements with breakpoint class keys and update their classes

        classes.forEach((el: Element): void => {

            // Iterate through all classes
            Array.from(el.classList).forEach((className: string): void => {
                if (getCurrentBreakpoint() === breakpoint) {
                    if (className.startsWith(getCurrentBreakpoint())) {
                        if (className.endsWith('!')) {
                            // If the class ends with '!', remove the '!'
                            el.classList.replace(className, className.slice(0, -1));
                        }
                    }
                } else if (getCurrentBreakpoint() !== breakpoint) {
                    if (className.startsWith(breakpoint)) {
                        if (!className.endsWith('!')) {
                            // Modify the matching class to add '!' at the end
                            el.classList.replace(className, `${className}!`);
                        }
                    }
                }
            });
        });

    }

    updateClassesForBreakpoint(xs_classes, "xs:");
    updateClassesForBreakpoint(sm_classes, "sm:");
    updateClassesForBreakpoint(md_classes, "md:");
    updateClassesForBreakpoint(lg_classes, "lg:");
    updateClassesForBreakpoint(xl_classes, "xl:");
}


// Call the function initially
applyBreakpointClasses();

// Add even listener for window resize to reapply breakpoint classes
window.addEventListener('resize', applyBreakpointClasses)