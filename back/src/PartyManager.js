module.exports =  class PartyManager {
  players = [];
  parties = [];

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
}
