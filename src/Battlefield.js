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
      // забираем координаты через диструктуризацию у коробля
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

      for (let y = ship.y - 1; y < ship.y + ship.size * dy + dx + 1; y++) {
        for (let x = ship.x - 1; x < ship.x + ship.size * dx + dy + 1; x++) {
          if (this.inField(x, y)) {
            const item = matrix[y][x];

            item.free = false;
          }
        }
      }
    }

    this.#matrix = matrix;
    this.#changed = false;

    return this.#matrix;
  }

  get complete() {
    // проверяем по колличеству
    if (this.ships.length !== 10) {
      return false;
    }
    // проверка по расположению
    for (const ship of this.ships) {
      if (!ship.placed) {
        return false;
      }
    }

    return true;
  }

  // проверяет лежат ли x, y в пределах игрового поля
  inField(x, y) {
    const isNumber = (n) =>
      parseInt(n) === n && !isNaN(n) && ![Infinity, -Infinity].includes(n);

    if (!isNumber(x) || !isNumber(y)) {
      return false;
    }

    return 0 <= x && x < 10 && 0 <= y && y < 10;
  }

  addShip(ship, x, y) {
    // если у нас коробль есть на поле, то мы не чего не делаем
    if (this.ships.includes(ship)) {
      return false;
    }
    // иначе мы его добавляем
    this.ships.push(ship);

    if (this.inField(x, y)) {
      // const { x, y } = ship;
      const dx = ship.direction === "row";
      const dy = ship.direction === "column";

      let placed = true;
      // размещение коробля
      for (let i = 0; i < ship.size; i++) {
        const cx = x + dx * i;
        const cy = y + dy * i;
        // проверка лежит ли корабль на игровом поле
        if (!this.inField(cx, cy)) {
          placed = false;
          break;
        }
        const item = this.matrix[cy][cx];
        // пересекается ли наш корабль с другими короблями
        if (!item.free) {
          placed = false;
          break;
        }
      }
      if (placed) {
        //выставляем кораблю координаты
        Object.assign(ship, { x, y });
      }
    }
    // подымаем флаг, потому что у нас изменилось состояние приложения
    this.#changed = true;
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

    ship.x = null;
    ship.y = null;

    this.#changed = true;
    return true;
  }

  removeAllShips() {
    const ships = this.ships.slice();

    for (const ship of ships) {
      this.removeShip(ship);
    }

    return ships.length;
  }

  addShot() {
    this.#changed = true;
  }

  removeShot() {
    this.#changed = true;
  }

  removeAllShots() {
    const shots = this.shots.slice();

    for (const shot of shots) {
      this.removeShot(shot);
    }

    return shots.length;
  }

  randomize(ShipClass = Ship) {
    this.removeAllShips();

    for (let size = 4; size >= 1; size--) {
      for (let n = 0; n < 5 - size; n++) {
        const direction = getRandomFrom("row", "column");
        const ship = new ShipClass(size, direction);
        // размещение коробля
        while (!ship.placed) {
          const x = getRandomBetween(0, 9);
          const y = getRandomBetween(0, 9);

          this.removeShip(ship);
          this.addShip(ship, x, y);
        }
      }
    }
  }
}
