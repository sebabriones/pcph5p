(function () {
  if (!window.H5P || !H5P.SortParagraphs) {
    return;
  }

  var proto = H5P.SortParagraphs.prototype;
  if (!proto || proto.__durationPatched) {
    return;
  }
  proto.__durationPatched = true;

  var originalRegisterDomElements = proto.registerDomElements;
  proto.registerDomElements = function () {
    this.__attemptStart = Date.now();
    return originalRegisterDomElements.apply(this, arguments);
  };

  var originalResetTask = proto.resetTask;
  proto.resetTask = function () {
    this.__attemptStart = Date.now();
    return originalResetTask.apply(this, arguments);
  };

  var originalGetXAPIAnswerEvent = proto.getXAPIAnswerEvent;
  proto.getXAPIAnswerEvent = function () {
    var xAPIEvent = originalGetXAPIAnswerEvent.apply(this, arguments);

    if (xAPIEvent && xAPIEvent.data && xAPIEvent.data.statement) {
      xAPIEvent.data.statement.result = xAPIEvent.data.statement.result || {};

      if (!xAPIEvent.data.statement.result.duration) {
        var startedAt = this.__attemptStart || Date.now();
        var seconds = Math.max(0, (Date.now() - startedAt) / 1000);
        xAPIEvent.data.statement.result.duration = 'PT' + seconds.toFixed(2) + 'S';
      }
    }

    return xAPIEvent;
  };
})();
