window.addEventListener("DOMContentLoaded", () => {
  let bg = chrome.extension.getBackgroundPage();

  const updateVariables = () => chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    const currentPerf = bg.perfWatch[activeTab.id];
    if (!currentPerf) return;

    const context = currentPerf.context;

    if (!context) return;

    window.ENVIRONMENT = context.ENVIRONMENT;
    window.windowLocation = context.windowLocation;
    window.scriptStatuses = context.scriptStatuses;
  });

  setInterval(updateVariables, 100);

  const attempt = () => {
    if (!window.ENVIRONMENT) {
      setTimeout(attempt, 100);
      return;
    }
    setup();
  }

  attempt();
});
