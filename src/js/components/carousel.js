// src/js/components/carousel.js

/**
 * ConnectHub Intranet - Carousel Component
 *
 * Handles the interactive behavior of the image/content carousel.
 * Features:
 * - Slide navigation via next/previous buttons.
 * - Slide navigation via pagination dots.
 * - Dynamic update of active slide/dot classes.
 * - Smooth transition using CSS transform.
 * - Auto-play functionality (optional).
 *
 * Dependencies:
 * - Corresponding CSS in src/scss/components/_carousel.scss
 * - DOM elements with specific classes defined in index.html
 */

class Carousel {
  constructor(carouselElement) {
    if (!carouselElement) {
      console.warn("Carousel: No carousel element provided. Skipping initialization.");
      return;
    }

    this.carousel = carouselElement;
    this.track = this.carousel.querySelector('.carousel-track');
    this.slides = Array.from(this.track.children);
    this.prevBtn = this.carousel.querySelector('.carousel-nav-arrow.prev');
    this.nextBtn = this.carousel.querySelector('.carousel-nav-arrow.next');
    this.paginationDotsContainer = this.carousel.querySelector('.carousel-pagination');
    this.paginationDots = []; // Will be populated dynamically

    this.currentIndex = 0;
    this.slideWidth = this.slides[0] ? this.slides[0].getBoundingClientRect().width : 0;
    this.slideCount = this.slides.length;
    this.isAnimating = false; // To prevent rapid clicks during transition

    this.autoplayInterval = 5000; // 5 seconds
    this.autoplayTimer = null;
    this.isAutoplayActive = true; // Set to false to disable autoplay

    // Initialize the carousel if essential elements exist
    if (this.track && this.slideCount > 0) {
      this.init();
    } else {
      console.warn("Carousel: Missing track or slides. Carousel cannot be initialized.", this.carousel);
      // Hide carousel if it can't function
      this.carousel.style.display = 'none';
    }
  }

  /**
   * Initializes the carousel: sets up event listeners, creates dots,
   * displays the first slide, and starts autoplay.
   */
  init() {
    this.createPaginationDots();
    this.addEventListeners();
    this.updateCarousel(); // Display the first slide initially
    this.startAutoplay();

    // Recalculate slide width on window resize
    window.addEventListener('resize', () => {
      this.slideWidth = this.slides[0].getBoundingClientRect().width;
      this.updateCarousel(false); // Update position without transition on resize
    });

    // Pause autoplay on mouse enter, resume on mouse leave
    this.carousel.addEventListener('mouseenter', () => this.pauseAutoplay());
    this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
  }

  /**
   * Adds event listeners for navigation arrows and pagination dots.
   */
  addEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.goToPrevSlide());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.goToNextSlide());
    }

    if (this.paginationDotsContainer) {
      this.paginationDotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('pagination-dot')) {
          const dotIndex = Array.from(this.paginationDots).indexOf(e.target);
          if (dotIndex !== -1 && dotIndex !== this.currentIndex) {
            this.goToSlide(dotIndex);
          }
        }
      });
    }

    // Listen for CSS transition end to reset isAnimating flag
    this.track.addEventListener('transitionend', () => {
      this.isAnimating = false;
    });
  }

  /**
   * Creates pagination dots dynamically based on the number of slides.
   */
  createPaginationDots() {
    if (!this.paginationDotsContainer) return;

    this.paginationDotsContainer.innerHTML = ''; // Clear any existing dots
    for (let i = 0; i < this.slideCount; i++) {
      const dot = document.createElement('div');
      dot.classList.add('pagination-dot');
      dot.dataset.index = i; // Store index for easy lookup
      this.paginationDotsContainer.appendChild(dot);
      this.paginationDots.push(dot);
    }
  }

  /**
   * Updates the carousel's display to show the current slide.
   * Applies transform to the track and updates active classes.
   * @param {boolean} [useTransition=true] - Whether to use CSS transition for the slide.
   */
  updateCarousel(useTransition = true) {
    if (this.slideCount === 0) return;

    this.isAnimating = useTransition; // Set flag if transition is intended
    this.track.style.transition = useTransition ? 'transform 0.5s ease-in-out' : 'none';
    this.track.style.transform = `translateX(-${this.currentIndex * this.slideWidth}px)`;

    // Update active classes for slides
    this.slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentIndex);
    });

    // Update active classes for pagination dots
    this.paginationDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }

  /**
   * Navigates to a specific slide by index.
   * @param {number} index - The index of the slide to go to.
   */
  goToSlide(index) {
    if (this.isAnimating || index < 0 || index >= this.slideCount) {
      return;
    }
    this.currentIndex = index;
    this.updateCarousel();
    this.resetAutoplay();
  }

  /**
   * Navigates to the next slide. Wraps around to the first slide if at the end.
   */
  goToNextSlide() {
    if (this.isAnimating) return;
    const nextIndex = (this.currentIndex + 1) % this.slideCount;
    this.goToSlide(nextIndex);
  }

  /**
   * Navigates to the previous slide. Wraps around to the last slide if at the beginning.
   */
  goToPrevSlide() {
    if (this.isAnimating) return;
    const prevIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
    this.goToSlide(prevIndex);
  }

  /**
   * Starts the autoplay timer.
   */
  startAutoplay() {
    if (!this.isAutoplayActive || this.slideCount <= 1) return; // No autoplay if only one slide

    this.pauseAutoplay(); // Clear any existing timer
    this.autoplayTimer = setInterval(() => {
      this.goToNextSlide();
    }, this.autoplayInterval);
  }

  /**
   * Pauses the autoplay timer.
   */
  pauseAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  /**
   * Resets the autoplay timer (pauses and then restarts).
   * Useful after manual navigation.
   */
  resetAutoplay() {
    if (this.isAutoplayActive) {
      this.pauseAutoplay();
      this.startAutoplay();
    }
  }
}

// Auto-initialize all carousels on the page when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(carouselElement => {
    new Carousel(carouselElement);
  });

  // Small note for the user: For the weather display and upcoming meetings in personalized briefing,
  // these would require separate JavaScript logic to fetch and display dynamic data.
  // The JS here is solely for the carousel component.
});
