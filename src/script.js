const app = new Application({
  // в приложении существовала сцена которая является
  // экземплятор класса PreparationScene
  preparation: PreparationScene,
});

app.start("preparation");
console.log(app);
