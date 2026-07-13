/**
 * --------------------------------------------------------------------------
 * Load the Existing Documentation Header Only
 * --------------------------------------------------------------------------
 *
 * This file does not load or initialize any government component.
 */

async function fetchHeaderPartial(path) {
  const cacheBuster = Date.now();
  const fetchOptions = { cache: "no-store" };

  try {
    const response = await fetch(
      `${path}?v=${cacheBuster}`,
      fetchOptions
    );

    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }

    return await response.text();
  } catch (firstError) {
    const fallbackResponse = await fetch(
      path,
      fetchOptions
    );

    if (!fallbackResponse.ok) {
      throw new Error(
        `Header failed: ${fallbackResponse.status} ${fallbackResponse.statusText}`
      );
    }

    return await fallbackResponse.text();
  }
}

async function loadDocsHeader() {
  const headerTarget =
    document.getElementById("docs-header");

  if (!headerTarget) {
    console.error(
      'Missing <div id="docs-header"></div>'
    );

    return;
  }

  try {
    const headerHtml = await fetchHeaderPartial(
      "./partials/header.html"
    );

    headerTarget.innerHTML = headerHtml;

    initDocsHeader();
    initDocsTheme();
    initDocsDirection();
    setActiveDocsLink();
    initMobileMenu();
    initMobileSubmenus();
    initCodeBlockCopy();
  } catch (error) {
    console.error(
      "Failed to load documentation header:",
      error
    );

    headerTarget.innerHTML = `
      <p>Unable to load the documentation header.</p>
    `;
  }
}

/**
 * --------------------------------------------------------------------------
 * Desktop Header Navigation
 * --------------------------------------------------------------------------
 */

function initDocsHeader() {
  const headerMenuTriggers = document.querySelectorAll(
    "[data-header-menu-trigger]"
  );

  function closeHeaderMenus() {
    const openItems = document.querySelectorAll(
      ".mngha-header-nav-item.is-open"
    );

    openItems.forEach(function (item) {
      item.classList.remove("is-open");

      const trigger = item.querySelector(
        "[data-header-menu-trigger]"
      );

      if (trigger) {
        trigger.classList.remove(
          "mngha-header-link--active"
        );

        trigger.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    });
  }

  headerMenuTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const navItem = trigger.closest(
        ".mngha-header-nav-item"
      );

      if (!navItem) return;

      const isOpen =
        navItem.classList.contains("is-open");

      closeHeaderMenus();

      if (!isOpen) {
        navItem.classList.add("is-open");

        trigger.classList.add(
          "mngha-header-link--active"
        );

        trigger.setAttribute(
          "aria-expanded",
          "true"
        );
      }
    });
  });

  document.addEventListener("click", closeHeaderMenus);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeHeaderMenus();
    }
  });
}

/**
 * --------------------------------------------------------------------------
 * Theme
 * --------------------------------------------------------------------------
 */

function initDocsTheme() {
  const html = document.documentElement;

  const themeLabel = document.getElementById(
    "themeLabel"
  );

  const themeButtons = document.querySelectorAll(
    "[data-toggle-theme]"
  );

  function updateThemeLabel() {
    const currentTheme =
      html.getAttribute("data-theme") || "external";

    if (themeLabel) {
      themeLabel.textContent = currentTheme;
    }
  }

  themeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const currentTheme =
        html.getAttribute("data-theme") || "external";

      const nextTheme =
        currentTheme === "internal"
          ? "external"
          : "internal";

      html.setAttribute(
        "data-theme",
        nextTheme
      );

      updateThemeLabel();
    });
  });

  updateThemeLabel();
}

/**
 * --------------------------------------------------------------------------
 * Direction
 * --------------------------------------------------------------------------
 */

function initDocsDirection() {
  const html = document.documentElement;

  const directionLabel = document.getElementById(
    "directionLabel"
  );

  const directionButtons = document.querySelectorAll(
    "[data-toggle-direction]"
  );

  function updateDirectionLabel() {
    const currentDirection = html.dir || "ltr";

    if (directionLabel) {
      directionLabel.textContent =
        currentDirection;
    }

    directionButtons.forEach(function (button) {
      const buttonText = button.querySelector("span");

      if (!buttonText) return;

      buttonText.textContent =
        currentDirection === "rtl"
          ? "English"
          : "العربية";
    });
  }

  directionButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const nextDirection =
        html.dir === "rtl" ? "ltr" : "rtl";

      html.dir = nextDirection;

      html.lang =
        nextDirection === "rtl"
          ? "ar"
          : "en";

      updateDirectionLabel();
    });
  });

  updateDirectionLabel();
}

