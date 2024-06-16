// Function to add a new URL input field with a type selector and a delete button
function addUrlInput(value = "", type = "Host Wildcard") {
  const urlContainer = document.getElementById("url-container");
  const newUrlIndex = urlContainer.children.length + 1;
  const newUrlDiv = document.createElement("div");
  newUrlDiv.className = "mb-3";
  newUrlDiv.innerHTML = `
        <div class="input-group">
            <select class="form-select" id="type${newUrlIndex}" name="types[]">
                <option value="Host Wildcard" ${
                  type === "Host Wildcard" ? "selected" : ""
                }>Host Wildcard</option>
                <option value="URL Wildcard" ${
                  type === "URL Wildcard" ? "selected" : ""
                }>URL Wildcard</option>
                <option value="URL regex" ${
                  type === "URL regex" ? "selected" : ""
                }>URL regex</option>
            </select>
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
      console.log(urlContainer.children.length);
      if (urlContainer.children.length === 1) {
        alert("You must have at least one URL field.");
        return;
      }
      newUrlDiv.remove();
      saveUrls(); // Save after removing
    });

  // Add event listener to input and select fields to save on change
  newUrlDiv.querySelector("input").addEventListener("input", saveUrls);
  newUrlDiv.querySelector("select").addEventListener("change", saveUrls);
}

// Load URLs and types from Chrome storage and display them
function loadUrls() {
  chrome.storage.sync.get(["urls", "types"], function (data) {
    const urls = data.urls || [];
    const types = data.types || [];
    for (let i = 0; i < urls.length; i++) {
      addUrlInput(urls[i], types[i]);
    }
  });
}

// Save URLs and types to Chrome storage
function saveUrls() {
  const urlInputs = document.querySelectorAll('input[name="urls[]"]');
  const typeSelects = document.querySelectorAll('select[name="types[]"]');
  const urls = Array.from(urlInputs)
    .map((input) => input.value.trim())
    .filter((url) => url !== "");
  const types = Array.from(typeSelects).map((select) => select.value);
  chrome.storage.sync.set({ urls: urls, types: types }, function () {
    console.log("URLs and types saved:", urls, types);
  });
}

document.getElementById("add-url").addEventListener("click", function () {
  addUrlInput();
});

// Initialize the form with saved URLs and types
loadUrls();
