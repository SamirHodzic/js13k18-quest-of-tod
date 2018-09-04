export function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

export function overlap(x1, y1, w1, h1, x2, y2, w2, h2) {
  return !(((x1 + w1 - 1) < x2) || ((x2 + w2 - 1) < x1) || ((y1 + h1 - 1) < y2) || ((y2 + h2 - 1) < y1));
}

export function tweenElement(frame, duration) {
  var half = duration / 2;
  var pulse = frame % duration;
  return pulse < half ? (pulse / half) : 1 - (pulse - half) / half;
}

export function cellAvailable(tiles, x, y) {
  return tiles[Math.floor(x / 32) + (Math.floor(y / 32) * 48)];
}

export function isMobile() {
  return 'ontouchstart' in document.documentElement;
}

export function setMobileSize(canvas) {
  var controlsBlock = document.getElementById('mobile-control');
  var orientationBlock = document.getElementById('orientation');
  var sizeY = screen.height * window.devicePixelRatio - canvas.offsetHeight

  controlsBlock.setAttribute('style', `display: flex; height: ${sizeY/4}px`);
  canvas.setAttribute('style', `width: 99.5vmin; height: 99.5vmin; bottom: ${sizeY/4}px;`);

  window.addEventListener('orientationchange', function () {
    if (window.orientation !== 0) {
      orientationBlock.setAttribute('style', 'display: flex;');
    } else {
      orientationBlock.setAttribute('style', 'display: none;');
    }
  });
}
