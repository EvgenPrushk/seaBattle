class OnlineScene extends Scene {
  actionsBar = null;
  status = "";
  init() {
    const actionsBar = document.querySelector('[data-scene="online"]');
    this.actionsBar = actionsBar;

    const { socket } = this.app;

    socket.on("status", (status) => {
      this.status = status;
      this.statusUpdate();
    });

    this.statusUpdate();
  }

  start(variant) {
    const { socket } = this.app;
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
      StatusDiv.textContent = '';
    } else if (this.status = 'randomFinding') {
      StatusDiv.textContent = 'Поиск случайного игрока';
    }
  }
}
