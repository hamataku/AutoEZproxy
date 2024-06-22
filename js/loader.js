(async () => {
  if (typeof globalThis.browser === "undefined") {
    globalThis.browser = chrome;
  }
  const src = browser.runtime.getURL("js/content.js");
  const contentMain = await import(src);
})();
