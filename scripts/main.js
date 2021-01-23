var fieldw = 300, fieldh = 600;
var nextareaw = 150, nextareah = 150;
var cols = 10, rows = 20;
var ncols = 5, nrows = 5;
var firstspeed=500;
var blockw = fieldw / cols, blockh = fieldh / rows;
fieldcv = document.getElementById("field");
fieldcv.style.position = "absolute";
fieldcv.style.left = "460px";
fieldcv.style.top = "30px";
fieldcv.style.zIndex = 2;
fdctx = fieldcv.getContext("2d");
nxtcanvas = document.getElementById("next");
nxtcanvas.style.position = "absolute";
nxtcanvas.style.left = "900px";
nxtcanvas.style.top = "30px";
nxtcanvas.style.zIndex = 3;
nxtctx = nxtcanvas.getContext("2d");
scorecanvas = document.getElementById("score");
scorecanvas.style.position = "absolute";
scorecanvas.style.left = "170px";
scorecanvas.style.top = "300px";
scorecanvas.style.zIndex = 3;
scrctx = scorecanvas.getContext("2d");
scrctx.font = '20pt Arial';
scrctx.fillStyle = "white";

var current_mino;
var post_mino;
var current_x = 3, current_y = 0;
var field = [];
var nextarea = [];
var status = "start";
var play;
var level = 1;
var canlevelup = true;
var leveluptf = false;
var interval = true;
var SEfix, SEclearrow, SEmove,SErotate,SElevelup,SEgameover;
var lastlv=1;
var highscore;
var speed = 500;
var score = 0;
var clearlinenum = 0;
var showscore = document.getElementById('showscore');
var showhighscore = document.getElementById('showhighscore');
var showlevel = document.getElementById('showlevel');
var nowplaying = 1;
var newrecord = 0;


function setup(){
for (var y = 0; y < rows; y++) {
  field[y] = [];
  for (var x = 0; x < cols; x++) {
    field[y][x] = 0;
  }
}

for (var y = 0; y < nrows; y++) {
  nextarea[y] = [];
  for (var x = 0; x < ncols; x++) {
    nextarea[y][x] = 0;
  }
}

if (typeOf.call(getCookieValue('highscore')) == "number") {
  highscore = getCookieValue('highscore');
  console.log(highscore);
} else {
  highscore = 0;
}
console.log("highscore: " + highscore);
current_mino = newMino();
post_mino = newnextmino();
render();
shownextmino();

speed = firstspeed - (level-1) * 20;
startgame();
}

function startgame() {
  displayscore();
  play = setInterval(tick, speed);
}
function stopgame() {
  clearInterval(play);
}

function PlaySEfix() {
  SEfix = new Audio();
  SEfix.src = "./sounds/SEfix.mp3";
  SEfix.play();
}
function PlaySEclearrow() {
  SEclearrow = new Audio();
  SEclearrow.src = "./sounds/SEclearrow.mp3";
  SEclearrow.play();
}
function PlaySEmove() {
  SEmove = new Audio();
  SEmove.src = "./sounds/SEmove.mp3";
  SEmove.play();
}
function PlaySErotate() {
  SErotate = new Audio();
  SErotate.src = "./sounds/SErotate.mp3";
  SErotate.play();
}
function PlaySElevelup() {
  SElevelup = new Audio();
  SElevelup.src = "./sounds/SElevelup.mp3";
  SElevelup.play();
}
function PlaySEgameover() {
  SEgameover = new Audio();
  SEgameover.src = "./sounds/SEgameover.mp3";
  SEgameover.play();
}

function getCookieValue(a) {
  var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}

function typeOf() {
  'use strict';
  console.log(typeof this);
}

function displayscore() {
  scrctx.clearRect(0,0,scorecanvas.width,scorecanvas.height)
  scrctx.fillText(`SCORE: ${score}`, 15, 80);
  scrctx.fillText(`HIGH SCORE:`, 15, 130);
  scrctx.fillText(highscore, 60, 160);
  scrctx.fillText(`LEVEL: ${level}`, 20, 210);
}

function render() {
  fdctx.clearRect(0, 0, fieldw, fieldh);
  fdctx.strokeStyle = "white";
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      drawBlock(x, y, field[y][x]);
    }
  }
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
      drawBlock(current_x + x, current_y + y, current_mino[y][x]);
    }
  }
}

function shownextmino() {
  nxtctx.clearRect(0, 0, 150, 150);
  nxtctx.strokeStyle = "white";
  for (var y = 0; y < nrows; y++) {
    for (var x = 0; x < ncols; x++) {
      drawnextBlock(x, y, nextarea[y][x]);
    }
  }
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
      drawnextBlock(1 + x, 2 + y, post_mino[y][x]);
    }
  }
  nxtctx.font = '20pt Arial';
  nxtctx.fillStyle = "white";
  nxtctx.fillText('NEXT MINO', 2, 30);
}

