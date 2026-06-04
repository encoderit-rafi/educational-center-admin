import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DemoTable } from '../-components/demo-table'
import type { TQuizSchema } from '../-types'

const mockQuizzes: TQuizSchema[] = [
  {
    id: 1,
    uuid: 'uuid-1',
    name: 'Test Quiz 1',
    title: 'Title 1',
    heading: 'Heading 1',
    description: 'Description 1',
    date: '2026-01-01',
    is_active: true,
    embed_code: null,
  },
]

describe('DemoTable', () => {
  const defaultProps = {
    quizzes: mockQuizzes,
    onView: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  }

  it('renders the quizzes correctly with description column', () => {
    render(<DemoTable {...defaultProps} />)
    expect(screen.getByText('Test Quiz 1')).toBeInTheDocument()
    expect(screen.getByText('Description 1')).toBeInTheDocument()
    expect(screen.getByText('2026-01-01')).toBeInTheDocument()
  })

  it('triggers onView when a row is clicked', () => {
    render(<DemoTable {...defaultProps} />)
    const row = screen.getByText('Test Quiz 1').closest('tr')
    if (row) fireEvent.click(row)
    expect(defaultProps.onView).toHaveBeenCalledWith(mockQuizzes[0])
  })

  it('triggers onEdit when edit button is clicked', async () => {
    render(<DemoTable {...defaultProps} />)
    const trigger = screen.getByRole('button', { name: '' })
    fireEvent.click(trigger)
    const editButton = await screen.findByText('Edit')
    fireEvent.click(editButton)
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockQuizzes[0])
  })

  it('triggers onDelete when delete button is clicked', async () => {
    render(<DemoTable {...defaultProps} />)
    const trigger = screen.getByRole('button', { name: '' })
    fireEvent.click(trigger)
    const deleteButton = await screen.findByText('Delete')
    fireEvent.click(deleteButton)
    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockQuizzes[0].id)
  })

  it('triggers onView when show button is clicked', async () => {
    render(<DemoTable {...defaultProps} />)
    const trigger = screen.getByRole('button', { name: '' })
    fireEvent.click(trigger)
    const showButton = await screen.findByText('Show')
    fireEvent.click(showButton)
    expect(defaultProps.onView).toHaveBeenCalledWith(mockQuizzes[0])
  })

  it('triggers onDelete when delete button is clicked', async () => {
    render(<DemoTable {...defaultProps} />)
    const trigger = screen.getByRole('button', { name: '' })
    fireEvent.click(trigger)
    const deleteButton = await screen.findByText('Delete')
    fireEvent.click(deleteButton)
    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockQuizzes[0].id)
  })

  it('triggers onView when show button is clicked', async () => {
    render(<DemoTable {...defaultProps} />)
    const trigger = screen.getByRole('button', { name: '' })
    fireEvent.click(trigger)
    const showButton = await screen.findByText('Show')
    fireEvent.click(showButton)
    expect(defaultProps.onView).toHaveBeenCalledWith(mockQuizzes[0])
  })

  it('renders empty state', () => {
    render(<DemoTable {...defaultProps} quizzes={[]} />)
    expect(screen.getByText(/no quizzes found/i)).toBeInTheDocument()
  })
})
