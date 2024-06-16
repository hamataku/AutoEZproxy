// Load URLs and types from Chrome storage
function loadSettings(callback) {
  chrome.storage.sync.get(["urls", "types"], function (data) {
    const urls = data.urls || [];
    const types = data.types || [];
    callback(urls, types);
  });
}

// Check if the current URL matches any of the configured patterns
function checkAndRedirect(currentUrl) {
  console.log("Checking URL:", currentUrl);
  if (currentUrl.includes(".idm.oclc.org")) {
    return;
  }
  loadSettings(function (urls, types) {
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const type = types[i];
      let regex;

      switch (type) {
        case "Host Wildcard":
          regex = new RegExp(`^https?://.*${url.replace(/\*/g, ".*")}`);
          break;
        case "URL Wildcard":
          regex = new RegExp(`^https?://${url.replace(/\*/g, ".*")}`);
          break;
        case "URL regex":
          regex = new RegExp(url);
          break;
        default:
          continue;
      }

      if (regex.test(currentUrl)) {
        const url = new URL(currentUrl);
        let newUrl =
          "https://" +
          url.hostname.replaceAll(".", "-") +
          ".utokyo.idm.oclc.org" +
          url.pathname +
          url.search;
        window.location.href = newUrl;
        return;
      }
    }
  });
}

checkAndRedirect(window.location.href);
