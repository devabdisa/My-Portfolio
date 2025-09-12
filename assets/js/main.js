//

(function () {
  "use strict";

  // Cache DOM elements
  const headerToggleBtn = document.querySelector(".header-toggle");
  const scrollTop = document.querySelector(".scroll-top");
  const navmenulinks = document.querySelectorAll(".navmenu a");
  const skillsAnimation = document.querySelectorAll(".skills-animation");

  /**
   * Header toggle
   */
  function headerToggle() {
    document.querySelector("#header").classList.toggle("header-show");
    headerToggleBtn.classList.toggle("bi-list");
    headerToggleBtn.classList.toggle("bi-x");
  }
  headerToggleBtn.addEventListener("click", headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".header-show")) {
        headerToggle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button - Optimized with throttling
   */
  let scrollTimeout;
  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }

  function throttleScroll() {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(function () {
        scrollTimeout = null;
        toggleScrollTop();
      }, 100);
    }
  }

  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("load", toggleScrollTop);
  window.addEventListener("scroll", throttleScroll);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector(".typed");
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute("data-typed-items");
    typed_strings = typed_strings.split(",");
    new Typed(".typed", {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Optimized skills animation with Intersection Observer
   */
  if (skillsAnimation.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let progress = entry.target.querySelectorAll(
              ".progress .progress-bar"
            );
            progress.forEach((el) => {
              el.style.width = el.getAttribute("aria-valuenow") + "%";
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.8 }
    );

    skillsAnimation.forEach((item) => {
      observer.observe(item);
    });
  }

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: ".glightbox",
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll(".isotope-layout").forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute("data-layout") ?? "masonry";
    let filter = isotopeItem.getAttribute("data-default-filter") ?? "*";
    let sort = isotopeItem.getAttribute("data-sort") ?? "original-order";

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector(".isotope-container"), function () {
      initIsotope = new Isotope(
        isotopeItem.querySelector(".isotope-container"),
        {
          itemSelector: ".isotope-item",
          layoutMode: layout,
          filter: filter,
          sortBy: sort,
        }
      );
    });

    isotopeItem
      .querySelectorAll(".isotope-filters li")
      .forEach(function (filters) {
        filters.addEventListener(
          "click",
          function () {
            isotopeItem
              .querySelector(".isotope-filters .filter-active")
              .classList.remove("filter-active");
            this.classList.add("filter-active");
            initIsotope.arrange({
              filter: this.getAttribute("data-filter"),
            });
            // Remove redundant AOS init call
          },
          false
        );
      });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );
      new Swiper(swiperElement, config);
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position - optimized without setTimeout
   */
  window.addEventListener("load", function (e) {
    if (window.location.hash) {
      const targetElement = document.querySelector(window.location.hash);
      if (targetElement) {
        requestAnimationFrame(() => {
          let scrollMarginTop = getComputedStyle(targetElement).scrollMarginTop;
          window.scrollTo({
            top: targetElement.offsetTop - parseInt(scrollMarginTop),
            behavior: "smooth",
          });
        });
      }
    }
  });

  /**
   * Optimized Navmenu Scrollspy with Intersection Observer
   */
  if (navmenulinks.length > 0) {
    const sections = {};
    navmenulinks.forEach((link) => {
      if (link.hash) {
        const section = document.querySelector(link.hash);
        if (section) {
          sections[link.hash] = section;
        }
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navmenulinks.forEach((link) => link.classList.remove("active"));
            const activeLink = document.querySelector(
              `.navmenu a[href="#${entry.target.id}"]`
            );
            if (activeLink) activeLink.classList.add("active");
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    Object.values(sections).forEach((section) => {
      observer.observe(section);
    });
  }
})();
