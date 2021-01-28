//ミノを定義
var MINOS = [
    [
        [1, 1, 1, 1],
        [0, 0, 0, 0] // I テトリミノ
    ],
    [
        [0, 1, 1, 0],
        [0, 1, 1, 0] // O テトリミノ
    ],
    [
        [0, 1, 1, 0],
        [1, 1, 0, 0] // S テトリミノ
    ],
    [
        [1, 1, 0, 0],
        [0, 1, 1, 0] // Z テトリミノ
    ],
    [
        [1, 0, 0, 0],
        [1, 1, 1, 0] // J テトリミノ
    ],
    [
        [0, 0, 1, 0],
        [1, 1, 1, 0] // L テトリミノ
    ],
    [
        [0, 1, 0, 0],
        [1, 1, 1, 0] // T テトリミノ
    ]
];
//ミノの色を定義
var COLORS = ["cyan", "yellow", "green", "red", "blue", "orange", "magenta"];
var minolist = [];
var firsttime = true; //初回の実行であるか
var id;
var nextid;


function newMino() { //新しいミノを取得
    var g = randomGenerator(); //ジェネレータより
    console.log(minolist.length);
    if (minolist.length == 0 || minolist.length == 1) { //minolistに1つしか無かったら
        for (num of g) {
            if (minolist.length != 7) {
                minolist.push(num); //ミノリストに1つずつ追加
            } else {
                break;
            }
        }
    }
    if (firsttime) { //初めての時
        id = minolist[0]; //初期のミノ
        nextid = minolist[1]; //次のミノ
        minolist.shift(); //最初のミノをリストから削除
        minolist.shift(); //次のミノをリストから削除
        firsttime = false; //次からはここは実行しないようにする
    } else { //2回目以降の時
        id = nextid; //次のミノを繰り上げ
        nextid = minolist[0]; //次の次のミノを取得
        minolist.shift(); //リストの先頭を削除
    }
    console.log("id" + id);
    console.log("nextid" + nextid)
        //ミノを扱いやすいカタチに変換
    var mino = [];
    for (var y = 0; y < 4; y++) {
        mino[y] = [];
        for (var x = 0; x < 4; x++) {
            mino[y][x] = 0;
            if (MINOS[id][y]) {
                if (MINOS[id][y][x]) {
                    mino[y][x] = id + 1;
                }
            }
        }
    }
    return mino;
}

function newnextmino() { //次のミノの加工
    console.log("newnextmino " + nextid);
    //扱いやすいカタチに変換
    var nextmino = [];
    for (var y = 0; y < 4; y++) {
        nextmino[y] = [];
        for (var x = 0; x < 4; x++) {
            nextmino[y][x] = 0;
            if (MINOS[nextid][y]) {
                if (MINOS[nextid][y][x]) {
                    nextmino[y][x] = nextid + 1;
                }
            }
        }
    }
    console.log(nextmino);
    return nextmino;
}

function lrotate(mino) { //左回転
    var rotated = [];
    for (var y = 0; y < 4; ++y) {
        rotated[y] = [];
        for (var x = 0; x < 4; ++x) {
            rotated[y][x] = mino[x][-y + 3];
        }
    }
    return rotated;
}

function rrotate(mino) { //右回転
    var rotated = [];
    for (var y = 0; y < 4; ++y) {
        rotated[y] = [];
        for (var x = 0; x < 4; ++x) {
            rotated[y][x] = mino[-x + 3][y];
        }
    }
    return rotated;
}


function* randomGenerator() { //ランダムにミノを生成(仕組みはreadme.md)
    let bag = [];
    var num;
    while (true) {
        if (bag.length === 0) {
            bag = [0, 1, 2, 3, 4, 5, 6];
            for (i = bag.length; 1 < i; i--) {
                k = Math.floor(Math.random() * i);
                [bag[k], bag[i - 1]] = [bag[i - 1], bag[k]];
            }
        }
        num = bag[0];
        bag.shift();
        yield num;
    }
}