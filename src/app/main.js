import {
  level,
  menuMap,
  playerSprite,
  mapSprites,
  logo,
  font,
  introText,
  outroText
} from './const';
import {
  timestamp,
  overlap,
  tweenElement,
  cellAvailable,
  isMobile,
  setMobileSize
} from './helpers';
import {
  textGenFull,
  textGenPart,
  timerTextGen
} from './text';

import Animation from './animation';
import Tileset from './tileset';
import Player from './player';
import Map from './map';
import Entity from './entity';
import Timer from './timer';
import Sound from './sound';

var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

canvas.width = 256;
canvas.height = 256;

var spriteTiles = new Tileset(playerSprite, 16, 16, 3, ctx);
var newMapSet = new Tileset(mapSprites, 8, 8, 49, ctx);
var map = new Map(ground, newMapSet);
var logoTile = new Tileset(logo, 16, 16, 3, ctx);
var fontTile = new Tileset(font, 8, 8, 39, ctx);
var soundHandler = new Sound();
var walkSpeed = 100;

var spriteDownAnim = new Animation(spriteTiles, ['1,2', '0,2', '2,2'], walkSpeed);
var spriteLeftAnim = new Animation(spriteTiles, ['0,0', '1,0', '2,0'], walkSpeed);
var spriteRightAnim = new Animation(spriteTiles, ['0,3', '1,3', '2,3'], walkSpeed);
var spriteUpAnim = new Animation(spriteTiles, ['0,1', '1,1', '2,1'], walkSpeed);
var keysDown = {};

var ground = [],
  collision = [],
  objects = {},
  player = {},
  entities = [],
  game = {},
  timer = {};

var introTs = 0,
  introCount = 0,
  outroTs = 0,
  outroCount = 0;

function start() {
  soundHandler.play(100);
  ground = level.layers[0].data;
  collision = Array.from(level.layers[1].data);
  objects = level.layers[2].objects;

  player = new Player({
      'left': spriteLeftAnim,
      'right': spriteRightAnim,
      'down': spriteDownAnim,
      'up': spriteUpAnim,
    },
    'down', 626, 1141, 30, 30, walkSpeed);

  entities = [];

  setupObjects();

  game = {
    images: 0,
    imagesLoaded: 0,
    backgroundColor: '#000',
    viewport: {
      x: 513,
      y: 1024
    },
    currentMap: map,
    fps: 0,
    lastfps: 0,
    fpsTimer: 0,
    message: null,
    tooltip: null,
    state: 'menu'
  };

  introTs = 0;
  introCount = 0;
  outroTs = 0;
  outroCount = 0;
}

function drawSprite(sprite) {
  var dX, dY;

  if (game.viewport.x <= 0) {
    dX = player.x;
  } else if (game.viewport.x >= 32 * game.currentMap.width - canvas.width) {
    dX = player.x - game.viewport.x;
  } else {
    dX = Math.round(canvas.width / 2 - player.width / 2);
  }

  if (game.viewport.y <= 0) {
    dY = player.y;
  } else if (game.viewport.y >= 32 * game.currentMap.height - canvas.height) {
    dY = player.y - game.viewport.y;
  } else {
    dY = Math.round(canvas.height / 2 - player.height / 2);
  }

  ctx.drawImage(
    sprite.stateAnimations[sprite.currentState].tileset.image,
    sprite.stateAnimations[sprite.currentState].frames[sprite.stateAnimations[sprite.currentState].currentFrame].split(',')[0] * 16,
    sprite.stateAnimations[sprite.currentState].frames[sprite.stateAnimations[sprite.currentState].currentFrame].split(',')[1] * 16,
    16,
    16,
    Math.round(dX),
    Math.round(dY),
    30,
    30);
}

