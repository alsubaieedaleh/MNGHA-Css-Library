async function loadDocsHeader() {
  const headerTarget = document.getElementById("docs-header");

  if (!headerTarget) return;

  const response = await fetch("./partials/header.html");
  const headerHtml = await response.text();

  headerTarget.innerHTML = headerHtml;

  initDocsHeader();
  initDocsTheme();
  initDocsDirection();
  setActiveDocsLink();
  initCodeBlockCopy()
}
function initCodeBlockCopy() {
  const copyButtons = document.querySelectorAll("[data-code-copy]");

  copyButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const codeBlock = button.closest(".mngha-code-block");
      const codeBody = codeBlock.querySelector(".mngha-code-block-body");

      if (!codeBody) return;

      navigator.clipboard.writeText(codeBody.innerText).then(function () {
        const originalText = button.textContent;

        button.textContent = "Copied";

        setTimeout(function () {
          button.textContent = originalText;
        }, 1500);
      });
    });
  });
}
function initDocsHeader() {
  const headerMenuTriggers = document.querySelectorAll("[data-header-menu-trigger]");

  function closeHeaderMenus() {
    document.querySelectorAll(".mngha-header-nav-item.is-open").forEach(function (item) {
      item.classList.remove("is-open");

      const trigger = item.querySelector("[data-header-menu-trigger]");

      if (trigger) {
        trigger.classList.remove("mngha-header-link--active");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  headerMenuTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const navItem = trigger.closest(".mngha-header-nav-item");
      const isOpen = navItem.classList.contains("is-open");

      closeHeaderMenus();

      if (!isOpen) {
        navItem.classList.add("is-open");
        trigger.classList.add("mngha-header-link--active");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", function () {
    closeHeaderMenus();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeHeaderMenus();
    }
  });
}

function initDocsTheme() {
  const html = document.documentElement;
  const themeLabel = document.getElementById("themeLabel");
  const themeButtons = document.querySelectorAll("[data-toggle-theme]");

  function updateThemeLabel() {
    const currentTheme = html.getAttribute("data-theme") || "external";

    if (themeLabel) {
      themeLabel.textContent = currentTheme;
    }
  }

  themeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const currentTheme = html.getAttribute("data-theme") || "external";
      const nextTheme = currentTheme === "internal" ? "external" : "internal";

      html.setAttribute("data-theme", nextTheme);
      updateThemeLabel();
    });
  });

  updateThemeLabel();
}

function initDocsDirection() {
  const html = document.documentElement;
  const directionLabel = document.getElementById("directionLabel");
  const directionButtons = document.querySelectorAll("[data-toggle-direction]");

  function updateDirectionLabel() {
    if (directionLabel) {
      directionLabel.textContent = html.dir || "ltr";
    }
  }

  directionButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const nextDirection = html.dir === "rtl" ? "ltr" : "rtl";

      html.dir = nextDirection;
      html.lang = nextDirection === "rtl" ? "ar" : "en";

      updateDirectionLabel();
    });
  });

  updateDirectionLabel();
}

function setActiveDocsLink() {
  const currentPage = window.location.pathname.split("/").pop();

  const pageMap = {
    "foundations.html": "foundations",
    "layout.html": "layout",
    "theme.html": "theme",
    "direction.html": "direction"
  };

  const activeKey = pageMap[currentPage];

  if (!activeKey) return;

  const activeLink = document.querySelector('[data-docs-link="' + activeKey + '"]');

  if (activeLink) {
    activeLink.classList.add("mngha-header-link--active");
  }
}

loadDocsHeader();