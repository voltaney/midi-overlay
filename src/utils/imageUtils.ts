/**
 * 画像処理関連のユーティリティ関数
 */

/** 画像の最大サイズ（ピクセル） */
const MAX_IMAGE_SIZE = 400

/**
 * 画像ファイルをBase64文字列に変換し、リサイズする
 * @param file - 画像ファイル
 * @returns Base64エンコードされた画像データ（data:image/...形式）
 */
export async function imageFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        // リサイズ処理
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Canvas context取得に失敗'))
          return
        }

        // アスペクト比を保持してリサイズ
        let width = img.width
        let height = img.height

        if (width > MAX_IMAGE_SIZE || height > MAX_IMAGE_SIZE) {
          if (width > height) {
            height = (height * MAX_IMAGE_SIZE) / width
            width = MAX_IMAGE_SIZE
          } else {
            width = (width * MAX_IMAGE_SIZE) / height
            height = MAX_IMAGE_SIZE
          }
        }

        canvas.width = width
        canvas.height = height

        // 画像を描画
        ctx.drawImage(img, 0, 0, width, height)

        // Base64に変換（JPEG形式、品質80%）
        const base64 = canvas.toDataURL('image/jpeg', 0.8)
        resolve(base64)
      }

      img.onerror = () => {
        reject(new Error('画像の読み込みに失敗'))
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('ファイルの読み込みに失敗'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * 画像ファイルのバリデーション
 * @param file - 検証する画像ファイル
 * @returns エラーメッセージ（検証成功時はnull）
 */
export function validateImageFile(file: File): string | null {
  // ファイルサイズチェック（10MB以下）
  const MAX_FILE_SIZE = 10 * 1024 * 1024
  if (file.size > MAX_FILE_SIZE) {
    return 'ファイルサイズは10MB以下にしてください'
  }

  // MIMEタイプチェック
  if (!file.type.startsWith('image/')) {
    return '画像ファイルを選択してください'
  }

  return null
}
