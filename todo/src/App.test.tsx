import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

beforeEach(() => {
  localStorage.clear()
})

async function addTodo(text: string, priority = 'medium') {
  await userEvent.type(screen.getByRole('textbox', { name: '新しいタスク' }), text)
  await userEvent.selectOptions(screen.getByRole('combobox', { name: '優先度' }), priority)
  await userEvent.click(screen.getByRole('button', { name: '追加' }))
}

describe('App', () => {
  it('初期状態では「タスクがありません」が表示される', () => {
    render(<App />)
    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })

  it('タスクを追加できる', async () => {
    render(<App />)
    await addTodo('新しいタスク')
    expect(screen.getByText('新しいタスク')).toBeInTheDocument()
  })

  it('複数のタスクを追加できる', async () => {
    render(<App />)
    await addTodo('タスク1')
    await addTodo('タスク2')
    expect(screen.getByText('タスク1')).toBeInTheDocument()
    expect(screen.getByText('タスク2')).toBeInTheDocument()
  })

  it('タスクを完了状態にできる', async () => {
    render(<App />)
    await addTodo('タスク')
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(checkbox)
    expect(checkbox).toHaveAttribute('aria-checked', 'true')
  })

  it('タスクを削除できる', async () => {
    render(<App />)
    await addTodo('削除するタスク')
    await userEvent.click(screen.getByRole('button', { name: '削除' }))
    expect(screen.queryByText('削除するタスク')).not.toBeInTheDocument()
  })

  it('タスクを編集できる', async () => {
    render(<App />)
    await addTodo('元のテキスト')
    await userEvent.dblClick(screen.getByText('元のテキスト'))
    const input = screen.getByRole('textbox', { name: 'タスクを編集' })
    await userEvent.clear(input)
    await userEvent.type(input, '編集済み{Enter}')
    expect(screen.getByText('編集済み')).toBeInTheDocument()
    expect(screen.queryByText('元のテキスト')).not.toBeInTheDocument()
  })

  it('未完了フィルターで完了済みタスクが非表示になる', async () => {
    render(<App />)
    await addTodo('未完了タスク')
    await addTodo('完了タスク')
    // 新しく追加したタスクが先頭（index 0）に来る
    await userEvent.click(screen.getAllByRole('checkbox')[0])
    await userEvent.click(screen.getByRole('button', { name: '未完了' }))
    expect(screen.getByText('未完了タスク')).toBeInTheDocument()
    expect(screen.queryByText('完了タスク')).not.toBeInTheDocument()
  })

  it('完了済みフィルターで未完了タスクが非表示になる', async () => {
    render(<App />)
    await addTodo('未完了タスク')
    await addTodo('完了タスク')
    // 新しく追加したタスクが先頭（index 0）に来る
    await userEvent.click(screen.getAllByRole('checkbox')[0])
    await userEvent.click(screen.getByRole('button', { name: '完了済み' }))
    expect(screen.getByText('完了タスク')).toBeInTheDocument()
    expect(screen.queryByText('未完了タスク')).not.toBeInTheDocument()
  })

  it('完了済みを削除で完了タスクのみ削除される', async () => {
    render(<App />)
    await addTodo('残るタスク')
    await addTodo('消えるタスク')
    // 新しく追加したタスクが先頭（index 0）に来る
    await userEvent.click(screen.getAllByRole('checkbox')[0])
    await userEvent.click(screen.getByRole('button', { name: '完了済みを削除' }))
    expect(screen.getByText('残るタスク')).toBeInTheDocument()
    expect(screen.queryByText('消えるタスク')).not.toBeInTheDocument()
  })

  it('件数カウントが正しく更新される', async () => {
    render(<App />)
    expect(screen.getByText('0 件残り')).toBeInTheDocument()
    await addTodo('タスク1')
    expect(screen.getByText('1 件残り')).toBeInTheDocument()
    await addTodo('タスク2')
    expect(screen.getByText('2 件残り')).toBeInTheDocument()
    await userEvent.click(screen.getAllByRole('checkbox')[0])
    expect(screen.getByText('1 件残り')).toBeInTheDocument()
  })

  it('タスクが localStorage に保存される', async () => {
    render(<App />)
    await addTodo('保存されるタスク')
    const stored = JSON.parse(localStorage.getItem('todos-v1') ?? '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].text).toBe('保存されるタスク')
  })

  it('localStorage からタスクを読み込む', () => {
    const saved = [
      { id: '1', text: '保存済みタスク', completed: false, priority: 'low', createdAt: 0 },
    ]
    localStorage.setItem('todos-v1', JSON.stringify(saved))
    render(<App />)
    expect(screen.getByText('保存済みタスク')).toBeInTheDocument()
  })
})
