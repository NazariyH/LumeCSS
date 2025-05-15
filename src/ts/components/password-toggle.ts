// Retrieve an array of the password toggle buttons
const passwordToggleBtnsArray: HTMLElement[] = Array.from(document.querySelectorAll('.toggle-password'));

// Iterate over each button in the passwordToggleBtnsArray to give it an event listener
passwordToggleBtnsArray.forEach((btn: HTMLElement): void => {
    // Get the btn's for attribute value or null if it does not exist
    const forAttribute: string | null = btn?.getAttribute('for') ?? null;

    // Make sure forAttribute exists (is not null)
    if (!forAttribute) return;


    // Give an event listener to the button
    btn.addEventListener('click', (event: MouseEvent): void => {
        event.preventDefault();

        // Get the input field corresponding to the ID from the for attribute
        const passwordField: HTMLInputElement | null = document.getElementById(forAttribute) as HTMLInputElement;

        // Make sure the passwordField exists (is not null)
        if (!passwordField) return;


        // Get the passwordField's for attribute value or null if it does not exist
        const inputType: string | null = passwordField.getAttribute('type') ?? null

        if (inputType === 'text') {
            // Call the hidePassword function
            hidePassword(btn, passwordField);
        } else if (inputType === 'password') {
            // Call the showPassword function
            showPassword(btn, passwordField);
        }
    });
});


function hidePassword (btn: HTMLElement, passwordField: HTMLInputElement): void {
    /* The function is responsible for hiding the password by changing the input type to password
    * 
    * Attributes:
    *   - btn: The HTML element used to add the 'hide-password' class
    *   - passwordField: The HTML password field is used to change the type attribute to 'password'
    */

    // Remove the 'show-password' class from the button
    btn.classList.remove('show-password');

    // Add the hide-password class to the button
    btn.classList.add('hide-password');

    // Change the password field type to password
    passwordField.type = "password";
}

function showPassword (btn: HTMLElement, passwordField: HTMLInputElement): void {
    /* The function is responsible for showing the password by changing the input type to text
    * 
    * Attributes:
    *   - btn: The HTML element used to add the 'show-password' class
    *   - passwordField: The HTML password field is used to change the type attribute to 'text'
    */

    // Remove the hide-password class from the button
    btn.classList.remove('hide-password');

    // Add the 'show-password' class to the button
    btn.classList.add('show-password');

    // Change the password field type to text
    passwordField.type = "text";
}