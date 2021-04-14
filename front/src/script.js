const app = new Application({
  preparation: PreparationScene,
  computer: ComputerScene,
});

app.start("preparation");
const socket = io();

socket.addEventListener("playerCount", (n) => {
  document.querySelector("[data-playersCount]").textContent = n;
  console.log(n);
});
// document.querySelector('[data-action="randomize"]').click();
// document.querySelector('[data-computer="hard"]').disabled = true;
// document.querySelector('[data-computer="hard"]').click();
