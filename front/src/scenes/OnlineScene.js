class OnlineScene extends Scene {
  actionsBar = null;
  status = "";
  ownTurn = false;

  init() {
    const actionsBar = document.querySelector('[data-scene="online"]');
    this.actionsBar = actionsBar;

    const { socket } = this.app;

    socket.on("status", (status) => {
      this.status = status;
      this.statusUpdate();
    });

    socket.on("PartyStart", (ownTurn) => {
      this.ownTurn = ownTurn;
      this.status = "play";
      this.statusUpdate();
    });

    this.statusUpdate();
  }

  start(variant) {
    const { socket, player } = this.app;

    socket.emit(
      "shipSet",
      player.ships.map((ship) => ({
        size: ship.size,
        direction: ship.direction,
        x: ship.x,
        y: ship.y,
      }))
    );
    socket.emit("findRandomOpponent");
    console.log("variant");

    document
      .querySelectorAll(".app-actions")
      .forEach((element) => element.classList.add("hidden"));

    document.querySelector('[data-scene="online"]').classList.remove("hidden");
    this.statusUpdate();
  }

  statusUpdate() {
    const StatusDiv = this.actionsBar.querySelector(".battlefield-status");

    if (!this.status) {
      StatusDiv.textContent = "";
    } else if (this.status === "randomFinding") {
      StatusDiv.textContent = "Поиск случайного игрока";
    } else if (this.status === "play") {
      StatusDiv.textContent = this.ownTurn ? "You turn" : "opponent is turn";
    }
  }
}
