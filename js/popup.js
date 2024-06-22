var currentUrl = "";

chrome.tabs.query({ active: true, currentWindow: true }, (e) => {
  const url = new URL(e[0].url);
  document.getElementById("current-url").textContent = url.hostname;
  currentUrl = url.hostname;
});

function loadSettings(callback) {
  chrome.storage.sync.get(["urls", "types"], function (data) {
    const urls = data.urls || [];
    const types = data.types || [];
    callback(urls, types);
  });
}

loadSettings(function (urls, types) {
  var toggleSwitch = document.getElementById("switch");
  if (currentUrl.includes(".idm.oclc.org")) {
    toggleSwitch.checked = false;
    toggleSwitch.disabled = true;
    return;
  }
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
