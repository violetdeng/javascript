(function () {
  chrome.storage.sync.get('close', function (data) {
    if (data.close && data.close.length) {
      for (let item of data.close) {
        let pattern = new RegExp(item)
        if (pattern.test(location.href)) return
      }
    }
    start()
  });

  function start () {
    chrome.storage.sync.get('settings', function (data) {
      if (!data.settings || !data.settings.length) {
        return
      }
      for (let item of data.settings) {
        let pattern = new RegExp(item.url)
        if (pattern.test(location.href)) init(item)
      }
    });
  }

  function init (option) {

    function stripScripts (s) {
      var div = document.createElement('div');
      div.innerHTML = s;
      var scripts = div.getElementsByTagName('script');
      var i = scripts.length;
      while (i--) {
        scripts[i].parentNode.removeChild(scripts[i]);
      }
      var as = div.getElementsByTagName('a');
      i = as.length;
      while (i--) {
        as[i].parentNode.removeChild(as[i]);
      }
      return div.innerHTML;
    }

    let prevChapter = false
    if (option.prev) {
      let prev = document.querySelectorAll(option.prev)
      if (prev.length > 0) {
        prevChapter = prev[0].href
      }
      if (prevChapter) {
        let tmp = document.createElement('a')
        tmp.href = prevChapter
        prevChapter = tmp
        prevChapter.innerText = '上一章'
      }
    }


    let next = document.querySelectorAll(option.next)
    let nextChapter = false
    if (next.length > 0) {
      nextChapter = next[0].href
    }
    if (nextChapter) {
      let tmp = document.createElement('a')
      tmp.href = nextChapter
      nextChapter = tmp
      nextChapter.innerText = '下一章'
      nextChapter.style = 'float: right;'
    }

    if (document.querySelectorAll(option.content).length > 0) {
      let html = document.querySelectorAll(option.content)[0].innerHTML;
      document.documentElement.innerHTML = '<div style="max-width: 1000px; margin: 0 auto; line-height: 2; padding-bottom: 2em;" id="violet_content">' + stripScripts(html) + '</div>'

      let container = document.getElementById('violet_content')
      container.appendChild(document.createElement('br'))
      if (nextChapter) {
        container.appendChild(nextChapter)
      }
      if (prevChapter) {
        container.appendChild(prevChapter)
      }

      document.body.style = "background: #E9FAFF; font-size: 20px;"
    }
  }

  chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
      switch(message.type) {
        case "settings":
          new Settings()
          break;
      }
    }
  );
})()
