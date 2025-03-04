# DOMCalendar

指定された年月のカレンダーをDocument Object Model（DOM）によってtable要素（オブジェクト）で作成する自作JavaScriptライブラリ

ES3くらいの仕様で記述され長いこと放置されていたファイルをES6に修正

## 特徴

### カレンダー生成に必要なデータをJSON形式で返す

`Calenadar.js`ではカレンダーのTable要素生成に必要なデータをJSON形式で返します。

```
// 2025年3月のデータ（日曜日始まり）
{
    year  : 2025, // 2025年
    month : 3, // 3月
    order : [0,1,2,3,4,5,6], // 曜日の並び順
    head  : ["SUN","MON","TUE","WED","THU","FRI","SAT"], // HTMLのhead要素の曜日配列
    body  : [ // HTMLのbody要素の曜日配列
                  ,  ,  ,  ,  ,  , 1,
                 2, 3, 4, 5, 6, 7, 8,
                 9,10,11,12,13,14,15,
                16,17,18,19,20,21,22,
                23,24,25,26,27,28,29,
                30,31
             ]
}
```

### カレンダーを何曜日始まりにするか自由に設定できる

カレンダーの週の始まりは文化圏によって異なります。
例えばヨーロッパなら月曜日始まり、日本やアメリカでは日曜日始まり、イスラム圏では土曜日始まり、というように。
`Calendar.js`ではカレンダーの週の始まりを自由に設定できます。
極端な例として、2025年3月の水曜日始まりのカレンダーを生成した場合、以下のようなJSON形式のデータが返されます。
上の日曜日始まりのデータと比較してください。

```
// 2025年3月のデータ（水曜日始まり）
{
    year  : 2025, // 2025年
    month : 3, // 3月
    order : [3,4,5,6,0,1,2], // 曜日の並び順
    head  : ["WED","THU","FRI","SAT","SUN","MON","TUE"], // HTMLのhead要素の曜日配列
    body  : [ // HTMLのbody要素の曜日配列
                  ,  ,  , 1, 2, 3, 4,
                 5, 6, 7, 8, 9,10,11,
                12,13,14,15,16,17,18,
                19,20,21,22,23,24,25,
                26,27,28,29,30,31
             ]
}
```

### カレンダーをDOM形式のオブジェクトとして返す

`Calendar.js`を継承した`DOMCalendar.js`は、`Calendar.js`で生成されたJSONオブジェクトをDOM形式のtable要素のオブジェクトに変換します。

```
<table class="calendar" summary="This table represents a calendar.">
    <caption>MARCH 2005</caption>
    <thead>
        <tr>
            <th class="sunday">SUN</th>
            <th class="monday">MON</th>
            ...
            <th class="saturday">SAT</thead>
        </tr>
    <thead>
    <tbody>
        ...
        <tr>
            <td class="sunday">23</td>
            <td class="monday">24</td>
            ...
            <td class="saturday">29</td>
        </tr>
        ...
    </tbody>
</table>
```

DOM形式のtable要素オブジェクトを返すことで、要素内にイベントハンドラを追加するなどカスタマイズや拡張が容易になります。
また個人的に必要と思った箇所にclass属性を付けているので、スタイルシート（CSS）によるカスタマイズが可能です。

### 日付部分にリンクを追加できる

`DOMCalendar.js`内のコメント参照

## 使用法

HTMLのhead要素に2つのJavaScriptファイルを追加

```
<head>
    <script src="js/Calendar.js"></script>
    <script src="js/DOMCalendar.js"></script>
</head>
```

HTMLのbody要素に直接記述してカレンダーを生成する場合は以下のようにする

```
<body>
    <script>
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const calendar = new DOMCalendar(year, month);
        document.body.appendChild(calendar.html());
    </script>
</body>
```
