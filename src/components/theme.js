import { deactivateLiveArena } from './liveArena.js';

export const toggleThemeLayouts = (isDark, animate = false) => {
    // Both Light Theme and Dark Theme now fully support the World Cup Archive section.
    // Toggling themes inside World Cup mode will smoothly swap CSS variables without forcing exit.
};

export const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
        document.body.classList.add('dark-theme');
        if (sunIcon) sunIcon.classList.add('hidden');
        if (moonIcon) moonIcon.classList.remove('hidden');
    } else {
        document.body.classList.remove('dark-theme');
        if (sunIcon) sunIcon.classList.remove('hidden');
        if (moonIcon) moonIcon.classList.add('hidden');
    }
    toggleThemeLayouts(isDark, false);
};

export const setupThemeListeners = () => {
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
        const body = document.body;
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');

        const currentlyDark = body.classList.contains('dark-theme');

        if (!currentlyDark) {
            // Toggling to dark mode
            let overlay = document.getElementById('dark-mode-transition-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'dark-mode-transition-overlay';
                overlay.className = 'dark-mode-transition-overlay';
                overlay.innerHTML = `
                    <div class="transition-content">
                        <div class="transition-spinner"></div>
                        <div class="transition-text">Switching to DARK MODE</div>
                    </div>
                `;
                document.body.appendChild(overlay);
            }

            // Show translucent screen
            overlay.style.display = 'flex';
            overlay.offsetHeight; // Force reflow
            overlay.classList.add('visible');

            // Apply theme changes in background swiftly
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            if (sunIcon) sunIcon.classList.add('hidden');
            if (moonIcon) moonIcon.classList.remove('hidden');

            // Trigger layouts with 2s float-entry animation
            toggleThemeLayouts(true, true);

            // Fade overlay out after 1.8 seconds (fades out completely by 2.3 seconds)
            setTimeout(() => {
                overlay.classList.remove('visible');
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 500);
            }, 1800);
        } else {
            // Toggling to light mode
            let overlay = document.getElementById('light-mode-transition-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'light-mode-transition-overlay';
                overlay.className = 'light-mode-transition-overlay';
                overlay.innerHTML = `
                    <div class="transition-content">
                        <div class="transition-spinner"></div>
                        <div class="transition-text">Switching to LIGHT MODE</div>
                    </div>
                `;
                document.body.appendChild(overlay);
            }

            // Show translucent screen
            overlay.style.display = 'flex';
            overlay.offsetHeight; // Force reflow
            overlay.classList.add('visible');

            // Apply theme changes in background swiftly
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
            if (sunIcon) sunIcon.classList.remove('hidden');
            if (moonIcon) moonIcon.classList.add('hidden');

            // Reset layouts instantly
            toggleThemeLayouts(false, false);

            // Fade overlay out after 1.8 seconds (fades out completely by 2.3 seconds)
            setTimeout(() => {
                overlay.classList.remove('visible');
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 500);
            }, 1800);
        }
    });
};
