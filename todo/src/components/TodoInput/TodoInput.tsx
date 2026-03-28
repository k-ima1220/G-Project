import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Priority } from '../../types'
import styles from './TodoInput.module.css'

interface Props {
  onAdd: (text: string, priority: Priority) => void
}

export function TodoInput({ onAdd }: Props) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed, priority)
    setText('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="タスクを追加..."
        value={text}
        onChange={e => setText(e.target.value)}
        aria-label="新しいタスク"
      />
      <select
        className={styles.select}
        value={priority}
        onChange={e => setPriority(e.target.value as Priority)}
        aria-label="優先度"
      >
        <option value="high">高</option>
        <option value="medium">中</option>
        <option value="low">低</option>
      </select>
      <button className={styles.button} type="submit">
        追加
      </button>
    </form>
  )
}
