const keyMap = {
  'a': 0,
  'b': 8,
  'c': 16,
  'd': 24,
  'e': 32,
  'f': 40,
  'g': 48,
  'h': 56,
  'i': 64,
  'j': 72,
  'k': 80,
  'l': 88,
  'm': 96,
  'n': 104,
  'o': 112,
  'p': 120,
  'q': 128,
  'r': 136,
  's': 144,
  't': 152,
  'u': 160,
  'v': 168,
  'w': 176,
  'x': 184,
  'y': 192,
  'z': 200,
  '0': 208,
  '1': 216,
  '2': 224,
  '3': 232,
  '4': 240,
  '5': 248,
  '6': 256,
  '7': 264,
  '8': 272,
  '9': 280,
  '.': 288,
  '!': 296,
  ' ': 304,
  ':': 312
}

export var textGenFull = function (ctx, text, canvas, image) {
  var sentence = text.split('*').length;
  var arr = text.split('');
  var row = 0;
  var col = 0;

  ctx.globalAlpha = 0.55;
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, 0, canvas.w, canvas.h);
  ctx.globalAlpha = 1.0;

  arr.forEach(element => {
    if (element === '*') {
      row += 16;
      col = 0;
    } else {
      ctx.drawImage(
        image,
        keyMap[element.toLowerCase()],
        0,
        8,
        8,
        26 + col * 16,
        row + (canvas.h / 2) - ((sentence * 16) / 2),
        16,
        16);
      col++;
    }
  });
}

export var textGenPart = function (ctx, text, canvas, image, position = 'bottom') {
  var blendY = position === 'bottom' ? canvas.h - canvas.h / 5 : 0;
  var posY = position === 'bottom' ? canvas.h - canvas.h / 8 : canvas.h / 12;
  var arr = text.split('');

  ctx.globalAlpha = 0.55;
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(0, blendY, canvas.w, canvas.h / 5);
  ctx.globalAlpha = 1.0;

  arr.forEach((element, index) => {
    ctx.drawImage(
      image,
      keyMap[element.toLowerCase()],
      0,
      8,
      8,
      (canvas.w / 2) - ((arr.length * 16) / 2) + index * 16,
      posY,
      16,
      16);
  });
}

export var timerTextGen = function (ctx, time, canvas, image) {
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = '#1a2332';
  ctx.fillRect(canvas.w - canvas.w / 3, 0, canvas.w, canvas.h / 8);
  ctx.globalAlpha = 1.0;

  var arr = time.split('');

  arr.forEach((element, index) => {
    ctx.drawImage(
      image,
      keyMap[element.toLowerCase()],
      0,
      8,
      8,
      (canvas.w - canvas.w / 3.1) + index * 16,
      8,
      16,
      16);
  });
}
