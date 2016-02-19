
Resithemi
========================================

Resithemiは遺伝的アルゴリズムを用いてスケジューリングを行うためのJavaScriptフレームワークです。初期臨床研修医の診療科ローテーションスケジューリングを想定して開発されています。



サンプル
========================================

リンク



入力データの形式
========================================

各研修医の希望スケジュールやevaluator, validatorへのオプションは、下に示された形式に従ったCSV形式で入力します。

1行目は2つの整数から構成されます。Rは研修医の数を自然数で指定します。Uはローテーション単位数、つまり、各研修医のスケジュールが何クールから成っているかを指定します。

2〜R+1行目は研修医名とU個の診療科名をカンマで区切ったものが並びます。ｓ

R+2行目移行はsetOptionParser関数に渡した関数（parser）に渡されます。

```
R,U
Resident1,Cardiology,Obstetrics, ...
Resident2,InternalMedicine,Surgery, ...
...
CSV for options
```



Evaluatorとvalidator
========================================

どのようなローテーションスケジュールが良いとするかはevaluatorを設定することによって定義できます。EvaluatorはGeneオブジェクトとChromosomeオブジェクトのそれぞれに対して定義できます。

※GeneオブジェクトへのevaluatorとChromosomeオブジェクトのどちらでも定義可能なものはできるだけGeneオブジェクトでevaluatorを定義した方が、キャッシュが効くため高速に動作します。

### GA.Gene.add_evaluator(function)

function: 3つの引数を受け取りNumberオブジェクトを返す関数。返値が大きいほど良いスケジュールとして評価される。

- name: 研修医の名前
- currentSchedule: 現在のスケジュールを示す配列
- initialSchedule: 初期スケジュールを示す配列

### GA.Chromosome.add_evaluator(function)

function: 1つの引数を受け取りNumberオブジェクトを返す関数。返値が大きいほど良いスケジュールとして評価される。

- genes: Chromosomeオブジェクトが管理しているGeneオブジェクトの配列。各研修医のスケジュールを表すGeneオブジェクトの配列。

### 定義例

例えば、各研修医の希望にできるだけ沿っている方が良いとするevaluatorは次のように定義できます。

```javascript
// without Underscore.js
GA.Gene.add_evaluator(function(name, currentSchedule, initialSchedule) {
    var satisfaction_score = 0;
    
    for (var i = 0; i < currentSchedule.length; i++) {
        if (currentSchedule[i] === initialSchedule[i]) {
            satisfaction_score += 1;
        }
    }
    
    return satisfaction_score;
});

// with Underscore.js
GA.Gene.add_evaluator(function(name, currentSchedule, initialSchedule) {
    var satisfaction_score = _.chain(currentSchedule)
                .zip(initialSchedule)
                .inject(function(sum, ary) {
                    return sum + (ary[0] === ary[1] ? 1 : 0);
                }, 0)
                .value();
    return satisfaction_score;
});
```




Build
========================================

ResithemiではビルドツールにGruntを使用しています。ソースコードからプロジェクトファイルをビルドするには以下のコマンドを実行して下さい。

```bash
cd /path/to/app
npm install
grunt less:development
```




License
========================================

Copyright (c) 2016 Satoshi Funayama (akchan)

このソフトウェアはMITライセンスの元で公開されています。LICENSE.txtを参照して下さい。





