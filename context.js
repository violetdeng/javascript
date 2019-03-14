chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    switch(message.type) {
      case "settings":
        new Settings()
        break;
      case "load":
        chrome.contextMenus.removeAll(function () {
          chrome.tabs.getSelected(null, function(tab) {
            createContextMenu(tab.url)
          });
        })
        break
    }
  }
);

function createContextMenu (url) {
  if (!url) return;
  let parts = url.split('/');
  if (parts.length < 2) return
  url = parts[0] + '//' + parts[2] + '/*'
  chrome.storage.sync.get('close', function (data) {
    let close = data.close || []
    let exists = false
    for (let item of close) {
      let pattern = new RegExp(item)
      if (pattern.test(url)) exists = true
    }

    if (exists) {
      addOpen(url)
    } else {
      addClose(url)
    }
  })
}

function addClose (url) {
  chrome.contextMenus.create({
    'title': '关闭',
    'contexts': ['all'],
    'onclick': function () {
      let parts = url.split('/');
      if (parts.length < 2) return
      url = parts[0] + '//' + parts[2] + '/*'
      chrome.storage.sync.get('close', function (data) {
        let close = data.close || []
        let news = []
        for (let item of close) {
          let pattern = new RegExp(item)
          if (!pattern.test(url)) {
            news.push(item)
          }
        }
        news.push(url)
        chrome.storage.sync.set({
          close: news
        })

        refresh();
      });
    }
  })
}

function refresh() {
  chrome.tabs.getSelected(null, function(tab) {
    var code = 'window.location.reload();';
    chrome.tabs.executeScript(tab.id, {code: code});
  });
}

function addOpen (url) {
  chrome.contextMenus.create({
    'title': '开启',
    'contexts': ['all'],
    'onclick': function () {
      let parts = url.split('/');
      if (parts.length < 2) return
      url = parts[0] + '//' + parts[2] + '/*'
      chrome.storage.sync.get('close', function (data) {
        let close = data.close || []
        let news = []
        for (let item of close) {
          let pattern = new RegExp(item)
          if (!pattern.test(url)) {
            news.push(item)
          }
        }
        chrome.storage.sync.set({
          close: news
        })

        refresh();
      });
    }
  })
}
