const app = new Application({
	preparation: PreparationScene,
	computer: ComputerScene,
});

app.start("preparation");

document.querySelector('[data-action="randomize"]').click();
document.querySelector('[data-computer="middle"]').disabled = false;
document.querySelector('[data-computer="middle"]').click();

//30-04