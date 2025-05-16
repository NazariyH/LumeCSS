// Retrieve an array of the theme toggle buttons
const themeToggleBtnsArray: HTMLElement[] = Array.from(document.querySelectorAll('.toggle-theme'));

// Iterate over each button in the themeToggleBtnsArray to give it an event listener
themeToggleBtnsArray.forEach((btn: HTMLElement): void => {
    // Give an event listener to the button
    btn.addEventListener('click', (event: MouseEvent): void => {
        event.preventDefault();

        // Get the body's data-theme attribute
        const theme: string | null = document.body.getAttribute('data-theme') ?? null;

        if (theme === 'light' || theme === null) {
            // Call the setDarkTheme function
            setDarkTheme(btn);
        } else if (theme === 'dark') {
            // Call the setLightTheme function
            setLightTheme(btn);
        }
    });
});


function setDarkTheme (btn: HTMLElement): void {
    /* The function is responsible for setting the 'dark' value to the body's data-theme attribute
    * 
    * Attributes:
    *   - btn: The HTML element used to add the 'dark-theme' class
    */

    // Set the 'dark' value to the body's data-theme attribute
    document.body.setAttribute('data-theme', 'dark');

    // Give the 'rotate' class to the button for a while
    btn.classList.add('rotate')

    // Remove the 'rotate' class after 200ms 
    setTimeout(():void => btn.classList.remove('rotate'), 200);
}

function setLightTheme (btn: HTMLElement): void {
    /* The function is responsible for setting the 'light' value to the body's data-theme attribute
    * 
    * Attributes:
    *   - btn: The HTML element used to add the 'light-theme' class
    */

    // Set the 'light' value to the body's data-theme attribute
    document.body.setAttribute('data-theme', 'light');

    // Give the 'rotate' class to the button for a while
    btn.classList.add('rotate')

    // Remove the 'rotate' class after 200ms 
    setTimeout(():void => btn.classList.remove('rotate'), 200);
}