function movePlayer(direction, mod) {
  player.currentState = direction;

  let move = {
    x: player.x,
    y: player.y
  };

  var c1, c2;

  switch (direction) {
    case 'left':
      if (player.x > 0) {
        move.x = player.x - player.speed * mod;
      }

      c1 = cellAvailable(collision, move.x, move.y);
      c2 = cellAvailable(collision, move.x, move.y + 30);

      if (c1 === 2 && c2 === 2) {
        player.x = move.x;
      }
      break;
    case 'up':
      if (player.y <= 0) {
        move.y = player.y + player.speed * mod;
      }

      move.y = player.y - player.speed * mod;

      c1 = cellAvailable(collision, move.x, move.y);
      c2 = cellAvailable(collision, move.x + 30, move.y);

      if (c1 === 2 && c2 === 2) {
        player.y = move.y;
      }
      break;
    case 'right':
      if (player.x < (game.currentMap.colTileCount * 32) - player.height) {
        move.x = player.x + player.speed * mod;
      }

      c1 = cellAvailable(collision, move.x + 30, move.y);
      c2 = cellAvailable(collision, move.x + 30, move.y + 30);

      if (c1 === 2 && c2 === 2) {
        player.x = move.x;
      }
      break;
    case 'down':
      if (player.y < (game.currentMap.rowTileCount * 32) - player.height) {
        move.y = player.y + player.speed * mod;
      }

      c1 = cellAvailable(collision, move.x, move.y + 30);
      c2 = cellAvailable(collision, move.x + 30, move.y + 30);

      if (c1 === 2 && c2 === 2) {
        player.y = move.y;
      }
      break;
  }

  checkEntities();
  updateAnimation(player.stateAnimations[player.currentState]);

  if (player.x + player.width / 2 < canvas.width / 2) {
    game.viewport.x = 0;
  } else if (player.x + canvas.width / 2 + player.width / 2 >= 32 * map.width) {
    game.viewport.x = 32 * map.width - canvas.width;
  } else {
    game.viewport.x = Math.floor(player.x - (canvas.width / 2 - player.width / 2));
  }

  if (player.y + player.height / 2 < canvas.height / 2) {
    game.viewport.y = 0;
  } else if (player.y + canvas.height / 2 + player.height / 2 >= 32 * map.height) {
    game.viewport.y = 32 * map.height - canvas.height;
  } else {
    game.viewport.y = Math.floor(player.y - (canvas.height / 2 - player.height / 2));
  }
}

function checkEntities() {
  for (var i = 0; i < entities.length; i++) {
    var entity = entities[i];

    if (!entity.collected && overlap(player.x, player.y, 32, 32, entity.x + 8, entity.y + 8, 16, 16)) {
      switch (entity.type) {
        case 'key':
        case 'floor':
          if (entity.type === 'floor' && entity.finish_id === 1) {
            game.state = 'outro';
            break;
          }
          if (entity.type === 'floor' && player.scrolls !== 5) break;
          entity.collected = true;

          var doors = entities.filter(function (obj) {
            return obj.type === 'door' && obj.key_id === entity.key_id
          });

          doors.forEach(function (door) {
            door.collected = true;
            collision[door.cY * 48 + door.cX] = 2;
          });

          if (entity.type === 'key') soundHandler.keySound();
          if (entity.message && !game.message && !game.tooltip) {
            game.tooltip = entity.message;

            setTimeout(function () {
              game.tooltip = null;
            }, 2500);
          }
          break;
        case 'message':
          if (game.message || game.tooltip) break;
          game.message = entity.message;

          setTimeout(function () {
            game.message = null;
          }, 2500);
          break;
        case 'scroll':
          entity.collected = true;
          player.scrolls++;
          soundHandler.scrollSound();

          if (game.message || game.tooltip) break;

          game.tooltip = `code ${player.scrolls} of 5`;

          setTimeout(function () {
            game.tooltip = null;
          }, 2500);
          break;
      }
    }
  }
}

function updateAnimation(anim) {
  if (timestamp() - anim.frameTimer > anim.frameDuration) {
    if (anim.currentFrame < anim.frames.length - 1) {
      anim.currentFrame++;
    } else {
      anim.currentFrame = 0;
    }
    anim.frameTimer = timestamp();
  }
}

