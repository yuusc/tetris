var fieldw = 300, fieldh = 600;
var cols = 10, rows = 20;
var blockw = fieldw / cols, blockh = fieldh / rows;
var canvas = document.getElementById("field");
var ctx = canvas.getContext("2d");
var current_mino;
var current_x = 3, current_y = 0;
var field = [];

for (var y = 0; y < rows; y++) {
  field[y] = [];
  for (var x = 0; x < cols; x++) {
    field[y][x] = 0;
  }
}
 
var highscore = 0;
highscore = getCookieValue('highscore');
current_mino = newMino();
render();
var score = 0;
var clearlinenum = 0;
setInterval(tick, 500);

function getCookieValue(a) {
  var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}

function render() {
  ctx.clearRect(0, 0, fieldw, fieldh);
  ctx.strokeStyle = "black";
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
 
function drawBlock(x, y, block) {
  if (block) {
    ctx.fillStyle = COLORS[block - 1];
    ctx.fillRect(x * blockw, y * blockh, blockw - 1, blockh - 1);
    ctx.strokeRect(x * blockw, y * blockh, blockw - 1, blockh - 1);
  }
}
 
function tick() {
  if (canMove(0, 1)) {
    current_y++;
  } else {
    fix();
    clearrows();
    gameover();
    current_mino = newMino();
    current_x = 3;
    current_y = 0;
    console.log("clearlinenum"+clearlinenum);
  }
  render();
}
 
function fix() {
  for (var y = 0; y < 4; ++y) {
    for (var x = 0; x < 4; ++x) {
      if (current_mino[y][x]) {
        field[current_y + y][current_x  + x] = current_mino[y][x];
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
  for (var y = rows - 1; y >=0; y--) {
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
      score = clearlinenum*10;
      y++;
    }
  }
}
 
document.body.onkeydown = function(e) {
  switch (e.keyCode) {
    case 37:
      if (canMove(-1, 0)) {
        current_x--;
      }
      break;
    case 39:
      if (canMove(1, 0)) {
        current_x++;
      }
      break;
    case 40:
      if (canMove(0, 1)) {
        current_y++;
      }
      break;
    case 65:
      rotated = lrotate(current_mino);
      if (canMove(0, 0, rotated)) {
        current_mino = rotated;
        console.log("l rotated");
      }
      break;
      case 68:
      rotated = rrotate(current_mino);
      if (canMove(0, 0, rotated)) {
        current_mino = rotated;
        console.log("r rotated");
      }
      break;
  }
  render();
}

function gameover(){
for (var y = 1;y>=0;y--){
  var nfill = true;
  for (var x = 3;x<=6;x++){
    if (field[y][x] != 0)
    nfill = false;
    break;
  }
}
if (!nfill){  //gameover
  result();
  alert("gameover");
  
}
}

function result(){
  if (score>=highscore){
    document.cookie = "highscore = "+score+"; max-age = 15552000; secure";
    console.log("new record: "+score);
  }else{
    document.cookie = "highscore = "+highscore+"; max-age = 15552000; secure";
    console.log("score: "+score);
  }
  console.log(getCookieValue('highscore'));
}