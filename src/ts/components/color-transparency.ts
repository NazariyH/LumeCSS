/**
 * Finds all elements with classes like trans-XX-bg, trans-XX-text, or trans-XX-border,
 * extracts the opacity value, computes a new RGBA color, and applies it inline.
 */
function applyTransOpacityStyles(): void {
    // Query all HTML elements in the document
    const elements: HTMLElement[] = Array.from(document.querySelectorAll<HTMLElement>('*'));

    elements.forEach((el: HTMLElement): void => {
        // Check each class name on the element
        el.classList.forEach((cls: string): void => {
            // Match class format: trans-<opacity>-<type>
            const match: RegExpMatchArray | null = cls.match(/^trans-(\d{1,3})-(bg|text|border)$/);
            if (!match) return; // Skip if not matching

            // Extract the numeric opacity value (0–100) and target style type
            const rawValue: number = parseInt(match[1], 10);
            const type = match[2] as 'bg' | 'text' | 'border';

            // Clamp the value between 0 and 100 and convert to 0–1 float
            const opacity: number = Math.max(0, Math.min(100, rawValue)) / 100;

            // Get computed styles for the element
            const style: CSSStyleDeclaration = getComputedStyle(el);

            // Variable to store the current color and the CSS property to update
            let baseColor: string;
            let property: string;

            // Determine which color to get and which property to set
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

            // Convert the color to RGBA with the new opacity
            const rgbaColor: string = makeColorWithOpacity(baseColor, opacity);

            // Apply the new color to the element inline
            el.style.setProperty(property, rgbaColor, 'important');
        });
    });
}


function makeColorWithOpacity(color: string, alpha: number): string {
    /*
    * Converts a color string like `rgb(255, 0, 0)` or `rgba(255, 0, 0, 1)`
    * into an `rgba(r, g, b, alpha)` string with the provided alpha.
    */

    // Match RGB or RGBA format and extract r, g, b components
    const match: RegExpMatchArray | null = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return color; // Return original if format is unrecognized

    const [, r, g, b] = match;

    // Return new RGBA string with specified alpha
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


// Call the function when the document is loaded
document.addEventListener('DOMContentLoaded', (): void => {
    // I've added a delay to trigger the function after the browser applies the color.
    setTimeout((): void => applyTransOpacityStyles(), 100);
});
