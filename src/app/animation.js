import {
	timestamp
} from './helpers';

export default class Animation {
	constructor(tileset, frames, frameDuration) {
		this.tileset = tileset;
		this.frames = frames;
		this.currentFrame = 0;
		this.frameTimer = timestamp();
		this.frameDuration = frameDuration;
	}
}
