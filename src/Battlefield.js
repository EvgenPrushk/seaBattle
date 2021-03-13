class Battlefield {
  ships = [];
  shots = [];

  addShip(ship) {
    // если корабль существет, то мы его не добавляем
    if (this.ships.includes(ship)) {
      return false;
    }
    // иначе мы его дабавляем
    this.ships.push(ship);
    return true;
  }

  removeShip(ship) {
    // если корабль нет, то мы его не можем удалить
    if (!this.ships.includes(ship)) {
      return false;
    }
    const index = this.ships.indexOf(ship);
    this.ships.splice(index, 1);
    return true;
  }

  removeAllShip() {
    // создаем копию массива всех кораблей
    const ships = this.ships.slice();

    for (const ship of ships) {
      //убираем корабль с поля
      this.removeShip(ship);
    }
    // получаем их колличество
    return ships.length;
  }

  addShot() {}
  removeShot() {}
  removeAllShots() {
    // создаем копию массива всех выстрелов
    const shots = this.shots.slice();
    for (const shot of shots) {
      //убираем выстрелы
      this.removeShip(shot);
    }
    // получаем их колличество
    return shots.length;
  }
}
