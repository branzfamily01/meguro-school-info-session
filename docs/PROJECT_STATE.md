# PROJECT STATE

更新: 2026-09-10 JST

## 状態
実装中。MASTER DESIGN SPEC v1.0に基づく構造刷新を実施。

## 完了
- 対象リポジトリを `branzfamily01/meguro-school-info-session` と確認
- 既存の4状態 `coming-soon/open/few-left/closed` とHTML直書き構成を廃止する新構造を作成
- 公式2026年度イベント案内から10/24・11/21・12/19の日程、時刻、会場を確認
- `data/events.json / content.json / photos.json / site.json` を追加
- 8種類の申込状態とビルド時検証を実装
- `open` なのにURL・受付時間・申込期間等が不足する場合のビルド拒否を実装
- 390pxを中心としたモバイルファーストUIへ刷新
- 9セクション構成、通常縦スクロール、限定的Glass、写真プレースホルダーを実装
- 固定CTAの出現/非表示、prefers-reduced-motionと手動軽減を実装
- JSなしでも開催情報と主要リンクがHTMLに残る構造へ変更
- `dist/` 生成と自動テストを追加

## 未確定・残作業
- 10月回の受付時間、終了予定、定員、同伴条件、持ち物、注意事項
- 正式申込URL、申込開始・締切、受付方式
- 生徒案内・応援パフォーマンス・学校説明テーマの最終確認
- 公開利用可の実写6〜9枚と写真メタデータ
- 公式アクセント色・校章を使う場合の正式素材確認
- 本番公開先のCloudflare設定と実URL検証

## 次の安全な更新
学校から正式情報が届いたら `data/events.json` と `data/content.json` を更新し、`npm test` → `npm run build` → 375/390/430/768/1024/1440px確認の順で進める。
