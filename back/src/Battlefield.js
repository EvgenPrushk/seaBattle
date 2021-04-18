module.exports =  class Battlefield {
  ships = [];
  shots = [];

  _private_matrix = null;
  _private_changed = true;

  get loser () {
    for (const ship of this.ships) {
      if (!ship.killed) {
        return false;
      }
    }

    return true;
  }

  get matrix() {
    if (!this._private_changed) {
      this._private_matrix;
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
          wounded: false,
          shoted: false,
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

    for (const { x, y } of this.shots) {
      const item = matrix[y][x];
      // делаем ячейку с выстрелом
      matrix[y][x].shoted = true;
      // если в ячейке находиться корабль, то делаем ее раненной
      if (item.ship) {
        matrix[y][x].wounded = true;
      }
    }

    this._private_matrix = matrix;
    this._private_changed = false;

    return this._private_matrix;
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
    this._private_changed = true;
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

    this._private_changed = true;
    return true;
  }

  removeAllShips() {
    const ships = this.ships.slice();

    for (const ship of ships) {
      this.removeShip(ship);
    }

    return ships.length;
  }
  // метод отвечает за выстрелы
  addShot(shot) {
    // проверяем был ли такой выстрео
    for (const { x, y } of this.shots) {
      if (x === shot.x && y === shot.y) {
        return false;
      }
    }
    // добавляем выстрел в общий стек всех выстрелов
    this.shots.push(shot);

    // фиксируем измение в экземпляре
    this._private_changed = true;
    // берем матрицу и учитываем выстрел
    const matrix = this.matrix;
    // достаем коодинаты выстрела
    const { x, y } = shot;
    // если мы попали
    if (matrix[y][x].ship) {
      shot.setVariant("wounded");

      // проверяем, что карабль по которому мы стреля не убит
      const { ship } = matrix[y][x];
      const dx = ship.direction === "row";
      const dy = ship.direction === "column";

      let killed = true;

      for (let i = 0; i < ship.size; i++) {
        const cx = ship.x + dx * i;
        const cy = ship.y + dy * i;
        const item = matrix[cy][cx];
        // если есть не раненные палубы, то корабль жив
        if (!item.wounded) {
          killed = false;
          break;
        }
      }
      // если все палубы ранены, то карабль убит
      if (killed) {
        ship.killed = true;
        for (let i = 0; i < ship.size; i++) {
          const cx = ship.x + dx * i;
          const cy = ship.y + dy * i;          
         
          const shot = this.shots.find(shot => shot.x === cx && shot.y === cy);

          shot.setVariant("killed");
        }

      }
    }

    this._private_changed = true;
    return true;
  }

  removeShot(shot) {
    // проверка, если ли выстрел
    if (!this.shots.includes(shot)) {
      return false;
    }

    // находимим индекс выстрела
    const index = this.shots.indexOf(shot);
    this.shots.splice(index, 1);
    this._private_changed = true;
    return true;
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

  clear() {
    this.removeAllShots();
    this.removeAllShips();
  }
}
