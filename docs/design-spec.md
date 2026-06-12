# デザイン仕様書 — 株式会社AIの鉄人 コーポレートサイト
基準: ワイヤーフレーム案C「テック・グリッド」（dense / bento / modular）。
手描きスケッチ表現は本番では「クリーンなテックグリッド」に翻訳する（方眼・ベント・mono英字・チップ・インクボーダーの構造は踏襲、ラフな歪みは廃止）。

## 1. デザイントークン（CSS変数）

```css
:root {
  /* color */
  --paper:   #F6F4EE;  /* ページ背景（ワイヤー--paper踏襲） */
  --card:    #FCFBF7;  /* カード背景 */
  --beige:   #EFE9E2;  /* 交互セクション背景（03/06） */
  --ink:     #1E1C19;  /* 文字・ボーダー主色 */
  --soft:    #6E6A61;  /* 補助テキスト */
  --line:    #D8D3C6;  /* 罫線 */
  --grid:    #E4E0D4;  /* 方眼グリッド線 */
  --accent:  #DE2B1C;  /* ロゴ赤（実測値）。ボタン・強調 */
  --accent-dark: #B72217; /* 小サイズ文字でaccentを使う場合 */
  --shadow:  4px 4px 0 rgba(30,28,25,.08); /* カードのオフセット影 */

  /* type */
  --font-sans: "Noto Sans JP", sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace;

  /* layout */
  --container: 1140px;   /* ワイヤーpageC max-width踏襲 */
  --gutter-pc: 56px;     /* セクション左右padding（ワイヤー.sec踏襲） */
  --gutter-sp: 20px;
  --radius: 10px;        /* カード角丸 */
  --radius-pill: 999px;  /* ボタン・チップ */
}
```

- 方眼グリッド背景（ヒーロー）: `repeating-linear-gradient` 縦横、**32px格子**、線色 `--grid` 1px。
- カード様式: `background:var(--card); border:1.5px solid var(--ink); border-radius:var(--radius); box-shadow:var(--shadow);`
- チップ（ISSUE 01等）: mono 11px、`border:1px solid var(--ink)`、radius pill、padding 3px 12px、letter-spacing .05em。
- monoラベル（セクション見出し上）: mono 12px、color accent、letter-spacing .08em、大文字。

## 2. タイポグラフィ

| 用途 | フォント | サイズPC | サイズSP(390px) | weight | line-height |
|---|---|---|---|---|---|
| H1（ヒーロー） | Noto Sans JP | 48px | 32px | 900 | 1.25 |
| H2（セクション） | Noto Sans JP | 34px | 26px | 700 | 1.35 |
| H3（カード見出し） | Noto Sans JP | 19px | 17px | 700 | 1.5 |
| 本文 | Noto Sans JP | 16px | 15px | 400 | 1.9 |
| 補助・注釈 | Noto Sans JP | 13px | 12px | 400 | 1.7 |
| monoラベル | IBM Plex Mono | 12px | 11px | 500 | 1 |
| ミッション宣言 | Noto Sans JP | 30px | 22px | 700 | 1.6 |

- Google Fonts: Noto Sans JP (400,500,700,900) / IBM Plex Mono (400,500)。`display=swap`。
- アクセント色の本文使用は**禁止**（コントラスト不足）。小サイズで赤が必要な場合は `--accent-dark`。
- 白文字 on accent はボタン・大見出しのみ可（UIコンポーネント基準3:1はクリア）。

## 3. レイアウト・セクション仕様

共通: セクション上下padding **96px**（PC）/ **64px**（SP）。コンテナ1140px中央。
セクション見出しパターン: monoラベル → H2 → （必要なら導入文1行）。

