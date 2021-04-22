class OnlineScene extends Scene {
  actionsBar = null;
  status = "";
  ownTurn = false;

  removeEventListeners = [];

  init() {
    const actionsBar = document.querySelector('[data-scene="online"]');
    this.actionsBar = actionsBar;

    const { socket, player, opponent } = this.app;

    socket.on("statusChange", (status) => {
      console.log("statusChange", status);
      this.status = status;
      this.statusUpdate();
    });

    socket.on("turnUpdate", (ownTurn) => {
      console.log("turnUpdate", ownTurn);
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
    });

    socket.on("setShots", (ownShots, opponentShots) => {
      player.removeAllShots();
      // add shot player
      for (const { x, y, variant } of ownShots) {
        const shot = new ShotView(x, y, variant);
        player.addShot(shot);
      }
      // add shot opponent
      opponent.removeAllShots();
      for (const { x, y, variant } of opponentShots) {
        const shot = new ShotView(x, y, variant);
        opponent.addShot(shot);
      }
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

    const scneneActionsBar = document.querySelector('[data-scene="online"]');
    scneneActionsBar.classList.remove("hidden");

    const gaveupButton = scneneActionsBar.querySelector(
      '[data-action="gaveup"]'
    );
    const againButton = scneneActionsBar.querySelector('[data-action="again"]');

    againButton.classList.add("hidden");
    gaveupButton.classList.remove("hidden");

    this.removeEventListeners = [];

    this.removeEventListeners.push(
      addListener(againButton, "click", () => {
        this.app.start("preparation");
      })
    );
    this.removeEventListeners.push(
      addListener(gaveupButton, "click", () => {
        socket.emit("gaveup");
        this.app.start("preparation");
      })
    );

    this.statusUpdate();
  }

  stop() {
    for (const removeEventListener of this.removeEventListeners) {
      removeEventListener();
    }
  }

  statusUpdate() {
    const StatusDiv = this.actionsBar.querySelector(".battlefield-status");

    if (!this.status) {
      StatusDiv.textContent = "";
    } else if (this.status === "randomFinding") {
      StatusDiv.textContent = "Поиск случайного игрока";
    } else if (this.status === "play") {
      StatusDiv.textContent = this.ownTurn ? "You turn" : "opponent is turn";
    } else if (this.status === "winner") {
      StatusDiv.textContent = "You win";
    } else if (this.status === "loser") {
      StatusDiv.textContent = "You lose";
    }
  }

  update() {
    const { mouse, opponent, player, socket } = this.app;
    // get all the cells
    const cells = opponent.cells.flat();
    cells.forEach((x) => x.classList.remove("battlefield-item__active"));

    if (player.loser) {
      return;
    }
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
