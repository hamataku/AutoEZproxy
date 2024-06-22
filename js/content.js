import { loadSettings } from "./common.js";

// Check if the current URL matches any of the configured patterns
function checkAndRedirect(currentUrl) {
  loadSettings(function (data) {
    for (let i = 0; i < data.urls.length; i++) {
      const url = data.urls[i];
      let regex;
      regex = new RegExp(
        `https?://${url.replace(/\*/g, "[^?]*").replace(/\./g, "\\.")}`
      );

      if (regex.test(currentUrl)) {
        const newUrl = data.proxy.url.replace("$@", currentUrl);
        window.location.href = newUrl;
        return;
      }
    }
  });
}

checkAndRedirect(window.location.href);
