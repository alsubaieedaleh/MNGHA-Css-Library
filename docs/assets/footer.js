/**
 * --------------------------------------------------------------------------
 * Shared Footer Loader
 * --------------------------------------------------------------------------
 *
 * Expected project structure:
 *
 */

(() => {
  const loaderScriptUrl = new URL(
    document.currentScript?.src || document.baseURI,
  );

  const footerPartialUrl = new URL(
    "../partials/footer.html",
    loaderScriptUrl,
  );

  const version = loaderScriptUrl.searchParams.get("v");

  if (version) {
    footerPartialUrl.searchParams.set("v", version);
  }

  function formatDateTimeAttribute(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function updateFooterMetadata(footerHost) {
    const year = footerHost.querySelector("[data-footer-year]");

    const lastModified = footerHost.querySelector(
      "[data-footer-last-modified]",
    );

    if (year) {
      year.textContent = String(new Date().getFullYear());
    }

    if (!lastModified) {
      return;
    }

    const pageLastModified = new Date(document.lastModified);

    if (Number.isNaN(pageLastModified.getTime())) {
      return;
    }

    lastModified.dateTime = formatDateTimeAttribute(pageLastModified);

    lastModified.textContent = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(pageLastModified);
  }

  async function injectFooter(footerHost) {
    const customSource = footerHost.dataset.footerSrc;

    const sourceUrl = customSource
      ? new URL(customSource, document.baseURI)
      : footerPartialUrl;

    footerHost.setAttribute("aria-busy", "true");

    try {
      const response = await fetch(sourceUrl, {
        headers: {
          Accept: "text/html",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Unable to load the footer: ${response.status} ${response.statusText}`,
        );
      }

      footerHost.innerHTML = await response.text();

      updateFooterMetadata(footerHost);

      footerHost.dispatchEvent(
        new CustomEvent("mngha:footer-ready", {
          bubbles: true,
        }),
      );
    } catch (error) {
      footerHost.replaceChildren();

      footerHost.dispatchEvent(
        new CustomEvent("mngha:footer-error", {
          bubbles: true,
          detail: {
            error,
            sourceUrl: sourceUrl.href,
          },
        }),
      );

      console.error(error);
    } finally {
      footerHost.removeAttribute("aria-busy");
    }
  }

  function loadFooters() {
    const footerHosts = document.querySelectorAll(
      "[data-mngha-footer]",
    );

    footerHosts.forEach((footerHost) => {
      injectFooter(footerHost);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      loadFooters,
      { once: true },
    );
  } else {
    loadFooters();
  }
})();