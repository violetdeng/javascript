let parent = chrome.contextMenus.create({
  'title': '读书'
});

let close = chrome.contextMenus.create({
  'title': '关闭',
  'parentId': parent,
  'onclick': function () {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      let tab = tabs[0];
      let url = tab.url;
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
    });
  }
})

function refresh() {
  chrome.tabs.getSelected(null, function(tab) {
    var code = 'window.location.reload();';
    chrome.tabs.executeScript(tab.id, {code: code});
  });
}

let open = chrome.contextMenus.create({
  'title': '开启',
  'parentId': parent,
  'onclick': function () {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      let tab = tabs[0];
      let url = tab.url;
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
    });
  }
})
