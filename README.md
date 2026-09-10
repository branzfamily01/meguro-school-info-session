# 東京都立目黒高等学校 学校説明会特設サイト

2026年度の学校説明会向け、スマートフォンファーストの静的サイトです。

## 現在の状態

- 10月24日（土）14:30〜／体育館をメイン表示
- 11月21日（土）14:30〜／体育館、12月19日（土）10:00〜・14:00〜／視聴覚室を今後の予定として掲載
- 上記日程・時刻・会場は東京都立目黒高等学校の2026年度イベント案内で確認済み
- 申込方法・受付時間・定員・正式申込URLは2026-09-10時点で未確認のため `unknown`
- 生徒による校内案内・応援パフォーマンス等は、学校確認前のためプレビューでは「内容確認中」として扱う
- `data/site.json` の `publishMode` は `preview`。プレビュー時は `noindex,nofollow`

## 構成

- `data/events.json` 開催日・時刻・会場・申込状態の正本
- `data/content.json` セクション原稿と承認状態
- `data/photos.json` 写真メタデータと公開可否
- `data/site.json` 学校情報・公開モード・更新日
- `scripts/build.mjs` データ検証と静的HTML生成
- `scripts/test.mjs` 状態・URL・生成結果の自動テスト
- `css/style.css` 表示スタイル
- `js/app.js` 固定CTA・動きを減らす設定・軽い奥行き演出
- `index.html` 互換用の生成済み公開HTML
- `dist/` 推奨公開ディレクトリ
- `docs/MASTER_DESIGN_SPEC.md` 実装基準
- `docs/PROJECT_STATE.md` 現在地と残作業
- `docs/DECISIONS.md` 設計上の決定

## ビルドとテスト

```bash
npm run build
npm test
```

外部ライブラリは不要です。Node.js 20以上を使用します。

## 申込受付開始時

`data/events.json` の10月イベントを更新します。`application.status = "open"` にする場合は、誤公開防止のため次の項目がすべて必須です。

- date
- receptionTime
- startTime
- venue
- audience
- application.url
- application.opensAt
- application.closesAt
- application.checkedAt
- application.conditionsSummary

不足している場合はビルドが失敗します。

受付状態は `unknown / scheduled / open / full / closed / ended / postponed / cancelled` を使用します。ブラウザ側で自動的に受付開始へ切り替えることはありません。`open` の締切を過ぎた状態で再ビルドすると、安全側に `closed` 表示へ解決します。

## 写真追加

権利確認済みの実写だけを使用してください。公開可否・alt・焦点位置・撮影情報を `data/photos.json` に記録し、承諾管理資料そのものは公開リポジトリへ入れません。

## 公開

推奨公開起点は `dist/` です。既存公開設定がルート配信の場合に備え、ビルド時にルート `index.html` も同時生成します。

現在はプレビュー扱いです。学校確認済み原稿・写真・申込情報が揃うまで `publishMode: "production"` に変更しません。
