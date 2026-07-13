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
        "./partials/government-verification.txt"
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

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    loadGovernmentVerification
  );
} else {
  loadGovernmentVerification();
}