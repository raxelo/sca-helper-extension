function setup() {
  const isRunningLocally = window.windowLocation.href.includes("-local.ssp");

  const runningStatusText = document.getElementById("runningStatusText");
  runningStatusText.innerText = isRunningLocally
    ? "Running locally"
    : "Not running locally";

  const runningStatusIcon = document.getElementById("runningStatusIcon");
  runningStatusIcon.classList.add(
    isRunningLocally ? "status--green" : "status--red"
  );

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

  document.getElementById("popupButton").addEventListener("click", () => {
    alert(getSiteHref(!isRunningLocally));
    alert(JSON.stringify(window.scriptStatuses));
  });
}
