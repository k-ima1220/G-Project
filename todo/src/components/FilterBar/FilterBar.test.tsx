import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterBar } from './FilterBar'

const defaultProps = {
  filter: 'all' as const,
  activeCount: 3,
  hasCompleted: false,
  onFilter: vi.fn(),
  onClearCompleted: vi.fn(),
}

describe('FilterBar', () => {
  it('残り件数が表示される', () => {
    render(<FilterBar {...defaultProps} activeCount={5} />)
    expect(screen.getByText('5 件残り')).toBeInTheDocument()
  })

  it('フィルターボタンが3つ表示される', () => {
    render(<FilterBar {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'すべて' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '未完了' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '完了済み' })).toBeInTheDocument()
  })

  it('現在のフィルターのボタンの aria-pressed が true', () => {
    render(<FilterBar {...defaultProps} filter="active" />)
    expect(screen.getByRole('button', { name: '未完了' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'すべて' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: '完了済み' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('フィルターボタンをクリックすると onFilter が呼ばれる', async () => {
    const onFilter = vi.fn()
    render(<FilterBar {...defaultProps} onFilter={onFilter} />)
    await userEvent.click(screen.getByRole('button', { name: '完了済み' }))
    expect(onFilter).toHaveBeenCalledWith('completed')
  })

  it('hasCompleted が false のとき「完了済みを削除」ボタンが表示されない', () => {
    render(<FilterBar {...defaultProps} hasCompleted={false} />)
    expect(screen.queryByRole('button', { name: '完了済みを削除' })).not.toBeInTheDocument()
  })

  it('hasCompleted が true のとき「完了済みを削除」ボタンが表示される', () => {
    render(<FilterBar {...defaultProps} hasCompleted={true} />)
    expect(screen.getByRole('button', { name: '完了済みを削除' })).toBeInTheDocument()
  })

  it('「完了済みを削除」をクリックすると onClearCompleted が呼ばれる', async () => {
    const onClearCompleted = vi.fn()
    render(<FilterBar {...defaultProps} hasCompleted={true} onClearCompleted={onClearCompleted} />)
    await userEvent.click(screen.getByRole('button', { name: '完了済みを削除' }))
    expect(onClearCompleted).toHaveBeenCalledOnce()
  })
})
