import type { FC } from 'react'
import styles from './Example.module.scss'

interface ExampleProps {
  label: string
  badge?: string
}

export const Example: FC<ExampleProps> = ({ label, badge }) => {
  return (
    <div className={styles.root} data-testid="example">
      <span className={styles.label}>{label}</span>
      {badge && <span className={styles.badge}>{badge}</span>}
    </div>
  )
}
