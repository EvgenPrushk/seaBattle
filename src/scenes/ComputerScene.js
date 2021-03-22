class ComputerScene extends Scene {
  start() {
    document
      .querySelectorAll(".app-actions")
      .forEach((element) => element.classList.add("hidden"));

    document
      .querySelector('[data-scene="computer"]')
      .classList.remove("hidden");
  }

  update() {
    // забираем с помощью диструктуризации  данные
    const { mouse, opponent, player } = this.app;
    // т.к cells - это матрица, то мы ее схлопываем 1 уровень вложенности за счет
    // flat()
    const cells = opponent.cells.flat();
    cells.forEach((cell) => cell.classList.remove("battlefield-item__active"));

    if (isUnderPoint(mouse, opponent.table)) {
      const cell = cells.find((cell) => isUnderPoint(mouse, cell));

      if (cell) {
        cell.classList.add("battlefield-item__active");
        // мы тоговы сделать выстрел
        if (mouse.left && !mouse.pLeft) {
          // достаем координаты ячейки по которой мы готовы сделать выстрел
          const x = parseInt(cell.dataset.x);
          const y = parseInt(cell.dataset.y);

          const shot = new ShotView(x, y);
          opponent.addShot(shot);
        }
      }
    }
  }
}
