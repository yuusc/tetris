var bgcanvas;
var bgctx;
var fieldcv;
var fdctx;
var nxtcanvas;
var nxtctx;
var scorecanvas;
var scrctx;
var darkcanvas;
var darkctx;
var btncanvas;
var btnctx;
var smpcanvas;
var smpctx;
var x = 0;
var y = 0;
var bx = 0;
var by = 0;
var easy = false;

function init() {
    bgcanvas = document.getElementById("background");
    bgcanvas.style.position = "absolute";
    bgcanvas.style.left = "10px";
    bgcanvas.style.top = "10px";
    bgcanvas.style.zIndex = 1;
    bgctx = bgcanvas.getContext("2d");

    darkcanvas = document.getElementById("dark");
    darkcanvas.style.position = "absolute";
    darkcanvas.style.left = "10px";
    darkcanvas.style.top = "10px";
    darkcanvas.style.zIndex = 4;
    darkctx = darkcanvas.getContext("2d");

    btncanvas = document.getElementById("button");
    btncanvas.style.position = "absolute";
    btncanvas.style.left = "10px";
    btncanvas.style.top = "10px";
    btncanvas.style.zIndex = 5;
    btnctx = btncanvas.getContext("2d");

    smpcanvas = document.getElementById("smartphone");
    smpcanvas.style.position = "absolute";
    smpcanvas.style.left = "10px";
    smpcanvas.style.top = "680px";
    smpcanvas.style.zIndex = 5;
    smpctx = smpcanvas.getContext("2d");
    draw();
}

function draw() {
    const chara = new Image();
    chara.src = "./images/backgroundimg.jpg";  // 画像のURLを指定
    chara.onload = () => {
        bgctx.drawImage(chara, 0, 0);
    };
    darkctx.fillStyle = "rgba(" + [0, 0, 0, 0.7] + ")";
    darkctx.fillRect(0, 0, darkcanvas.width, darkcanvas.height);
    btnctx.fillStyle = "rgba(" + [255, 255, 255, 0.9] + ")";
    btnctx.fillRect(450, 200, 300, 60);
    btnctx.fillRect(450,300,300,60);
    btnctx.font = '30pt Arial';
    btnctx.fillStyle = "black";
    btnctx.fillText("EASY", 540, 240);
    btnctx.fillText("NORMAL", 510, 340);
    btnctx.fillStyle="white";
    btnctx.fillText("A,Dで回転，左右矢印キーで移動，下矢印キーで落下", 170, 500);
    clicklistener();
}

window.onload = function () {
    no_scaling();
    mobile_no_scroll();
    init();
};

function clicklistener(){
    btncanvas.addEventListener('click', onClick,false);
}

function onClick(e){
    var rect = e.target.getBoundingClientRect();
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
    pressstart();
}

function pressstart(){
    smpui();
    if (nowplaying == 1){
    if (x>=450 && x<=750 && y>=200 && y<= 260){
        firstspeed = 750;
        nowplaying++;
        easy = true;
        countdown();
    }else if(x>=450 && x<=750 && y>=300 && y<= 360){
        firstspeed = 500;
        nowplaying++;
        countdown();
    }else{
        clicklistener();
    }
}
}

function countdown(){
    btnctx.clearRect(0,0,btncanvas.width,btncanvas.height);
    darkctx.clearRect(0,0,darkcanvas.width,darkcanvas.height);
    darkctx.font = '30pt Arial';
    darkctx.fillStyle = "red";
    darkctx.fillText("READY?", 520, 300);
    PlaySEcount();
    highscore = getCookieValue('highscore');
    console.log(highscore);
    setTimeout(count,3000);
}

function PlaySEcount() {
  SEcount = new Audio();
  SEcount.src = "./sounds/SEcount.mp3";
  SEcount.play();
} 

function count(){
    darkctx.clearRect(0,0,darkcanvas.width,darkcanvas.height);
    setTimeout(document.getElementById("bgm").play(),6000);
    setup();
}

function smpui(){
    smpctx.fillStyle = "rgba(" + [255, 255, 255, 0.9] + ")";
    smpctx.fillRect(320,25,100,100);
    smpctx.fillRect(450, 25, 100, 100);
    smpctx.fillRect(560, 25, 100, 100);
    smpctx.fillRect(670,25,100,100);
    smpctx.fillRect(800,25,100,100);
    smpctx.font = '30pt Arial';
    smpctx.fillStyle = "black";
    smpctx.fillText("⟲", 350, 95);
    smpctx.fillText("◀", 480, 95);
    smpctx.fillText("▼", 590, 95);
    smpctx.fillText("▶", 700, 95);
    smpctx.fillText("⟳", 830, 95);
    smpcanvas.addEventListener('click', onClickbutton,false);
}
function onClickbutton(be){
    var brect = be.target.getBoundingClientRect();
    bx = be.clientX - brect.left;
    by = be.clientY - brect.top;
    clickbutton();
}

function clickbutton(){
    console.log(bx+""+by);
    if (nowplaying == 2){
    if(bx>=320 && bx<=420 && by>=25 && by<= 125){
      console.log("button1");
        rotated = lrotate(current_mino);
      if (canMove(0, 0, rotated)) {
        current_mino = rotated;
        PlaySErotate();
        console.log("l rotated");
      }
    }else if(bx>=450 && bx<=550 && by>=25 && by<= 125){
      console.log("button2");
        if (canMove(-1, 0)) {
        current_x--;
        PlaySEmove();
      }
    }else if(bx>=560 && bx<=660 && by>=25 && by<= 125){
      console.log("button3");
        if (canMove(-1, 0)) {
        current_y++;
        PlaySEmove();
      }
    }else if(bx>=670 && bx<=770 && by>=25 && by<= 125){
      console.log("button4");
        if (canMove(-1, 0)) {
        current_x++;
        PlaySEmove();
      }
    }else if(bx>=800 && bx<=900 && by>=25 && by<= 125){
      console.log("button5");
        rotated = rrotate(current_mino);
      if (canMove(0, 0, rotated)) {
        current_mino = rotated;
        PlaySErotate();
        console.log("r rotated");
      }
    }else{}
}
}