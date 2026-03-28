import { useState, useRef, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import type { Todo } from '../../types'
import styles from './TodoItem.module.css'

interface Props {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
}

const PRIORITY_LABEL: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function commitEdit() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== todo.text) onEdit(todo.id, trimmed)
    else setDraft(todo.text)
    setEditing(false)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') { setDraft(todo.text); setEditing(false) }
  }

  return (
    <li className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
      <button
        className={styles.checkbox}
        onClick={() => onToggle(todo.id)}
        role="checkbox"
        aria-checked={todo.completed}
        aria-label={todo.completed ? '未完了に戻す' : '完了にする'}
      >
        {todo.completed && (
          <svg viewBox="0 0 12 10" fill="none" aria-hidden="true">
            <polyline
              points="1,5 4.5,8.5 11,1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {editing ? (
        <input
          ref={inputRef}
          className={styles.editInput}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          aria-label="タスクを編集"
        />
      ) : (
        <span
          className={styles.text}
          onDoubleClick={() => setEditing(true)}
          title="ダブルクリックで編集"
        >
          {todo.text}
        </span>
      )}

      <span className={`${styles.badge} ${styles[todo.priority]}`}>
        {PRIORITY_LABEL[todo.priority]}
      </span>

      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(todo.id)}
        aria-label="削除"
      >
        ×
      </button>
    </li>
  )
}
