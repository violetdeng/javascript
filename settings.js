class DescriptionStep {
  constructor (text, judge) {
    let container = document.createElement('div');
    container.style = 'position: fixed; top: 50%; left: 50%; font-size: 3rem; color: red; margin-left: -9rem; z-index: 10000; display: none;'
    container.innerText = text;
    document.body.appendChild(container);
    this.container = container;
    this.judge = judge
  }

  hide () {
    this.container.style.display = 'none'
  }

  show () {
    let that = this
    function next (e) {
      e.stopPropagation();
      e.preventDefault();
      let container = event.target

      container = that.judge(container);
      if (container) {
        that.lastStyle = container.style.background || 'transparent'
        container.style.background = 'rgba(0,0,0,.3)';
        that.targetContainer = container;

        document.removeEventListener('click', next)
        that.goNext()
      }
    }
    document.addEventListener('click', next)
    if (that.targetContainer) {
      that.targetContainer.style.background = that.lastStyle
    }
    this.container.style.display = 'block'
  }

  setNext (next) {
    this.next = next
  }

  setPrev (prev) {
    this.prev = prev
  }

  goNext () {
    if (this.next) {
      this.hide()
      this.next.show()
    }
  }

  goPrev () {
    if (this.prev) {
      this.hide()
      this.prev.show()
    }
  }
}

class GapStep {
  constructor () {
    let that = this
    let container = document.createElement('div');
    container.style = 'position: fixed; top: 50%;left: 0; right: 0; text-align: center; display: none;';
    let ok = document.createElement('button');
    ok.className = 'violet-ok violet-button';
    ok.innerText = '确定';
    ok.style = ' cursor: pointer; display: inline-block; min-height: 1em; outline: 0; border: none; vertical-align: baseline; background: #e0e1e2 none; color: rgba(0,0,0,.6); font-family: Lato,"Helvetica Neue",Arial,Helvetica,sans-serif; margin: 0 .25em 0 0; padding: .78571429em 1.5em .78571429em; text-transform: none; text-shadow: none; font-weight: 700; line-height: 1em; font-style: normal; font-size: 1rem; text-align: center; text-decoration: none; border-radius: .28571429rem; -webkit-box-shadow: 0 0 0 1px transparent inset, 0 0 0 0 rgba(34,36,38,.15) inset; box-shadow: 0 0 0 1px transparent inset, 0 0 0 0 rgba(34,36,38,.15) inset; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-transition: opacity .1s ease,background-color .1s ease,color .1s ease,background .1s ease,-webkit-box-shadow .1s ease; transition: opacity .1s ease,background-color .1s ease,color .1s ease,background .1s ease,-webkit-box-shadow .1s ease; transition: opacity .1s ease,background-color .1s ease,color .1s ease,box-shadow .1s ease,background .1s ease; transition: opacity .1s ease,background-color .1s ease,color .1s ease,box-shadow .1s ease,background .1s ease,-webkit-box-shadow .1s ease; will-change: ""; -webkit-tap-highlight-color: transparent; width: 150px; margin: 1em;';
    container.appendChild(ok);

    let cancel = document.createElement('button');
    cancel.className = 'violet-cancel violet-button';
    cancel.innerText = '撤销';
    cancel.style = ' cursor: pointer; display: inline-block; min-height: 1em; outline: 0; border: none; vertical-align: baseline; background: #e0e1e2 none; color: rgba(0,0,0,.6); font-family: Lato,"Helvetica Neue",Arial,Helvetica,sans-serif; margin: 0 .25em 0 0; padding: .78571429em 1.5em .78571429em; text-transform: none; text-shadow: none; font-weight: 700; line-height: 1em; font-style: normal; font-size: 1rem; text-align: center; text-decoration: none; border-radius: .28571429rem; -webkit-box-shadow: 0 0 0 1px transparent inset, 0 0 0 0 rgba(34,36,38,.15) inset; box-shadow: 0 0 0 1px transparent inset, 0 0 0 0 rgba(34,36,38,.15) inset; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-transition: opacity .1s ease,background-color .1s ease,color .1s ease,background .1s ease,-webkit-box-shadow .1s ease; transition: opacity .1s ease,background-color .1s ease,color .1s ease,background .1s ease,-webkit-box-shadow .1s ease; transition: opacity .1s ease,background-color .1s ease,color .1s ease,box-shadow .1s ease,background .1s ease; transition: opacity .1s ease,background-color .1s ease,color .1s ease,box-shadow .1s ease,background .1s ease,-webkit-box-shadow .1s ease; will-change: ""; -webkit-tap-highlight-color: transparent; width: 150px; margin: 1em;';
    container.appendChild(cancel);

    document.body.appendChild(container);

    this.container = container;

    ok.addEventListener('click', function (e) {
      e.stopPropagation()
      that.goNext()
    })

    cancel.addEventListener('click', function (e) {
      e.stopPropagation()
      that.goPrev()
    })
  }

