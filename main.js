// JAVASCRIPT
"use strict";

let cnv = document.getElementById("gameCnv");
let ctx = cnv.getContext("2d");

cnv.width = 500;
cnv.height = 650;

let gamestate = 0;
// 0 = start screen
// 1 = currently playing
// 2 = game over

let images;
let logs = [];
let logYModify = 0;
let keydown = false;

for(let i = 0; i < 8; i++) {
  logs.push({
    x: (cnv.width / 2) - 75,
    y: 0,
    direction: 0,
    position: i
  })
}


// things to do:
// implement gamestates
// add player character
// branches array and drawing
// ~> seperate array for branches, with values -1, 0 or 1
// additional images for log + branch for when they fly



function start() { // waits for body to load, then loads
  images = {       // images and starts game
    log: document.getElementById("log"),
    stump: document.getElementById("stump")
  }

  requestAnimationFrame(main);
}

function main() {
  drawLandscape();

  

  for(let i = 0; i < logs.length; i++) { // draw all the logs
    // check if log is offscreen first, if so then delet
    if(logs[i].x > cnv.width || logs[i].x < -150) {
      logs.shift();
      i--;
    } else { // otherwise draw it
      if(logs[i].position >= 0) {
        ctx.drawImage(images.log, logs[i].x, 455 - (logs[i].position * 75) - logYModify);
      } else {
        ctx.drawImage(images.log, logs[i].x, logs[i].y)
      }
      
      if(logs[i].position < 0) {
        logs[i].x += 10 * logs[i].direction;
        logs[i].y += 3.5;
      }
      
    }
  }

  if(logYModify > 0) {
    logYModify -= 7;
  }
  
  

  requestAnimationFrame(main);
}

function drawLandscape() {
  ctx.fillStyle = "rgb(12, 35, 115)"
  ctx.fillRect(0, 0, cnv.width, cnv.height); // sky

  ctx.fillStyle = "rgb(120, 105, 180)";
  ctx.fillRect(0, 450, cnv.width, 200); // ground

  ctx.fillStyle = "rgb(255, 255, 180)"
  fillCircle(395, 175, 40); // moon

  ctx.drawImage(images.stump, (cnv.width / 2) - 100, 530);
}


document.addEventListener("keydown", handleKeyAction);
document.addEventListener("keyup", handleKeyAction);

function handleKeyAction(event) {
  if(event.type === "keydown" && keydown == false) {
    if(event.code == "ArrowRight" || event.code == "ArrowLeft") {
      keydown = true;
      logYModify = 75;
      for(let i = 0; i < logs.length; i++) {
        // loop thru every log and do logic
        if(logs[i].position == 0) { // bottommost log gets yeeted
          logs[i].position = -1;
          logs[i].y = 455;
          if(event.code == "ArrowRight") {
            logs[i].direction = -1;
          } else if(event.code == "ArrowLeft") {
            logs[i].direction = 1;
          }
        }
        if(logs[i].position > 0) { // all other logs go down
          logs[i].position -= 1;
        }
      }
      // add another log on top
      logs.push({
        x: (cnv.width / 2) - 75,
        direction: 0,
        position: 7
      })
    }

  }
  if(event.type === "keyup") {
    keydown = false;
  }
}
