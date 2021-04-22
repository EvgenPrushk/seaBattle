//subscribe to changes
module.exports = class Observer {
  watchers = new Set();

  subscribe(watcher) {
    this.watchers.add(watcher);
    // delete watcher
    return () => this.watchers.delete(watcher);
  }

  dispatch(...args) {
    for (const watcher of this.watchers) {
      watcher(...args);
    }
  }
};
