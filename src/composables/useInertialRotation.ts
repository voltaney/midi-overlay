import { ref, type Ref } from 'vue'

/**
 * 慣性設定パラメータ
 */
export interface InertiaSettings {
  /** 減衰率（0-1、1に近いほど長く回る） */
  decayRate: number
  /** 停止判定の最小速度（これ以下で完全停止） */
  minVelocity: number
}

/**
 * 慣性付き回転管理用composable
 * ジョグホイールのリアルな物理挙動を実現
 *
 * @param settings - 慣性設定パラメータ（リアクティブ）
 */
export function useInertialRotation(settings: Ref<InertiaSettings>) {
  /** 現在の回転角度（ラジアン） */
  const angle = ref(0)

  /** 現在の角速度（rad/frame） */
  const velocity = ref(0)

  /**
   * 速度を加算
   * MIDI入力時に呼び出す
   *
   * @param delta - 追加する速度
   */
  function addVelocity(delta: number): void {
    velocity.value += delta
  }

  /**
   * 慣性計算を実行
   * 毎フレーム呼び出す
   *
   * @param deltaTime - 前フレームからの経過時間（秒）
   * @returns 描画が必要かどうか
   */
  function update(deltaTime: number): boolean {
    // 速度が十分小さい場合は停止
    if (Math.abs(velocity.value) < settings.value.minVelocity) {
      velocity.value = 0
      return false
    }

    // 速度を減衰
    velocity.value *= settings.value.decayRate

    // 角度を更新（60fps基準で正規化）
    angle.value += velocity.value * deltaTime * 60

    return true
  }

  /**
   * 速度をリセット（即座に停止）
   */
  function reset(): void {
    velocity.value = 0
  }

  return {
    angle,
    velocity,
    addVelocity,
    update,
    reset,
  }
}
