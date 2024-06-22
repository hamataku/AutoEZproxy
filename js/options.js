import { loadSettings, saveSettings, getProxies } from "./common.js";

let proxyLists = [];
var currentProxy = [];
var selectedLi = undefined;

// Function to add a new URL input field with a type selector and a delete button
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
        alert("You must have at least one URL field.");
        return;
      }
      newUrlDiv.remove();
      saveUrls(); // Save after removing
    });

  // Add event listener to input and select fields to save on change
  newUrlDiv.querySelector("input").addEventListener("input", saveUrls);
}

// 初期リストの表示
function displayProxies(filter = "") {
  const proxyListDOM = document.getElementById("proxyList");
  proxyListDOM.innerHTML = ""; // リストをクリア
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
      if (currentProxy.name === proxy.name) {
        selectedLi = li;
        li.classList.add("active");
      }
      proxyListDOM.appendChild(li);
    }
  });
  selectedLi.scrollIntoView({ block: "center" });
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
  console.log(proxyLists);

  // 検索ボックスの入力イベントリスナー
  document.getElementById("searchBox").addEventListener("input", function () {
    displayProxies(this.value);
  });

  // 初期リストの表示
  displayProxies();
}

// Save URLs to Chrome storage
function saveUrls() {
  const urlInputs = document.querySelectorAll('input[name="urls[]"]');
  const urls = Array.from(urlInputs)
    .map((input) => input.value.trim())
    .filter((url) => url !== "");
  saveSettings({ urls: urls });
}

document.getElementById("add-url").addEventListener("click", function () {
  addUrlInput();
});

main();
