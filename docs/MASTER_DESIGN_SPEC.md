# 東京都立目黒高等学校 学校説明会特設サイト
# MASTER DESIGN SPEC v1.0

設計日: 2026-09-10 JST
実装基準: ユーザー提示のMASTER DESIGN SPEC v1.0

## 1. Concept
**目黒高校を、ひと足先に歩いてみよう。**

生徒のいる学校を、写真と短い言葉で巡る「来校前の小さな学校体験」。写真で空気を、短文で意味を、開催情報で安心を伝える。体験の主役は生徒。Glassは校内案内表示を連想させる用途へ限定する。

## 2. Experience story
入口 → 体験予告 → 校内 → 生徒 → 活気 → 学校説明 → 開催情報 → 今後の開催 → 実際の来校。
Webの編集順であり、実際の校内経路・当日実施順を推測しない。

## 3. Site map
1. ENTRANCE `#entrance`
2. DISCOVER `#discover`
3. EXPLORE `#explore`
4. MEET `#students`
5. EXPERIENCE `#experience`
6. LEARN `#learning`
7. INFORMATION `#information`
8. UPCOMING EVENTS `#upcoming`
9. VISIT `#visit`

初版は1ページ。別探検ページ、ログイン、フォーム、写真モーダルを作らない。

## 4. Hero
スマホでは正式校名 → 10月学校説明会 → 日付/状態 → 主コピー → 主CTA → 学校写真の順をDOMでも維持。PCでは写真・案内面・前景情報の3層を作る。架空の日付や架空の学校写真を使わない。

## 5. Glass / 3D
情報Glassは白94% + blur 12px、写真キャプションは白92% + blur 8px。スマホ同一画面のbackdrop-filterは原則1面。本文・日付・リンクは傾けない。液体ガラス、虹色反射、浮遊球体、全画面Glassは禁止。

## 6. Photos
Hero、生徒案内、人物、応援パフォーマンス、学校日常、終盤を中心に6〜9枚、上限10枚。掲載可否・撮影時期・場所・活動・alt・焦点位置を写真ごとに管理。AI生成の架空生徒・架空校内は実写代替に使わない。

## 7. Visual system
White `#FFFFFF` / Canvas `#F6F5F1` / Ink `#142738` / Body `#26323B` / Muted `#52616B` / Line `#D9DEE0` / provisional accent `#245F56` / Focus `#A94618`。
日本語はNoto Sans JPを第1候補、system-uiへフォールバック。カードの反復を避け、罫線・大写真・余白差で章を作る。

## 8. Motion
通常の縦スクロール。Hero写真scale最大1.025、Y最大12px、Explore最大24px程度。スマホは基本静止。アニメーション対象は最大3か所。本文をopacity:0で待機させない。`prefers-reduced-motion` とサイト内「動きを減らす」を両方尊重。

## 9. Mobile / Accessibility
320 / 375 / 390 / 430 / 768 / 1024 / 1440 / 1920pxを確認。主CTA48px以上、その他操作44px以上。本文16px以上。safe area、200%拡大、320 CSS pxリフロー、キーボード操作、フォーカス可視性を確認。WCAG 2.2 AAを目標。

## 10. Application CTA
Hero / INFORMATION / VISIT / 条件付き固定CTAは同じ10月イベントから生成。
状態は `unknown / scheduled / open / full / closed / ended / postponed / cancelled`。
`open` は正式URL、日時、対象、場所、申込条件、確認時刻等が揃わなければビルド失敗。空URLや `href="#"` 禁止。受付開始は端末時計で自動化しない。締切超過は安全側へ閉じる。

## 11. Content requirements
10月の正式日時、対象条件、申込URL/期間、会場・交通、実施範囲、注意事項、写真、公式素材、コメント、11/12月詳細、更新担当をそれぞれ確認管理する。未確認情報を公式発言として創作しない。

## 12. Tech stack
静的HTML + CSS + 小さなVanilla JavaScript + Node.js事前生成。React / GSAP / Three.js / CMS / DB / 認証 / PWAは初版に新規導入しない。`dist/index.html` を公開起点とする。

## 13. Source of truth
- `data/events.json`: 開催情報・申込状態
- `data/content.json`: 原稿と承認状態
- `data/photos.json`: 写真と公開可否
- `data/site.json`: 学校情報・更新日・公開モード
HTML/JSへ日程や申込URLを重複直書きしない。

## 14. Acceptance criteria
- 初期画面5秒で学校名・10月説明会・日時または未定・申込状態が分かる
- 8状態でCTAが全箇所一致
- `open` の必須情報不足をビルド拒否
- 日付・URL・写真をデータ変更だけで一括更新
- 全対象幅、200%文字拡大、320px、横向きで欠落なし
- キーボード、safe area、reduce motion、JS無効で主要情報利用可
- 写真の公開可否・トリミング・性能を実確認
- 学校確認済み原稿のみproductionへ出す

## 15. Non-negotiables
生徒を主役にした構成、10月中心、正式申込への外部リンク、受付状態整合、JSなしの情報表示、スマホ優先、未確定情報の非創作を維持する。重要変更は変更案として扱う。
