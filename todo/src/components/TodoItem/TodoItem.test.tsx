import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoItem } from './TodoItem'
import type { Todo } from '../../types'

const makeTodo = (override: Partial<Todo> = {}): Todo => ({
  id: '1',
  text: 'テストタスク',
  completed: false,
  priority: 'medium',
  createdAt: 0,
  ...override,
})

describe('TodoItem', () => {
  it('タスクのテキストが表示される', () => {
    render(
      <TodoItem todo={makeTodo({ text: '買い物' })} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />
    )
    expect(screen.getByText('買い物')).toBeInTheDocument()
  })

  it('未完了のチェックボックスの aria-checked が false', () => {
    render(
      <TodoItem todo={makeTodo({ completed: false })} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />
    )
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false')
  })

  it('完了済みのチェックボックスの aria-checked が true', () => {
    render(
      <TodoItem todo={makeTodo({ completed: true })} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />
    )
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
  })

  it('チェックボックスをクリックすると onToggle が呼ばれる', async () => {
    const onToggle = vi.fn()
    render(
      <TodoItem todo={makeTodo({ id: 'abc' })} onToggle={onToggle} onDelete={vi.fn()} onEdit={vi.fn()} />
    )
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith('abc')
  })

  it('削除ボタンをクリックすると onDelete が呼ばれる', async () => {
    const onDelete = vi.fn()
    render(
      <TodoItem todo={makeTodo({ id: 'abc' })} onToggle={vi.fn()} onDelete={onDelete} onEdit={vi.fn()} />
    )
    await userEvent.click(screen.getByRole('button', { name: '削除' }))
    expect(onDelete).toHaveBeenCalledWith('abc')
  })

  it('優先度バッジが正しく表示される', () => {
    const { rerender } = render(
      <TodoItem todo={makeTodo({ priority: 'high' })} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />
    )
    expect(screen.getByText('高')).toBeInTheDocument()

    rerender(
      <TodoItem todo={makeTodo({ priority: 'medium' })} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />
    )
    expect(screen.getByText('中')).toBeInTheDocument()

    rerender(
      <TodoItem todo={makeTodo({ priority: 'low' })} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />
    )
    expect(screen.getByText('低')).toBeInTheDocument()
  })

  it('テキストをダブルクリックすると編集モードになる', async () => {
    render(
      <TodoItem todo={makeTodo({ text: '元のテキスト' })} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />
    )
    await userEvent.dblClick(screen.getByText('元のテキスト'))
    expect(screen.getByRole('textbox', { name: 'タスクを編集' })).toBeInTheDocument()
  })

  it('編集中に Enter を押すと onEdit が呼ばれる', async () => {
    const onEdit = vi.fn()
    render(
      <TodoItem todo={makeTodo({ id: 'abc', text: '元のテキスト' })} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={onEdit} />
    )
    await userEvent.dblClick(screen.getByText('元のテキスト'))
    const input = screen.getByRole('textbox', { name: 'タスクを編集' })
    await userEvent.clear(input)
    await userEvent.type(input, '新しいテキスト{Enter}')
    expect(onEdit).toHaveBeenCalledWith('abc', '新しいテキスト')
  })

  it('編集中に Escape を押すとキャンセルされる', async () => {
    const onEdit = vi.fn()
    render(
      <TodoItem todo={makeTodo({ text: '元のテキスト' })} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={onEdit} />
    )
    await userEvent.dblClick(screen.getByText('元のテキスト'))
    const input = screen.getByRole('textbox', { name: 'タスクを編集' })
    await userEvent.clear(input)
    await userEvent.type(input, '変更後{Escape}')
    expect(onEdit).not.toHaveBeenCalled()
    expect(screen.getByText('元のテキスト')).toBeInTheDocument()
  })

  it('編集中にフォーカスを外すと onEdit が呼ばれる', async () => {
    const onEdit = vi.fn()
    render(
      <TodoItem todo={makeTodo({ id: 'abc', text: '元のテキスト' })} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={onEdit} />
    )
    await userEvent.dblClick(screen.getByText('元のテキスト'))
    const input = screen.getByRole('textbox', { name: 'タスクを編集' })
    await userEvent.clear(input)
    await userEvent.type(input, '新しいテキスト')
    await userEvent.tab()
    expect(onEdit).toHaveBeenCalledWith('abc', '新しいテキスト')
  })

  it('テキストが変わらない場合は onEdit が呼ばれない', async () => {
    const onEdit = vi.fn()
    render(
      <TodoItem todo={makeTodo({ text: '元のテキスト' })} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={onEdit} />
    )
    await userEvent.dblClick(screen.getByText('元のテキスト'))
    await userEvent.keyboard('{Enter}')
    expect(onEdit).not.toHaveBeenCalled()
  })
})
