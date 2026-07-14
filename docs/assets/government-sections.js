/**
 * --------------------------------------------------------------------------
 * Government Verification Component
 * --------------------------------------------------------------------------
 *
 * Loads and initializes only the government verification banner.
 * It does not access or modify #docs-header.
 */

async function fetchGovernmentPartial(path) {
  const cacheBuster = Date.now();
  const fetchOptions = {
    cache: "no-store"
  };

  try {
    const response = await fetch(
      `${path}?v=${cacheBuster}`,
      fetchOptions
    );

    if (!response.ok) {
      throw new Error(
        `Status ${response.status}`
      );
    }

    return await response.text();
  } catch (firstError) {
    const fallbackResponse = await fetch(
      path,
      fetchOptions
    );

    if (!fallbackResponse.ok) {
      throw new Error(
        `Government verification partial failed: ` +
        `${fallbackResponse.status} ` +
        `${fallbackResponse.statusText}`
      );
    }

    return await fallbackResponse.text();
  }
}
/**
 * --------------------------------------------------------------------------
 * Government Toolbar Date and Time
 * --------------------------------------------------------------------------
 */

function initGovernmentDateTime() {
  const dateEl = document.querySelector(
    "[data-government-date]"
  );

  const timeEl = document.querySelector(
    "[data-government-time]"
  );

  if (!dateEl && !timeEl) return;

  function update() {
    const now = new Date();

    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString(
        "en-US",
        {
          day: "2-digit",
          month: "long",
          year: "numeric"
        }
      ).replace(/(\w+)\s(\d+),\s(\d+)/, "$2-$1-$3");
    }

    if (timeEl) {
      timeEl.textContent = now.toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        }
      );
    }
  }

  update();
  setInterval(update, 1000);
}

async function loadGovernmentToolbar() {
  const toolbarTarget = document.getElementById(
    "docs-government-toolbar"
  );

  if (!toolbarTarget) return;

  try {
    const toolbarHtml = await fetchGovernmentPartial(
      "./partials/government-toolbar.html"
    );

    toolbarTarget.innerHTML = toolbarHtml;

    initGovernmentDateTime();
  } catch (error) {
    console.error(
      "Failed to load government toolbar:",
      error
    );

    toolbarTarget.innerHTML = "";
  }
}
function initGovernmentVerification(root) {
  if (!root) return;

  const toggle = root.querySelector(
    "[data-government-verification-toggle]"
  );

  const details = root.querySelector(
    "[data-government-verification-details]"
  );

  if (!toggle || !details) {
    console.warn(
      "Government verification toggle or details panel is missing."
    );

    return;
  }

  /*
   * Start closed.
   */
  toggle.setAttribute(
    "aria-expanded",
    "false"
  );

  details.hidden = true;

  toggle.addEventListener(
    "click",
    function () {
      const isOpen =
        toggle.getAttribute("aria-expanded") ===
        "true";

      const nextOpen = !isOpen;

      toggle.setAttribute(
        "aria-expanded",
        String(nextOpen)
      );

      details.hidden = !nextOpen;
    }
  );
}

async function loadGovernmentVerification() {
  const verificationTarget =
    document.getElementById(
      "docs-government-verification"
    );

  if (!verificationTarget) {
    console.error(
      'Missing target: "#docs-government-verification".'
    );

    return;
  }

  try {
    const verificationHtml =
      await fetchGovernmentPartial(
        "./partials/government-verification.html"
      );

    verificationTarget.innerHTML =
      verificationHtml;

    initGovernmentVerification(
      verificationTarget
    );
  } catch (error) {
    console.error(
      "Failed to load government verification:",
      error
    );

    verificationTarget.innerHTML = "";
  }
}

function loadGovernmentSections() {
  loadGovernmentToolbar();
  loadGovernmentVerification();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadGovernmentSections);
} else {
  loadGovernmentSections();
}