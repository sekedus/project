/*!
 * Source: https://dev.to/official_fire/making-the-chrome-dino-game-play-itself-using-javascript-2j8n
 * Similar: https://www.codesnail.com/autoplay-chrome-dinosaur-game-with-javascript/
 *
 */

// Multiple events to a listener https://stackoverflow.com/a/8797106/7598333
function multiEventListener(element, names, target, handler) {
  var events = names.split(' ');
  events.forEach(function(item) {
  element[`${target}EventListener`](item, handler, false);
  });
}

function checkBot(e) {
  if (!auto_play && (Runner.keycodes.JUMP[e.keyCode] || e.type == Runner.events.TOUCHSTART || e.type == Runner.events.TOUCHEND)) {
    dino_mode.parentElement.classList.remove('hidden');
    dino_mode.innerHTML = 'manual';
    btn_autoplay.disabled = false;
    btn_pause.innerHTML = 'pause';
    btn_pause.disabled = true;
    btn_restart.disabled = true;
  }
}

function keyDown(e) {
  Podium = {};
  var n = document.createEvent("KeyboardEvent");
  Object.defineProperty(n, "keyCode", {
    get: function () {
      return this.keyCodeVal;
    },
  }),
    n.initKeyboardEvent ? n.initKeyboardEvent("keydown", !0, !0, document.defaultView, e, e, "", "", !1, "") : n.initKeyEvent("keydown", !0, !0, document.defaultView, !1, !1, !1, !1, e, 0),
    (n.keyCodeVal = e),
    document.body.dispatchEvent(n);
} 

function keyUp(e) {
  Podium = {};
  var n = document.createEvent("KeyboardEvent");
  Object.defineProperty(n, "keyCode", {
      get: function () {
          return this.keyCodeVal;
      },
  }),
      n.initKeyboardEvent ? n.initKeyboardEvent("keyup", !0, !0, document.defaultView, e, e, "", "", !1, "") : n.initKeyEvent("keyup", !0, !0, document.defaultView, !1, !1, !1, !1, e, 0),
      (n.keyCodeVal = e),
      document.body.dispatchEvent(n);
}

function autoPlay(note) {
  if (note == 'pause' || note == 'stop') {
    clearInterval(auto_play);
    auto_play = null;
  }

  if (note == 'start' || note == 'restart') {
    dino_mode.parentElement.classList.remove('hidden');
    auto_play = setInterval(function() {
      dino_mode.innerHTML = 'auto';
      myobstacles = dinobot.horizon.obstacles;

      if (!dinobot.isFullScreen()) full_screen.checked = false;
    
      // if my tRex is ducking then
      if (dinobot.tRex.ducking) {
        // make my tRex to duck
        dinobot.tRex.setDuck(true);
      }
      if (dinobot.crashed) {
        // When the game is over then
        // console.log("Game Over... Paste the code again to automate the game");
        // return;
        autoPlay('stop');
        btn_pause.disabled = true;
        btn_restart.disabled = false;
        localStorage.setItem(`highScore_${new Date().getTime()}`,  Math.round(dinobot.highestScore / 40));
      }
      if (myobstacles.length > 0) {
        action = "JUMP";
        obstacle_type = myobstacles[0]["typeConfig"]["type"];
    
        // Defining which action to perform if it match the following cases
        if (obstacle_type == "CACTUS_SMALL" || obstacle_type == "CACTUS_LARGE") {
        action = "JUMP";
        // i know its a hard name ( actually PTERODACTYL its the bird )
        } else if (obstacle_type == "PTERODACTYL") {
        if (myobstacles[0]["yPos"] == 75 || myobstacles[0]["yPos"] == 50)
          action = "DUCK";
        }
    

        cactus_small_wide = myobstacles[0]["yPos"] == 105 && myobstacles[0]["width"] == 51;
        cactus_large_wide = myobstacles[0]["yPos"] == 90 && myobstacles[0]["width"] == 75;
        if (IS_MOBILE) {
          if (cactus_large_wide) {
            dis = 45;
          } else if (cactus_small_wide) {
            dis = 55;
          } else {
            dis = 65;
          }
        } else {
          dis = cactus_large_wide ? 75 : 85;
        }
        
        step = (dinobot.distanceMeter.config.ACHIEVEMENT_DISTANCE * dinobot.distanceStep) / 8;
        
        // Making the action work
        if (myobstacles[0].xPos <= dis + step) {
          // console.log(myobstacles[0]);
      
          // Perform the action
          if (action == "JUMP") {
            // console.log("Jumping.. Yahoo");
            // we get the current speed of our dino
            curr_speed = dinobot.currentSpeed;

            curr_speed = curr_speed + step;

            // then making it jump
            if (!dinobot.tRex.jumping && !dinobot.tRex.ducking) {
              dinobot.playSound(dinobot.soundFx.BUTTON_PRESS);
              dinobot.tRex.startJump(curr_speed);
            }
          } else if (action == "DUCK") {
            // console.log("Ducking.. Oo");
            dinobot.tRex.setDuck(true);
          }
        }
      }
    }, 20);
  }
}

var auto_play, dinobot;
var btn_autoplay = document.getElementById('autoplay');
var btn_pause = document.getElementById('pause');
var btn_restart = document.getElementById('restart');
var full_screen = document.querySelector('.dino-full input[type=checkbox]');
var dark_mode = document.querySelector('.dino-toggle');
var dino_mode = document.querySelector('.dino-mode span');

full_screen.checked = localStorage.getItem('dino-fullscreen') && localStorage.getItem('dino-fullscreen') == 'true' ? true : false;

window.addEventListener('load', function() {
  setTimeout(function() { document.body.classList.remove('loading'); }, 1500);
  dinobot = Runner.instance_;
  multiEventListener(window, 'keydown keyup', 'add', checkBot);
  multiEventListener(dinobot.containerEl, 'touchstart touchend', 'add', checkBot);
  if (IS_MOBILE) multiEventListener(dinobot.touchController, 'touchstart touchend', 'add', checkBot);
});

full_screen.addEventListener('click', function() {
  document.activeElement.blur();
  if (this.checked) {
    if (dinobot.activated) dinobot.setFullScreenScale();
    localStorage.setItem('dino-fullscreen', 'true');
  } else {
    dinobot.removeFullScreenScale();
    localStorage.removeItem('dino-fullscreen');
  }
});

dark_mode.addEventListener('click', function() {
  if (dinobot.isDarkMode) {
    dinobot.toggleDark(false);
  } else {
    dinobot.toggleDark(true);
  }
});

btn_autoplay.addEventListener('click', function() {
  document.activeElement.blur();
  this.disabled = true;
  btn_pause.disabled = false;
  autoPlay('start');
  if (!dinobot.playing) {
    // ArrowUp
    if (dinobot.crashed) {
      keyUp(38);
    } else {
      keyDown(38);
    }
  }
});

btn_pause.addEventListener('click', function() {
  document.activeElement.blur();
  if (this.innerHTML == 'pause') {
    this.innerHTML = 'resume';
    autoPlay('pause');
    dinobot.stop();
  } else {
    this.innerHTML = 'pause';
    autoPlay('start');
    dinobot.play();
  }
});

btn_restart.addEventListener('click', function() {
  document.activeElement.blur();
  this.disabled = true;
  btn_pause.disabled = false;
  autoPlay('restart');
  keyUp(38); //ArrowUp
});