function drawMap() {
  for (var i = 0; i < ground.length; i++) {
    var posX = (i % 48) * 32;
    var posY = Math.floor(i / 48) * 32;
    var assetX = (ground[i] - 1) * 8;

    if (ground[i] - 1 === 22) {
      assetX = game.fps >= 51 ? (44 * 8) : (ground[i] - 1) * 8
    } else if (ground[i] - 1 === 4) {
      assetX = game.fps >= 51 ? (45 * 8) : (ground[i] - 1) * 8
    } else if (ground[i] - 1 === 5) {
      assetX = game.fps >= 51 ? (60 * 8) : (ground[i] - 1) * 8
    }

    if (player.scrolls === 5) {
      if (ground[i] - 1 >= 29 && ground[i] - 1 <= 36) {
        assetX = (ground[i] + 20) * 8;
      }
    } else {
      if (ground[i] - 1 === 31) {
        assetX = game.fps >= 51 ? (46 * 8) : (ground[i] - 1) * 8
      } else if (ground[i] - 1 === 34) {
        assetX = game.fps >= 51 ? (47 * 8) : (ground[i] - 1) * 8
      } else if (ground[i] - 1 === 29) {
        assetX = game.fps >= 51 ? (48 * 8) : (ground[i] - 1) * 8
      } else if (ground[i] - 1 === 36) {
        assetX = game.fps >= 51 ? (49 * 8) : (ground[i] - 1) * 8
      }
    }

    ctx.drawImage(
      game.currentMap.tileset.image,
      assetX,
      0,
      8,
      8,
      posX - game.viewport.x,
      posY - game.viewport.y,
      32,
      32);
  }
}

function setupObjects() {
  for (var i = 0; i < objects.length; i++) {
    entities.push(new Entity(objects[i]));
  }
}

function drawObjects() {
  for (var i = 0; i < entities.length; i++) {
    if (!entities[i].collected) {
      var posX = entities[i].x - game.viewport.x;
      var posY = entities[i].y - game.viewport.y;
      var assetX = entities[i].gid * 8;

      if (entities[i].type === 'key' || entities[i].type === 'scroll') ctx.globalAlpha = 0.55 + tweenElement(game.fps, 100);

      ctx.drawImage(
        game.currentMap.tileset.image,
        assetX,
        0,
        8,
        8,
        posX,
        posY,
        32,
        32);
      ctx.globalAlpha = 1;
    }
  }
}

function update(mod) {
  if (game.state === 'play') {
    if (37 in keysDown) {
      movePlayer('left', mod);
    }
    if (39 in keysDown) {
      movePlayer('right', mod);
    }
    if (38 in keysDown) {
      movePlayer('up', mod);
    }
    if (40 in keysDown) {
      movePlayer('down', mod);
    }
  }

  if (timestamp() - game.fpsTimer > 1000) {
    game.lastfps = game.fps;
    game.fps = 0;
    game.fpsTimer = timestamp();
  }

  game.fps++;
}

function drawMenu() {
  for (var i = 0; i < menuMap.length; i++) {
    var posX = (i % 8) * 32;
    var posY = Math.floor(i / 8) * 32;
    var assetX = (menuMap[i] - 1) * 8;

    if (menuMap[i] - 1 === 22) {
      assetX = game.fps >= 51 ? (44 * 8) : (menuMap[i] - 1) * 8
    } else if (menuMap[i] - 1 === 4) {
      assetX = game.fps >= 51 ? (45 * 8) : (menuMap[i] - 1) * 8
    } else if (menuMap[i] - 1 === 5) {
      assetX = game.fps >= 51 ? (60 * 8) : (menuMap[i] - 1) * 8
    }

    ctx.drawImage(
      game.currentMap.tileset.image,
      assetX,
      0,
      8,
      8,
      posX,
      posY,
      32,
      32);
  }

  ctx.drawImage(
    logoTile.image,
    0,
    0,
    51,
    50,
    canvas.width - 50 * 4.55,
    29 * 1.25,
    51 * 4,
    50 * 4);
}

function drawMessage() {
  if (game.message) {
    textGenFull(ctx, game.message, {
      w: canvas.width,
      h: canvas.height
    }, fontTile.image)
  } else if (game.tooltip) {
    textGenPart(ctx, game.tooltip, {
      w: canvas.width,
      h: canvas.height
    }, fontTile.image)
  }
}