| # | id | 構成（PC 1440） | 主要数値 |
|---|---|---|---|
| Header | `header` | 固定（sticky）。左ロゴ（logo-horizontal.png 高さ36px）、monoナビ（SERVICE/CASE/COMPANY/CONTACT）、右に丸CTA「お問い合わせ」 | 高さ64px、下ボーダー1.5px ink、背景 #FFFEF9（95%不透明+blur） |
| 01 Hero | `hero` | 方眼背景。2カラム（左1.1 : 右1）。左: mono「AI SOLUTION PARTNER」→H1→リード→CTA2本。右: ダッシュボード風カード | 上下padding 110px/90px。H1キーワード「使いこなせる会社へ」をaccent。CTA gap 12px |
| 02 課題 | `issues` | H2「こんなお悩みはありませんか？」+ ISSUEカード6枚（3col×2row、gap 18px） | カードpadding 22px。チップ「ISSUE 01」〜06 + SVGアイコン36px + H3 + 本文 |
| 03 解決策 | `solution` | 背景beige。フロー3ボックス（課題→AIの鉄人(accent反転)→成果）+ STEP1〜3カード縦タイムライン + 「6ヶ月後の姿」チェック4項目(2col) | フローボックス min-width 170px、矢印は→記号でなくSVG。STEPバッジはaccent角丸4px |
| 04 サービス | `service` | H2「サービス」+ 3カード（3col、gap 18px） | アイコン枠56px + H3 + 「できること」「導入メリット」mono小見出し付き |
| 05 理由 | `reasons` | H2「選ばれる理由」+ ベントグリッド 3col・行高132px: 理由1(2行スパン)、理由2、理由3(accent反転)、理由4(2colスパン)、理由5、理由6 | gap 18px。accent反転カードは白文字（H3/本文とも） |
| 06 実績 | `case` | 背景beige。実績ハイライト大カード1枚（「活用定着率 国内SUBARU販売会社 1位」を主役、num表現は「1位」のみ=事実）+ 事実カード2枚（時間削減/全店舗キックオフ）+ 富士スバル様事例カード（業種・成果表組） | 数値の捏造禁止。「1位」表示は num-xl 56px accent |
| 07 ミッション | `mission` | 宣言カード1枚: mono「MISSION」+ 宣言文 | padding 48px、中央寄せ |
| 08 会社 | `company` | 2ブロック: (a)代表メッセージ=写真(ceo-photo.jpg 角丸、幅360px)+本文 (b)会社概要テーブル | 写真はobject-fit cover。テーブルはdl/dt/dd、罫線--line |
| 09 問合せ | `contact` | カード1枚: H2 + 誘導文 + CTA2本（お問い合わせ/資料請求→Googleフォーム別タブ）+ QR(140px)+メールリンク | フォームUIは置かない |
| Footer | `footer` | 背景 #EFECE4、上ボーダー1.5px ink。ロゴ(高さ28px)+アンカーリンク+© 2026 株式会社AIの鉄人 | padding 30px 56px |

## 4. レスポンシブ

| 幅 | 変化 |
|---|---|
| ≤1024px | ヒーロー2カラム維持（比率1:0.9）、ベントは3col維持、gutter 40px |
| ≤768px | ハンバーガーメニュー（JSトグル、aria-expanded）。ヒーロー1カラム（ビジュアルは下）。課題/サービス2col。ベントは2col（スパン解除、全て1行高auto）。フロー3ボックスは縦積み（矢印90度回転） |
| ≤480px | 全グリッド1col。H1 32px。CTAは幅100%縦積み。会社概要テーブルは縦組 |

- 横スクロール禁止（全幅で `overflow-x` 発生なし）。
- タップターゲット44px以上。

## 5. インタラクション

- スクロールでの軽いフェードイン（`IntersectionObserver`、translateY 12px→0、0.5s）。**`prefers-reduced-motion: reduce` 時は無効**。
- ボタンhover: translateY(-2px)+影拡大。カードhover: 影 6px 6px 0。
- アンカースクロールは `scroll-behavior: smooth`（reduced motion時はauto）+ `scroll-margin-top: 80px`。

## 6. 禁止事項

- チラシにない数値・固有名詞の創作（設立年・資本金・電話番号・導入社数等）
- アクセント赤の小サイズ本文使用
- 外部JSライブラリ・フレームワークの追加（Vanilla JSのみ。Google Fontsのみ外部）
- 実在他社ロゴの掲載（富士スバル様は文字情報のみ）
