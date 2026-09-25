// デモ用のモックAPI（MSW）が起動するまでAPI呼び出しを待たせる。
// 起動を待ってから描画すると、MSWとその依存（約200KB）のダウンロードが初回描画を遅らせるため、
// 画面は先に描き、通信だけを待たせる。実バックエンドがあればこの仕組みは不要。
let markReady: () => void = () => {}

export const apiReady = new Promise<void>((resolve) => {
  markReady = resolve
})

export function markApiReady() {
  markReady()
}
