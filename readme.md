# TETRIS

コンテンツ表現工学　3班　グループワーク

# DEMO

プレイは [こちら](https://yuusc.github.io/tetris/)

初回プレイ時は動作が不安定になることがあります．そのまま続行しリプレイすると安定します．

キーボードの←，↓，→で移動しA，Dで回転します．
下部にスマートフォン用のボタンが試験的に設置されていますが動作の安定性は保証しかねます．

# Usage

[こちら](https://yuusc.github.io/tetris/)にアクセスすることで遊ぶことが出来ます．難易度を選択するとカウントダウンが始まり，ゲームが開始されます．
# Note
## 注意点
ハイスコアの保存にcookieを使用します．cookieを有効にするように警告が出る場合がありますが，問題が無ければ許可して頂けるとより快適にプレイすることが出来ます．cookieの中身は以下の通りです．

```js
document.cookie = `highscore = ${highscore}; max-age = 15552000; secure`
```

cookieは最終プレイ時より180日間保存されます．ブラウザを変更したりcookieの削除を行うとハイスコアが消えてしまいますのでご注意ください．


画面下部にスマートフォン用の操作ボタンを試験的に設置しました．現在は動作が非常に不安定でミノが壁にめり込む，ボタンを連打するとズームしてしまう，動作が遅いなどの不具合があります．ですのでプレイの際にはできるだけキーボードを使用して操作するようにしてください．

# Feauture
テトリスのようなゲームです．キーボード操作を行うことが出来ます．
- ハイスコアの保存
    
    ブラウザを閉じても180日間はハイスコアを保存することが出来ます．
- ミノの出現率の調整
  
  7種類のミノを1グループとして出現させることでそれぞれのミノをほぼ同じ確率で出現させることが出来ます．ジェネレータのプログラムを以下に掲載します．

  ```js
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
    ```

- 難易度の選択

    スタート画面で難易度を選択することが出来ます．EASYは初期の落下スピードが750，NORMALは500に設定されます．
    (正しくは1サイクルにかかる時間(ms)です．便宜上落下スピードという表現を使用しています．)

- スコアとレベル
    スコアは消した行数*10で計算されています．
    3行消すごとにレベルが1上がります．
    EASYでは37レベル，NORMALでは25レベルまではレベルの上昇に伴い落下スピードも上がります．

    ```js
    speed = firstspeed - level * 20;
    ```

- SEとBGM
    操作を行うごとにSEが流れます．レベルアップ時は行の削除とは異なる音が流れます．
    ゲーム開始時にBGMが流れ，リザルト画面ではBGMが切り替わります．

- 次のミノ
    右上に次のミノが表示されます．次のミノ(next id)は以下の方法で取得されます．

    ```js
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

    id = nextid;
    nextid = minolist[0];
    minolist.shift();
    ```

