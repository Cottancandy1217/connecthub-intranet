// src/js/components/tabs.js

/**
 * ConnectHub Intranet - Tabs Component
 *
 * Handles the interactive behavior of tabbed interfaces.
 * Features:
 * - Switches content panels when a tab header is clicked.
 * - Manages 'active' classes for both headers and panels.
 * - Implements WAI-ARIA best practices for accessibility (roles, states, properties).
 * - Supports keyboard navigation (Left/Right arrows for tab headers).
 * - Can initialize multiple tab sets on a single page.
 *
 * Assumed HTML Structure:
 * <div class="tabs-container">
 * <div class="tab-headers" role="tablist">
 * <button class="tab-header" role="tab" id="tab-1-header" aria-controls="tab-1-panel" aria-selected="false" tabindex="-1">Tab 1</button>
 * <button class="tab-header" role="tab" id="tab-2-header" aria-controls="tab-2-panel" aria-selected="false" tabindex="-1">Tab 2</button>
 * </div>
 * <div class="tab-content">
 * <div class="tab-panel" role="tabpanel" id="tab-1-panel" aria-labelledby="tab-1-header" hidden>Content 1</div>
 * <div class="tab-panel" role="tabpanel" id="tab-2-panel" aria-labelledby="tab-2-header" hidden>Content 2</div>
 * </div>
 * </div>
 */

class Tabs {
  constructor(containerElement) {
    if (!containerElement) {
      console.warn("Tabs: No container element provided. Skipping initialization.");
      return;
    }

    this.container = containerElement;
    this.tabHeadersContainer = this.container.querySelector('.tab-headers');
    this.tabContentContainer = this.container.querySelector('.tab-content');

    if (!this.tabHeadersContainer || !this.tabContentContainer) {
      console.warn("Tabs: Missing .tab-headers or .tab-content container. Skipping initialization.", this.container);
      return;
    }

    this.tabHeaders = Array.from(this.tabHeadersContainer.querySelectorAll('.tab-header'));
    this.tabPanels = Array.from(this.tabContentContainer.querySelectorAll('.tab-panel'));

    if (this.tabHeaders.length === 0 || this.tabPanels.length === 0 || this.tabHeaders.length !== this.tabPanels.length) {
      console.warn("Tabs: Mismatch in number of tab headers and panels, or no tabs found. Skipping initialization.", this.container);
      return;
    }

    this.init();
  }

  /**
   * Initializes the tabs component by setting up ARIA attributes,
   * event listeners, and activating the default tab.
   */
  init() {
    this.tabHeaders.forEach((header, index) => {
      // Set initial ARIA attributes for non-active tabs
      header.setAttribute('role', 'tab');
      header.setAttribute('aria-controls', this.tabPanels[index].id);
      header.setAttribute('tabindex', '-1'); // Not keyboard focusable by default
      header.setAttribute('aria-selected', 'false');

      // Set ARIA for panels
      this.tabPanels[index].setAttribute('role', 'tabpanel');
      this.tabPanels[index].setAttribute('aria-labelledby', header.id);
      this.tabPanels[index].setAttribute('hidden', 'true'); // Hide all panels by default

      // Add click listener
      header.addEventListener('click', () => this.activateTab(header));
      // Add keyboard listener for arrow navigation
      header.addEventListener('keydown', (e) => this.handleKeydown(e, index));
    });

    // Activate the first tab by default
    this.activateTab(this.tabHeaders[0]);
  }

  /**
   * Activates a specific tab, updates active classes and ARIA attributes.
   * @param {HTMLElement} activeTabHeader - The tab header to activate.
   */
  activateTab(activeTabHeader) {
    // Prevent activating if the tab is already active
    if (activeTabHeader.classList.contains('active')) {
      return;
    }

    // Deactivate current active tab and panel
    this.tabHeaders.forEach(header => {
      header.classList.remove('active');
      header.setAttribute('aria-selected', 'false');
      header.setAttribute('tabindex', '-1'); // Make non-active tabs unfocusable via Tab key
    });

    this.tabPanels.forEach(panel => {
      panel.classList.remove('active');
      panel.setAttribute('hidden', 'true'); // Hide content
    });

    // Activate the new tab header
    activeTabHeader.classList.add('active');
    activeTabHeader.setAttribute('aria-selected', 'true');
    activeTabHeader.setAttribute('tabindex', '0'); // Make active tab focusable via Tab key
    activeTabHeader.focus(); // Focus the activated tab (important for keyboard users)

    // Activate the corresponding content panel
    const targetPanelId = activeTabHeader.getAttribute('aria-controls');
    const targetPanel = document.getElementById(targetPanelId);
    if (targetPanel) {
      targetPanel.classList.add('active');
      targetPanel.removeAttribute('hidden'); // Show content
    }
  }

  /**
   * Handles keyboard navigation for tabs (Left/Right arrow keys).
   * @param {KeyboardEvent} e - The keyboard event.
   * @param {number} currentIndex - The index of the currently focused tab.
   */
  handleKeydown(e, currentIndex) {
    let newIndex = -1;

    switch (e.key) {
      case 'ArrowLeft':
        newIndex = (currentIndex - 1 + this.tabHeaders.length) % this.tabHeaders.length;
        e.preventDefault(); // Prevent default browser scroll
        break;
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % this.tabHeaders.length;
        e.preventDefault(); // Prevent default browser scroll
        break;
      case 'Home': // Go to first tab
        newIndex = 0;
        e.preventDefault();
        break;
      case 'End': // Go to last tab
        newIndex = this.tabHeaders.length - 1;
        e.preventDefault();
        break;
    }

    if (newIndex !== -1 && newIndex !== currentIndex) {
      this.activateTab(this.tabHeaders[newIndex]);
    }
  }
}

// Auto-initialize all tabs components on the page when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const tabsContainers = document.querySelectorAll('.tabs-container');
  tabsContainers.forEach(containerElement => {
    new Tabs(containerElement);
  });
});
