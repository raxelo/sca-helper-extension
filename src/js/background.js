window.perfWatch = {};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  window.perfWatch[sender.tab.id] = message.essential || null;
});
