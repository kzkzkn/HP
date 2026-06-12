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

### 運用メモ（Codex駆動）
- Codex CLI 0.19.0はChatGPTアカウントでモデル非対応 → プロジェクトローカルに 0.139.0 導入、`npx codex exec` で駆動（model: gpt-5.5）
- execは「説明のみのメッセージ」を出すとターン終了する → タスク票に実行規律を明記
- `npx http-server` をフォアグラウンド起動するとセッションが止まる → サーバーはFable側で常駐起動、Codexには起動済みポートを使わせる
