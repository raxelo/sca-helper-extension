setTimeout(function(){
  const inj = chrome.extension.getURL('js/inject.js');
  fetch(inj)
    .then((response) => response.text())
    .then((text) => {
      var tmp = document.createElement('script');
      tmp.innerHTML = text;
      document.head.appendChild(tmp);
    });
}, 0);

window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FROM_PAGE') {
    chrome.runtime.sendMessage({ essential: event.data });
  }
});
