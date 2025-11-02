/**
 * 色操作ユーティリティ
 */

/**
 * 16進数カラーコードから透明度を取得
 * @param hexColor - 16進数カラーコード (#RRGGBBAA形式)
 * @returns 透明度 (0.00 ~ 1.00の文字列)
 */
export function getOpacityFromHex(hexColor: string): string {
  // #RRGGBBAA形式（9文字）の場合のみアルファ値を取得
  if (hexColor.length === 9) {
    const alphaHex = hexColor.slice(7, 9)
    const alpha = parseInt(alphaHex, 16)

    // NaNチェック
    if (isNaN(alpha)) {
      return '1.00'
    }

    return (alpha / 255).toFixed(2)
  }

  // アルファ値がない場合は完全不透明
  return '1.00'
}

/**
 * 16進数カラーコードに透明度を設定
 * @param hexColor - 16進数カラーコード (#RRGGBB形式または#RRGGBBAA形式)
 * @param opacity - 透明度 (0.0 ~ 1.0)
 * @returns 透明度を含む16進数カラーコード (#RRGGBBAA形式)
 */
export function setOpacityToHex(hexColor: string, opacity: number): string {
  // RGB部分のみ取得（最初の7文字: #RRGGBB）
  const rgb = hexColor.slice(0, 7)

  // 透明度を0-255の範囲に変換し、16進数2桁に
  const clampedOpacity = Math.max(0, Math.min(1, opacity))
  const alpha = Math.round(clampedOpacity * 255)
    .toString(16)
    .padStart(2, '0')

  return rgb + alpha
}
