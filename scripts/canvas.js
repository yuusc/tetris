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
var x = 0;
var y = 0;



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
    if (nowplaying == 1){
    if (x>=450 && x<=750 && y>=200 && y<= 260){
        firstspeed = 750;
        nowplaying++;
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