import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoInput } from './TodoInput'

describe('TodoInput', () => {
  it('フォームの各要素が表示される', () => {
    render(<TodoInput onAdd={vi.fn()} />)
    expect(screen.getByRole('textbox', { name: '新しいタスク' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: '優先度' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument()
  })

  it('デフォルトの優先度は「中」', () => {
    render(<TodoInput onAdd={vi.fn()} />)
    expect(screen.getByRole('combobox', { name: '優先度' })).toHaveValue('medium')
  })

  it('テキストを入力して送信すると onAdd が呼ばれる', async () => {
    const onAdd = vi.fn()
    render(<TodoInput onAdd={onAdd} />)

    await userEvent.type(screen.getByRole('textbox', { name: '新しいタスク' }), 'テストタスク')
    await userEvent.click(screen.getByRole('button', { name: '追加' }))

    expect(onAdd).toHaveBeenCalledOnce()
    expect(onAdd).toHaveBeenCalledWith('テストタスク', 'medium')
  })

  it('優先度を変更して送信すると選択した優先度が渡される', async () => {
    const onAdd = vi.fn()
    render(<TodoInput onAdd={onAdd} />)

    await userEvent.type(screen.getByRole('textbox', { name: '新しいタスク' }), 'タスク')
    await userEvent.selectOptions(screen.getByRole('combobox', { name: '優先度' }), 'high')
    await userEvent.click(screen.getByRole('button', { name: '追加' }))

    expect(onAdd).toHaveBeenCalledWith('タスク', 'high')
  })

  it('空白のみのテキストでは onAdd が呼ばれない', async () => {
    const onAdd = vi.fn()
    render(<TodoInput onAdd={onAdd} />)

    await userEvent.type(screen.getByRole('textbox', { name: '新しいタスク' }), '   ')
    await userEvent.click(screen.getByRole('button', { name: '追加' }))

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('送信後にテキスト入力がクリアされる', async () => {
    render(<TodoInput onAdd={vi.fn()} />)
    const input = screen.getByRole('textbox', { name: '新しいタスク' })

    await userEvent.type(input, 'タスク')
    await userEvent.click(screen.getByRole('button', { name: '追加' }))

    expect(input).toHaveValue('')
  })

  it('Enterキーで送信できる', async () => {
    const onAdd = vi.fn()
    render(<TodoInput onAdd={onAdd} />)

    await userEvent.type(screen.getByRole('textbox', { name: '新しいタスク' }), 'タスク{Enter}')

    expect(onAdd).toHaveBeenCalledWith('タスク', 'medium')
  })

  it('テキストの前後の空白はトリムされる', async () => {
    const onAdd = vi.fn()
    render(<TodoInput onAdd={onAdd} />)

    await userEvent.type(screen.getByRole('textbox', { name: '新しいタスク' }), '  タスク  ')
    await userEvent.click(screen.getByRole('button', { name: '追加' }))

    expect(onAdd).toHaveBeenCalledWith('タスク', 'medium')
  })
})
