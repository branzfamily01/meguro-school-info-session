# content.md

このファイルは旧構成からの案内用です。現在の公開内容の正本は `data/` 配下へ移行しました。

## Project
東京都立目黒高等学校 学校説明会特設サイト

## Purpose
中学生・保護者が、目黒高校の雰囲気を来校前に感じ、開催情報を迷わず確認し、正式申込ページへ進める1ページサイト。

## Design concept
**目黒高校を、ひと足先に歩いてみよう。**

写真で空気を、短文で意味を、開催情報で安心を伝える。生徒を主役とし、Glass / 3Dは校内案内表示を連想させる補助表現に限定する。

## Source of truth
- 開催情報：`data/events.json`
- 原稿承認：`data/content.json`
- 写真：`data/photos.json`
- 学校情報・公開段階：`data/site.json`
- 設計：`docs/MASTER_DESIGN_SPEC.md`
- 進捗：`docs/PROJECT_STATE.md`

HTMLやJavaScriptへ日付・申込URLを重複直書きしない。
