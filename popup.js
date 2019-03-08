(function () {
  document.getElementById('setting').addEventListener('click', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: "settings"}, function(response){
      });
    });
  })
})();
