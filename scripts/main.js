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
 
current_mino = newMino();
render();
setInterval(tick, 500);
 
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
    current_mino = newMino();
    current_x = 3;
    current_y = 0;
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
    case 38:
      rotated = rotate(current_mino);
      if (canMove(0, 0, rotated)) {
        current_mino = rotated;
      }
      break;
  }
  render();
}

//キーの変更！