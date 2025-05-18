// Retrieve an array of icon elements
const iconElements: HTMLElement[] = Array.from(document.querySelectorAll('.icon'));

// Iterate over each icon in the iconElements to generate a filter for it
iconElements.forEach((icon: HTMLElement): void => {

    // Check if the icon has a class that begins with 'text-'
    const hasColorClass: boolean = Array.from(icon.classList).some((cls: string): boolean => cls.startsWith('text-'));

    if (hasColorClass) {
        // Extract the text color value
        const color: string = getComputedStyle(icon).color;

        // Apply a color filter to the icon's background image
        const backgroundImage: string = getComputedStyle(icon).backgroundImage;

        if (backgroundImage && backgroundImage !== 'none') {
            // Extract the URL of the background image
            const imageUrl: string = backgroundImage.slice(5, -2); // Remove 'url("...")' to get the raw URL

            const img = new Image();
            img.src = imageUrl;

            img.onload = (): void => {
                // Create a canvas element to manipulate the image
                const canvas: HTMLCanvasElement = document.createElement('canvas');
                const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

                if (ctx) {
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Draw the image on the canvas
                    ctx.drawImage(img, 0, 0);

                    // Apply a filter using the extracted color
                    // Here you can modify this logic to manipulate the color
                    ctx.globalCompositeOperation = 'source-atop';
                    ctx.fillStyle = color; // Apply the color to the filter
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Create a new image from the canvas data and set it as the icon's background
                    const filteredImage: string = canvas.toDataURL();
                    icon.style.backgroundImage = `url(${filteredImage})`;
                }
            };
        }
    }
});
