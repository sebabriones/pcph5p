(function () {
  if (!window.H5P || !H5P.CoursePresentation || !H5P.CoursePresentation.prototype) {
    return;
  }

  var originalTrigger = H5P.CoursePresentation.prototype.trigger;
  if (typeof originalTrigger !== 'function') {
    return;
  }

  H5P.CoursePresentation.prototype.trigger = function (event) {
    try {
      var statement = event && event.data && event.data.statement;
      var hasParent = !!(
        statement &&
        statement.context &&
        statement.context.contextActivities &&
        statement.context.contextActivities.parent &&
        statement.context.contextActivities.parent.length
      );
      var hasSubContentId = !!(
        statement &&
        statement.context &&
        statement.context.extensions &&
        statement.context.extensions['http://h5p.org/x-api/h5p-subContentId']
      );
      var hasInteractionType = !!(
        statement &&
        statement.object &&
        statement.object.definition &&
        statement.object.definition.interactionType
      );
      var isEmbeddedStatement = hasParent || hasSubContentId || hasInteractionType;

      // Para esta copia local de Course Presentation (m3_l1_e3),
      // priorizar statements del contenido embebido y bloquear los del contenedor.
      if (statement && !isEmbeddedStatement) {
        return;
      }
    }
    catch (e) {
      // Si algo falla, no romper la emisión de eventos.
    }

    return originalTrigger.apply(this, arguments);
  };
})();
