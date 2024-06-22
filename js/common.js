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

    // if no settings, set default
    if (proxy === undefined) {
      getProxies().then((proxies) => {
        if (proxies === undefined) {
          return;
        }
        proxy = { name: proxies[0].name, url: proxies[0].url };
      });
      saveSettings(urls, proxy);
    }

    console.log("Settings loaded:", urls, proxy);

    callback({ urls: urls, proxy: proxy });
  });
}

export async function getProxies() {
  let proxies;
  try {
    const response = await fetch("https://libproxy-db.org/proxies.json");
    proxies = await response.json();
  } catch (err) {
    alert("Failed to get proxy list.");
    return undefined;
  }
  return proxies;
}
