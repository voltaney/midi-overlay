/// <reference types="vite/client" />

/**
 * Vue SFC型定義
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
