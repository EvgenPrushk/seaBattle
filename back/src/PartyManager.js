const Player = require("./Player");
const Party = require("./Party");
const Ship = require("./Ship");
module.exports = class PartyManager {
  players = [];
  parties = [];
  // collection for add and remove players
  waitingRandom = [];

  connection(socket) {
    //TODO: identify one user
    const player = new Player(socket);
    //add player in players
    this.players.push(player);

    socket.on("shipSet", (ships) => {
      if (this.waitingRandom.includes(player)) {
        return;
      }

      if (player.party) {
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
      if (this.waitingRandom.includes(player)) {
        return;
      }

      if (player.party) {
        return;
      }
      // add player in party
      this.waitingRandom.push(player);
      player.emit("statusChange", "randomFinding");

      if (this.waitingRandom.length >= 2) {
        const [player1, player2] = this.waitingRandom.splice(0, 2);
        const party = new Party(player1, player2);
        // add party in parties
        this.parties.push(party);

        const  unsubscribe = party.subscribe(() =>{
          unsubscribe();

          this.removeParty(party)
        });
      }
    });
  }
  disconnect(socket) {}

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

  removeAllPlayers(player) {
    // add copy all players
    const players = this.players.slice();
    // delete all players
    for (const player of players) {
      this.removePlayer(player);
    }

    return this.players.length;
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
      this.removePlayer(party);
    }

    return this.parties.length;
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
