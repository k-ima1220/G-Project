import { render, screen } from '@testing-library/react'
import { TodoList } from './TodoList'
import type { Todo } from '../../types'

const makeTodo = (override: Partial<Todo> = {}): Todo => ({
  id: '1',
  text: 'テストタスク',
  completed: false,
  priority: 'medium',
  createdAt: 0,
  ...override,
})

describe('TodoList', () => {
  it('todos が空のとき「タスクがありません」を表示する', () => {
    render(
      <TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />
    )
    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })

  it('todos がある場合リスト要素を表示する', () => {
    const todos = [
      makeTodo({ id: '1', text: 'タスク1' }),
      makeTodo({ id: '2', text: 'タスク2' }),
    ]
    render(
      <TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />
    )
    expect(screen.getByText('タスク1')).toBeInTheDocument()
    expect(screen.getByText('タスク2')).toBeInTheDocument()
  })

  it('todos の件数分のリストアイテムが表示される', () => {
    const todos = [
      makeTodo({ id: '1' }),
      makeTodo({ id: '2' }),
      makeTodo({ id: '3' }),
    ]
    render(
      <TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />
    )
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
})
