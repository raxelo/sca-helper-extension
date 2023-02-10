window.perfWatch = {};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (!sender.tab) return;
  window.perfWatch[sender.tab.id] = message.essential || null;
});
