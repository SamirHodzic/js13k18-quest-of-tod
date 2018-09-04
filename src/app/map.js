export default class Map {
  constructor(data, tileset) {
    this.data = data;
    this.tileset = tileset;
    this.width = 48;
    this.height = 40;
    this.rowTileCount = 40;
    this.colTileCount = 48;
  }
}
