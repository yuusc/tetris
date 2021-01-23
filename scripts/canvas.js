var bgcanvas;
var bgctx;
var fieldcv;
var fdctx;
var nxtcanvas;
var nxtctx;
var scorecanvas;
var scrctx;
var btncanvas;
var btnctx;
var uicanvas;
var uictx;


function init() {
    bgcanvas = document.getElementById("background");
    bgcanvas.style.position = "absolute";
    bgcanvas.style.left = "10px";
    bgcanvas.style.top = "10px";
    bgcanvas.style.zIndex = 1;
    bgctx = bgcanvas.getContext("2d");
    draw();
}

function draw() {
    const chara = new Image();
  chara.src = "/image/backgroundimg.jpg";  // 画像のURLを指定
  chara.onload = () => {
    bgctx.drawImage(chara, 0, 0);
  };


}

window.onload = function() {
    init();
};