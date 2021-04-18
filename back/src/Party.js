const Battlefield = require("./Battlefield");

module.exports = class Party {
  player1 = null;
  player2 = null;

  battlefield1 = new Battlefield();
  battlefield2 = new Battlefield();
};
