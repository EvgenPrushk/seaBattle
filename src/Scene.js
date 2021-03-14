class Scene {
	name = null;
	app = null;

	constructor(name, app) {
		// диструктуризация
		Object.assign(this, { name, app });
	}

	init() {}

	start() {}

	update() {}

	stop() {}
}