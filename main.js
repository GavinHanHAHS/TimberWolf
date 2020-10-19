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

let playerSide = -1;

let score = 0;


// things to do?:
// day/night cycle

window.addEventListener("load", start);

function start() { // waits for body to load, then loads
  images = {       // images and starts game
    stump: document.getElementById("stump"),
    background: document.getElementById("background"),
    branchR: document.getElementById("branchR"),
    werewolf: document.getElementById("werewolf"),
    branchL: document.getElementById("branchL"),
    tombstone: document.getElementById("tombstone"),
    gameover: document.getElementById("gameover")
  }

  startLogs();

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
        ctx.drawImage(logs[i].img, logs[i].x, 430 - (logs[i].position * 100) - logYModify);
        if(logs[i].branch != 0) { // draw branches
          if(logs[i].branch == -1) {
            ctx.drawImage(images.branchR, logs[i].x + 144, 430 - (logs[i].position * 100) - logYModify);
          } else if(logs[i].branch == 1) { //redundant
            ctx.drawImage(images.branchL, logs[i].x - 95, 430 - (logs[i].position * 100) - logYModify);
          }
          
        }
      } else { // draw flying logs
        ctx.save();
        ctx.translate(logs[i].x + 75, logs[i].y + 37.5);
        ctx.rotate(logs[i].angle * Math.PI / 180);
        ctx.translate(-(logs[i].x + 75), -(logs[i].y + 37.5));
        ctx.drawImage(logs[i].img, logs[i].x, logs[i].y)
        
        if(logs[i].branch != 0) {
          if(logs[i].branch == -1) {
            ctx.drawImage(images.branchR, logs[i].x + 150, logs[i].y);
          } else if(logs[i].branch == 1) { //redundant
            ctx.drawImage(images.branchL, logs[i].x - 95, 430 - (logs[i].position * 100) - logYModify);
          }
        }
        ctx.restore();
        logs[i].angle += logs[i].angleChange * logs[i].direction;
      }
      
      if(logs[i].position < 0) { // if log is not in tree, make it move and rotate it.
        logs[i].x += 8 * logs[i].direction;
        logs[i].y += logs[i].angleChange * Math.random() + 3;
      }
    }
  }

  if(logYModify > 0) { // if there is empty space below log stack, decrease space.
    logYModify -= 7;
  }

  drawGamestate(); // draws any gamestate specific things (menus/player);
  
  requestAnimationFrame(main);
}

function drawLandscape() {
  ctx.drawImage(images.background, 0, 0);

  ctx.drawImage(images.stump, (cnv.width / 2) - 100, 530);
}


document.addEventListener("keydown", handleKeyAction);
document.addEventListener("keyup", handleKeyAction);

function handleKeyAction(event) {
  if(event.type == "keydown" && event.code == "Space" && gamestate == 2) { // reset variables and add more logs
    logs = [];
    logYModify = 0;
  
    gamestate = 0;
    playerSide = -1;
    score = 0;

    startLogs();

  } else if(event.type === "keydown" && keydown == false) {
    keydown = true;
    if(event.code == "ArrowRight") {
      logChop("right");
    } else if(event.code == "ArrowLeft") {
      logChop("left");
    }
  }
  if(event.type === "keyup") {
    keydown = false;
  }
}

function logChop(side) {
  if(gamestate == 0) {
    gamestate = 1;
  }

  if(gamestate == 1) {
    logYModify = 75;
    score++;

    for(let i = 0; i < logs.length; i++) {
      // loop thru every log and do logic
      if(logs[i].position == 0) { // bottommost log gets yeeted
        logs[i].position = -1;
        logs[i].y = 455;

        if(side == "right") { // player is on right side !! log goes left
          logs[i].direction = -1;
          logs[i].x += -50;
          playerSide = 1;
        } else if(side == "left") { // player is on left side !! log goes right
          logs[i].direction = 1;
          logs[i].x += 50;
          playerSide = -1;
        }
      }

      if(logs[i].position > 0) { // all other logs go down
        logs[i].position -= 1;
      }
    }
    //check if new bottom log is on player
    for(let i = 0; i < logs.length; i++) {
      if(logs[i].position == 0 && logs[i].branch == playerSide * -1) {
        gamestate++;
        break;
      }
    }
    
    

    // add another log on top
    addLog(7);

  }

}

