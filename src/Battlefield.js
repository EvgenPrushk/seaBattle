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

      if (ship.direction === "row") {
        const { x, y } = ship;

        for (let i = 0; i < ship.size; i++) {
          //   const cx = x + i;
          //   const cy = y + i;

          //   if (this.inField(cx, cy)) {
          const item = matrix[y][x + i];
          item.ship = ship;
          //   }
        }
      } else {
        for (let i = 0; i < ship.size; i++) {
          const item = matrix[y + i][x];
          item.ship = ship;
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
