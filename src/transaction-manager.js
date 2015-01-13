define(['lodash-amd/modern/objects/assign'], function (assign) {

  'use strict';

  return function (scribe) {
    function TransactionManager() {
      this.history = [];
    }

    assign(TransactionManager.prototype, {
      start: function () {
        this.history.push(1);
      },

      end: function () {
        this.history.pop();

        if (this.history.length === 0) {
          scribe.pushHistory();
          scribe.trigger('content-changed');
        }
      },

      _run: function (transaction) {
        this.start();
        // If there is an error, don't prevent the transaction from ending.
        try {
          if (transaction) {
            transaction();
          }
        } finally {
          this.end();
        }
      },

      run: function (transaction) {
        if (scribe.safariFeatureTest && !scribe.safariGreaterThan6FeatureTest) {
          setTimeout(function () {
            this._run(transaction);
          }.bind(this), 0)
        } else {
          this._run(transaction);
        }
      }
    });

    return TransactionManager;
  };
});
