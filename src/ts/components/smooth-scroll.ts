// Select all anchor elements with href attribute starting with '#' (in-page links)
const anchors: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('a[href^="#"]');

// Loop through each anchor element
anchors.forEach(anchor => {
  // Add a click event listener to each anchor
  anchor.addEventListener('click', (e: MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior (instant jump)

    // Get the target element's ID from the href attribute
    const targetId = anchor.getAttribute('href');
    
    // Make sure the targetId is not null and not just "#"
    if (targetId && targetId !== '#') {
      const targetElement = document.querySelector<HTMLElement>(targetId);
      
      // If the element exists, scroll to it smoothly
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});
