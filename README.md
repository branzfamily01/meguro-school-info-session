# 東京都立目黒高等学校 学校説明会特設サイト

2026年度の学校説明会向け、スマートフォンファーストの静的サイトです。

## 現在の扱い

第1回（10/24）をメイン表示し、第2回（11/21）・第3回（12/19）は今後の予定として掲載しています。
詳細が未確定の項目は、昨年度情報を流用せず「後日公開」「調整中」としています。

## ファイル構成

- `index.html` 本体
- `css/style.css` デザイン
- `js/app.js` 申込受付状態・申込URLの設定
- `assets/` 今後の写真・画像置き場
- `content.md` 内容とデザイン方針の正本
- `README.md` このファイル

## 申込受付を開始するとき

`js/app.js` 冒頭の `SITE_CONFIG` を変更します。

例：

```js
const SITE_CONFIG = {
  application: {
    status: "open",
    url: "ここに正式な申込URL"
  }
};
```

status は以下の4種類です。

- `coming-soon` 受付情報公開前
- `open` 受付中
- `few-left` 残席わずか
- `closed` 受付終了

## 写真を追加するとき

現時点では権利関係の不明な学校写真を勝手に埋め込まず、写真掲載エリアを仮表示しています。
正式な学校写真が用意できたら `assets/` に保存し、Hero・学校生活セクションへ反映してください。

推奨：
- Hero 横長 1600px以上
- WebPまたはAVIF
- 1枚あたり可能なら300KB前後以下
- 生徒が写る写真は学校内の掲載ルール・許諾を確認

## GitHubへアップロードするもの

ZIPそのものではなく、ZIPを解凍した以下をリポジトリ直下へアップロードします。

```
index.html
css/
js/
assets/
README.md
content.md
```

## 公開

静的サイトとしてCloudflare Workers Static Assets等へ配置できます。
アクセス制限（Limited）はサイトUIとは分離し、Cloudflare側のサーバー設定で行う想定です。