  hide () {
    this.container.style.display = 'none'
  }

  show () {
    this.container.style.display = 'block'
  }

  setNext (next) {
    this.next = next
  }

  setPrev (prev) {
    this.prev = prev
  }

  goNext () {
    if (this.next) {
      this.hide()
      this.next.show()
    }
  }

  goPrev () {
    if (this.prev) {
      this.hide()
      this.prev.show()
    }
  }
}
class Settings {
  constructor () {
    let that = this
    this.first = new DescriptionStep('请点击内容处', function (container) {
      return that.findContentWrapper(container)
    })
    this.second = new GapStep()
    this.first.setNext(this.second)
    this.second.setPrev(this.first)
    this.third = new DescriptionStep('请点击下一章', function (container) {
      return that.findLinkWrapper(container)
    })
    this.second.setNext(this.third)
    this.third.setPrev(this.second)
    this.forth = new GapStep()
    this.third.setNext(this.forth)
    this.forth.setPrev(this.third)
    this.five = new DescriptionStep('请点击上一章', function (container) {
      return that.findLinkWrapper(container)
    })
    this.forth.setNext(this.five)
    this.five.setPrev(this.forth)
    this.six = new GapStep()
    this.five.setNext(this.six)
    this.six.setPrev(this.five)
    this.six.setNext({
      show: function () {
        that.finish()
      }
    })

    this.first.show()
  }

  findContentWrapper (container) {
    if (!container) return false
    if (container.tagName.toLowerCase() === 'div') {
      return container;
    } else {
      return this.findContentWrapper(container.parentNode)
    }
  }

  findLinkWrapper (container) {
    if (!container) return false
    if (container.tagName.toLowerCase() === 'a') {
      return container;
    } else {
      return this.findLinkWrapper(container.parentNode)
    }
  }

  finish () {
    var that = this
    let parts = location.href.split('/');
    if (parts.length < 2) return
    var url = parts[0] + '//' + parts[2] + '/*'
    chrome.storage.sync.get('settings', function (data) {
      let settings = data.settings || []
      let news = []
      for (let item of data.settings) {
        let pattern = new RegExp(item.url)
        if (!pattern.test(location.href)) {
          news.push(item)
        }
      }

      news.push({
        url: url,
        content: that.findPath(that.first.targetContainer),
        prev: that.findPath(that.third.targetContainer),
        next: that.findPath(that.five.targetContainer)
      })

      chrome.storage.sync.set({
        settings: news
      })
    });
  }

  findPath (container) {
    var path = []
    function find (container) {
      if (container.id) {
        path.push('#' + container.id)
        return
      } else if (container.className) {
        path.push('.' + container.className)
        return
      } else {
        if (container.parentNode.children.length > 1) {
          let nodes = Array.prototype.slice.call(container.parentNode.children)
          path.push(container.tagName.toLowerCase() + ':nth-child(' + (nodes.indexOf(container) + 1) + ')')
        } else {
          path.push(container.tagName.toLowerCase())
        }
        return find(container.parentNode)
      }
    }

    find(container)
    return path.reverse().join('>')
  }
}
