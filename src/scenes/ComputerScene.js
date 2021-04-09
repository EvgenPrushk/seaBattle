class ComputerScene extends Scene {
  untouchables = [];
  playerTurn = true;
  status = null;

  init() {
    this.status = document.querySelector(".battlefield-status");
  }

  start(untouchables) {
    const { opponent } = this.app;
    document
      .querySelectorAll(".app-actions")
      .forEach((element) => element.classList.add("hidden"));

    document
      .querySelector('[data-scene="computer"]')
      .classList.remove("hidden");

    opponent.clear();
    opponent.randomize(ShipView);

    this.untouchables = untouchables;
  }

  update() {
    // забираем с помощью диструктуризации  данные
    const { mouse, opponent, player } = this.app;
    // т.к cells - это матрица, то мы ее схлопываем 1 уровень вложенности за счет
    // flat()

    const isEnd = opponent.loser || player.loser;

    if (isEnd) {
      if (opponent.loser) {
        this.status.textContent = "Вы выиграли";
      } else {
        this.status.textContent = "Компьютер выиграл";
      }

      return;
    }
    const cells = opponent.cells.flat();
    cells.forEach((cell) => cell.classList.remove("battlefield-item__active"));

    if (isUnderPoint(mouse, opponent.table)) {
      const cell = cells.find((cell) => isUnderPoint(mouse, cell));

      if (cell) {
        cell.classList.add("battlefield-item__active");
        // мы тоговы сделать выстрел
        if (this.playerTurn && mouse.left && !mouse.pLeft) {
          // достаем координаты ячейки по которой мы готовы сделать выстрел
          const x = parseInt(cell.dataset.x);
          const y = parseInt(cell.dataset.y);

          const shot = new ShotView(x, y);
          const result = opponent.addShot(shot);

          if (result) {
            this.playerTurn = shot.variant === "miss" ? false : true;
          }
        }
      }
    }

    if (!this.playerTurn) {
      const x = getRandomBetween(0, 9);
      const y = getRandomBetween(0, 9);

      let untouchables = false;

      for (const item of this.untouchables) {
        // если мы хотим сделать выстрел в клетку из массива
        // untouchables, то сы туда стрелять не будем
        if (item.x === x && item.y === y) {
          untouchables = true;
          break;
        }
      }

      // показываем выстрел на экране
      if (!untouchables) {
        const shot = new ShotView(x, y);
        const result = player.addShot(shot);

        if (result) {
          this.playerTurn = shot.variant === "miss" ? true : false;
        }
      }
    }

    if (this.playerTurn) {
      this.status.textContent = "Ващ ход";
    } else {
      this.status.textContent = "Ход компьютера";
    }
  }
}
