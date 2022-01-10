// web extensions polyfill for ff/chrome
window.browser = (function () {
  return window.browser || window.chrome;
})();

browser.browserAction.onClicked.addListener(async function (tab) {
  init();
  await listTabs();
});


window.browser = (function () {
  return window.browser || window.chrome;
})();


async function listTabs() {
  const list = []
  const browser = window.browser || window.chrome
  const tabs = await browser.tabs.query({})
  console.log("tabs", tabs)
  for (let i = 0; i < tabs.length; ++i) {
    if (tabs[i].url && !tabs[i].url.startsWith("chrome") && !tabs[i].url.startsWith("moz") && !tabs[i].url.startsWith("about") && !tabs[i].url.startsWith("data")) {
      list.push("- [" + tabs[i].title + "](" + tabs[i].url + ")");
    }
  }
  await navigator.clipboard.writeText(list.join("\n"));
  await browser.notifications.create('tab-list', {
    type: 'basic',
    title: "Tab list copied to clipboard",
    message: list.length + " tabs",
    iconUrl: "icon-black.png"
  });
}

function activateTabs() {
  browser.tabs.query({}, async function (tabs) {
    for (let i = 0; i < tabs.length; ++i) {
      await browser.tabs.update(tabs[i].id, {
        active: true
      });
    }
    listTabs()
  });
}

function init() {
  browser.tabs.getCurrent(function (tab) {
    browser.runtime.getPlatformInfo(function (platform) {
      if (platform.os === "android") {
        // workaround for ff on android
        // tab.url is only available for tabs that have been recently used. so we'll activate them all before we query them
        alert("Generating list of tabs. This may take a moment...");
        activateTabs()
      } else {
        listTabs()
      }
    });
  });
}

