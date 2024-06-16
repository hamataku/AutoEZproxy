var currentUrl = "";
chrome.tabs.query({ active: true, currentWindow: true }, (e) => {
  const url = new URL(e[0].url);
  document.getElementById("current-url").textContent = url.hostname;
  currentUrl = url.hostname;
});

document.getElementById("add-btn").addEventListener("click", function () {
  chrome.storage.sync.get(["urls", "types"], function (data) {
    const urls = data.urls || [];
    const types = data.types || [];
    urls.push(currentUrl);
    types.push("Host Wildcard");
    chrome.storage.sync.set({ urls: urls, types: types }, function () {
      console.log("URLs and types saved:", urls, types);
      alert(currentUrl + " added successfully.");
    });
  });
});

document.getElementById("option-btn").addEventListener("click", function () {
  chrome.runtime.openOptionsPage();
});
