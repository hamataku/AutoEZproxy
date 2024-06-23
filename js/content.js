import { checkRedirectUrl } from "./common.js";

if (typeof globalThis.browser === "undefined") {
  globalThis.browser = chrome;
}

function checkAndRedirect(currentUrl) {
  checkRedirectUrl(currentUrl, function (data) {
    browser.storage.local.get(["previousRedirect"], function (localData) {
      let previousRedirect = localData.previousRedirect || "";

      if (data.newUrl !== undefined) {
        // if redirecting to the same URL, show an alert
        if (previousRedirect === currentUrl) {
          const url = new URL(previousRedirect);
          alert(
            'AutoEZproxy(Extension)\nRedirect loop detected with "' +
              url.hostname +
              '". Please check your settings.\n'
          );
          return;
        }
        // Set the new URL as the current URL before redirecting
        browser.storage.local.set({
          previousRedirect: currentUrl,
        });
        // redirect
        window.location.href = data.newUrl;
      } else {
        browser.storage.local.set({ previousRedirect: "" });
      }
    });
  });
}

checkAndRedirect(window.location.href);
