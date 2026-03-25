(function () {
  function applyFilter() {
    if (!window.H5P || !H5P.externalDispatcher || !H5P.CoursePresentation) return false;

    H5P.externalDispatcher.on('xAPI', function (event) {
      try {
        var statement = event.data && event.data.statement;
        if (!statement) return;

        var verbId        = (statement.verb && statement.verb.id) || '';
        var objectId      = (statement.object && statement.object.id) || '';
        var hasSubContent = objectId.indexOf('subContentId=') !== -1;

        // Solo completed de contenido embebido (el set completo, no preguntas individuales)
        if (!/\/completed$/.test(verbId) || !hasSubContent) return;

        var instances = H5P.instances || [];
        for (var i = 0; i < instances.length; i++) {
          var inst = instances[i];
          if (!(inst instanceof H5P.CoursePresentation)) continue;
          (function (cp) {
            setTimeout(function () {
              try {
                if (typeof cp.triggerXAPICompleted === 'function') {
                  var score    = typeof cp.getScore    === 'function' ? cp.getScore()    : 0;
                  var maxScore = typeof cp.getMaxScore === 'function' ? cp.getMaxScore() : 0;
                  cp.triggerXAPICompleted(score, maxScore);
                }
              } catch (e) {}
            }, 0);
          })(inst);
          break;
        }
      } catch (e) {}
    });
    return true;
  }

  if (!applyFilter()) {
    var attempts = 0;
    var interval = setInterval(function () {
      attempts++;
      if (applyFilter() || attempts >= 100) clearInterval(interval);
    }, 100);
  }
})();
