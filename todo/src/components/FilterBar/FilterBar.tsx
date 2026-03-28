import type { Filter } from '../../types'
import styles from './FilterBar.module.css'

interface Props {
  filter: Filter
  activeCount: number
  hasCompleted: boolean
  onFilter: (f: Filter) => void
  onClearCompleted: () => void
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了済み' },
]

export function FilterBar({ filter, activeCount, hasCompleted, onFilter, onClearCompleted }: Props) {
  return (
    <div className={styles.bar}>
      <span className={styles.count}>{activeCount} 件残り</span>
      <div className={styles.filters} role="group" aria-label="フィルター">
        {FILTERS.map(f => (
          <button
            key={f.value}
            className={`${styles.filterBtn} ${filter === f.value ? styles.active : ''}`}
            onClick={() => onFilter(f.value)}
            aria-pressed={filter === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>
      {hasCompleted && (
        <button className={styles.clearBtn} onClick={onClearCompleted}>
          完了済みを削除
        </button>
      )}
    </div>
  )
}
