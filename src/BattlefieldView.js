class BattlefieldView extends Battlefield {
  root = null;
  table = null;
  dock = null;
  polygon = null;
  constructor() {
    const root = document.createElement("div");
    root.classList.add("battlefield");

    const table = document.createElement("table");
    table.classList.add("battlefield-table");

    const dock = document.createElement("div");
    dock.classList.add("battlefield-dock");

    const polygon = document.createElement("div");
    polygon.classList.add("battlefield-polygon");
    // поэлементно в  this.root = root, this.table = table  и т.д.
    Object.assign(this, { root, table, dock, polygon });
  }
}
