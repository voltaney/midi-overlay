/**
 * ログ出力ユーティリティ
 * 開発環境でのみログを出力する
 */

const isDev = import.meta.env.DEV

/**
 * ログレベルに応じたログ出力を行う
 */
export const logger = {
  /**
   * デバッグログ（開発環境のみ）
   */
  debug: (...args: unknown[]): void => {
    if (isDev) {
      console.debug('[DEBUG]', ...args)
    }
  },

  /**
   * 情報ログ（開発環境のみ）
   */
  info: (...args: unknown[]): void => {
    if (isDev) {
      console.info('[INFO]', ...args)
    }
  },

  /**
   * 警告ログ（常に出力）
   */
  warn: (...args: unknown[]): void => {
    console.warn('[WARN]', ...args)
  },

  /**
   * エラーログ（常に出力）
   */
  error: (...args: unknown[]): void => {
    console.error('[ERROR]', ...args)
  },
} as const
