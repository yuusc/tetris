var fieldw = 300,
    fieldh = 600;
var nextareaw = 150,
    nextareah = 150;
var cols = 10,
    rows = 20;
var ncols = 5,
    nrows = 5;
var firstspeed = 500;
var blockw = fieldw / cols,
    blockh = fieldh / rows;
//キャンバスの設定
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
var current_x = 3,
    current_y = 0;
var field = [];
var nextarea = [];
var status = "start";
var play;
var level = 1;
var canlevelup = true;
var leveluptf = false;
var interval = true;
var SEfix, SEclearrow, SEmove, SErotate, SElevelup, SEgameover;
var lastlv = 1;
var highscore;
var speed = 500;
var score = 0;
var clearlinenum = 0;
var nowplaying = 1;
var newrecord = 0;
var nfill = true;


function setup() { //初期設定
    for (var y = 0; y < rows; y++) { //フィールドを作成
        field[y] = [];
        for (var x = 0; x < cols; x++) {
            field[y][x] = 0;
        }
    }

    for (var y = 0; y < nrows; y++) { //次のミノを表示するエリアを作成
        nextarea[y] = [];
        for (var x = 0; x < ncols; x++) {
            nextarea[y][x] = 0;
        }
    }

    //cookieもしくはlocal strageからハイスコアを取得
    if (typeOf.call(parseInt(getCookieValue('highscore'), 10)) == "number") { //cookieにハイスコアが存在する
        highscore = parseInt(getCookieValue('highscore'), 10); //ハイスコアを反映
        console.log("typeOf.call(getCookieValue('highscore')) == number  true");
        console.log(highscore);
    } else { //cookieにハイスコアがないとき
        highscore = parseInt(localStorage.getItem('highscore'), 10); //ローカルストレージから取得
        console.log("isNaN: " + Number.isNaN(highscore));
        if (Number.isNaN(highscore) == true) { //ローカルストレージにもないとき
            localStorage.removeItem('highscore'); //ローカルストレージのhighscoreを初期化
            highscore = 0; //ハイスコアを0に
        }
    }

    console.log("highscore: " + highscore);
    current_mino = newMino(); //最初のミノを取得
    post_mino = newnextmino(); //次のミノを取得
    render(); //最初のミノを描画
    shownextmino(); //次のミノを描画

    speed = firstspeed - (level - 1) * 20; //スピードの初期設定
    startgame(); //ゲームスタート
}

function startgame() {
    displayscore(); //スコアボードを更新
    play = setInterval(tick, speed); //インターバルを設定
}

function stopgame() { //ゲームを一時停止
    clearInterval(play); //インターバルを解除
}

//SEを設定
function PlaySEfix() { //固定
    SEfix = new Audio();
    SEfix.src = "./sounds/SEfix.mp3";
    SEfix.play();
}

function PlaySEclearrow() { //行消去
    SEclearrow = new Audio();
    SEclearrow.src = "./sounds/SEclearrow.mp3";
    SEclearrow.play();
}

function PlaySEmove() { //移動
    SEmove = new Audio();
    SEmove.src = "./sounds/SEmove.mp3";
    SEmove.play();
}

function PlaySErotate() { //回転
    SErotate = new Audio();
    SErotate.src = "./sounds/SErotate.mp3";
    SErotate.play();
}

function PlaySElevelup() { //レベルアップ
    SElevelup = new Audio();
    SElevelup.src = "./sounds/SElevelup.mp3";
    SElevelup.play();
}

function PlaySEgameover() { //ゲームオーバー
    SEgameover = new Audio();
    SEgameover.src = "./sounds/SEgameover.mp3";
    SEgameover.play();
}


function getCookieValue(a) { //cookie内検索用
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}

function typeOf() {
    'use strict';
    console.log(typeof this);
}

function displayscore() { //スコアを表示
    scrctx.clearRect(0, 0, scorecanvas.width, scorecanvas.height)
    scrctx.fillText(`SCORE: ${score}`, 15, 80);
    scrctx.fillText(`HIGH SCORE:`, 15, 130);
    scrctx.fillText(highscore, 60, 160);
    scrctx.fillText(`LEVEL: ${level}`, 20, 210);
}

