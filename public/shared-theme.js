/**
 * Shared Theme Management System
 * Handles theme toggle functionality across all pages with persistence
 */

(function() {
    'use strict';

    // Theme management
    const ThemeManager = {
        // Get current theme from localStorage or system preference
        getCurrentTheme() {
            const saved = localStorage.getItem('table-share-theme');
            if (saved) {
                return saved;
            }
            
            // Check system preference
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        },

        // Apply theme to document
        applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('table-share-theme', theme);
            
            // Update toggle icon
            const icon = document.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = theme === 'dark' ? '●' : '○';
            }
        },

        // Toggle between light and dark themes
        toggleTheme() {
            const current = this.getCurrentTheme();
            const newTheme = current === 'dark' ? 'light' : 'dark';
            this.applyTheme(newTheme);
        },

        // Initialize theme toggle
        init() {
            const toggle = document.getElementById('themeToggle');
            if (!toggle) {
                console.warn('Theme toggle button not found');
                return;
            }

            // Set initial theme
            this.applyTheme(this.getCurrentTheme());

            // Add event listener
            toggle.addEventListener('click', () => {
                this.toggleTheme();
            });

            // Update theme on system preference change
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-update if user hasn't manually set a preference
                const saved = localStorage.getItem('table-share-theme');
                if (!saved) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            ThemeManager.init();
        });
    } else {
        ThemeManager.init();
    }

    // Make ThemeManager available globally for manual control if needed
    window.TableShareTheme = ThemeManager;

})();