function drawBlock(x, y, block) {
  if (block) {
    fdctx.fillStyle = COLORS[block - 1];
    fdctx.fillRect(x * blockw, y * blockh, blockw - 1, blockh - 1);
    fdctx.strokeRect(x * blockw, y * blockh, blockw - 1, blockh - 1);
  }
}
function drawnextBlock(x, y, block) {
  if (block) {
    nxtctx.fillStyle = COLORS[block - 1];
    nxtctx.fillRect(x * blockw, y * blockh, blockw - 1, blockh - 1);
    nxtctx.strokeRect(x * blockw, y * blockh, blockw - 1, blockh - 1);
  }
}

function tick() {
  if (nowplaying == 2){
  if (canMove(0, 1)) {
    current_y++;
  } else {
    fix();
    clearrows();
    gameover();
    current_mino = newMino();
    post_mino = newnextmino();
    shownextmino();
    current_x = 3;
    current_y = 0;
    console.log("clearlinenum" + clearlinenum);
    if (score != 0) {
      level = 1 + Math.floor(clearlinenum / 3);
      if (level < 25) {
        speed = firstspeed - level * 20;
      } else {
        speed = 10
      }
      if(lastlv<level){
        PlaySElevelup();
      }
    }
    lastlv=level;
    displayscore();
  }
  render();
  clearInterval(play);
  console.log("speed: " + speed);
  startgame();
}
}

function fix() {
  for (var y = 0; y < 4; ++y) {
    for (var x = 0; x < 4; ++x) {
      if (current_mino[y][x]) {
        field[current_y + y][current_x + x] = current_mino[y][x];
        PlaySEfix();
      }
    }
  }
}

function canMove(move_x, move_y, move_mino) {
  var next_x = current_x + move_x;
  var next_y = current_y + move_y;
  var next_mino = move_mino || current_mino;
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
      if (next_mino[y][x]) {
        if (next_y + y >= rows
          || next_x + x < 0
          || next_x + x >= cols
          || field[next_y + y][next_x + x]) {
          return false;
        }
      }
    }
  }
  return true;
}

function clearrows() {
  for (var y = rows - 1; y >= 0; y--) {
    var fill = true;
    for (var x = 0; x < cols; x++) {
      if (field[y][x] == 0) {
        fill = false;
        break;
      }
    }
    if (fill) {
      for (var v = y - 1; v >= 0; v--) {
        for (var x = 0; x < cols; x++) {
          field[v + 1][x] = field[v][x];
        }
      }
      clearlinenum++;
      score = clearlinenum * 10;
      y++;
      PlaySEclearrow();
    }
  }
}

document.body.onkeydown = function (e) {
  switch (e.keyCode) {
    case 37:
      if (canMove(-1, 0)) {
        current_x--;
        PlaySEmove();
      }
      break;
    case 39:
      if (canMove(1, 0)) {
        current_x++;
        PlaySEmove();
      }
      break;
    case 40:
      if (canMove(0, 1)) {
        current_y++;
        PlaySEmove();
      }
      break;
    case 65:
      rotated = lrotate(current_mino);
      if (canMove(0, 0, rotated)) {
        current_mino = rotated;
        PlaySErotate();
        console.log("l rotated");
      }
      break;
    case 68:
      rotated = rrotate(current_mino);
      if (canMove(0, 0, rotated)) {
        current_mino = rotated;
        PlaySErotate();
        console.log("r rotated");
      }
      break;
  }
  render();
}


function gameover() {
  for (var y = 1; y >= 0; y--) {
    var nfill = true;
    for (var x = 3; x <= 6; x++) {
      if (field[y][x] != 0)
        nfill = false;
      break;
    }
  }

  if (!nfill) {  //gameover
    stopgame();
    PlaySEgameover();
    result();
  }
}

function result() {
  nowplaying++;
  document.getElementById("bgm").pause();
  document.getElementById("result").play()
  clearInterval(play);
  stopgame();
  if (score > highscore) {
    document.cookie = `highscore = ${score}; max-age = 15552000; secure`;
    console.log("new record: " + score);
    newrecord = 1;
  } else {
    document.cookie = `highscore = ${highscore}; max-age = 15552000; secure`;
    console.log("score: " + score);
  }
  console.log(getCookieValue('highscore'));
  darkctx.fillStyle = "rgba(" + [0, 0, 0, 0.7] + ")";
    darkctx.fillRect(0, 0, darkcanvas.width, darkcanvas.height);
    btnctx.fillStyle = "rgba(" + [255, 255, 255, 0.9] + ")";
    btnctx.fillRect(450,300,300,60);
    btnctx.font = '30pt Arial';
    btnctx.fillStyle = "white";
    btnctx.fillText("SCORE: "+score, 510, 240);
    if (newrecord == 1){
      btnctx.fillStyle = "red";
      btnctx.fillText("NEW RECORD!", 490, 180);
    }
    btnctx.fillStyle = "black";
    btnctx.fillText("REPLAY", 510, 340);
    btncanvas.addEventListener('click', onClickresult,false);
}
function onClickresult(e){
    var rect = e.target.getBoundingClientRect();
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
    restart();
}

function restart(){
    if (nowplaying == 3){
    if(x>=450 && x<=750 && y>=300 && y<= 360){
        location.reload();
    }else{}
}
}