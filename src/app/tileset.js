export default class Tileset {
  constructor(image, tileWidth, tileHeight, tilesInImgRow, ctx) {
    this.image = new Image();
    this.image.src = image;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.tilesInImgRow = tilesInImgRow;

    this.image.onload = function () {
      ctx.imageSmoothingEnabled = false;
    }
  }
}
