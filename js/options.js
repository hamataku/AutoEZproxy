import {
  loadSettings,
  saveSettings,
  resetSettings,
  getProxies,
} from "./common.js";

let proxyLists = [];
var currentProxy = undefined;
var selectedLi = undefined;

// Function to add a new URL input field with a delete button
function addUrlInput(value = "") {
  const urlContainer = document.getElementById("url-container");
  const newUrlIndex = urlContainer.children.length + 1;
  const newUrlDiv = document.createElement("div");
  newUrlDiv.className = "mb-3";
  newUrlDiv.innerHTML = `
        <div class="input-group">
            <input type="text" class="form-control" id="url${newUrlIndex}" name="urls[]" placeholder="Enter URL" value="${value}">
            <button type="button" class="btn btn-danger btn-remove-url">
                <div style='color: #eee;'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
                </div>
            </button>
        </div>
        `;
  urlContainer.appendChild(newUrlDiv);

  // Add event listener to the remove button
  newUrlDiv
    .querySelector(".btn-remove-url")
    .addEventListener("click", function () {
      if (urlContainer.children.length === 1) {
        alert("AutoEZproxy(Extension)\nYou must have at least one URL field.");
        return;
      }
      newUrlDiv.remove();
      saveUrls();
    });

  // Add event listener to input fields to save on change
  newUrlDiv.querySelector("input").addEventListener("input", saveUrls);
}

function displayProxies(filter = "") {
  const proxyListDOM = document.getElementById("proxyList");
  proxyListDOM.innerHTML = "";
  proxyLists.forEach(function (proxy) {
    if (proxy.name.toLowerCase().includes(filter.toLowerCase())) {
      let li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = proxy.name;
      li.addEventListener("click", function () {
        currentProxy = proxy;
        if (selectedLi !== undefined) {
          selectedLi.classList.remove("active");
        }
        selectedLi = this;
        li.classList.add("active");
        saveSettings({ proxy: proxy });
      });
      if (currentProxy !== undefined && currentProxy.name === proxy.name) {
        selectedLi = li;
        li.classList.add("active");
      }
      proxyListDOM.appendChild(li);
    }
  });
  if (selectedLi !== undefined) selectedLi.scrollIntoView({ block: "center" });
}

async function main() {
  loadSettings(function (data) {
    currentProxy = data.proxy;
    for (let i = 0; i < data.urls.length; i++) {
      addUrlInput(data.urls[i]);
    }
  });

  const proxies = await getProxies();
  proxyLists = proxies.map((item) => ({
    name: item.name,
    url: item.url,
  }));

  document.getElementById("searchBox").addEventListener("input", function () {
    displayProxies(this.value);
  });

  displayProxies();
}

function saveUrls() {
  const urlInputs = document.querySelectorAll('input[name="urls[]"]');
  const urls = Array.from(urlInputs)
    .map((input) => input.value.trim())
    .filter((url) => url !== "");
  saveSettings({ urls: urls });
}

function exportSettings() {
  loadSettings(function (items) {
    const dataStr = JSON.stringify(items, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AutoEZproxy.json";
    a.click();
    URL.revokeObjectURL(url);
  });
}

function handleFileSelect(event) {
  const fileInput = document.getElementById("importFile");
  const file = fileInput.files[0];

  if (!file) {
    console.log("No file selected.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const settings = JSON.parse(e.target.result);
      saveSettings(settings);
      location.reload();
    } catch (error) {
      console.error("Failed to parse JSON file:", error);
    }
  };
  reader.readAsText(file);
}

function openFileDialog() {
  const fileInput = document.getElementById("importFile");
  fileInput.click();
}

// Event listeners
document
  .getElementById("importButton")
  .addEventListener("click", openFileDialog);
document
  .getElementById("importFile")
  .addEventListener("change", handleFileSelect);
document
  .getElementById("exportButton")
  .addEventListener("click", exportSettings);
document.getElementById("addRule").addEventListener("click", function () {
  addUrlInput();
});
document.getElementById("resetButton").addEventListener("click", function () {
  resetSettings();
});

main();
