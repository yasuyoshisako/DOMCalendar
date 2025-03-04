/*

# カレンダーデータ生成クラス  Calendar.js

## 使用例

```
const calendar = new Calendar(2007, 10);
calendar.header(["日", "月", "火", "水", "木", "金", "土"]);
calendar.data();
```

## プロパティ

###クラスプロパティ

* VERSION - バージョン番号
* HEAD    - カレンダーのデフォルトの曜日配列 ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

### インスタンスプロパティ

* year  - カレンダーの年
* month - カレンダーの月

## メソッド

### Calendar( year, month ) - コンストラクタ関数

```
const calendar = new Calendar( 2007, 10 );
```

### header( Array ) - カレンダーヘッダー部分の曜日配列の設定と取得

引数には配列を設定
配列の先頭は**日曜日**にすること（重要）

```
calendar.header(["日", "月", "火", "水", "木", "金", "土"]);
```
戻り値は曜日配列
引数を設定しない場合は呼び出し時の曜日配列を返す

### data( startDayOfWeek ) - カレンダーを生成するためのデータオブジェクトを返す

```
{
  year  : 2007,
  month :   10,
  head  : ["日", "月", "火", "水", "木", "金", "土"],
  body  : [
            "", 1, 2, 3, 4, 5, 6,
            7, 8, 9,10,11,12,13,
            14,15,16,17,18,19,20,
            21,22,23,24,25,26,27,
            28,29,30,31,"","",""
          ]
}
```

引数startDayOfWeekには週の始まりの曜日を指定
日曜日ならstartDayOfWeekに0、月曜日なら1、…、土曜日なら6
デフォルトは0で日曜日はじまりのカレンダーを生成

```
calendar.data(1); // 月曜日はじまりのカレンダーデータを生成
```
*/

class Calendar {

    constructor( year, month ) {
        this._data = {
            year  : year,
            month : month,
            order : [ 0, 1, 2, 3, 4, 5, 6 ],
            head  : Calendar.HEAD,
            body  : []
        };
    }

    // カレンダーヘッダー部分の曜日リストの設定と取得
    header( list ) {
        if ( list && list instanceof Array && list.length === 7 ) this._data.head = list;
        return this._data.head;
    }

    /*
    カレンダーのデータオブジェクトを取得
    引数（startDayOfWeek）で週の始まりの曜日を指定
    日曜日ならstartDayOfWeekに0、月曜日なら1、…、土曜日なら6
    デフォルトは0で日曜日はじまりのカレンダーを生成
    */
    data( startDayOfWeek ) {
        // 引数が指定されなければstartDayWeekに0を代入
        startDayOfWeek = startDayOfWeek || 0;

        const year  = this._data.year;
        const month = this._data.month;

        // 配列listOfDaysInMonthsに各月の日数を格納（うるう年にも対応）
        const listOfDaysInMonths = 
        [ 
            31, 28, 31, 30,
            31, 30, 31, 31,
            30, 31, 30, 31 
        ];
        if ( year % 4 === 0 && year % 100 !== 0 || year % 400 === 0 ) listOfDaysInMonths[1] = 29;

        // 月始めの曜日を求める
        // 日曜日ならbeginningOfMonthに0、月曜日なら1、…、土曜日なら6
        const beginningOfMonth = ( new Date(year + "/" + month + "/1") ).getDay();

        /*
        ヘッダを日曜日はじまりに並び替え & 曜日の番号配列wを生成
        例えば土曜日はじまりのカレンダーの場合wは[6, 0, 1, 2, 3, 4, 5]
        月曜日はじまりのカレンダーの場合wは[1, 2, 3, 4, 5, 6, 0]になる
        */
        const init_sorted = [], w = [];
        for ( let i = 0; i < 7; i++ ) {
            init_sorted[this._data.order[i]] = this._data.head[i];
            w[i] = startDayOfWeek + i < 7 ? startDayOfWeek + i : (startDayOfWeek + i) % 7;
        }
        this._data.head  = init_sorted;
        this._data.order = w;

        // カレンダー１行目１列目から初日の前までの日数を求める
        let start = 0;
        for ( let i = 0; i < w.length; i++ ) {
            if ( w[i] == beginningOfMonth ) break;
            else                            ++start;
        }

        // ヘッダーの並び替え
        const sorted_head = [];
        for ( let i = 0; i < w.length; i++ ) {
            sorted_head[i] = this._data.head[w[i]];
        }
        this._data.head = sorted_head;

        // カレンダーボディ部分を生成
        const lenMonth  = listOfDaysInMonths[month - 1];       // month月の日数
        const lenRow    = Math.ceil( (start + lenMonth) / 7 ); // カレンダーの行数
        this._data.body = [];                                  // 初期化
        for ( let row = 0; row < lenRow; row++ ) {
            this._data.body[row] = [];
            for ( let col = 0; col < 7; col++ ) {
                let day = (row * 7) + col - start + 1;
                this._data.body[row][col] = day < 1 || day > lenMonth ? "" : day;
            }
        }

        return this._data;
 
    }
}

// バージョン情報
Calendar.VERSION = "2.00";

// 曜日配列
Calendar.HEAD = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
