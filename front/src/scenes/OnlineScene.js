class OnlineScene extends Scene {
  actionsBar = null;
  status = "";
  ownTurn = false;

  init() {
    const actionsBar = document.querySelector('[data-scene="online"]');
    this.actionsBar = actionsBar;

    const { socket } = this.app;

    socket.on("statusChange", (status) => {
      this.status = status;
      this.statusUpdate();
    });

    socket.on("turnUpdate", (ownTurn) => {
      this.ownTurn = ownTurn;
      this.statusUpdate();
    });

    socket.on("addShot", ({ x, y, variant }) => {
      const shot = new ShotView(x, y, variant);
      if (this.ownTurn) {
        this.app.opponent.addShot(shot);
      } else {
        this.app.player.addShot(shot);
      }

      socket.on("setShots", (shots) => {
        const battlefield = this.ownTurn ? this.app.player : this.app.opponent;
        battlefield.removeAllShots();

        for (const { x, y, variant } of shots) {
          const shot = new ShotView(x, y, variant);
          battlefield.addShot(shot);
        }
      });
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

  update() {
    const { mouse, opponent, socket } = this.app;
    // get all the cells
    const cells = opponent.cells.flat();
    cells.forEach((x) => x.classList.remove("battlefield-item__active"));

    if (opponent.isUnder(mouse)) {
      const cell = opponent.cells
        .flat()
        .find((cell) => isUnderPoint(mouse, cell));

      if (cell) {
        cell.classList.add("battlefield-item__active");

        if (mouse.left && !mouse.pLeft) {
          const x = parseInt(cell.dataset.x);
          const y = parseInt(cell.dataset.y);
          socket.emit("addShot", x, y);
        }
      }
    }
  }
}
