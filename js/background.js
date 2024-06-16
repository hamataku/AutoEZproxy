chrome.runtime.onInstalled.addListener((details) => {
  // check settings
  const default_urls = ["*.sciencedirect.com", "*.springer.com", "*.ieee.org"];
  const default_types = ["Host Wildcard"] * default_urls.length;
  chrome.storage.sync.get("urls", function (data) {
    if (data.urls === undefined) {
      chrome.storage.sync.set(
        { urls: default_urls, types: default_types },
        function () {}
      );
    }
  });
});
