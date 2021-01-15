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
var rdm = false;

function newMino() {
    //var id = Math.floor(Math.random() * MINOS.length);
    var g = randomGenerator();
    if (rdm){
        g.next();
    }
    console.log(g);
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

function rotate(mino) {
    var rotated = [];
    for (var y = 0; y < 4; ++y) {
        rotated[y] = [];
        for (var x = 0; x < 4; ++x) {
            rotated[y][x] = mino[x][- y + 3];
        }
    }
    return rotated;
}

function* randomGenerator() {
    let bag = [];
    rdm = true;
    while (true) {
        if (bag.length === 0) {
            bag = [0, 1, 2, 3, 4, 5, 6];
            for (i = bag.length; 1 < i; i--) {
                k = Math.floor(Math.random() * i);
                [bag[k], bag[i - 1]] = [bag[i - 1], bag[k]];
            }
        }
        id = bag[0];
        bag.shift();
        yeild id;//なぜ？
    }
}