// Retrieve an array of HTML tags that have the data-current-time attribute
const currentTimeElements: HTMLElement[] = Array.from(document.querySelectorAll('[data-current-time]'));

// Retrieve an array of HTML tags that have the data-current-date attribute
const currentDateElement: HTMLElement[] = Array.from(document.querySelectorAll('[data-current-date]'));

// Retrieve an array of HTML tags that have the data-time-passed attribute
const timePassedElements: HTMLElement[] = Array.from(document.querySelectorAll('[data-time-passed]'));


function updateTime(): void {
    /* The function is responsible for updating and inserting the current time into the HTML elements */

    // Retrieve the current time values
    const now = new Date();
    const hours: string = now.getHours().toString().padStart(2, '0');
    const minutes: string = now.getMinutes().toString().padStart(2, '0');
    const seconds: string = now.getSeconds().toString().padStart(2, '0');

    // Format time and full-time string
    const time = `${hours}:${minutes}`;
    const fullTime = `${hours}:${minutes}:${seconds}`;

    // Iterate over each element in the currentTimeElements to insert the formatted time
    currentTimeElements.forEach((element: HTMLElement): void => {
        // Get the element's data-time-format attribute or null if it does not exist
        const format: string | null = element.getAttribute('data-time-format') ?? null;

        // Insert the formatted string into the element based on the data-time-format attribute
        if (format === 'short' || format === null) {
            element.textContent = time;
        } else if (format === 'full') {
            element.textContent = fullTime;
        }

    });
}


function updateDate(): void {
    /* The function is responsible for updating and inserting the current date into the HTML elements */

    // Retrieve the current date values
    const now = new Date();
    const day: string = now.getDate().toString().padStart(2, '0');
    const month: string = now.toLocaleString('default', { month: 'long' });
    const year: number = now.getFullYear();

    // Format short and long date string
    const shortDate = `${day}/${now.getMonth() + 1}/${year}`;  // DD/MM/YYYY
    const longDate = `${month} ${day}, ${year}`;  // May 6, 2025

    // Iterate over each element in the currentDateElement to insert the formatted date
    currentDateElement.forEach((element: HTMLElement): void => {
        // Get the element's data-date-format attribute or null if it does not exist
        const format: string | null = element.getAttribute('data-date-format') ?? null;

        // Insert the formatted string into the element based on the data-date-format attribute
        if (format === 'short' || format === null) {
            element.textContent = shortDate;
        } else if (format === 'long') {
            element.textContent = longDate;
        }
    });
}


function updateElapsedTime():void {
    /* The function is responsible for calculating the elapsed time and
    inserting it into a specific HTML element */

    /* Iterate over each element in the timePassedElements to calculate
    and insert into the element its elapsed time value */
    timePassedElements.forEach((element: HTMLElement): void => {
        // Retrieve the element's data-time-passed attribute value or null if it does not exist
        const passedDateAttribute: string | null = element.getAttribute('data-time-passed');

        // Make sure passedDateAttribute exists (is not null)
        if (!passedDateAttribute) return;

        // Convert the passedDateAttribute string (or timestamp) to a Date object
        const passedDate = new Date(passedDateAttribute);

        // Ensure the passedDate is valid before proceeding
        if (isNaN(passedDate.getTime())) return; // If the date is invalid, do nothing

        // Get the current time
        const now = new Date();

        // Calculate the difference in milliseconds
        const diffInMilliseconds: number = now.getTime() - passedDate.getTime();

        // Convert milliseconds to seconds
        const diffInSeconds: number = Math.floor(diffInMilliseconds / 1000);

        // Calculate date values
        const seconds: number = diffInSeconds % 60;
        const minutes: number = Math.floor((diffInSeconds % 3600) / 60);
        const hours: number = Math.floor((diffInSeconds % 86400) / 3600);
        const days: number = Math.floor(diffInSeconds / 86400);

        const months = Math.floor(days / 30); // Approximate month length
        const years = Math.floor(months / 12); // Approximate year length

        // Initialize an empty timeString
        let timeString: string = '';

        // Update the timeString based on the calculated date values
        if (years > 0) {
            timeString = `${years} year${years > 1 ? 's' : ''} ago`;
        } else if (months > 0) {
            timeString = `${months} month${months > 1 ? 's' : ''} ago`;
        } else if (days > 7) {
            // If more than 7 days, show weeks
            const weeks = Math.floor(days / 7);
            timeString = `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else if (days > 0) {
            timeString = `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            timeString = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            timeString = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (seconds > 0) {
            timeString = `${seconds} second${seconds > 1 ? 's' : ''} ago`;
        } else {
            timeString = `recently`;
        }

        // Insert the timeString string into the element
        element.textContent = timeString;
    });
}




/* Check whether at least one of the currentTimeElements, currentDateElement,
or timePassedElements arrays is not empty */
if (currentTimeElements.length > 0 || currentDateElement.length > 0 || timePassedElements.length > 0) {

    // Update every second for time and every minute for elapsed time
    setInterval((): void => {
        if (currentTimeElements.length > 0) {
            updateTime();
        }

        if (currentDateElement.length > 0) {
            updateDate();
        }

        if (timePassedElements.length > 0) {
            updateElapsedTime();
        }
    }, 1000);
}