function startLogs() {
  logs.push({ // first log always empty
    x: (cnv.width / 2) - 75,
    y: 0,
    direction: 0,
    position: 0,
    angle: 0,
    angleChange: Math.random() * 10,
    branch: 0,
    img: document.getElementById("log")
  });
  
  for(let i = 1; i < 8; i++) { // add 7 more logs to complete tree
    addLog(i);
  }
}

function addLog(position) {
  let log = {
    x: (cnv.width / 2) - 75,
    y: 0,
    direction: 0,
    position: position,
    angle: 0,
    angleChange: Math.random() * 10 - 5,
    branch: 0,
    img: document.getElementById("log")
  };

  log.branch = Math.round(Math.random() * 3 - 1.5);

  if(log.branch == -0) {log.branch = 0};

  if(Math.random() >= 0.35) {
    log.img = document.getElementById("log");
  } else {
    log.img = document.getElementById("log2");
  }

  logs.push(log);
}

function drawGamestate() {
  if(gamestate == 0) { //draw start screen
    ctx.fillStyle = "dimgray";
    ctx.fillRect(100, 150, 300, 200);

    ctx.drawImage(images.werewolf, cnv.width / 2 + (225 * playerSide), 400, 200, 175);

    ctx.fillStyle = "white";
    ctx.font = "42px VT323"
    ctx.fillText("TimberWolf", 115, 210);
    ctx.font = "27px VT323"
    ctx.fillText("Press   <-   /   ->", 115, 250);
    ctx.fillText("or Click Left / Right side", 125, 280, 260);
    ctx.fillText("to Start", 135, 310);
  } else if(gamestate == 1) {
    // game is playing
    if(playerSide == -1) { // draw player
      ctx.drawImage(images.werewolf, cnv.width / 2 + (225 * playerSide), 400, 200, 175);
    } else {
      ctx.save();
      ctx.translate(cnv.width / 2 + (35 * playerSide), 400);
      ctx.scale(-1, 1)
      ctx.translate(-(cnv.width / 2 + (35 * playerSide)), -400);
      ctx.drawImage(images.werewolf, cnv.width / 2 - (155 * playerSide), 400, 200, 175);
      ctx.restore();
    }

    ctx.font = "42px VT323";
    ctx.fillColor = "rgb(235, 235, 172)"
    ctx.fillText(score, 20, 52);
  } else if(gamestate == 2) { // technically redundant
    //game over
    if(playerSide == -1) { // draw dead player + gameover box
      ctx.drawImage(images.tombstone, cnv.width / 2 + (225 * playerSide), 400, 200, 175);
    } else {
      ctx.save();
      ctx.translate(cnv.width / 2 + (35 * playerSide), 400);
      ctx.scale(-1, 1)
      ctx.translate(-(cnv.width / 2 + (35 * playerSide)), -400);
      ctx.drawImage(images.tombstone, cnv.width / 2 - (155 * playerSide), 400, 200, 175);
      ctx.restore();
    }

    ctx.fillStyle = "rgb(85, 50, 93)";
    ctx.fillRect(100, 75, 300, 435);
    ctx.font = "43px VT323";
    ctx.fillStyle = "rgb(235, 235, 172)";
    ctx.fillText("Game Over!", 165, 397);
    ctx.font = "27px VT323"
    ctx.fillText("Final Score: " + score, 157, 440);
    ctx.font = "22px VT323";
    ctx.fillText("Press ⎵ (Space) to restart", 130, 480);
    ctx.drawImage(images.gameover, 125, 100);
  }
}