define([], function () {

  'use strict';

  // TODO: unbind, once
  // TODO: unit test
  // Good example of a complete(?) implementation: https://github.com/Wolfy87/EventEmitter
  function EventEmitter() {
    this._listeners = [];
  }

  EventEmitter.prototype.on = function (eventName, fn) {
    var listeners = this._listeners[eventName] || [];

    listeners.push(fn);

    this._listeners[eventName] = listeners;
  };

  EventEmitter.prototype.trigger = function (eventName, args) {
    var listeners = this._listeners[eventName] || [];

    listeners.forEach(function (listener) {
      listener.apply(null, args);
    });
  };

  return EventEmitter;

});
