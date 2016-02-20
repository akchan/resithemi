Resithemi
========================================

Resithemiは遺伝的アルゴリズムを用いてスケジューリングを行うためのJavaScriptフレームワークです。遺伝的アルゴリズムを用いたスケジュール最適化を簡便に行うことができます。初期臨床研修医の診療科ローテーションスケジューリングを想定して開発されています。



サンプル
========================================

リポジトリ内の `sample/resithemi.html` に動作サンプルがあります。リポジトリは `git clone` コマンドを用いるか、[https://github.com/akchan/resithemi](https://github.com/akchan/resithemi) の画面右上`Download ZIP` からダウンロードすることができます。



How to use
========================================



入力データ
----------------------------------------

入力データは下に示された形式に従ったCSV形式で `resithemi.html` のtextareaに入力します。

1行目は2つの整数から構成されます。Rは研修医の数を自然数で指定します。Uは各研修医のスケジュールが何クールから成っているかを指定します。

2〜R+1行目は研修医名とU個の診療科名をカンマで区切ったものが並びます。診療科名の並びはその研修医の希望スケジュールを表します。

R+2行目以降はsetOptionParser関数に渡した関数（parser）に渡されます。Evaluatorで使用したい変数はここに記載します。

```
R,U
Resident1,Cardiology,Obstetrics, ...
Resident2,InternalMedicine,Surgery, ...
...
ResidentR,Psychiatry,Anesthesiology, ...
CSV for option parser
```



Options parser
----------------------------------------

入力データのR+2行目以降をevaluatorで使用したい場合は `js/option_parser.js` 内にparserを定義します。

#### 診療科ごとに定員を定義する例

入力データのR+2行目以降

```
循環器内科,4
呼吸器内科,3
消化器外科,3
```

```javascript
// js/option_parser.js

setOptionParser(function(csvString) {
    var lines = csvString.split(/\n/),
        options = {capacities: {} };

    for (var i = 0; i < lines.length; i++) {
        var ary = lines[i].split(“,”),
            name = ary[0],
            capacity = Number(ary[1]);
        options.capacities[name] = capacity;
    }
    
    return options;
});
```



Evaluator
----------------------------------------

どのようなスケジュールを良いとするかは `js/config.js` 内で `GA.Gene.add_evaluator()` や `GA.Chromosome.add_evaluator()` 用いることで定義できます。

EvaluatorはGeneオブジェクトとChromosomeオブジェクトのそれぞれに対して定義できます。

※GeneオブジェクトへのevaluatorとChromosomeオブジェクトのどちらでも定義可能なものはできるだけGeneオブジェクトでevaluatorを定義した方が高速に動作します。


### GA.Gene.add_evaluator(function)

Geneオブジェクトにevaluatorを定義する関数。

#### 引数

- function: 下の3つの引数を受け取りNumberオブジェクトを返す関数。返値が大きいほど良いスケジュールとして評価される。
	- name: 研修医の名前
	- currentSchedule: 現在のスケジュールを示す配列
	- initialSchedule: 初期スケジュールを示す配列


### GA.Chromosome.add_evaluator(function)

Chromosomeオブジェクトにevaluatorを定義する関数。

#### 引数

- function: 1つの引数を受け取りNumberオブジェクトを返す関数。返値が大きいほど良いスケジュールとして評価される。
	- genes: Chromosomeオブジェクトが管理しているGeneオブジェクトの配列。


### 例

各研修医の希望にできるだけ沿っている方が良いとするevaluatorは次のように定義できます。

```javascript
// js/config.js

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

ResithemiではビルドツールにGruntを使用しています。

ソースコードからプロジェクトファイルをビルドするには以下のコマンドを実行して下さい。

```bash
cd /path/to/app
npm install
grunt less:development
```



License
========================================

Copyright (c) 2016 Satoshi Funayama (akchan)

このソフトウェアはMITライセンスの元で公開されています。LICENSE.txtを参照して下さい。





