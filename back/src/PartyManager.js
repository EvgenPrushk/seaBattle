const Player = require("./Player");
const Party = require("./Party");
const Ship = require("./Ship");
const { getRandomString } = require("./additional");

module.exports = class PartyManager {
  players = [];
  parties = [];
  // collection for add and remove players
  waitingRandom = [];
  waitingChallenge = new Map();

  connection(socket) {
    //TODO: identify one user
    const sessionId = socket.request.sessionID;
    let player = this.players.find((player) => player.sessionID === sessionId);

    // if player have => recconnection
    if (player) {
      player.socket.emit("doubleConnection");
      player.socket.disconnect();
      player.socket = socket;
    } else {
      player = new Player(socket, sessionId);
      //add player in players
      this.players.push(player);
    }

    const isFree = () => {
      if (this.waitingRandom.includes(player)) {
        return false;
      }
      const values = Array.from(this.waitingChallenge.values());
      if (values.includes(player)) {
        return false;
      }

      if (player.party) {
        return false;
      }

      return true;
    };

    socket.on("shipSet", (ships) => {
      if (!isFree()) {
        return;
      }

      // checking ship placement
      player.battlefield.clear();
      // ship  use {size, direction}
      for (const { size, direction, x, y } of ships) {
        const ship = new Ship(size, direction);
        player.battlefield.addShip(ship, x, y);
      }
    });
    socket.on("findRandomOpponent", () => {
      if (!isFree()) {
        return;
      }

      this.waitingRandom.push(player);
      player.emit("statusChange", "randomFinding");

      if (this.waitingRandom.length >= 2) {
        const [player1, player2] = this.waitingRandom.splice(0, 2);
        const party = new Party(player1, player2);
        this.parties.push(party);

        const unsubcribe = party.subscribe(() => {
          this.removeParty(party);
          unsubcribe();
        });
      }
    });

    socket.on("challengeOpponent", (key = "") => {
      if (!isFree()) {
        return;
      }

      if (this.waitingChallenge.has(key)) {
        const opponent = this.waitingChallenge.get(key);
        this.waitingChallenge.delete(key);

        const party = new Party(opponent, player);
        this.parties.push(party);
      } else {
        key = getRandomString(20);
        socket.emit("challengeOpponent", key);
        socket.emit("statusChange", "waiting");

        this.waitingChallenge.set(key, player);
      }
    });

    socket.on("gaveup", () => {
      if (player.party) {
        player.party.gaveup(player);
      }

      if (this.waitingRandom.includes(player)) {
        // delete player
        const index = this.waitingRandom.indexOf(player);
        this.waitingRandom.splice(index, 1);
      }

      const values = Array.from(this.waitingChallenge.values());
      if (values.includes(player)) {
        const index = values.indexOf(player);
        const keys = Array.from(this.waitingChallenge.keys());
        const key = keys[index];
        this.waitingChallenge.delete(key);
      }
    });

    socket.on("addShot", (x, y) => {
      if (player.party) {
        player.party.addShot(player, x, y);
      }
    });

    socket.on("message", (message) => {
      console.log(message);
      if (player.party) {
        player.party.sendMessage(message);
      }
    });
  }

  disconnect(socket) {
    // find player
    const player = this.players.find((player) => player.socket === socket);
    if (!player) {
      return;
    }

    if (player.party) {
      player.party.gaveup(player);
    }

    if (this.waitingRandom.includes(player)) {
      // delete player
      const index = this.waitingRandom.indexOf(player);
      this.waitingRandom.splice(index, 1);
    }

    const values = Array.from(this.waitingChallenge.values());
    if (values.includes(player)) {
      const index = values.indexOf(player);
      const keys = Array.from(this.waitingChallenge.keys());
      const key = keys[index];
      this.waitingChallenge.delete(key);
    }
  }

  addPlayer(player) {
    if (this.players.includes(player)) {
      return false;
    }

    this.players.push(player);
    return true;
  }

  removePlayer(player) {
    if (!this.players.includes(player)) {
      return false;
    }

    const index = this.players.indexOf(player);
    //deleting a player by index
    this.players.splice(index, 1);

    if (this.waitingRandom.includes(player)) {
      const index = this.waitingRandom.indexOf(player);

      this.waitingRandom.splice(index, 1);
    }

    return true;
  }

  removeAllPlayers() {
    // add copy all players
    const players = this.players.slice();
    // delete all players
    for (const player of players) {
      this.removePlayer(player);
    }

    return players.length;
  }

  addParty(party) {
    if (this.parties.includes(party)) {
      return false;
    }

    this.parties.push(party);
    return true;
  }

  removeParty(party) {
    if (!this.parties.includes(party)) {
      return false;
    }
    //take the index from the party
    const index = this.parties.indexOf(party);
    //deleting a party by index
    this.parties.splice(index, 1);
    return true;
  }

  removeAllParties(party) {
    // add copy all party
    const parties = this.parties.slice();
    // delete all parties
    for (const party of parties) {
      this.removeParty(party);
    }

    return parties.length;
  }

  playRandom(player) {
    if (this.waitingRandom.includes(player)) {
      return false;
    }

    this.waitingRandom.push(player);

    if (this.waitingRandom.length >= 2) {
      const [player1, player2] = this.waitingRandom.splice(0, 2);
      const party = new Party(player1, player2);
      this.addParty(party);
    }
    return true;
  }
};
