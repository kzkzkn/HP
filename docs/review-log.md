# Visual Review Log（Fable独立レビュー）

## Review R1 — CT-01/02（基盤＋ヘッダー） 2026-06-12

### Visual Review
- Section ID: header / 骨格全体
- Viewport: 1440px / 390px
- Similarity score: 96%（対 design-spec.md）
- Critical differences: なし
- Major differences: なし
- Minor differences: ヒーローH1のリード行・CTA・右カードは未実装（CT-03スコープのため対象外）
- Likely cause: —
- Required correction: なし
- Correction priority: —
- Assigned agent: —
- Status: **PASS**

確認項目: sticky header 64px・ロゴ高さ・monoナビ4項目・CTAピル（accent #DE2B1C、inkボーダー、影）／方眼背景32px格子／セクションpadding・beige交互背景（solution/case）／390pxでハンバーガー表示・横スクロールなし。

## Review R2 — 全セクション（RB-A/RB-B/RV-04後） 2026-06-12

| Section ID | Viewport | Similarity | Critical | Major | Minor | Status |
|---|---|---|---|---|---|---|
| header | 1440/390 | 97% | なし | なし | なし | PASS |
| 01 hero | 1440/390 | 97% | なし | なし | ダッシュボードSVGはワイヤーのプレースホルダー指示を忠実に図案化 | PASS |
| 02 issues | 1440/390 | 97% | なし | なし | なし | PASS |
| 03 solution | 1440/390 | 95% | なし | なし | STEPタイムラインはワイヤーに無い要素（チラシ由来・計画通りの統合） | PASS |
| 04 service | 1440/390 | 96% | なし | なし | ワイヤー2カード→3カード（コンテンツ都合・計画通り） | PASS |
| 05 reasons | 1440/390 | 96% | なし | RV-04で空きマス解消済み | accent反転カードの位置=3枚目（ワイヤー通り） | PASS |
| 06 case | 1440/390 | 95% | なし | 数値カード4枚→実績ハイライトに置換（ユーザー決定） | なし | PASS |
| 07 mission | 1440/390 | 97% | なし | なし | なし | PASS |
| 08 company | 1440/390 | 95% | なし | メンバーグリッド削除（ユーザー決定） | 写真は透かし除去済みトリミング版 | PASS |
| 09 contact | 1440/390 | 96% | なし | フォームUI→CTA+QR（ユーザー決定） | なし | PASS |
| footer | 1440/390 | 97% | なし | なし | なし | PASS |

機能QA（PHASE 10）: コンソールエラー0／横スクロール0px（1440・390）／アンカー切れ0／4xx応答0／単一H1・階層正常／meta・OGP絶対URL・canonical・JSON-LD(valid)・favicon／モバイルメニュー開閉+aria-expanded+アンカーで自動クローズ／skip link（focus時のみ表示）／reduced-motion対応／全imgにwidth・height・lazy。
注: QAスクリプトの「brokenImages」3件は loading="lazy" の検査タイミングによる誤検知（スクリーンショットで表示確認済み）。

### 運用メモ（Codex駆動）
- Codex CLI 0.19.0はChatGPTアカウントでモデル非対応 → プロジェクトローカルに 0.139.0 導入、`npx codex exec` で駆動（model: gpt-5.5）
- execは「説明のみのメッセージ」を出すとターン終了する → タスク票に実行規律を明記
- `npx http-server` をフォアグラウンド起動するとセッションが止まる → サーバーはFable側で常駐起動、Codexには起動済みポートを使わせる
