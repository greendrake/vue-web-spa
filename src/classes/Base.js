const lKeys = ['oneOffListeners', 'listeners'];

export default class Base {

  init(data) {
    this.mix(data);
  }

  mix(...mixins) {
    mixins.forEach((m) => Object.assign(this, m));
  }

  callIf(name, ...args) {
    if (this[name] && typeof this[name] === 'function') {
      return this[name](...args);
    }
    return null;
  }

  trigger(event, ...args) {
    this.foreachListener(event, (handlers) => {
      handlers.forEach((l) => l(...args));
      return true;
    });
  }

  getListeners(oneOff) {
    const key = lKeys[oneOff ? 0 : 1];
    if (!this[key]) {
      this[key] = {};
    }
    return this[key];
  }

  on(event, handler, oneOff) {
    const ls = this.getListeners(oneOff);
    if (!ls[event]) {
      ls[event] = new Set();
    }
    ls[event].add(handler);
  }

  one(event, handler) {
    this.on(event, handler, true);
  }

  foreachListener(event, fn) {
    lKeys.forEach((lk, i) => {
      if (this[lk] && this[lk][event]) {
        const hasTriggered = fn(this[lk][event]);
        if (i === 0 && hasTriggered === true) {
          // Delete one-offs once triggered
          delete this[lk][event];
        }
      }
    });
  }

  off(event, handler) {
    this.foreachListener(event, (handlers) => {
      if (handlers.has(handler)) {
        handlers.delete(handler);
      }
    });
  }

}
