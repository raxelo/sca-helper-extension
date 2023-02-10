function setup() {
  const isRunningLocally = window.windowLocation.href.includes("-local.ssp");

  const runningStatusText = document.getElementById("runningStatusText");
  runningStatusText.innerText = isRunningLocally
    ? "Running locally"
    : "Not running locally";
  runningStatusText.style.display = "";

  const runningStatusIcon = document.getElementById("runningStatusIcon");
  runningStatusIcon.classList.add(
    isRunningLocally ? "status--green" : "status--red"
  );
  runningStatusIcon.style.display = "";

  function getPath() {
    let path = "";
    const search = window.windowLocation.search;
    const hash = window.windowLocation.hash;

    if (window.windowLocation.hash) return search + hash;

    if (!window.windowLocation.pathname.includes(".ssp"))
      return window.windowLocation.pathname.replace("/", "#");

    return path;
  }

  function getTouchpoint(isLocal) {
    let touchpoint = ENVIRONMENT.SCTouchpoint;
    if (isLocal) touchpoint += "-local";
    touchpoint += ".ssp";
    return touchpoint;
  }

  const getSiteHref = (isLocal) => {
    const touchpoint = getTouchpoint(isLocal);
    const url = ENVIRONMENT.baseUrl.replace("{{file}}", touchpoint);
    const path = getPath();
    return url + path;
  };

  const popupButton = document.getElementById("popupButton");
  popupButton.style.display = "";
  popupButton.addEventListener("click", () => {
    const href = getSiteHref(!isRunningLocally);
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { type: "REDIRECT", url: href });
      window.close();
    });
  });

  document.getElementById("popupButtonText").innerHTML = isRunningLocally
    ? "Switch to live"
    : "Switch to local";

  // loaded script list
  const loadedScriptsUl = document.getElementById("loaded-scripts");
  window.scriptStatuses.forEach((script) => {
    const li = document.createElement("li");

    const status = document.createElement("span");
    status.classList.add("status");
    const statusClasses = {
      loaded: "green",
      failed: "red",
      loading: "yellow",
    };
    status.classList.add(`status--${statusClasses[script.status]}`);
    li.appendChild(status);

    const text = document.createElement("span");
    text.innerText = script.name;
    li.appendChild(text);

    loadedScriptsUl.appendChild(li);
  });
}
