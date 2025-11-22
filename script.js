// ============================================
// CONFIGURATION
// ============================================

// Launch Date - Format: DD-MM-YYYY HH:MM:SS AM/PM
const LAUNCH_DATE = '25-11-2025 12:00:00 PM';

// Default Theme - Options: 'dark' or 'light'
const DEFAULT_THEME = 'dark';

// Custom Logo - Set path to your logo image or null to use default logo
// Example: 'assets/logo.png' or null
const CUSTOM_LOGO_PATH = null;

// Typing Animation Settings
const TYPING_SPEED = 150; // Speed of typing (milliseconds per character)
const ERASING_SPEED = 100; // Speed of erasing (milliseconds per character)
const DELAY_AFTER_TYPING = 2000; // Pause after typing completes (milliseconds)
const DELAY_AFTER_ERASING = 1000; // Pause after erasing completes (milliseconds)
const TYPING_REPEAT_COUNT = 2; // Number of times to repeat (0 = infinite loop)

// ============================================

// Theme Toggle Functionality
(function() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Get saved theme or use default
    const savedTheme = localStorage.getItem('theme') || DEFAULT_THEME;

    // Apply saved/default theme
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('light-theme');

        // Save theme preference
        const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
    });
})();

// Logo Configuration
(function() {
    const customLogo = document.getElementById('customLogo');
    const defaultLogo = document.getElementById('defaultLogo');

    if (CUSTOM_LOGO_PATH) {
        // Show custom logo
        customLogo.src = CUSTOM_LOGO_PATH;
        customLogo.style.display = 'block';
        defaultLogo.style.display = 'none';
    } else {
        // Show default logo
        customLogo.style.display = 'none';
        defaultLogo.style.display = 'flex';
    }
})();

// Typing Animation for Heading
(function() {
    const headingElement = document.getElementById('typingHeading');
    const text = 'We Are\nLaunching Soon';
    let charIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let loopCount = 0;

    function updateDisplay() {
        // Always show cursor while typing/erasing
        headingElement.innerHTML = currentText + '<span class="typing-cursor"></span>';
    }

    function type() {
        if (!isDeleting) {
            // Typing
            if (charIndex < text.length) {
                if (text[charIndex] === '\n') {
                    currentText += '<br>';
                } else {
                    currentText += text[charIndex];
                }
                charIndex++;
                updateDisplay();
                setTimeout(type, TYPING_SPEED);
            } else {
                // Finished typing
                loopCount++;

                // Check if this is the last loop
                if (TYPING_REPEAT_COUNT > 0 && loopCount >= TYPING_REPEAT_COUNT) {
                    // Final display without cursor
                    headingElement.innerHTML = currentText;
                    return;
                }

                // Pause before erasing
                setTimeout(() => {
                    isDeleting = true;
                    type();
                }, DELAY_AFTER_TYPING);
            }
        } else {
            // Erasing
            if (charIndex > 0) {
                // Remove last character or <br> tag
                if (currentText.endsWith('<br>')) {
                    currentText = currentText.slice(0, -4);
                } else {
                    currentText = currentText.slice(0, -1);
                }
                charIndex--;
                updateDisplay();
                setTimeout(type, ERASING_SPEED);
            } else {
                // Finished erasing, pause before typing again
                isDeleting = false;
                setTimeout(type, DELAY_AFTER_ERASING);
            }
        }
    }

    // Start typing animation
    type();
})();

// Countdown Timer
(function() {
    // Parse the configured launch date
    function parseLaunchDate(dateString) {
        // Split date and time
        const [datePart, timePart, meridian] = dateString.split(' ');
        const [day, month, year] = datePart.split('-');
        const [hours, minutes, seconds] = timePart.split(':');

        // Convert to 24-hour format
        let hour24 = parseInt(hours);
        if (meridian.toUpperCase() === 'PM' && hour24 !== 12) {
            hour24 += 12;
        } else if (meridian.toUpperCase() === 'AM' && hour24 === 12) {
            hour24 = 0;
        }

        // Create date object (month is 0-indexed in JavaScript)
        return new Date(year, month - 1, day, hour24, minutes, seconds).getTime();
    }

    const targetDate = parseLaunchDate(LAUNCH_DATE);

    // Get countdown elements
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    // Pad numbers with leading zero
    function pad(num) {
        return num < 10 ? '0' + num : num;
    }

    // Update countdown
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        // If countdown is finished
        if (distance < 0) {
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            clearInterval(countdownInterval);
            return;
        }

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update display
        daysElement.textContent = pad(days);
        hoursElement.textContent = pad(hours);
        minutesElement.textContent = pad(minutes);
        secondsElement.textContent = pad(seconds);
    }

    // Initial call
    updateCountdown();

    // Update every second
    const countdownInterval = setInterval(updateCountdown, 1000);
})();
