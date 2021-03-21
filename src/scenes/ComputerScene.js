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
    const cell = cells.find((cell) => isUnderPoint(mouse, cell));

    cells.forEach((cell) => cell.classList.remove("battlefield-item__active"));

    if (isUnderPoint(mouse, opponent.table)) {
      cell.classList.add("battlefield-item__active");
    }
  }
}
