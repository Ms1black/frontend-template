'use client'

import { useCounterStore } from '../model/counterStore'
import styles from './Counter.module.scss'

export function Counter() {
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)
  const decrement = useCounterStore((state) => state.decrement)
  const reset = useCounterStore((state) => state.reset)

  return (
    <div className={styles.root}>
      <span className={styles.count}>{count}</span>
      <div className={styles.controls}>
        <button className={styles.button} onClick={decrement}>−</button>
        <button className={styles.button} onClick={increment}>+</button>
        <button className={styles.reset} onClick={reset}>Reset</button>
      </div>
    </div>
  )
}
