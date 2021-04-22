const Observer = require("./Observer");
const Shot = require("./Shot");
class Party extends Observer {
  player1 = null;
  player2 = null;

  turnPlayer = null;
  play = true;

  get nextPlayer() {
    return this.turnPlayer === this.player1 ? this.player2 : this.player1;
  }

  constructor(player1, player2) {
    super();

    Object.assign(this, { player1, player2 });
    this.turnPlayer = player1;

    for (const player of [player1, player2]) {
      player.party = this;
      player.emit("statusChange", "play");

      player.on("addShot", (x, y) => {
        if (this.turnPlayer !== player || !this.play) {
          return;
        }
        const shot = new Shot(x, y);
        const result = this.nextPlayer.battlefield.addShot(shot);

        if (result) {
          const Player1Shots = player1.battlefield.shots.map((shot) => ({
            x: shot.x,
            y: shot.y,
            variant: shot.variant,
          }));

          const Player2Shots = player2.battlefield.shots.map((shot) => ({
            x: shot.x,
            y: shot.y,
            variant: shot.variant,
          }));

          player1.emit("setShots", Player1Shots, Player2Shots);
          player2.emit("setShots", Player2Shots, Player1Shots);

          if (shot.variant === "miss") {
            this.turnPlayer = this.nextPlayer;
            this.turnUpdate();
          }
        }
        if (player1.battlefield.loser || player2.battlefield.loser) {
          this.stop();

          player1.emit(
            "statusChange",
            player1.battlefield.loser ? "loser" : "winner"
          );
          player2.emit(
            "statusChange",
            player2.battlefield.loser ? "loser" : "winner"
          );
        }
      });
    }

    this.turnUpdate();
  }

  turnUpdate() {
    this.player1.emit("turnUpdate", this.player1 === this.turnPlayer);
    this.player2.emit("turnUpdate", this.player2 === this.turnPlayer);
  }

  stop() {
    if (!this.play) {
      return;
    }
    this.play = false;
    this.dispatch();

    this.player1.party = null;
    this.player2.party = null;

    this.player1 = null;
    this.player2 = null;
  }
  gaveup(player) {
    const { player1, player2 } = this;
    player1.emit("statusChange", player1 === player ? "loser" : "winner");
    player2.emit("statusChange", player2 === player ? "loser" : "winner");
    
    this.stop();
  }
}

module.exports = Party;

//02-21-43
