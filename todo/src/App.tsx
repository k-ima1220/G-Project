import { useState, useEffect } from 'react'
import type { Todo, Filter, Priority } from './types'
import { TodoInput } from './components/TodoInput/TodoInput'
import { TodoList } from './components/TodoList/TodoList'
import { FilterBar } from './components/FilterBar/FilterBar'
import styles from './App.module.css'

const STORAGE_KEY = 'todos-v1'

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Todo[]) : []
  } catch {
    return []
  }
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  function addTodo(text: string, priority: Priority) {
    const todo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      priority,
      createdAt: Date.now(),
    }
    setTodos(prev => [todo, ...prev])
  }

  function toggleTodo(id: string) {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  function deleteTodo(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function editTodo(id: string, text: string) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, text } : t)))
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed))
  }

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const activeCount = todos.filter(t => !t.completed).length

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Todo</h1>
      </header>
      <main className={styles.main}>
        <TodoInput onAdd={addTodo} />
        <div className={styles.card}>
          <FilterBar
            filter={filter}
            activeCount={activeCount}
            hasCompleted={todos.some(t => t.completed)}
            onFilter={setFilter}
            onClearCompleted={clearCompleted}
          />
          <TodoList
            todos={filtered}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        </div>
      </main>
    </div>
  )
}
