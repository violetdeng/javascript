(function() {
  var lastTime, vendors, x, _fn, _ref;
  lastTime = 0;
  vendors = ['ms', 'moz', 'webkit', 'o'];
  _fn = function(x) {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      return window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
  };
  for (x = 0, _ref = vendors.length; 0 <= _ref ? x <= _ref : x >= _ref; 0 <= _ref ? x++ : x--) {
    _fn.call(this, x);
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime, id, timeToCall;
      currTime = new Date().getTime();
      timeToCall = Math.max(0, 16 - (currTime - lastTime));
      id = window.setTimeout((function() {
        return callback(currTime + timeToCall);
      }), timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    return window.cancelAnimationFrame = function(id) {
      return window.clearTimeout(id);
    };
  }

  if (!window.addEventListener) {
    window.addEventListener = function(event, callback, capture) {
      if (window.attachEvent) {
        return window.attachEvent('on' + event, callback);
      } else {
        return window['on' + event] = callback;
      }
    };
  }
}).call(this);
