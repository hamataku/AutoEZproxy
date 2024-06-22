import { loadSettings } from "./common.js";

var currentUrl = "";

chrome.tabs.query({ active: true, currentWindow: true }, (e) => {
  const url = new URL(e[0].url);
  document.getElementById("current-url").textContent = url.hostname;
  currentUrl = url.hostname;
});

loadSettings(function (data) {
  var toggleSwitch = document.getElementById("switch");
  if (currentUrl.includes(".idm.oclc.org")) {
    toggleSwitch.checked = false;
    toggleSwitch.disabled = true;
    return;
  }
  for (let i = 0; i < data.urls.length; i++) {
    const url = data.urls[i];
    let regex;

    regex = new RegExp(`^https?://${url.replace(/\*/g, ".*")}`);
    break;

    if (regex.test(currentUrl)) {
      toggleSwitch.checked = true;
    }
  }
});

// document.getElementById("add-btn").addEventListener("click", function () {
//   chrome.storage.sync.get(["urls", "types"], function (data) {
//     const urls = data.urls || [];
//     const types = data.types || [];
//     urls.push(currentUrl);
//     types.push("Host Wildcard");
//     chrome.storage.sync.set({ urls: urls, types: types }, function () {
//       console.log("URLs and types saved:", urls, types);
//       var alertBox = document.getElementById("alertBox");
//       alertBox.textContent = '"' + currentUrl + '" is added successfully!';
//       alertBox.classList.add("show");
//       setTimeout(function () {
//         alertBox.classList.remove("show");
//       }, 5000);
//     });
//   });
// });

document.getElementById("option-btn").addEventListener("click", function () {
  chrome.runtime.openOptionsPage();
});
