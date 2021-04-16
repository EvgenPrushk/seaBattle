class OnlineScene extends Scene {
  // status = "";
  // init() {
  //   const { socket } = this.app;
  //   socket.on("status", (status) => (this.status = status));
  // }

  start(variant) {
    const { socket } = this.app;
    socket.emit("findRandomOpponent");
    console.log("variant");
  }
}
