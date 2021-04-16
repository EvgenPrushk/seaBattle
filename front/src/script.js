const app = new Application({
  preparation: PreparationScene,
  computer: ComputerScene,
  online: OnlineScene,
});

app.start("preparation");


document.querySelector('[data-action="randomize"]').click();
// document.querySelector('[data-computer="hard"]').disabled = true;
// document.querySelector('[data-computer="hard"]').click();
