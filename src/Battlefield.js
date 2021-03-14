class Battlefield {
	ships = [];
	shots = [];

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