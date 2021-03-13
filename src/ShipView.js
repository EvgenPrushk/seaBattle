class ShipView extends Ship {
  div = null;
  // стартовые позиции кораблей до размещения на поле
  startX = null;
  startY = null;

  constructor(size, direction, startX, startY) {
    super(size, direction);

    const div = document.createElement("div");
    div.classList.add("ship");
    this.div = div;
  }
}
