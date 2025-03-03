# DOMCalendar

指定された年月のカレンダーをDocument Object Model（DOM）によってtable要素（オブジェクト）で作成する自作JavaScriptライブラリ

ES3くらいの仕様で記述され長いこと放置されていたファイルをES6に修正

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
