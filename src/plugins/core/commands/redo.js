define(function () {

  'use strict';

  return function () {
    return function (scribe) {
      var redoCallback;

      var redoCommand = new scribe.api.Command('redo');

      redoCommand.execute = function () {

        var historyItem = scribe.undoManager.redo();

        if (typeof historyItem !== 'undefined') {
          scribe.restoreFromHistory(historyItem);
        }
      };

      redoCommand.queryEnabled = function () {
        return scribe.undoManager.position < scribe.undoManager.stack.length - 1;
      };

      scribe.commands.redo = redoCommand;

      //is scribe is configured to undo assign listener
      if (scribe.options.undo.enabled) {
        scribe.el.addEventListener('keydown', redoCallback = function (event) {
          if (event.shiftKey && (event.metaKey || event.ctrlKey) && event.keyCode === 90) {
            event.preventDefault();
            redoCommand.execute();
          }
        });

        return function () {
          scribe.el.removeEventListener('keydown', redoCallback);
        };
      }
    };
  };

});
