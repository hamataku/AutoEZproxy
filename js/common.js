if (typeof globalThis.browser === "undefined") {
  globalThis.browser = chrome;
}

const default_urls = ["*.sciencedirect.com", "*.springer.com", "*.ieee.org"];

export function saveSettings({ urls = undefined, proxy = undefined }) {
  loadSettings(function (data) {
    const save_urls = urls || data.urls;
    const save_proxy = proxy || data.proxy;
    browser.storage.sync.set(
      { urls: save_urls, proxy: save_proxy },
      function () {
        console.log("Settings saved:", save_urls, save_proxy);
      }
    );
  });
}

export function loadSettings(callback) {
  browser.storage.sync.get(["urls", "proxy"], function (data) {
    const urls = data.urls || default_urls;
    let proxy = data.proxy || undefined;

    callback({ urls: urls, proxy: proxy });
  });
}

export async function getProxies() {
  let proxies;
  try {
    const response = await fetch("https://libproxy-db.org/proxies.json");
    proxies = await response.json();
  } catch (err) {
    alert("AutoEZproxy(Extension)\nFailed to get proxy list.");
    return undefined;
  }
  return proxies;
}

export function isUrlRegex(url, currentUrl) {
  return new RegExp(
    `https?://${url.replace(/\*/g, "[^?]*").replace(/\./g, "\\.")}`
  ).test(currentUrl);
}

export function checkRedirectUrl(currentUrl, callback) {
  let newUrl = undefined;
  let registered = false;
  let disabled = false;

  loadSettings(function (data) {
    if (data.proxy === undefined) {
      browser.runtime.sendMessage({ action: "openOptionsPage" });
      return;
    }
    for (let i = 0; i < data.urls.length; i++) {
      if (isUrlRegex(data.urls[i], currentUrl)) {
        newUrl = data.proxy.url.replace("$@", currentUrl);
        registered = true;
        break;
      }
    }

    const currentUrlObj = new URL(currentUrl);
    const proxyUrlObj = new URL(data.proxy.url);

    // if the current URL is already the proxy URL
    if (currentUrlObj.hostname.includes(proxyUrlObj.hostname)) {
      registered = true;
      disabled = true;
    }

    // if the current URL is not http or https
    if (
      currentUrlObj.protocol !== "https:" &&
      currentUrlObj.protocol !== "http:"
    ) {
      disabled = true;
    }
    callback({ newUrl: newUrl, registered: registered, disabled: disabled });
  });
}
