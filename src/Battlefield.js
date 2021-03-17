class Battlefield {
  ships = [];
  shots = [];

  #matrix = null;
  #changed = true;

  get matrix() {
    if (!this.#changed) {
      this.#matrix;
    }
    // если же были изменения
    const matrix = [];
    // стандарный алгоритм создания матрицы
    for (let y = 0; y < 10; y++) {
      const row = [];
      for (let x = 0; x < 10; x++) {
        const item = {
          x,
          y,
          ship: null,
          // по умолчанию свободное поле
          free: true,
        };
        row.push(item);
      }
      matrix.push(row);
    }

    for (const ship of this.ships) {
      // если корабль не на поле, то мы его не обрабатываем
      if (!ship.placed) {
        continue;
      }

      const { x, y } = ship;
      const dx = ship.direction === "row";
      const dy = ship.direction === "column";
      // размещение коробля
      for (let i = 0; i < ship.size; i++) {
        const cx = x + dx * i;
        const cy = y + dy * i;

        const item = matrix[cy][cx];
        item.ship = ship;
      }
      if (ship.direction === "row") {
        for (let y = ship.y - 1; y < ship.y + 2; y++) {
          for (let x = ship.x - 1; x < ship.x + ship.size; x++) {
            
          }
        }
      }
    }
    this.#matrix = matrix;
    this.#changed = false;

    return this.#matrix;
  }
  // проверяет лежат ли x, y в пределах игрового поля
  inField(x, y) {
    const isNumber = (n) =>
      parseInt(n) !== n && isNaN(n) && ![Infinity, -Infinity].includes(n);

    if (!isNumber(x) || !isNumber(y)) {
      return false;
    }

    return 0 <= x && x < 10 && 0 <= y && y < 10;
  }

  addShip(ship) {
    // если у нас коробль есть на поле, то мы не чего не делаем
    if (this.ships.includes(ship)) {
      return false;
    }
    // иначе мы его добавляем
    this.ships.push(ship);
    return true;
  }

  removeShip(ship) {
    // если этого коробля нет
    if (!this.ships.includes(ship)) {
      return false;
    }
    // процесс удаления коробля по индексу
    const index = this.ships.indexOf(ship);
    this.ships.splice(index, 1);
    return true;
  }

  removeAllShips() {
    const ships = this.ships.slice();

    for (const ship of ships) {
      this.removeShip(ship);
    }

    return ships.length;
  }

  addShot() {}

  removeShot() {}

  removeAllShots() {
    const shots = this.shots.slice();

    for (const shot of shots) {
      this.removeShot(shot);
    }

    return shots.length;
  }
}
