define(function () {

  'use strict';

  return function () {
    return function (scribe) {
      var boldCommand = new scribe.api.CommandPatch('bold');

      /**
       * Chrome: Executing the bold command inside a heading corrupts the markup.
       * Disabling for now.
       */
      boldCommand.queryEnabled = function () {
        var selection = new scribe.api.Selection();
        var headingNode = selection.getContaining(function (node) {
          return (/^(H[1-6])$/).test(node.nodeName);
        });
        var containsHeadingNode = function (selection) {
          $contents = $(selection.range.cloneContents()).children()
          return $contents.is('h1, h2, h3, h4, h5, h6');
        };

        return scribe.api.CommandPatch.prototype.queryEnabled.apply(this, arguments) && ! headingNode && ! containsHeadingNode(selection);
      };

      // TODO: We can't use STRONGs because this would mean we have to
      // re-implement the `queryState` command, which would be difficult.

      scribe.commandPatches.bold = boldCommand;
    };
  };

});