/**
 * --------------------------------------------------------------------------
 * Active Documentation Link
 * --------------------------------------------------------------------------
 */

function setActiveDocsLink() {
  const currentPage =
    window.location.pathname.split("/").pop() ||
    "index.html";

  const pageMap = {
    "foundations.html": "foundations",
    "layout.html": "layout",
    "theme.html": "theme",
    "direction.html": "direction"
  };

  const activeKey = pageMap[currentPage];

  if (!activeKey) return;

  const activeLink = document.querySelector(
    `[data-docs-link="${activeKey}"]`
  );

  if (activeLink) {
    activeLink.classList.add(
      "mngha-header-link--active"
    );

    activeLink.setAttribute(
      "aria-current",
      "page"
    );
  }
}

/**
 * --------------------------------------------------------------------------
 * Mobile Menu
 * --------------------------------------------------------------------------
 */

function initMobileMenu() {
  const toggle = document.querySelector(
    "[data-mobile-menu-toggle]"
  );

  const menu = document.querySelector(
    "[data-mobile-menu]"
  );

  const backdrop = document.querySelector(
    "[data-mobile-menu-backdrop]"
  );

  const closeButton = document.querySelector(
    "[data-mobile-menu-close]"
  );

  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add("is-open");

    if (backdrop) {
      backdrop.classList.add("is-open");
    }

    document.body.classList.add(
      "has-mobile-menu-open"
    );

    toggle.setAttribute(
      "aria-expanded",
      "true"
    );

    toggle.setAttribute(
      "aria-label",
      "Close menu"
    );
  }

  function closeMenu() {
    menu.classList.remove("is-open");

    if (backdrop) {
      backdrop.classList.remove("is-open");
    }

    document.body.classList.remove(
      "has-mobile-menu-open"
    );

    toggle.setAttribute(
      "aria-expanded",
      "false"
    );

    toggle.setAttribute(
      "aria-label",
      "Open menu"
    );
  }

  toggle.addEventListener("click", function () {
    const isOpen =
      menu.classList.contains("is-open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeButton) {
    closeButton.addEventListener(
      "click",
      closeMenu
    );
  }

  if (backdrop) {
    backdrop.addEventListener(
      "click",
      closeMenu
    );
  }

  const menuLinks = menu.querySelectorAll("a");

  menuLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

/**
 * --------------------------------------------------------------------------
 * Mobile Submenus
 * --------------------------------------------------------------------------
 */

function initMobileSubmenus() {
  const submenuTriggers = document.querySelectorAll(
    "[data-mobile-submenu-trigger]"
  );

  submenuTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      const submenuId =
        trigger.getAttribute("aria-controls");

      const submenu =
        document.getElementById(submenuId);

      if (!submenu) return;

      const isOpen =
        trigger.getAttribute("aria-expanded") ===
        "true";

      const nextOpen = !isOpen;

      trigger.setAttribute(
        "aria-expanded",
        String(nextOpen)
      );

      submenu.hidden = !nextOpen;

      trigger.classList.toggle(
        "is-active",
        nextOpen
      );

      const arrow = trigger.querySelector(
        ".mngha-mobile-menu-arrow"
      );

      if (arrow) {
        arrow.textContent =
          nextOpen ? "⌃" : "⌄";
      }
    });
  });
}

/**
 * --------------------------------------------------------------------------
 * Code Block Copy
 * --------------------------------------------------------------------------
 */

function initCodeBlockCopy() {
  const copyButtons = document.querySelectorAll(
    "[data-code-copy]"
  );

  copyButtons.forEach(function (button) {
    button.addEventListener("click", async function () {
      const codeBlock = button.closest(
        ".mngha-code-block"
      );

      if (!codeBlock) return;

      const codeBody = codeBlock.querySelector(
        ".mngha-code-block-body"
      );

      if (!codeBody) return;

      try {
        await navigator.clipboard.writeText(
          codeBody.innerText
        );

        const originalText =
          button.textContent.trim();

        button.textContent = "Copied";

        window.setTimeout(function () {
          button.textContent = originalText;
        }, 1500);
      } catch (error) {
        console.error(
          "Unable to copy code:",
          error
        );
      }
    });
  });
}

/**
 * --------------------------------------------------------------------------
 * Start Documentation Header
 * --------------------------------------------------------------------------
 */

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    loadDocsHeader
  );
} else {
  loadDocsHeader();
}
