class OnlineScene extends Scene {
  status = "";
  init() {
    const { socket } = this.app;
    socket.addEventListener("status", (status) => console.log(status));
  }
  start(variant) {
    const { socket } = this.app;
    socket.emit("findRandomOpponent");
  }
}
