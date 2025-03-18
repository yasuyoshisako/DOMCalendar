/*
# Documnt Object Model (DOM)形式のカレンダー生成クラス　DOMCalendar.js

カレンダーデータ生成クラスCalendar.jsのサブクラス

## 使用例

```
const calendar = new DOMCalendar(2007, 10);

calendar.header(["日", "月", "火", "水", "木", "金", "土"]);

calendar.link( 8, { href : "#", title : "体育の日" })
        .link(14, { href : "#", title : "鉄道の日" })
        .link(30, { href : "#", title : "初恋の日" })
        .caption("2007年10月")
        .html();
```
## プロパティ

### クラスプロパティ

* MONTH     - 月の名前配列（英語）
* DAYOFWEEK - 曜日の名前配列（英語）

## メソッド

### DOMCalendar( year, month ) - コンストラクタ関数

```
const calendar = new DOMCalendar(2007, 10);
```

### link( day, attrs ) - カレンダーの日付にリンク情報を挿入する

```
calendar.link(8, { href : "#", title : "体育の日" });
```

第1引数にはリンクを挿入したい日、第2引数にはHTMLのリンク（a）要素に追加したい属性の連想配列
連想配列のキーには（a）要素に指定できる属性の名前にすること

### caption( str ) - カレンダーの見出し（table要素内のcaption要素）を設定

```
calendar.caption("2007年10月のカレンダー");
```

### html( startDayOfWeek ) - HTMLのカレンダー用table要素のオブジェクトを返す

```
calendar.html();
```

引数startDayOfWeekには週の始まりの曜日を指定
日曜日ならstartDayOfWeekに0、月曜日なら1、…、土曜日なら6
デフォルトは0で日曜日はじまりのカレンダーを生成

### header( Array ) - カレンダーヘッダー部分の曜日配列の設定と取得（Calendarクラスから継承）

引数には配列を設定
配列の先頭は**日曜日**にすること（重要）

```
calendar.header(["日", "月", "火", "水", "木", "金", "土"]);
```
戻り値は曜日配列
引数を設定しない場合は呼び出し時の曜日配列を返す

### data( startDayOfWeek ) - カレンダーを生成するためのデータオブジェクトを返す（Calendarクラスから継承）

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

class DOMCalendar extends Calendar {

    constructor( year, month ) {
        super( year, month );
        this._links   = [];
        this._today   = new Date();
        this._caption = `${DOMCalendar.MONTH[month - 1].toUpperCase()} ${year}`;
    }

    // インスタンスメソッド - リンクの追加
    link( day, attrs ) {
        this._links.push({
            day   : day,   // 日にち
            attrs : attrs  // 連想配列（例：{ href : "https://google.com", title="Google" }）
        });
        return this;
    }

    // 表の見出しの設定
    caption( str ) {
        this._caption = !str ? this._caption : str;
        return this;
    }

    // インスタンスメソッド - カレンダーのDOMオブジェクトを返す
    html( startDayOfWeek ) {
        /*
        何曜日始まりのカレンダーにするかを決定する引数startDayOfWeekを
        Calendarクラスから継承したdataメソッドの引数に渡して
        カレンダーのデータオブジェクトをdataに格納
        */
        const data = this.data( startDayOfWeek );

        const year  = data.year;  // カレンダーの年
        const month = data.month; // カレンダーの月
        // カレンダーのcaptionに使う文字列
        const title = this._caption;

        const links = this._links;

        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const tbody = document.createElement("tbody");
        const caption = document.createElement("caption");

        table.setAttribute("class", "calendar");
        table.setAttribute("summary", "This table represents a calendar.");

        caption.appendChild(document.createTextNode(title));
        table.appendChild(caption);

        for ( let row = 0; row < data.body.length + 1; row++ ) {
            let tr = document.createElement("tr");
            for ( let col = 0; col < 7; col++ ) {
                let className = DOMCalendar.DAYOFWEEK[data.order[col]].toLowerCase();
                if ( row === data.body.length ) {
                    let th = document.createElement("th");
                    th.appendChild(document.createTextNode(data.head[col]));
                    th.setAttribute("class", className);
                    tr.appendChild(th);
                    continue;
                }
                let day = data.body[row][col];
                let td = document.createElement("td");
                td.setAttribute("class", className);
                // カレンダーの生成日と一致する日のtd要素のclass属性に"today"を追加
                if ( year  === this._today.getFullYear()  && 
                     month === this._today.getMonth() + 1 && 
                     day   === this._today.getDate() ) 
                {
                    td.setAttribute("class", `${className} today`);
                }
                let link;
                for ( let i = 0; i < links.length; i++ ) {
                    if ( links[i].day === day ) {
                        link = document.createElement("a");
                        for ( let key in links[i].attrs ) {
                            link.setAttribute( key, links[i].attrs[key] );
                        }
                        link.appendChild(document.createTextNode(day));
                        td.setAttribute("class", `${className} specialday`);
                        td.appendChild(link);
                        break;
                    } 
                }
                if ( !td.hasChildNodes() ) td.appendChild(document.createTextNode(day));
                tr.appendChild(td);
            }
            ( row < data.body.length ? tbody : thead ).appendChild(tr);
        }
        table.appendChild(thead);
        table.appendChild(tbody);

        return table;
    }
}

// バージョン情報
DOMCalendar.VERSION = "2.00";

// クラスプロパティ（月名）
DOMCalendar.MONTH = [
    "January",  "February",    "March",    "April",
        "May",      "June",     "July",   "August",
  "September",   "October", "November", "December"
];

// クラスプロパティ（週名）
DOMCalendar.DAYOFWEEK = [
    "Sunday", "Monday",  "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"
];