function render() { //現在のミノを設定
    fdctx.clearRect(0, 0, fieldw, fieldh); //フィールド内のミノを消去
    fdctx.strokeStyle = "white"; //ミノの輪郭を白に
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

function shownextmino() { //次のミノを設定
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
    nxtctx.fillText('NEXT MINO', 2, 30); //next minoフィールドの文字
}

function drawBlock(x, y, block) { //設定された情報からミノを描画
    if (block) {
        fdctx.fillStyle = COLORS[block - 1];
        fdctx.fillRect(x * blockw, y * blockh, blockw - 1, blockh - 1);
        fdctx.strokeRect(x * blockw, y * blockh, blockw - 1, blockh - 1);
    }
}

function drawnextBlock(x, y, block) { //次のミノを描画
    if (block) {
        nxtctx.fillStyle = COLORS[block - 1];
        nxtctx.fillRect(x * blockw, y * blockh, blockw - 1, blockh - 1);
        nxtctx.strokeRect(x * blockw, y * blockh, blockw - 1, blockh - 1);
    }
}

function tick() { //インターバルの中身
    if (nowplaying == 2) { //ゲーム中のとき
        if (canMove(0, 1)) { //下にミノが無ければ
            current_y++; //1つ下に移動
        } else { //下にミノがある時
            fix(); //ミノを固定
            clearrows(); //消せるか判定
            gameover(); //ゲームオーバーを判定
            current_mino = newMino(); //新しくミノを取得
            post_mino = newnextmino(); //次の次のミノを取得
            shownextmino(); //次の次のミノの描画
            current_x = 3; //新しいミノの描画位置の設定
            current_y = 0;
            console.log("clearlinenum" + clearlinenum);
            //スコアと落下スピードの変更
            if (score != 0) { //スコアが0でないとき
                level = 1 + Math.floor(clearlinenum / 3); //レベルを計算
                if (easy == false) { //イージーモードでないとき
                    if (level < 25) { //レベルが25よりも下だったら
                        speed = firstspeed - level * 20;
                    } else { //レベルが25以上だったら
                        speed = 10
                    }
                } else if (easy == true) { //イージーモードのとき
                    if (level < 37) { //レベルが37よりも下だったら
                        speed = firstspeed - level * 20;
                    } else { //レベルが37以上だったら
                        speed = 10
                    }
                }
                if (lastlv < level) { //レベルが上がったら
                    PlaySElevelup(); //レベルアップ音を鳴らす
                }
            }
            lastlv = level; //前回のレベルとして記録
            displayscore(); //スコアボードの更新
        }
        render(); //ミノの描画
        if (!nfill) { //新規描画エリアにミノがあったら
            nowplaying++; //ゲームオーバーへ
        }
        clearInterval(play); //スピードの更新のためにインターバルの解除
        console.log("speed: " + speed);
        startgame(); //新しいスピードでインターバルを再度開始
    }
}

function fix() { //ミノを固定する
    for (var y = 0; y < 4; ++y) {
        for (var x = 0; x < 4; ++x) {
            if (current_mino[y][x]) {
                field[current_y + y][current_x + x] = current_mino[y][x];
                PlaySEfix(); //固定時のSEを鳴らす
            }
        }
    }
}

function canMove(move_x, move_y, move_mino) { //下にミノがあるかどうかの判定
    var next_x = current_x + move_x;
    var next_y = current_y + move_y;
    var next_mino = move_mino || current_mino;
    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 4; x++) {
            if (next_mino[y][x]) {
                if (next_y + y >= rows ||
                    next_x + x < 0 ||
                    next_x + x >= cols ||
                    field[next_y + y][next_x + x]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function clearrows() { //行が埋まっているか判定し行を消去する
    for (var y = rows - 1; y >= 0; y--) {
        var fill = true; //とりあえず埋まっていると仮定
        for (var x = 0; x < cols; x++) {
            if (field[y][x] == 0) { //埋まっていない時に
                fill = false; //fillをfalseにして埋まっていないとする
                break;
            }
        }
        if (fill) { //埋まっているとき
            for (var v = y - 1; v >= 0; v--) {
                for (var x = 0; x < cols; x++) {
                    field[v + 1][x] = field[v][x];
                }
            } //行を消して全体を下に移動
            clearlinenum++; //消した行数を1増やす
            score = clearlinenum * 10; //スコアの再計算
            y++;
            PlaySEclearrow(); //SEを鳴らす
        }
    }
}

document.body.onkeydown = function(e) { //キーの判定
    switch (e.keyCode) {
        case 37: //←
            if (canMove(-1, 0)) {
                current_x--;
                PlaySEmove();
            }
            break;
        case 39: //→
            if (canMove(1, 0)) {
                current_x++;
                PlaySEmove();
            }
            break;
        case 40: //↓
            if (canMove(0, 1)) {
                current_y++;
                PlaySEmove();
            }
            break;
        case 65: //D
            rotated = lrotate(current_mino);
            if (canMove(0, 0, rotated)) {
                current_mino = rotated;
                PlaySErotate();
                console.log("l rotated");
            }
            break;
        case 68: //A
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


function gameover() { //新規描画エリア内にミノがあるかどうかの判定
    for (var y = 1; y >= 0; y--) {
        nfill = true; //無いと仮定
        for (var x = 3; x <= 6; x++) {
            if (field[y][x] != 0)
                nfill = false; //あるのでnfillをfalseに
            break;
        }
    }

    if (!nfill) { //gameover
        stopgame(); //インターバルを解除
        PlaySEgameover(); //ゲームオーバーのSEの再生
        result(); //リザルト画面に移動
    }
}

function result() {
    //nowplaying=3;
    document.getElementById("bgm").pause(); //bgmの停止
    document.getElementById("result").play() //リザルトbgmの再生
    clearInterval(play); //インターバルの停止
    //ハイスコアの判定
    if (score > highscore) { //ハイスコアよりも高かったとき
        document.cookie = `highscore = ${score}; max-age = 15552000; secure`; //cookieに書き込み
        localStorage.setItem('highscore', `${score}`); //ローカルストレージにバックアップ
        console.log("new record: " + score);
        newrecord = 1; //新記録
    } else {
        document.cookie = `highscore = ${highscore}; max-age = 15552000; secure`; //cookieの期限を更新
        localStorage.setItem('highscore', `${highscore}`); //ローカルストレージにバックアップ
        console.log("score: " + score);
    }
    console.log("cookie: " + document.cookie);
    console.log("cookie highscore: " + getCookieValue('highscore'));
    //暗転
    darkctx.fillStyle = "rgba(" + [0, 0, 0, 0.7] + ")";
    darkctx.fillRect(0, 0, darkcanvas.width, darkcanvas.height);
    //リプレイボタンの表示
    btnctx.fillStyle = "rgba(" + [255, 255, 255, 0.9] + ")";
    btnctx.fillRect(450, 300, 300, 60);
    //スコアの表示
    btnctx.font = '30pt Arial';
    btnctx.fillStyle = "white";
    btnctx.fillText("SCORE: " + score, 510, 240);
    if (newrecord == 1) { //もし新記録がでたら
        btnctx.fillStyle = "red";
        btnctx.fillText("NEW RECORD!", 490, 180);
    }
    //リプレイボタンの文字の表示
    btnctx.fillStyle = "black";
    btnctx.fillText("REPLAY", 510, 340);
    btncanvas.addEventListener('click', onClickresult, false); //ボタンが押されたか判定
}

function onClickresult(e) { //クリック位置の取得
    var rect = e.target.getBoundingClientRect();
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
    restart();
}

function restart() {
    if (nowplaying == 3) { //ゲームが終了していることの確認
        if (x >= 450 && x <= 750 && y >= 300 && y <= 360) { //ボタンを押しているとき
            location.reload(); //リスタートへ(再読み込みによる強制的なリスタート)
        } else {} //何も押されていない場合はもう一度クリック判定へ
    }
}