export default class Player {
	constructor(stateAnimations, startingState, x, y, width, height, speed) {
		this.stateAnimations = stateAnimations;
		this.currentState = startingState;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = speed;
		this.scrolls = 0;
	}
}
