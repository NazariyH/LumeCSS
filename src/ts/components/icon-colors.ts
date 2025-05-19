import { breakpoints } from '../breakpoint-handler'; // Import an array of breakpoints

// Function to get the current viewport width
// This will be used to check if we're above a certain breakpoint
function getViewportWidth(): number {
    return window.innerWidth;
}

// Function to check if the current viewport width is greater than or equal to a specific breakpoint
// It compares the current window width to the breakpoint values defined above
function isBreakpointOrGreater(breakpoint: string): boolean {
    const viewportWidth = getViewportWidth();  // Get the current width of the viewport
    return viewportWidth >= breakpoints[breakpoint];  // Check if current width is larger than or equal to breakpoint
}

// Apply a color filter to an icon's background image using a <canvas>
// This is used when 'text-*' or similar color-based classes are detected
function applyFilteredImage(icon: HTMLElement, color: string): void {
    // Get the background-image CSS property
    const backgroundImage: string = getComputedStyle(icon).backgroundImage;

    // Exit if there's no background image
    if (!backgroundImage || backgroundImage === 'none') return;

    // Extract the URL from backgroundImage (removes url("..."))
    const imageUrl: string = backgroundImage.slice(5, -2);

    const img = new Image();
    img.src = imageUrl;

    // When the image loads, draw it to a canvas and apply a color overlay
    img.onload = (): void => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match image size
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the original image onto the canvas
        ctx.drawImage(img, 0, 0);

        // Apply the color filter using a blending mode
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Replace the icon's background image with the filtered version
        icon.style.backgroundImage = `url(${canvas.toDataURL()})`;
    };
}

// Triggered on initial load and on window resize
function applyResponsiveStyles(): void {
    const iconElements: HTMLElement[] = Array.from(document.querySelectorAll('.icon'));
    const breakpointKeys = Object.keys(breakpoints);

    iconElements.forEach((icon: HTMLElement) => {
        const classList = Array.from(icon.classList);

        // Iterate over each defined breakpoint (e.g., sm, md, lg, ...)
        breakpointKeys.forEach((breakpoint) => {
            // Look for a class like 'sm:text-*' that applies at this breakpoint
            const breakpointTextClass = classList.find(cls =>
                cls.startsWith(`${breakpoint}:text-`) && !cls.endsWith('!')
            );

            // Look for a hover class like 'md:hover:text-*'
            const breakpointHoverTextClass = classList.find(cls =>
                cls.startsWith(`${breakpoint}:hover:text-`) && !cls.endsWith('!')
            );

            // Apply static text color if applicable for current viewport
            if (breakpointTextClass && isBreakpointOrGreater(breakpoint)) {
                const color = getColorFromClass(breakpointTextClass);
                if (color) applyFilteredImage(icon, color);
            }

            // Set up hover listeners if viewport matches and class exists
            if (breakpointHoverTextClass && isBreakpointOrGreater(breakpoint)) {
                // Prevent duplicate listeners (optional: can clear listeners before attaching if needed)
                icon.addEventListener('mouseenter', () => {
                    const hoverColor = getColorFromClass(breakpointHoverTextClass);
                    if (hoverColor) applyFilteredImage(icon, hoverColor);
                });

                icon.addEventListener('mouseleave', () => {
                    const originalColor = getComputedStyle(icon).color;
                    applyFilteredImage(icon, originalColor);
                });
            }
        });
    });
}

// Use a hidden <span> element to compute the CSS color from a class name
// This is useful when a class applies a color indirectly via your CSS framework
function getColorFromClass(className: string): string | null {
    const temp = document.createElement('span');
    temp.style.display = 'none';
    document.body.appendChild(temp);

    // Remove hover: prefix to get base class (since span can't be hovered)
    temp.className = className.replace('hover:', '');

    const color = getComputedStyle(temp).color;
    document.body.removeChild(temp);
    return color;
}

// Get all elements marked with the `.icon` class
const iconElements: HTMLElement[] = Array.from(document.querySelectorAll('.icon'));

// Get a list of all defined breakpoint keys (e.g., ['xs', 'sm', 'md', ...])
const breakpointKeys = Object.keys(breakpoints);


// Call once on page load
applyResponsiveStyles();


// Iterate over each icon to process its classes
iconElements.forEach((icon: HTMLElement) => {
    const classList = Array.from(icon.classList); // Convert classList to array for easier filtering

    // Debounced resize event listener to avoid flooding
    let resizeTimeout: number | null = null;
    window.addEventListener('resize', () => {
        if (resizeTimeout !== null) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = window.setTimeout(() => {
            applyResponsiveStyles();
        }, 200);
    });

    // Find a base color class like 'text-red' (not hover, not responsive)
    const textColorClass = classList.find(cls =>
        cls.startsWith('text-') && !cls.startsWith('hover:') && !cls.endsWith('!')
    );

    // Find a base hover color class like 'hover:text-blue'
    const hoverTextColorClass = classList.find(cls =>
        cls.startsWith('hover:text-') && !cls.endsWith('!')
    );

    // Apply base color filter immediately
    if (textColorClass) {
        const baseColor = getComputedStyle(icon).color;
        applyFilteredImage(icon, baseColor);
    }

    // Add hover effect for 'hover:text-*'
    if (hoverTextColorClass) {
        icon.addEventListener('mouseenter', () => {
            const hoverColor = getColorFromClass(hoverTextColorClass);
            if (hoverColor) applyFilteredImage(icon, hoverColor);
        });

        icon.addEventListener('mouseleave', () => {
            const originalColor = getComputedStyle(icon).color;
            applyFilteredImage(icon, originalColor);
        });
    }
});