function drawIntro() {
  if (introCount === 6) {
    timer = new Timer(3);
    game.state = 'play';
    soundHandler.play(100);

    setTimeout(function () {
      game.tooltip = 'hmm 3 mins';
      setTimeout(function () {
        game.tooltip = null;
        timer.start();
      }, 2500);
    }, 1000);
    return;
  }

  textGenPart(ctx, introText[introCount], {
    w: canvas.width,
    h: canvas.height
  }, fontTile.image);

  if (timestamp() - introTs >= 2500) {
    introCount++;
    introTs = timestamp();
    player.currentState = introCount === 2 ? 'left' : introCount === 3 ? 'right' : introCount === 4 ? 'up' : 'down';
  }
}

function drawOutro() {
  if (player.x === 370) {
    if (outroCount === 5) {
      movePlayer('down', 0.01);
      if (player.y === 1249) {
        game.state = 'finish';
      }
      return;
    }

    player.currentState = 'down';

    ctx.drawImage(
      spriteTiles.image,
      0,
      4 * 16,
      16,
      16,
      player.x - game.viewport.x,
      player.y - game.viewport.y + 107,
      30,
      30);

    textGenPart(ctx, outroText[outroCount], {
      w: canvas.width,
      h: canvas.height
    }, fontTile.image, 'top');

    if (timestamp() - outroTs >= 2500) {
      outroCount++;
      outroTs = timestamp();
    }
  } else {
    movePlayer('left', 0.01);
  }
}

function drawFinish() {
  textGenFull(ctx, 'quest of tod **   samirh ***  js13k 18', {
    w: canvas.width,
    h: canvas.height
  }, fontTile.image)
}

function drawTimer() {
  timerTextGen(ctx, `${timer.minutes}:${timer.seconds}`, {
    w: canvas.width,
    h: canvas.height
  }, fontTile.image);

  if (timer.minutes === '00' && timer.seconds === '00') {
    game.state = 'gameover';
  }
}

function drawGameOver() {
  game.message = '  game over ** you need to * be faster. * stay locked * forever!'
  drawMessage();
}

function render() {
  ctx.fillStyle = game.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  switch (game.state) {
    case 'menu':
      drawMenu();
      break;
    case 'intro':
      drawSprite(player);
      drawIntro();
      break;
    case 'play':
      drawMap();
      drawObjects();
      drawSprite(player);
      drawTimer();
      drawMessage();
      break;
    case 'outro':
      drawMap();
      drawObjects();
      drawSprite(player);
      drawOutro();
      break;
    case 'finish':
      drawFinish();
      break;
    case 'gameover':
      drawMap();
      drawObjects();
      drawSprite(player);
      drawTimer();
      drawGameOver();
      break;
  }
}

var dt = 0,
  now,
  last = timestamp(),
  step = 1 / 100;

function frame() {
  now = timestamp();
  dt = dt + Math.min(1, (now - last) / 1000);
  while (dt > step) {
    dt = dt - step;
    update(step);
  }
  render();
  last = now;
  requestAnimationFrame(frame, canvas);
}

document.querySelector('canvas').addEventListener('click', function () {
  if (game.state === 'menu') {
    start();
    game.state = 'intro';
    soundHandler.play(55);
  } else if (game.state === 'finish') {
    game.state = 'menu';
  } else if (game.state === 'gameover') {
    game.state = 'menu';
  }
})

window.addEventListener('keydown', function (e) {
  keysDown[e.keyCode] = true;
  if (e.keyCode === 77) {
    soundHandler.mute();
  }
  e.preventDefault();
});

window.addEventListener('keyup', function (e) {
  delete keysDown[e.keyCode];
  e.preventDefault();
});

if (isMobile()) {
  var controls = {
    left: 37,
    right: 39,
    up: 38,
    down: 40
  };

  setMobileSize(canvas);

  document.getElementById('mobile-control').addEventListener('touchstart', function (e) {
    if (controls[e.target.id]) {
      keysDown[controls[e.target.id]] = true;
    }
    e.preventDefault();
  });

  document.getElementById('mobile-control').addEventListener('touchend', function (e) {
    if (controls[e.target.id]) {
      delete keysDown[controls[e.target.id]];
    }
    e.preventDefault();
  });
}

frame();
start();
