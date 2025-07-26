// src/js/main.js

/**
 * ConnectHub Intranet - Main JavaScript Entry Point
 *
 * This file orchestrates global JavaScript functionalities for the entire intranet.
 * It ensures key UI elements are interactive and handles site-wide behaviors.
 *
 * Responsibilities include:
 * - Mobile navigation (hamburger menu) toggling.
 * - Any other global utilities or initializations not handled by specific component files.
 *
 * Note: Components like `carousel.js` and `tabs.js` are designed to self-initialize
 * by querying the DOM for their respective containers, making this file cleaner.
 * Page-specific data rendering (e.g., for `index.html`) is handled in `pages/homePage.js`.
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Main JavaScript loaded and DOM is ready.');

  // --- Mobile Navigation Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNavigation = document.querySelector('.main-nav'); // The actual nav UL/LI structure
  const body = document.body;
  const HEADER_BREAKPOINT = 768; // Corresponds to $breakpoint-md in SCSS for mobile menu activation

  if (menuToggle && mainNavigation) {
    // Set initial ARIA state for accessibility
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', mainNavigation.id || 'main-navigation'); // Ensure nav has an ID
    if (!mainNavigation.id) {
      mainNavigation.id = 'main-navigation'; // Assign ID if missing
    }
    // Initially hide the main navigation visually for small screens
    // This assumes CSS handles display: none for .main-nav by default on mobile,
    // and JS adds/removes 'active' class to show it.

    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

      // Toggle 'active' class on both menu toggle and navigation
      menuToggle.classList.toggle('is-active', !isExpanded);
      mainNavigation.classList.toggle('active', !isExpanded);

      // Toggle 'body-no-scroll' class to prevent scrolling when menu is open
      body.classList.toggle('body-no-scroll', !isExpanded);

      // Update ARIA attributes
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      mainNavigation.setAttribute('aria-hidden', String(isExpanded)); // Hide from screen readers when closed

      // For accessibility: if menu is open, ensure focus is managed (e.g., trap focus inside menu)
      // This is a more advanced feature not implemented here for brevity, but crucial for complex menus.
    });

    // Close mobile menu if resized to desktop view
    window.addEventListener('resize', () => {
      if (window.innerWidth > HEADER_BREAKPOINT && mainNavigation.classList.contains('active')) {
        menuToggle.classList.remove('is-active');
        mainNavigation.classList.remove('active');
        body.classList.remove('body-no-scroll');
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNavigation.setAttribute('aria-hidden', 'true');
      }
    });

    // Optionally close menu when a navigation link is clicked (useful for single-page apps or scroll-to-section)
    const navLinks = mainNavigation.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mainNavigation.classList.contains('active')) {
          menuToggle.click(); // Simulate click on toggle to close menu
        }
      });
    });

  } else {
    console.warn('Main JS: Mobile menu toggle or main navigation not found. Mobile menu functionality will not work.');
  }

  // --- Global Search Functionality (Placeholder) ---
  const searchInput = document.querySelector('#global-search-input');
  const searchButton = document.querySelector('#global-search-button');

  if (searchInput && searchButton) {
    searchButton.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent form submission if it's inside a form
      performGlobalSearch(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performGlobalSearch(searchInput.value);
      }
    });
  }

  function performGlobalSearch(query) {
    if (query.trim()) {
      console.log(`Performing global search for: "${query}"`);
      // In a real application, you would:
      // 1. Redirect to a search results page: window.location.href = `/search?q=${encodeURIComponent(query)}`;
      // 2. Or, trigger an AJAX call to filter/display results dynamically.
      alert(`Simulating search for: "${query}"`); // For demonstration
    } else {
      alert('Please enter a search query.');
    }
  }

  // --- Accessibility Enhancements (Focus Management, Skip Links - Placeholder) ---
  // You might add logic here for:
  // - Skip to content links
  // - Managing focus for modals or other interactive elements (beyond basic tab/carousel)

  // --- Initializing other JS modules (if they don't self-initialize) ---
  // If you had other modules that didn't have their own DOMContentLoaded listeners
  // or needed specific parameters, you would initialize them here.
  // Example:
  // import { initSomeOtherModule } from './modules/someOtherModule.js';
  // initSomeOtherModule(someConfig);
});
