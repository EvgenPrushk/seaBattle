const Battlefield = require("./Battlefield");
const Shot = require("./Shot");

module.exports = class Party {
  player1 = null;
  player2 = null;

  turnPlayer = null;

  get nextPlayer() {
    return this.turnPlayer === this.player1 ? this.player2 : this.player1;
  }

  constructor(player1, player2) {
    //
    Object.assign(this, { player1, player2 });
    this.turnPlayer = player1;

    for (const player of [player1, player2]) {
      player.party = this;
      player.emit("statusChange", "play");

      player.on("addShot", (x, y) => {
        if (this.turnPlayer !== player) {
          return;
        }
        const shot = new Shot(x, y);
        const result = this.nextPlayer.battlefield.addShot(shot);

        if (result) {
          player1.emit("addShot", shot);
          player2.emit("addShot", shot);

          if (shot === "miss") {
            this.turnPlayer = this.nextPlayer;
            this.turnUpdate();
          }
        }
      });
    }

    this.turnUpdate();
  }

  turnUpdate() {
    this.player1.emit("turnUpdate", this.player1 === this.turnPlayer);
    this.player2.emit("turnUpdate", this.player2 === this.turnPlayer);
  }
};
