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

var COLORS = ["cyan", "yellow", "green", "red", "blue", "orange", "magenta"];
var minolist = [];
var firsttime = true;
    var id;
    var nextid;


function newMino() {
    //var id = Math.floor(Math.random() * MINOS.length);

    var g = randomGenerator();
    console.log(minolist.length);
    if (minolist.length == 0||minolist.length == 1) {   //minolistに1つしか無かったら
        for (num of g) {
            if (minolist.length != 7){
            minolist.push(num);
    //        console.log(minolist);
            }else{
                break;
            }
        }
    }
    if (firsttime){
        id = minolist[0];
        nextid = minolist[1];
        minolist.shift();
        minolist.shift();
        firsttime = false;
    }else{
//        console.log(nextid);
        id = nextid;
        nextid = minolist[0];
        minolist.shift();
}
    console.log("id"+id);
    console.log("nextid"+nextid)
//    console.log(MINOS[6][0][0]);
    var mino = [];
    for (var y = 0; y < 4; y++) {
        mino[y] = [];
        for (var x = 0; x < 4; x++) {
            mino[y][x] = 0;
            //console.log(MINOS[id][y]);
            if (MINOS[id][y]) {
                //console.log(MINOS[id][y][x]);
                if (MINOS[id][y][x]) {
                    mino[y][x] = id + 1;
                }
            }
        }
    }
    
    //console(mino);
    return mino;
}
function newnextmino(){
    console.log("newnextmino "+nextid);
    var nextmino = [];
    for (var y = 0; y < 4; y++) {
        nextmino[y] = [];
        for (var x = 0; x < 4; x++) {
            nextmino[y][x] = 0;
            //console.log(MINOS[id][y]);
            if (MINOS[nextid][y]) {
                //console.log(MINOS[id][y][x]);
                if (MINOS[nextid][y][x]) {
                    nextmino[y][x] = nextid + 1;
                }
            }
        }
    }
    console.log(nextmino);
    return nextmino;
}

function lrotate(mino) {
    var rotated = [];
    for (var y = 0; y < 4; ++y) {
        rotated[y] = [];
        for (var x = 0; x < 4; ++x) {
            rotated[y][x] = mino[x][- y + 3];
        }
    }
    return rotated;
}

function rrotate(mino) {
    var rotated = [];
    for (var y = 0; y < 4; ++y) {
        rotated[y] = [];
        for (var x = 0; x < 4; ++x) {
            rotated[y][x] = mino[-x + 3][y];
        }
    }
    return rotated;
}


function* randomGenerator() {
    let bag = [];
    var num;
    while (true) {
        if (bag.length === 0){
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