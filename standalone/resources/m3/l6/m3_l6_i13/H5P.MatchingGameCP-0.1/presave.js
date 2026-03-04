var H5PPresave = H5PPresave || {};
var H5PEditor = H5PEditor || {};

/**
 * Function to presave MatchingGameCP and calculate max score
 *
 * @param content
 * @param finished
 * @constructor
 */
H5PPresave['H5P.MatchingGameCP'] = function (content, finished) {
  var presave = H5PEditor.Presave;

  if (isContentInvalid()) {
    throw new presave.exceptions.InvalidContentSemanticsException('Invalid MatchingGameCP Error');
  }

  // Calculate max score: one point per correct pair
  var maxScore = 0;
  if (content.pairs && Array.isArray(content.pairs)) {
    maxScore = content.pairs.length;
  }

  presave.validateScore(maxScore);
  finished({maxScore: maxScore});

  /**
   * Check if required parameters is present
   * @return {boolean}
   */
  function isContentInvalid() {
    return !presave.checkNestedRequirements(content, 'content.pairs');
  }
};

