(function () {
  const HEADER_SCROLLED_CLASS = "scrolled";
  const MOBILE_MENU_OPEN_CLASS = "open";

  function initHeader() {
    const header = document.querySelector(".header");

    if (!header) {
      return;
    }

    const updateHeaderState = () => {
      header.classList.toggle(HEADER_SCROLLED_CLASS, window.scrollY > 8);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
  }

  function initMobileMenu() {
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (!hamburger || !mobileMenu) {
      return;
    }

    const closeMenu = () => {
      hamburger.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove(MOBILE_MENU_OPEN_CLASS);
      document.body.classList.remove("menu-open");
    };

    const openMenu = () => {
      hamburger.setAttribute("aria-expanded", "true");
      mobileMenu.classList.add(MOBILE_MENU_OPEN_CLASS);
      document.body.classList.add("menu-open");
    };

    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains(MOBILE_MENU_OPEN_CLASS);
      if (isOpen) {
        closeMenu();
        return;
      }

      openMenu();
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (!mobileMenu.classList.contains(MOBILE_MENU_OPEN_CLASS)) {
        return;
      }

      if (mobileMenu.contains(event.target) || hamburger.contains(event.target)) {
        return;
      }

      closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }

  function normalizePath(pathname) {
    if (!pathname) {
      return "/";
    }

    const normalized = pathname.replace(/index\.html$/i, "").replace(/\/+$/, "");
    return normalized || "/";
  }

  function setActiveNavLink() {
    const currentPath = normalizePath(window.location.pathname);
    const currentFile = currentPath.split("/").filter(Boolean).pop() || "";
    const navLinks = document.querySelectorAll(".header-nav a, .mobile-menu a");

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");

      if (!href || href.startsWith("#")) {
        return;
      }

      let linkPath = href;

      try {
        linkPath = new URL(href, window.location.origin).pathname;
      } catch (error) {
        linkPath = href;
      }

      const normalizedLinkPath = normalizePath(linkPath);
      const linkFile = normalizedLinkPath.split("/").filter(Boolean).pop() || "";
      const isMatch =
        normalizedLinkPath === currentPath ||
        (currentFile && linkFile && currentFile === linkFile);

      if (isMatch) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function smoothScrollAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const targetId = anchor.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
          return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function getToastContainer() {
    let container = document.querySelector(".toast-container");

    if (container) {
      return container;
    }

    container = document.createElement("div");
    container.className = "toast-container";
    container.setAttribute("aria-live", "polite");
    container.setAttribute("aria-atomic", "true");
    document.body.appendChild(container);
    return container;
  }

  function dismissToast(toast) {
    if (!toast || toast.dataset.dismissing === "true") {
      return;
    }

    toast.dataset.dismissing = "true";
    toast.classList.add("is-leaving");

    window.setTimeout(() => {
      toast.remove();
    }, 250);
  }

  function showToast(message, type = "info", duration = 4000) {
    const container = getToastContainer();
    const toast = document.createElement("div");
    const safeType = ["success", "error", "warning", "info"].includes(type) ? type : "info";
    const closeButton = document.createElement("button");
    const messageEl = document.createElement("div");
    let timeoutId = null;

    toast.className = `toast toast-${safeType}`;
    toast.setAttribute("role", safeType === "error" ? "alert" : "status");

    messageEl.className = "toast-message";
    messageEl.textContent = message;

    closeButton.className = "toast-close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Dismiss notification");
    closeButton.textContent = "×";
    closeButton.addEventListener("click", () => dismissToast(toast));

    toast.append(messageEl, closeButton);
    container.appendChild(toast);

    const startDismissTimer = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => dismissToast(toast), duration);
    };

    startDismissTimer();
    toast.addEventListener("mouseenter", () => window.clearTimeout(timeoutId));
    toast.addEventListener("mouseleave", startDismissTimer);

    return toast;
  }

  function initScrollReveal() {
    const elements = document.querySelectorAll(".reveal");

    if (!elements.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("visible");
          observerInstance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));
  }

  function initFAQ() {
    const faqQuestions = document.querySelectorAll(".faq-question");

    if (!faqQuestions.length) {
      return;
    }

    faqQuestions.forEach((question) => {
      const faqItem = question.closest(".faq-item");
      const answer = faqItem ? faqItem.querySelector(".faq-answer") : null;

      if (!faqItem || !answer) {
        return;
      }

      question.addEventListener("click", () => {
        const isOpen = faqItem.classList.contains("open");

        if (isOpen) {
          answer.style.maxHeight = "0px";
          faqItem.classList.remove("open");
          question.setAttribute("aria-expanded", "false");
          return;
        }

        faqItem.classList.add("open");
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      });
    });
  }

  window.showToast = showToast;
  window.initHeader = initHeader;
  window.initMobileMenu = initMobileMenu;
  window.setActiveNavLink = setActiveNavLink;
  window.smoothScrollAnchors = smoothScrollAnchors;
  window.initScrollReveal = initScrollReveal;
  window.initFAQ = initFAQ;

  document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initMobileMenu();
    setActiveNavLink();
    smoothScrollAnchors();
    initScrollReveal();
    initFAQ();
  });
})();
