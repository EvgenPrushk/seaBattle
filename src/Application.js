class Application {
  mouse = null;
  player = null;
  opponent = null;

  scenes = {};
  activeScene = null;

  constructor(scenes = {}) {
    const mouse = new Mouse(document.body);
    const player = new BattlefieldView();
    const opponent = new BattlefieldView();

    Object.assign(this, { mouse, player, opponent });
    // монтирование игровых полей
    document.querySelector('[data-side="player"]').append(player.root);
    document.querySelector('[data-side="opponent"]').append(opponent.root);

    // Object.entries(scenes) - превращаем объект в формат entries
    // для работы с данными, как с массивом
    //[sceneName, sceneClass] -диструктуризация и записываю их в sceneName и sceneClass
    for (const [sceneName, sceneClass] of Object.entries(scenes)) {
      //  генерируем сцены передавая имя и ссылку на текущее приложение
      this.scenes[sceneName] = new sceneClass(sceneName, this);
    }
    // Object.value(this.scenes) создаем массив значений этих scene
    for (const scene of Object.values(this.scenes)) {
      scene.init();
    }

    requestAnimationFrame(() => this.tick());
  }
  // обнавление экрана
  tick() {
    requestAnimationFrame(() => this.tick);
    // если есть активная сцена, то мы вызываем функцию update()
    if (this.activeScene) {
      this.activeScene.update();
    }
    this.mouse.tick();
  }
  // вызов сцены
  start(sceneName) {
    if (this.activeScene && this.activeScene.name === sceneName) {
      return false;
    }
    // если у нас  такая сцена
    if (!this.scenes.hasOwnProperty(sceneName)) {
      return false;
    }

    // если есть активная сцена, то мы ее останавливаем
    if (this.activeScene) {
      this.activeScene.stop();
    }
    // берем и запускаем новую сцену
    const scene = this.scenes[sceneName];
    this.activeScene = scene;
    scene.start();

    return true;
  }
}
