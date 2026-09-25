# イベント予約 ― jQuery画面をReactへ段階移行するデモ

定員に達すると自動で受付を締め切る、イベント予約アプリです。
あわせて、**jQueryで作られた旧画面を止めずに、部品単位でReactへ置き換えていく**実例を含めています。

- 新画面（React）: https://web-suz.com/demo/event-booking/
- 旧画面（jQuery・一部React化済み）: https://web-suz.com/demo/event-booking/legacy.html
- デザインシステム（Storybook）: https://web-suz.com/demo/event-booking/storybook/

> バックエンドは持たず、APIはMSW（Service Worker）で再現しています。予約データはブラウザのlocalStorageに保存されます。

## このリポジトリで示していること

| 領域 | 内容 |
|---|---|
| React / TypeScript | React 19、TypeScript `strict` ＋ `noUncheckedIndexedAccess` |
| 状態管理 | Redux Toolkit。サーバー状態はRTK Query、画面の状態（絞り込み・移行フラグ）はslice |
| 段階移行 | jQuery画面にReact部品を差し込み（ストラングラー方式）、Reduxストアを共有。フラグ1つで旧実装へ即時に切り戻せる |
| テスト | Jest ＋ React Testing Library ＋ MSW。40件。新旧実装の表示一致を確かめるパリティテストを含む |
| CSS設計 | Sassのトークンを一次情報にしてCSS変数を出力し、styled-componentsと旧画面のSass（BEM）が同じ変数を参照 |
| デザインシステム | Storybookでコンポーネントとトークンを一覧化 |
| セキュリティ | 許可リスト方式のHTML無害化、旧コードの `.html()` 連結を `.text()` へ修正、CSP、サーバー側での再検証 |
| 性能 | Lighthouse（モバイル）中央値 93点。モックAPIを初回描画の経路から外し、バーの伸縮は `transform` で描画 |

## 画面

1. **イベント一覧** ― キーワード・カテゴリ・受付中のみで絞り込み（条件はReduxに保持）
2. **イベント詳細・予約** ― 入力検証、定員到達で自動締切。入力中に他の申込で残席が減った場合（409）の扱いを含む
3. **申込状況（管理）** ― イベント別の申込数と、このブラウザでの申込一覧
4. **旧画面（jQuery）** ― 残席表示を「React版 / jQueryプラグイン版」でその場で切り替えられる

## 技術選定と設計判断

### 1. 移行は一括ではなく、部品単位で行う

旧画面を丸ごと作り直すと、完成まで価値が出ず、差し替え当日のリスクも大きくなります。
そこで、次の3つを揃えたうえで部品単位で置き換えています。

- **判定ロジックを先に切り出す** ― 「残席」「受付中／残りわずか／満席」の判定を `src/domain/capacity.ts` に集約し、jQueryプラグインとReactコンポーネントの両方から呼ぶ。表示の実装だけを差し替えられる
- **新旧の一致をテストで保証する** ― `src/legacy/jquery.capacityBar.test.tsx` で、同じデータに対して両者の表示が一致することを確認
- **すぐ戻せるようにする** ― 旧画面の実装切り替えをReduxのフラグ（`migrationSlice`）で持ち、問題があればjQuery版へ即時に戻せる

### 2. 状態管理は Redux Toolkit + RTK Query

- Reduxのストアは**React の外からも `dispatch` / `subscribe` できる**ため、jQueryの旧画面と新しいReact部品で同じストアを共有できる。APIの取得も1回で済む（`src/legacy/main.ts`）
- サーバーから来るデータ（イベント・申込）はRTK Queryのキャッシュに任せ、自前のsliceには画面の状態だけを置く。同じデータを二重に持たない

### 3. 定員は「楽観的更新」をしない

予約は、サーバーの確定を待ってから画面に反映しています。定員は整合性が最優先で、先に画面を更新すると「申し込めたように見えて実は満席」が起こり得るためです。
409（先に満席になった）のときも、キャッシュを無効化して最新の残席を取り直し、選べる人数を残席に合わせます。

### 4. CSS：Sassで値を持ち、styled-componentsで組む

- 値（色・余白・角丸など）は `src/styles/_tokens.scss` だけが持ち、CSS変数として出力する
- React側は `theme.ts` でその変数を型付きで参照する。旧画面のSassも同じ変数を使うため、**移行途中でも見た目が揃う**
- トレードオフ：styled-componentsは実行時に `<style>` を挿入するため、CSPで `style-src 'unsafe-inline'` を許可している。厳しくするなら、nonceの付与か、ビルド時にCSSを出力する方式（vanilla-extract等）への移行が選択肢

### 5. テストの方針

- 判定・検証・絞り込みは純粋関数に寄せて、ユニットテストで網羅する
- 画面は、ユーザーの操作単位（入力して送信する、など）でテストし、実装の詳細には依存させない
- APIはMSWで再現し、画面のテストとブラウザで同じハンドラを使う

### 6. モックAPIの起動を待って描画しない

MSWとその依存は約160KB（gzip）あります。起動を待ってから描画すると、その分だけ初回表示が遅れるため、画面は先に描き、API呼び出しだけを起動完了まで待たせています（`src/api/ready.ts`）。実バックエンドがあれば不要な仕組みです。

## ディレクトリ構成

```
src/
  api/            RTK Query の定義と型
  domain/         定員・入力検証などの純粋なロジック（新旧で共有）
  store/          Redux ストア（絞り込み・移行フラグ）
  design-system/  styled-components の部品、テーマ、Storybook
  features/       画面（一覧・予約・管理）
  legacy/         旧画面：jQueryプラグイン、React部品の差し込み
  mocks/          MSW のハンドラと、メモリ上のデータ
  styles/         Sass のトークンとベーススタイル
```

## 動かし方

```bash
npm install
npm run dev              # http://localhost:5173
npm test                 # Jest
npm run typecheck        # tsc
npm run storybook        # http://localhost:6006
DEMO_BASE=/sub/dir/ npm run build   # サブディレクトリに置く場合
```

## 開発について

設計・実装・検証には AI コーディングエージェント（Claude Code）を用いています。
