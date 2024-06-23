import {
  checkRedirectUrl,
  loadSettings,
  saveSettings,
  isRedirectUrl,
} from "./common.js";

if (typeof globalThis.browser === "undefined") {
  globalThis.browser = chrome;
}

let proxySwitch = document.getElementById("proxy-switch");

browser.tabs.query({ active: true, currentWindow: true }, (e) => {
  const url = new URL(e[0].url);
  document.getElementById("current-url").textContent = url.hostname;

  checkRedirectUrl(url.href, function (data) {
    proxySwitch.checked = data.registered;
    proxySwitch.disabled = data.disabled;
  });

  proxySwitch.addEventListener("click", function () {
    if (proxySwitch.checked) {
      // add
      loadSettings(function (data) {
        let urls = data.urls;
        urls.push(url.hostname);
        saveSettings({ urls: urls });
      });
      location.reload();
    } else {
      // remove
      loadSettings(function (data) {
        for (let i = 0; i < data.urls.length; i++) {
          if (isRedirectUrl(data.urls[i], url.href)) {
            data.urls.splice(i, 1);
            break;
          }
        }
        saveSettings({ urls: data.urls });
      });
    }
  });
});

document.getElementById("optionButton").addEventListener("click", function () {
  browser.runtime.openOptionsPage();
});
