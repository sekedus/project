/*!
 * Source: https://dev.to/official_fire/making-the-chrome-dino-game-play-itself-using-javascript-2j8n
 * Similar: https://www.codesnail.com/autoplay-chrome-dinosaur-game-with-javascript/
 *
 */

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
  if (note == 'pause' || note == 'pause') clearInterval(auto_play);

  if (note == 'start' || note == 'restart') {
    auto_play = setInterval(function() {
      myinstance = this.Runner.instance_;
      myobstacles = myinstance.horizon.obstacles;
    
      // if my tRex is ducking then
      if (myinstance.tRex.ducking) {
        // make my tRex to duck
        myinstance.tRex.setDuck(true);
      }
      if (myinstance.crashed) {
        // When the game is over then
        // console.log("Game Over... Paste the code again to automate the game");
        // return;
        clearInterval(auto_play);
        btn_stop.disabled = true;
        btn_restart.disabled = false;
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
    
        step = myinstance.distanceMeter.config.ACHIEVEMENT_DISTANCE * myinstance.distanceStep;
        dis = IS_MOBILE ? (myobstacles[0]["yPos"] == 105 ? 55 : 65) : 85;
        
        // Making the action work
        if (myobstacles[0].xPos <= dis + (step / 10)) {
          // console.log(myobstacles[0]);
      
          // Perform the action
          if (action == "JUMP") {
            // console.log("Jumping.. Yahoo");
            // we get the current speed of our dino
            curr_speed = myinstance.currentSpeed;

            curr_speed = curr_speed + (step / 5);

            // then making it jump
            myinstance.tRex.startJump(curr_speed);
          } else if (action == "DUCK") {
            // console.log("Ducking.. Oo");
            myinstance.tRex.setDuck(true);
          }
        }
      }
    }, 20);
  }
}

var auto_play;
var btn_autoplay = document.getElementById('autoplay');
var btn_stop = document.getElementById('pause');
var btn_restart = document.getElementById('restart');

btn_autoplay.addEventListener('click', function() {
  this.disabled = true;
  btn_stop.disabled = false;
  document.activeElement.blur();
  autoPlay('start');
  // ArrowUp
  if (Runner.instance_.crashed) {
    keyUp(38);
  } else {
    keyDown(38);
  }
});

btn_stop.addEventListener('click', function() {
  clearInterval(auto_play);
  this.disabled = true;
  btn_autoplay.disabled = false;
  document.activeElement.blur();
  autoPlay('pause');
  Runner.instance_.stop();
});

btn_restart.addEventListener('click', function() {
  this.disabled = true;
  btn_stop.disabled = false;
  document.activeElement.blur();
  autoPlay('restart');
  keyUp(38); //ArrowUp
});
