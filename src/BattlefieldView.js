class BattlefieldView extends Battlefield {
  root = null;
  table = null;
  dock = null;
  polygon = null;

  cells = [];
  constructor() {
    super();

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
    // позволяет установить его дочерние элементы
    root.append(table, dock, polygon);

    for (let y = 0; y < 10; y++) {
      const row = [];
      const tr = document.createElement("tr");
      tr.classList.add("battlefield-row");
      tr.dataset.y = y;

      for (let x = 0; x < 10; x++) {
        const td = document.createElement("td");
        td.classList.add("battlefield-item");
        Object.assign(td.dataset, { x, y });
        tr.append(td);
        row.push(td);
      }
      table.append(tr);
      this.cells.push(row);
    }

    //создаем маркеры
    for (let x = 0; x < 10; x++) {
      // берем первые 10 ячеек по х
      const cell = this.cells[0][x];
      const marker = document.createElement("div");

      marker.classList.add("marker", "marker-column");
      // делаем размещение букв по х
      marker.textContent = "АБВГДЕЖЗИК"[x];
      cell.append(marker);
    }

    for (let y = 0; y < 10; y++) {
      const cell = this.cells[y][0];
      const marker = document.createElement("div");

      marker.classList.add("marker", "marker-row");
      // делаем размещение цифр по y
      marker.textContent = y + 1;
      cell.append(marker);
    }
  }
  // пример возможностей ООП - расширение класса
  addShip(ship) {
    if (!super.addShip(ship)) {
      return false;
    }

    this.dock.append(ship.div);
    return true;
  }
}
