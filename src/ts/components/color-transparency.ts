/**
 * This script allows the use of custom utility classes like:
 *  - `trans-50-bg`, `trans-30-text`, `trans-70-border` for static transparency
 *  - `hover:trans-50-bg`, etc., for hover-based opacity changes
 *
 * It dynamically calculates and applies inline RGBA colors based on the current
 * computed color of the element and the given opacity.
 */

// Supported style types for background, text, and border
type StyleType = 'bg' | 'text' | 'border';

// WeakMap is used to store the original colors of elements on hover
// so we can restore them after the mouse leaves.
const originalColorMap: WeakMap<HTMLElement, Record<string, string>> = new WeakMap();

/**
 * Scans the DOM for elements with specific `trans-XX-*` or `hover:trans-XX-*` classes,
 * and applies appropriate inline RGBA styles.
 */
function applyTransOpacityStyles(): void {
    // Select all elements in the document
    const elements: HTMLElement[] = Array.from(document.querySelectorAll<HTMLElement>('*'));

    elements.forEach((el: HTMLElement): void => {
        // Loop through each class applied to the element
        el.classList.forEach((cls: string): void => {
            // Match standard class (e.g., trans-50-bg)
            const normalMatch: RegExpMatchArray | null = cls.match(/^trans-(\d{1,3})-(bg|text|border)$/);

            // Match hover-prefixed class (e.g., hover:trans-50-bg)
            const hoverMatch: RegExpMatchArray | null = cls.match(/^hover:trans-(\d{1,3})-(bg|text|border)$/);

            if (normalMatch) {
                // Apply the static (non-hover) opacity transformation
                applyOpacityStyle(el, normalMatch, false);
            } else if (hoverMatch) {
                // Set up mouseenter/mouseleave behavior for hover-based opacity
                setupHoverEffect(el, hoverMatch);
            }
        });
    });
}

/**
 * Applies a color style with modified opacity to an element.
 * If used during a hover effect, stores the original value to restore it later.
 *
 * @param el - The target HTML element
 * @param match - The matched RegExp array containing opacity and type
 * @param isHover - Whether this is a hover-triggered application
 */
function applyOpacityStyle(
    el: HTMLElement,
    match: RegExpMatchArray,
    isHover: boolean
): void {
    // Extract opacity value (0–100) from class name
    const rawValue: number = parseInt(match[1], 10);
    const type: StyleType = match[2] as StyleType;

    // Clamp value to 0–100 and convert to 0–1 for alpha
    const opacity: number = Math.max(0, Math.min(100, rawValue)) / 100;

    // Get current computed styles of the element
    const style: CSSStyleDeclaration = getComputedStyle(el);

    // Declare variables for current color and CSS property name
    let baseColor: string;
    let property: string;

    // Determine which color and property to work with based on the type
    switch (type) {
        case 'bg':
            baseColor = style.backgroundColor;
            property = 'background-color';
            break;
        case 'text':
            baseColor = style.color;
            property = 'color';
            break;
        case 'border':
            baseColor = style.borderColor;
            property = 'border-color';
            break;
    }

    // Convert current color into an RGBA value with adjusted opacity
    const rgbaColor: string = makeColorWithOpacity(baseColor, opacity);

    // If applying during hover, store the original color for restoration
    if (isHover) {
        const originalColors: Record<string, string> = originalColorMap.get(el) || {};
        originalColors[property] = baseColor;
        originalColorMap.set(el, originalColors);
    }

    // Apply the new color as an inline style with high priority
    el.style.setProperty(property, rgbaColor, 'important');
}

/**
 * Adds event listeners to apply/remove opacity changes on hover.
 *
 * @param el - The target element
 * @param match - The matched class (hover:trans-XX-type)
 */
function setupHoverEffect(el: HTMLElement, match: RegExpMatchArray): void {
    // Get style type from the class (bg, text, border)
    const type: StyleType = match[2] as StyleType;

    // Map from type to the corresponding CSS property name
    const propertyMap: Record<StyleType, string> = {
        bg: 'background-color',
        text: 'color',
        border: 'border-color'
    };

    const property: string = propertyMap[type];

    // On hover (mouseenter), apply the opacity-modified color
    el.addEventListener('mouseenter', (): void => {
        applyOpacityStyle(el, match, true);
    });

    // On mouse leave, restore the original color if it was stored
    el.addEventListener('mouseleave', (): void => {
        const originalColors: Record<string, string> | undefined = originalColorMap.get(el);
        const originalColor: string | undefined = originalColors?.[property];

        if (originalColor) {
            el.style.setProperty(property, originalColor, 'important');
        }
    });
}

/**
 * Converts a standard rgb(...) or rgba(...) color string to a new rgba(...)
 * string using the specified alpha (opacity) value.
 *
 * @param color - The base color in rgb or rgba format
 * @param alpha - The new opacity value (0.0–1.0)
 * @returns A new rgba() string
 */
function makeColorWithOpacity(color: string, alpha: number): string {
    // Match RGB or RGBA format and extract red, green, blue values
    const match: RegExpMatchArray | null = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);

    // If the color doesn't match expected format, return it unchanged
    if (!match) return color;

    const r: string = match[1];
    const g: string = match[2];
    const b: string = match[3];

    // Return the new RGBA string with the specified alpha
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Initializes the script after the DOM is fully loaded.
 * A short timeout ensures that styles are rendered before calculating them.
 */
document.addEventListener('DOMContentLoaded', (): void => {
    setTimeout((): void => applyTransOpacityStyles(), 100);
});
